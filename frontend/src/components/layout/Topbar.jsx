// src/components/layout/Topbar.jsx
import { Zap } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 px-6 py-3">
      <div>
        <h1 className="text-sm font-semibold text-slate-100">
          Task Orchestrator
        </h1>
        <p className="text-xs text-slate-500">
          Send a goal. Watch Synaptra plan, act, and log every step.
        </p>
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1">
          <span className="mr-1 flex h-2 w-2 items-center justify-center">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
          </span>
          <span>Agent core</span>
          <span className="text-emerald-400">live</span>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-sky-500/10 px-3 py-1 text-sky-300">
          <Zap size={12} />
          <span>v0.1 · dev</span>
        </div>
      </div>
    </header>
  );
}
