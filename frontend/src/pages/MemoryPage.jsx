import Card from "../components/ui/Card";

export default function MemoryPage() {
  return (
    <div className="flex flex-col gap-4 pb-10">
      <Card className="border border-slate-800/70 bg-slate-950/70 p-5">
        <h2 className="mb-2 text-sm font-semibold text-slate-100">
          Memory Inspector (Planned)
        </h2>
        <p className="text-xs text-slate-400">
          Synaptra will expose a full memory inspector here: long-term memory
          entries, embeddings, retrieval hits, and agent read/write operations.
          Perfect for research, debugging, and explainability.
        </p>
      </Card>
    </div>
  );
}
