// src/components/ui/Button.jsx
export default function Button({
  children,
  variant = "primary",
  className = "",
  disabled,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500 active:scale-[0.97]",
    ghost:
      "bg-transparent text-slate-200 hover:bg-slate-800/60 focus:ring-slate-500 active:scale-[0.97]",
    subtle:
      "bg-slate-800/60 text-slate-100 hover:bg-slate-800 focus:ring-slate-500 active:scale-[0.97]",
  };

  return (
    <button
      className={`${base} ${variants[variant] || ""} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
