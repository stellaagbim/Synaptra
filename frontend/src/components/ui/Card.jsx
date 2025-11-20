// src/components/ui/Card.jsx
export default function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-800/70 bg-slate-900/60 backdrop-blur-lg shadow-[0_18px_45px_rgba(15,23,42,0.55)] ${className}`}
    >
      {children}
    </div>
  );
}
