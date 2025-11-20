import { motion, AnimatePresence } from "framer-motion";
import { Clock, Zap, Globe, Terminal, CheckCircle2 } from "lucide-react";

export default function TaskTimeline({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <p className="text-xs text-slate-500">
        No timeline available yet — run a task to see agent actions appear here.
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-sm font-semibold text-sky-300 tracking-wide uppercase">
        Agent Timeline
      </h3>

      <div className="relative ml-4 border-l border-sky-400/30 pl-4">
        {logs.map((log, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
            className="relative mb-6"
          >
            {/* glowing dot */}
            <div className="absolute -left-[13px] top-1 flex h-3 w-3 items-center justify-center">
              <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]" />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs shadow-[0_14px_35px_rgba(15,23,42,0.85)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-200">
                  {log.event_type}
                </span>
                <span className="text-[10px] text-slate-500">
                  {new Date(log.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>

              <pre className="mt-1 whitespace-pre-wrap text-slate-400">
                {log.payload}
              </pre>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
