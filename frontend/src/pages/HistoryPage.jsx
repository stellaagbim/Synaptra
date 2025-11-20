import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock3, Search, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { listTasks, getTaskDetails } from "../lib/api";

export default function HistoryPage() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedTask, setSelectedTask] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  async function loadTasks() {
    setLoading(true);
    setError(null);
    try {
      const tasks = await listTasks({
        limit: 40,
        offset: 0,
        status: statusFilter === "all" ? undefined : statusFilter,
        search: search || undefined,
      });
      setTasks(tasks);
    } catch (err) {
      setError(err.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  async function openTaskDetails(task) {
    setSelectedTask(task);
    setDetail(null);
    setDetailError(null);
    setDetailLoading(true);

    try {
      const data = await getTaskDetails(task.id);
      setDetail(data);
    } catch (err) {
      setDetailError(err.message || "Failed to load task details.");
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-10">
      {/* Header */}
      <Card className="border border-slate-800/70 bg-slate-950/70 p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Clock3 className="h-4 w-4 text-sky-300" />
            <span className="font-semibold">Agent Task History</span>
          </div>
          <Button size="xs" variant="outline" onClick={loadTasks}>
            Refresh
          </Button>
        </div>
        <p className="text-[11px] text-slate-500">
          Every time Synaptra runs a task, it leaves a trace here. Use this
          view to audit behaviour, debug automations, and build research
          datasets for Synaptra Eval.
        </p>

        {/* Filters */}
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 text-[11px]">
            {["all", "running", "success", "failed"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-full px-3 py-1 capitalize ${
                  statusFilter === status
                    ? "bg-sky-500/20 text-sky-100 ring-1 ring-sky-500/60"
                    : "bg-slate-900/80 text-slate-400 hover:bg-slate-800/80"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/80 px-2 py-1 text-[11px] text-slate-300">
            <Search className="h-3.5 w-3.5 text-slate-500" />
            <input
              className="flex-1 bg-transparent text-[11px] text-slate-200 outline-none placeholder:text-slate-500"
              placeholder="Search goals…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") loadTasks();
              }}
            />
            <button
              onClick={loadTasks}
              className="rounded-lg bg-sky-500/20 px-2 py-0.5 text-[10px] text-sky-100 ring-1 ring-sky-500/40 hover:bg-sky-500/30"
            >
              Go
            </button>
          </div>
        </div>
      </Card>

      {/* List */}
      <Card className="border border-slate-800/70 bg-slate-950/70 p-4">
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin text-sky-300" />
            <span>Loading recent tasks…</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-xs text-red-300">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-xs text-slate-500">
            No tasks yet. Run a task from the Task Runner to populate this
            history.
          </p>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-12 border-b border-slate-800 pb-1 text-[10px] uppercase tracking-wide text-slate-500">
              <span className="col-span-5">Goal</span>
              <span className="col-span-2">Status</span>
              <span className="col-span-2">Steps</span>
              <span className="col-span-2">Started</span>
              <span className="col-span-1 text-right">More</span>
            </div>

            <AnimatePresence initial={false}>
              {tasks.map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="grid grid-cols-12 items-center rounded-xl border border-slate-800/70 bg-slate-950/80 px-3 py-2 text-[11px] text-slate-200"
                >
                  <span className="col-span-5 line-clamp-2 pr-3 text-slate-100">
                    {t.goal}
                  </span>

                  <span className="col-span-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${
                        t.status === "success"
                          ? "bg-emerald-900/70 text-emerald-300"
                          : t.status === "failed"
                          ? "bg-red-900/70 text-red-300"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {t.status}
                    </span>
                  </span>

                  <span className="col-span-2 text-slate-400">
                    {t.steps_taken} step(s)
                  </span>

                  <span className="col-span-2 text-slate-500">
                    {t.started_at
                      ? new Date(t.started_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </span>

                  <span className="col-span-1 text-right">
                    <button
                      onClick={() => openTaskDetails(t)}
                      className="text-[10px] text-sky-300 hover:text-sky-200"
                    >
                      View
                    </button>
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </Card>

      {/* Detail drawer */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-4xl rounded-t-3xl border border-slate-800/80 bg-slate-950/95 p-4 shadow-[0_-24px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
          >
            <div className="mb-2 flex items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                  Task details
                </span>
                <span className="line-clamp-1 text-slate-100">
                  {selectedTask.goal}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedTask(null);
                  setDetail(null);
                }}
                className="text-[11px] text-slate-400 hover:text-slate-100"
              >
                Close
              </button>
            </div>

            {detailLoading ? (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin text-sky-300" />
                <span>Loading agent timeline…</span>
              </div>
            ) : detailError ? (
              <div className="flex items-center gap-2 text-xs text-red-300">
                <AlertTriangle className="h-4 w-4" />
                <span>{detailError}</span>
              </div>
            ) : detail ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    Status:{" "}
                    <span
                      className={`rounded-full px-2 py-0.5 ${
                        detail.status === "success"
                          ? "bg-emerald-900/60 text-emerald-300"
                          : detail.status === "failed"
                          ? "bg-red-900/60 text-red-300"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {detail.status}
                    </span>
                  </span>
                  <span>
                    Steps:{" "}
                    <span className="text-slate-200">
                      {detail.steps_taken ?? detail.steps?.length ?? 0}
                    </span>
                  </span>
                </div>

                <div className="max-h-64 space-y-2 overflow-y-auto rounded-2xl border border-slate-800/80 bg-slate-950/80 p-3 text-[11px] text-slate-100">
                  {detail.steps && detail.steps.length > 0 ? (
                    detail.steps.map((s) => (
                      <div
                        key={s.step_number}
                        className="rounded-xl border border-slate-800/70 bg-slate-950/90 p-2"
                      >
                        <div className="mb-1 flex items-center justify-between text-[10px] text-slate-400">
                          <span>Step {s.step_number}</span>
                          <span className="text-sky-300">{s.tool}</span>
                        </div>
                        <div className="mb-1 text-[11px] text-slate-300">
                          <span className="font-semibold text-slate-200">
                            Instruction:
                          </span>{" "}
                          {s.instruction}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          <span className="font-semibold text-slate-200">
                            Output:
                          </span>{" "}
                          {s.output}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-slate-500">
                      No step logs recorded for this task.
                    </p>
                  )}
                </div>

                {detail.result && (
                  <div className="mt-2 rounded-2xl border border-emerald-700/60 bg-emerald-950/40 p-3 text-[11px] text-emerald-100">
                    <div className="mb-1 flex items-center gap-2 text-[11px]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Final result</span>
                    </div>
                    <pre className="max-h-40 overflow-y-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                      {detail.result}
                    </pre>
                  </div>
                )}
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
