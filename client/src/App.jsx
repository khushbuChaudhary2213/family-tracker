import { useState } from "react";
import FamilyManagement from "./pages/FamilyManagement"; // Ensure path is correct
import Auth from "./pages/Auth";

export default function App() {
  // 1. Manage which view is active ('dashboard' or 'family')
  const [currentView, setCurrentView] = useState("dashboard");

  return (
    <div className="w-screen h-screen bg-background text-on-surface antialiased overflow-hidden flex flex-col">
      {/* ================= HEADER ================= */}
      <header className="w-full z-50 flex justify-between items-center px-6 h-16 bg-surface/70 backdrop-blur-xl border-b border-white/5 shadow-sm shrink-0">
        <div className="flex items-center gap-6">
          <span className="text-3xl font-bold tracking-tighter text-primary">
            SENTRY
          </span>
        </div>
      </header>

      {/* Main Workspace Split */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* ================= DESKTOP SIDEBAR ================= */}
        <aside className="hidden lg:flex flex-col h-full w-64 bg-surface-container border-r border-white/5 p-6 shrink-0">
          <nav className="flex flex-col gap-2 flex-grow">
            {/* Dashboard Navigation Button */}
            <div
              onClick={() => setCurrentView("dashboard")}
              className={`rounded-xl flex items-center gap-3 px-4 py-3 cursor-pointer transition-all ${
                currentView === "dashboard"
                  ? "text-secondary bg-white/5"
                  : "text-on-surface-variant hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </div>

            {/* Family Management Navigation Button */}
            <div
              onClick={() => setCurrentView("family")}
              className={`rounded-xl flex items-center gap-3 px-4 py-3 cursor-pointer transition-all ${
                currentView === "family"
                  ? "text-secondary bg-white/5"
                  : "text-on-surface-variant hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined">group_add</span>
              <span>Manage Family</span>
            </div>
            {/* Family Management Navigation Button */}
            <div
              onClick={() => setCurrentView("auth")}
              className={`rounded-xl flex items-center gap-3 px-4 py-3 cursor-pointer transition-all ${
                currentView === "auth"
                  ? "text-secondary bg-white/5"
                  : "text-on-surface-variant hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined">user</span>
              <span>Auth</span>
            </div>
          </nav>
        </aside>

        {/* ================= MAIN INTERFACE VIEWPORTS ================= */}
        <main className="flex-1 relative bg-background overflow-hidden h-full">
          {currentView === "dashboard" && (
            /* ====== TARGET VIEW 1: MAP AND FLOATING STREAMING ELEMENTS ====== */
            <div className="w-full h-full relative">
              {/* Keep your existing Stitch Map HTML structure and list elements here */}
              <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                <p className="text-on-surface-variant">
                  [ Your Live Tracking Map & Panels Go Here ]
                </p>
              </div>
            </div>
          )}
          {currentView == "family" && (
            /* ====== TARGET VIEW 2: FAMILY MANAGEMENT CONTAINER ====== */
            <FamilyManagement />
          )}
          {currentView == "auth" && <Auth />}
        </main>
      </div>

      {/* ================= MOBILE NAVIGATION OVERLAY ================= */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-surface/80 backdrop-blur-xl border-t border-white/5 py-3 px-8 flex justify-around items-center z-50">
        <div
          onClick={() => setCurrentView("dashboard")}
          className={`flex flex-col items-center justify-center cursor-pointer ${currentView === "dashboard" ? "text-primary" : "text-on-surface-variant"}`}
        >
          <span className="material-symbols-outlined">location_on</span>
          <span className="text-xs">Map</span>
        </div>
        <div
          onClick={() => setCurrentView("family")}
          className={`flex flex-col items-center justify-center cursor-pointer ${currentView === "family" ? "text-primary" : "text-on-surface-variant"}`}
        >
          <span className="material-symbols-outlined">groups</span>
          <span className="text-xs">Family</span>
        </div>
      </nav>
    </div>
  );
}
