import Card from "../components/ui/Card";

export default function ToolsPage() {
  return (
    <div className="flex flex-col gap-4 pb-10">
      <Card className="border border-slate-800/70 bg-slate-950/70 p-5">
        <h2 className="mb-2 text-sm font-semibold text-slate-100">
          Tools & Integrations
        </h2>
        <p className="text-xs text-slate-400">
          This page will list all tools the agent can call: browser automation,
          document loaders, data processors, external APIs, and more. Each tool
          will show configuration, example prompts, and recent call logs.
        </p>
      </Card>
    </div>
  );
}
