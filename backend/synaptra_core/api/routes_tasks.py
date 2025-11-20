# backend/synaptra_core/api/routes_tasks.py

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from synaptra_core.api.dependencies import get_db
from synaptra_core.db.models import TaskRun
from synaptra_core.agent.controller import run_agent_task

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


# ---------- Schemas ----------

class RunTaskRequest(BaseModel):
    goal: str


class TaskSummary(BaseModel):
    id: int
    goal: str
    status: str
    steps_taken: int
    started_at: str
    finished_at: Optional[str] = None


class RunTaskResponse(BaseModel):
    task_id: int
    steps: int
    result: str
    success: bool
    trace: list


# ---------- Routes ----------

@router.post("/run", response_model=RunTaskResponse)
async def run_task(payload: RunTaskRequest) -> RunTaskResponse:
    """
    Launch a new agent task and return the result + trace.
    """
    data = await run_agent_task(payload.goal)
    # run_agent_task already returns the right shape
    return RunTaskResponse(**data)


@router.get("/", response_model=List[TaskSummary])
async def list_tasks(
    db: AsyncSession = Depends(get_db),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
):
    """
    List recent task runs with optional filters.
    Perfect for the Synaptra Studio History page.
    """

    query = select(TaskRun).order_by(desc(TaskRun.started_at))

    if status:
        query = query.where(TaskRun.status == status)

    if search:
        like = f"%{search}%"
        query = query.where(TaskRun.goal.ilike(like))

    query = query.limit(limit).offset(offset)

    result = await db.execute(query)
    tasks = result.scalars().all()

    return [
        TaskSummary(
            id=t.id,
            goal=t.goal,
            status=t.status,
            steps_taken=t.steps_taken or 0,
            started_at=t.started_at.isoformat() if t.started_at else "",
            finished_at=t.finished_at.isoformat() if t.finished_at else None,
        )
        for t in tasks
    ]

