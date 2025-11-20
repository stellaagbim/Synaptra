from typing import Any, Dict, List


class MemoryStore:
    """
    Very small in-memory store for now.
    Later we plug in a real vector DB + relational DB.
    """

    def __init__(self) -> None:
        self._events: List[Dict[str, Any]] = []

    def build_state(self, goal: str) -> Dict[str, Any]:
        return {
            "goal": goal,
            "history": self._events[-10:],  # last 10 events as context
        }

    def update(self, state: Dict[str, Any], new_event: Any) -> None:
        self._events.append({"state": state, "event": new_event})
