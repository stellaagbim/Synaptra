import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Bot,
  Repeat,
  Brain,
  Wrench,
  History,
  Settings,
} from "lucide-react";

const items = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tasks", label: "Task Runner", icon: Bot },
  { id: "automations", label: "Automations", icon: Repeat },
  { id: "memory", label: "Memory", icon: Brain },
  { id: "tools", label: "Tools", icon: Wrench },
  { id: "history", label: "History", icon: History },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ active, onChange }) {
  return (
    <aside className="hidden h-screen w-64 flex-shrink-0 border-r border-slate-800/80 bg-slate-950/90 px-3 py-4 shadow-[0_0_40px_rgba(15,23,42,0.9)] backdrop-blur-2xl md:flex md:flex-col">
      {/* Logo / brand */}
      <div className="mb-4 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-blue-500 to-purple-500">
          <span className="text-xs font-bold tracking-wide text-slate-950">
            ⌬
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Synaptra
          </span>
          <span className="text-[11px] text-slate-500">
            Multimodal Agent Studio
          </span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="mt-2 flex-1 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onChange(item.id)}
              whileTap={{ scale: 0.97 }}
              className={`group flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-all ${
                isActive
                  ? "bg-sky-500/15 text-sky-100 ring-1 ring-sky-500/50 shadow-[0_0_25px_rgba(56,189,248,0.35)]"
                  : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-100"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${
                  isActive ? "text-sky-300" : "text-slate-500 group-hover:text-sky-300"
                }`}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom status badge */}
      <div className="mt-3 rounded-xl border border-emerald-500/40 bg-emerald-900/20 px-3 py-2 text-[11px] text-emerald-200">
        <div className="mb-1 flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="m-auto h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
          </span>
          <span className="font-medium">Core online</span>
        </div>
        <p className="text-[10px] text-emerald-200/80">
          Agent node connected. Eval + Automations coming online next.
        </p>
      </div>
    </aside>
  );
}

