// src/components/ui/Spinner.jsx
export default function Spinner({ size = 18 }) {
  return (
    <div
      className="inline-block animate-spin rounded-full border-2 border-sky-400 border-t-transparent"
      style={{ width: size, height: size }}
    />
  );
}
