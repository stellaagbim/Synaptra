// src/components/layout/PageWrapper.jsx
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function PageWrapper({ children }) {
  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 px-6 py-5">
          {children}
        </main>
      </div>
    </div>
  );
}
