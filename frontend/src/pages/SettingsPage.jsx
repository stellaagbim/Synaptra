import Card from "../components/ui/Card";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4 pb-10">
      <Card className="border border-slate-800/70 bg-slate-950/70 p-5">
        <h2 className="mb-2 text-sm font-semibold text-slate-100">
          Settings & Configuration
        </h2>
        <p className="text-xs text-slate-400">
          Model selection, API keys, agent personas, safety settings, and
          workspace preferences will live here. This is what turns Synaptra
          into a configurable product rather than a fixed demo.
        </p>
      </Card>
    </div>
  );
}
