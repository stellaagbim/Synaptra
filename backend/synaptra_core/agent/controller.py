# backend/synaptra_core/agent/controller.py

from datetime import datetime
from typing import Dict, Any, List

from synaptra_core.db.session import async_session
from synaptra_core.db.models import TaskRun, TaskStep
from synaptra_core.agent.planner import Planner
from synaptra_core.agent.tool_registry import ToolRegistry
from synaptra_core.agent.logger import AgentLogger


async def run_agent_task(goal: str) -> Dict[str, Any]:
    """
    Main Synaptra agent execution loop.

    1. Create TaskRun in DB
    2. Use Planner to derive a sequence of (tool, instruction) steps
    3. Execute each step via ToolRegistry
    4. Persist TaskStep entries to DB
    5. Return final aggregated result + metadata
    """

    planner = Planner()
    tools = ToolRegistry()

    async with async_session() as session:
        # 1) Create the TaskRun row
        task = TaskRun(
            goal=goal,
            status="running",
            started_at=datetime.utcnow(),
        )
        session.add(task)
        await session.commit()
        await session.refresh(task)

        logger = AgentLogger(task_id=task.id)

        # 2) Planner creates structured steps
        plan_steps: List[Dict[str, str]] = planner.plan(goal)
        step_results: List[str] = []

        for idx, step in enumerate(plan_steps, start=1):
            tool_name = step["tool"]
            instruction = step["instruction"]

            try:
                tool_fn = tools.get_tool(tool_name)
                output = await tool_fn(instruction)
                success = True
            except Exception as e:
                success = False
                output = f"Tool '{tool_name}' failed: {e}"

            # Log into in-memory logger
            logger.log_step(
                step_number=idx,
                tool=tool_name,
                instruction=instruction,
                output=output,
                success=success,
            )

            if not success:
                logger.log_error(
                    f"Step {idx} failed while using tool '{tool_name}'."
                )

            # 3) Persist TaskStep row
            db_step = TaskStep(
                task_id=task.id,
                step_number=idx,
                tool=tool_name,
                instruction=instruction,
                output=output,
                success=success,
            )
            session.add(db_step)
            await session.commit()

            step_results.append(output)

        # 4) Mark task finished
        task.status = "success"
        task.finished_at = datetime.utcnow()
        task.steps_taken = len(plan_steps)
        await session.commit()
        await session.refresh(task)

        trace = logger.export()

    # 5) Response back to API / frontend
    return {
        "task_id": task.id,
        "steps": task.steps_taken,
        "result": "\n".join(step_results),
        "success": True,
        "trace": trace,
    }
