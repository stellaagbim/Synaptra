# backend/synaptra_core/agent/tool_registry.py

"""
Tool Registry
-------------
Maps tool names (strings) to concrete async callables.

Later, this will include:
- real browser automation
- document loaders
- code execution
- vector search
- etc.
"""

from typing import Awaitable, Callable, Dict


ToolFn = Callable[[str], Awaitable[str]]


class ToolRegistry:
    def __init__(self) -> None:
        # register tools here
        self._tools: Dict[str, ToolFn] = {
            "browser_research": self._browser_research,
            "data_handler": self._data_handler,
            "text_summariser": self._text_summariser,
            "echo": self._echo,
        }

    def get_tool(self, name: str) -> ToolFn:
        """
        Returns a tool function. Falls back to 'echo' if unknown.
        """
        return self._tools.get(name, self._tools["echo"])

    # -------------------- Tools --------------------

    async def _browser_research(self, instruction: str) -> str:
        # Placeholder: simulate web research
        return (
            "[browser_research] Simulated research completed. "
            f"Instruction: {instruction}"
        )

    async def _data_handler(self, instruction: str) -> str:
        # Placeholder: simulate data processing
        return (
            "[data_handler] Simulated data collection/transformation. "
            f"Instruction: {instruction}"
        )

    async def _text_summariser(self, instruction: str) -> str:
        # Placeholder: simulate summarisation
        return (
            "[text_summariser] Simulated summary generated. "
            f"Instruction: {instruction}"
        )

    async def _echo(self, instruction: str) -> str:
        # Fallback tool
        return f"[echo] {instruction}"
