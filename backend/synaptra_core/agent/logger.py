# backend/synaptra_core/agent/logger.py

from datetime import datetime

class AgentLogger:
    """
    Lightweight but production-ready logger for Synaptra agent pipeline.
    Captures steps, tool calls, errors, intermediate reasoning, etc.
    """

    def __init__(self, task_id: int):
        self.task_id = task_id
        self.events = []

    def log(self, event_type: str, message: str, meta: dict = None):
        """
        General logger method.
        """
        entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "type": event_type,
            "message": message,
            "meta": meta or {}
        }
        self.events.append(entry)

    def log_step(self, step_number: int, tool: str, instruction: str, output: str, success=True):
        """
        Logs a single agent step in detail.
        """
        self.log(
            event_type="step",
            message=f"Step {step_number} executed using tool '{tool}'",
            meta={
                "step_number": step_number,
                "tool": tool,
                "instruction": instruction,
                "output": output,
                "success": success,
            }
        )

    def log_error(self, error_msg: str):
        """
        Logs error during agent execution.
        """
        self.log(
            event_type="error",
            message=error_msg
        )

    def export(self):
        """
        Returns all events (used by API return / debugging).
        """
        return self.events