import Card from "../components/ui/Card";

export default function AutomationsPage() {
  return (
    <div className="flex flex-col gap-4 pb-10">
      <Card className="border border-slate-800/70 bg-slate-950/70 p-5">
        <h2 className="mb-2 text-sm font-semibold text-slate-100">
          Automations (Coming Online)
        </h2>
        <p className="text-xs text-slate-400">
          This is where you’ll design reusable workflows like “every morning at
          9am, log into analytics, pull yesterday’s data, summarise trends, and
          notify me”. We’ll wire a visual builder + scheduler here.
        </p>
      </Card>
    </div>
  );
}
