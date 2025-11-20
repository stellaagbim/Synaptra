import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, ChevronRight } from "lucide-react";

export default function StepTimeline({ trace }) {
  if (!trace || trace.length === 0) {
    return (
      <p className="text-xs text-slate-500">
        No timeline data. Run a task to view the agent’s reasoning steps.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {trace.map((step, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.08 }}
          className="relative rounded-xl border border-slate-800/60 bg-slate-950/60 p-3 shadow-[0_8px_20px_rgba(15,23,42,0.45)] backdrop-blur-xl"
        >
          {/* connector dot */}
          <div className="absolute -left-4 top-4 h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]" />

          <div className="flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-sky-300" />
              <span className="font-medium">Step {idx + 1}</span>
            </div>

            {step.success && (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
            )}
          </div>

          <div className="mt-2 flex items-start gap-2">
            <ChevronRight className="h-3 w-3 text-slate-400 mt-0.5" />
            <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
              {step.description || step.text || JSON.stringify(step)}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
