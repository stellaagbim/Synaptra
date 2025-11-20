from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from synaptra_core.db.models import TaskRun, TaskStep
from synaptra_core.api.dependencies import get_db

router = APIRouter(prefix="/api/tasks", tags=["task-detail"])


@router.get("/{task_id}")
async def get_task_details(task_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(TaskRun).where(TaskRun.id == task_id)
    )
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    steps_result = await db.execute(
        select(TaskStep)
        .where(TaskStep.task_id == task_id)
        .order_by(TaskStep.step_number.asc())
    )
    steps = steps_result.scalars().all()

    return {
        "task_id": task.id,
        "goal": task.goal,
        "status": task.status,
        "started_at": task.started_at,
        "finished_at": task.finished_at,
        "steps_taken": task.steps_taken,
        "steps": [
            {
                "step_number": s.step_number,
                "tool": s.tool,
                "instruction": s.instruction,
                "output": s.output,
                "success": s.success,
            }
            for s in steps
        ],
    }
