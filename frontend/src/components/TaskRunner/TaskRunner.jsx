import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Clock3,
  Sparkles,
} from "lucide-react";

import Button from "../ui/Button";
import Card from "../ui/Card";
import Spinner from "../ui/Spinner";
import { runTask } from "../../lib/api";
import StepTimeline from "./StepTimeline"; // 👈 NEW timeline component

export default function TaskRunner() {
  const [goal, setGoal] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState(null);
  const [trace, setTrace] = useState([]); // 👈 agent timeline
  const [history, setHistory] = useState([]); // right-side run log

  async function handleRunTask(e) {
    e.preventDefault();
    if (!goal.trim()) return;

    setIsRunning(true);
    setError(null);
    setResult(null);
    setSteps(null);
    setTrace([]);

    const startedAt = new Date();

    try {
      const data = await runTask(goal.trim());

      // Backend returns: result, steps, trace, task_id, success
      setResult(data.result || "");
      setSteps(data.steps || 0);
      setTrace(data.trace || []);

      // Save to session history
      setHistory((prev) => [
        {
          id: data.task_id,
          goal: goal.trim(),
          result: data.result,
          steps: data.steps,
          status: data.success ? "success" : "failed",
          startedAt,
        },
        ...prev.slice(0, 9),
      ]);
    } catch (err) {
      setError(err.message || "Something went wrong running the task.");
    } finally {
      setIsRunning(false);
    }
  }

  const agentStatus =
    isRunning ? "Running" : result || error ? "Idle (recent run)" : "Idle";

  return (
    <motion.div
      className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {/* Left: Task input + output */}
      <div className="flex-1 space-y-4">
        {/* Header strip */}
        <div className="flex flex-col gap-2 rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-3 shadow-[0_18px_45px_rgba(15,23,42,0.85)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/40 via-blue-500/40 to-purple-500/40">
                <Sparkles className="h-4 w-4 text-sky-200" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Synaptra Studio
                </span>
                <span className="text-sm font-medium text-slate-100">
                  Agent Task Orchestrator
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <div className="flex items-center gap-1 rounded-full border border-emerald-500/50 bg-emerald-900/40 px-3 py-0.5">
                <span className="flex h-1.5 w-1.5">
                  <span className="m-auto h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
                </span>
                <span className="text-emerald-200">Agent core</span>
                <span className="text-emerald-400/90">online</span>
              </div>

              <div className="hidden items-center gap-1 rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-0.5 text-sky-200/90 sm:flex">
                <Activity className="h-3 w-3" />
                <span className="capitalize">{agentStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Goal input */}
        <Card className="relative overflow-hidden p-5">
          <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />

          <form className="space-y-3" onSubmit={handleRunTask}>
            <div className="flex items-center justify-between gap-3">
              <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-sky-300">
                Goal
              </label>
              <span className="text-[11px] text-slate-500 hidden sm:flex gap-2">
                <span className="rounded-full bg-slate-800/70 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
                  Agent mode
                </span>
                Planner · Tools · Memory · Logs
              </span>
            </div>

            <motion.textarea
              className="min-h-[110px] w-full rounded-2xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 shadow-[0_0_0_1px_rgba(15,23,42,1)] outline-none placeholder:text-slate-500 focus:border-sky-400 focus:ring-1 focus:ring-sky-500/70"
              placeholder="Example: Log into the analytics dashboard, download yesterday's data, clean it, and summarise the main changes."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              initial={false}
              whileFocus={{
                boxShadow:
                  "0 0 20px rgba(56,189,248,0.28), 0 0 40px rgba(129,140,248,0.18)",
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            />

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              {isRunning ? (
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/80">
                    <div className="h-3 w-3 animate-ping rounded-full bg-sky-400" />
                  </div>
                  <span>Agent is thinking, selecting tools, updating memory…</span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500">
                  Hint: describe end goals, not specific clicks.
                </p>
              )}

              <Button type="submit" disabled={isRunning}>
                {isRunning ? (
                  <span className="flex items-center gap-2">
                    <Spinner size={14} />
                    Running…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Play size={14} />
                    Run task
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Agent output */}
        <Card className="relative overflow-hidden p-5">
          <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen">
            <div className="absolute -left-10 top-0 h-32 w-32 rounded-full bg-sky-500/20 blur-3xl" />
            <div className="absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl" />
          </div>

          <div className="relative mb-2 flex items-center gap-2 text-xs text-slate-400">
            <Terminal size={14} />
            <span>Agent output</span>
            {typeof steps === "number" && (
              <span className="rounded-full bg-emerald-900/60 px-2 py-0.5 text-[10px] text-emerald-300/90">
                {steps} step{steps === 1 ? "" : "s"}
              </span>
            )}
          </div>

          <AnimatePresence initial={false}>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="relative flex items-start gap-2 rounded-2xl border border-red-600/60 bg-red-950/50 p-3 text-xs text-red-200 shadow-[0_16px_40px_rgba(127,29,29,0.55)]"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {result && !error && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950/70 p-4 text-sm text-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.95)]"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-sky-500/40 via-blue-500/60 to-purple-500/40" />
                <div className="mb-2 flex items-center gap-2 text-xs text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Task finished</span>
                </div>
                <pre className="max-h-[260px] overflow-y-auto whitespace-pre-wrap rounded-xl bg-slate-950/60 px-3 py-2 font-mono text-[13px] leading-relaxed text-slate-100 ring-1 ring-slate-800/80">
                  {String(result)}
                </pre>

                {/* TIMELINE */}
                <div className="mt-4">
                  <h3 className="text-xs uppercase tracking-wide text-sky-300 mb-2">
                    Execution Timeline
                  </h3>
                  <StepTimeline trace={trace} />
                </div>
              </motion.div>
            )}

            {!result && !error && !isRunning && (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.78 }}
                exit={{ opacity: 0 }}
                className="text-xs text-slate-500"
              >
                Run a task to see Synaptra’s reasoning here — including tool
                calls, step-by-step reasoning, and memory updates.
              </motion.p>
            )}
          </AnimatePresence>
        </Card>
      </div>

      {/* Right: session history */}
      <div className="w-full max-w-sm space-y-3">
        <Card className="relative overflow-hidden p-4">
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/70 to-transparent" />

          <div className="relative mb-2 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Clock3 className="h-3.5 w-3.5 text-slate-500" />
              <span>Recent runs</span>
            </div>
            <span className="text-[10px] text-slate-500">
              Session-local only
            </span>
          </div>

          {history.length === 0 ? (
            <p className="relative text-xs text-slate-600">
              No runs yet. Once you trigger tasks, a compact mission log will
              appear here.
            </p>
          ) : (
            <div className="relative space-y-2">
              <div className="absolute left-3 top-2 bottom-3 w-px bg-gradient-to-b from-sky-500/60 via-slate-700/60 to-transparent" />

              {history.map((run, idx) => (
                <motion.div
                  key={run.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="pl-6"
                >
                  <div className="relative rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs shadow-[0_14px_35px_rgba(15,23,42,0.85)]">
                    <div className="absolute -left-[14px] top-3 flex h-3 w-3 items-center justify-center">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          run.status === "success"
                            ? "bg-emerald-400"
                            : "bg-red-400"
                        } shadow-[0_0_10px_rgba(16,185,129,0.9)]`}
                      />
                    </div>

                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="line-clamp-1 text-[11px] text-slate-100">
                        {run.goal}
                      </span>

                      <span
                        className={`ml-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${
                          run.status === "success"
                            ? "bg-emerald-900/70 text-emerald-300"
                            : "bg-red-900/70 text-red-300"
                        }`}
                      >
                        {run.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>{run.steps} step(s)</span>
                      <span>
                        {run.startedAt.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  );
}
