import { motion } from "framer-motion";
import { Activity, Sparkles, FileText, Workflow } from "lucide-react";
import Card from "../components/ui/Card";
import LatencyCard from "../components/LatencyCard";
import FileUpload from "../components/FileUpload";
import SessionHistory from "../components/SessionHistory";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4 pb-10">
      {/* Hero strip */}
      <Card className="relative overflow-hidden border border-slate-800/70 bg-slate-950/70 px-5 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-sky-500/40 via-blue-500/60 to-purple-500/40" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/40 via-violet-500/40 to-fuchsia-500/40">
              <Sparkles className="h-4 w-4 text-sky-100" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                Synaptra Studio
              </span>
              <span className="text-sm text-slate-100">
                Multimodal Agent Operations Hub
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Activity className="h-3.5 w-3.5 text-emerald-300" />
            <span>Ready for new tasks, automations, and eval runs.</span>
          </div>
        </div>
      </Card>

      {/* Top row widgets */}
      <div className="grid gap-4 md:grid-cols-3">
        <LatencyCard />
        <Card className="border border-slate-800/70 bg-slate-950/70 p-4 text-xs text-slate-300">
          <div className="mb-2 flex items-center gap-2 text-slate-200">
            <Workflow className="h-4 w-4 text-sky-300" />
            <span>Quick actions</span>
          </div>
          <div className="space-y-2">
            <button className="w-full rounded-xl bg-sky-500/10 px-3 py-2 text-left text-[11px] text-sky-100 ring-1 ring-sky-500/40 hover:bg-sky-500/20">
              + Run an ad-hoc agent task
            </button>
            <button className="w-full rounded-xl bg-violet-500/10 px-3 py-2 text-left text-[11px] text-violet-100 ring-1 ring-violet-500/40 hover:bg-violet-500/20">
              + Design a new automation
            </button>
            <button className="w-full rounded-xl bg-emerald-500/10 px-3 py-2 text-left text-[11px] text-emerald-100 ring-1 ring-emerald-500/40 hover:bg-emerald-500/20">
              + Inspect memory & recent runs
            </button>
          </div>
        </Card>
        <Card className="border border-slate-800/70 bg-slate-950/70 p-4 text-xs text-slate-300">
          <div className="mb-2 flex items-center gap-2 text-slate-200">
            <FileText className="h-4 w-4 text-emerald-300" />
            <span>Upcoming: Synaptra Eval</span>
          </div>
          <p className="mb-2 text-[11px] text-slate-400">
            Define benchmarks that treat the agent as a decision-making system.
            Compare memory strategies, toolchains, and planning styles on real
            tasks.
          </p>
          <p className="text-[11px] text-slate-500">
            This pane will show eval runs, scores, and research-ready metrics.
          </p>
        </Card>
      </div>

      {/* Multimodal playground row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border border-slate-800/70 bg-slate-950/70 p-4">
          <div className="mb-2 text-xs text-slate-300">
            Multimodal core · Image / Audio entry
          </div>
          <div className="space-y-3">
            <FileUpload label="Upload Image" />
            <FileUpload label="Upload Audio" />
          </div>
        </Card>
        <Card className="border border-slate-800/70 bg-slate-950/70 p-4">
          <div className="mb-2 text-xs text-slate-300">
            Recent multimodal sessions
          </div>
          <SessionHistory />
        </Card>
      </div>
    </div>
  );
}
