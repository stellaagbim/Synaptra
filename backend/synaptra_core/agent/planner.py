# backend/synaptra_core/agent/planner.py

"""
Planner module
--------------
Responsible for turning a high-level natural language goal
into a small sequence of structured tool calls.

Later we can swap this to a real LLM-powered planner without
changing the rest of the pipeline.
"""

from typing import List, Dict


class Planner:
    """
    Rule-based planner (for now) that approximates what an LLM
    planner would do: decompose the goal into tool + instruction
    pairs.
    """

    def plan(self, goal: str) -> List[Dict]:
        goal_lower = goal.lower()

        steps: List[Dict] = []

        # Very simple heuristics for now. Later -> LLM.
        if any(w in goal_lower for w in ["website", "dashboard", "login"]):
            steps.append(
                {
                    "tool": "browser_research",
                    "instruction": goal,
                }
            )

        if any(w in goal_lower for w in ["download", "export", "report", "data"]):
            steps.append(
                {
                    "tool": "data_handler",
                    "instruction": "Collect and organise the relevant data for this goal.",
                }
            )

        if any(w in goal_lower for w in ["summarise", "summary", "explain", "insight"]):
            steps.append(
                {
                    "tool": "text_summariser",
                    "instruction": "Summarise the key findings in a concise report.",
                }
            )

        # Fallback: if rules didn’t trigger, make at least 2 generic steps
        if not steps:
            steps = [
                {
                    "tool": "browser_research",
                    "instruction": f"Research the topic: {goal}",
                },
                {
                    "tool": "text_summariser",
                    "instruction": "Summarise the main points clearly.",
                },
            ]

        return steps
