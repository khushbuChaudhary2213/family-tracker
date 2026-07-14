import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user } = useAuth();
  const hasFamily = !!(user?.familyId || user?.family); // Checks if

  return (
    <>
      <aside className="hidden lg:flex flex-col h-[calc(100vh-4rem)] fixed left-0 top-16 py-10 px-6 w-64 bg-[#201f1f] border-r border-white/5 shadow-2xl z-40 pt-24">
        <div className="flex flex-col gap-6 h-full">
          <div className="flex flex-col gap-1 px-4">
            <span className="text-3xl font-black text-[#b0c6ff] tracking-tight">
              Member
            </span>
            <span className="text-xl font-medium text-[#c2c6d7] opacity-70">
              {user.name || "Sentry User"}
            </span>
          </div>

          <nav className="flex flex-col gap-2 mt-8">
            <div className="bg-[#00a572] text-[#00311f] rounded-xl flex items-center gap-3 px-4 py-3 cursor-pointer active:opacity-80 transition-all shadow-[0_0_12px_rgba(78,222,163,0.2)]">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-lg font-medium">Dashboard</span>
            </div>
            <div className="text-[#c2c6d7] hover:text-[#e5e2e1] flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/5 rounded-xl transition-all duration-200 group">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">group</span>
                <span className="text-lg font-medium">Family</span>
              </div>
              {!hasFamily && (
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  Empty
                </span>
              )}
            </div>
            <div className="text-[#c2c6d7] hover:text-[#e5e2e1] flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 rounded-xl transition-all duration-200">
              <span className="material-symbols-outlined">settings</span>
              <span className="text-lg font-medium">Settings</span>
            </div>
          </nav>

          {/* Persistent Protection Card Status */}
          <div className="mt-auto p-4 bg-[#1e1e1e]/70 backdrop-blur-2xl border border-white/5 rounded-xl">
            {hasFamily ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#4edea3] shadow-[0_0_12px_rgba(78,222,163,0.4)]"></div>
                  <span className="text-[12px] font-semibold uppercase tracking-widest text-[#4edea3]">
                    ACTIVE PROTECTION
                  </span>
                </div>
                <p className="text-xs text-[#c2c6d7] mb-4 leading-relaxed">
                  Your location is being shared with the Family Lead.
                </p>
                <button className="w-full py-2 bg-[#2a2a2a] hover:bg-[#393939] text-[#e5e2e1] rounded-lg text-xs font-bold transition-colors cursor-pointer">
                  Privacy Controls
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.4)]"></div>
                  <span className="text-[12px] font-semibold uppercase tracking-widest text-amber-400">
                    STANDALONE MODE
                  </span>
                </div>
                <p className="text-xs text-[#c2c6d7] mb-4 leading-relaxed">
                  You aren't linked to a family ecosystem. Security sharing
                  features are paused.
                </p>
                <button className="w-full py-2 bg-[#b0c6ff] hover:bg-[#9cb6f7] text-[#002d6e] rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer">
                  Setup Family Circle
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#171717]/90 backdrop-blur-xl border-t border-white/5 px-6 flex items-center justify-around z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col items-center justify-center gap-0.5 text-[#4edea3] cursor-pointer">
          <span className="material-symbols-outlined text-xl">dashboard</span>
          <span className="text-[10px] font-medium tracking-wide">Home</span>
        </div>

        <div className="flex flex-col items-center justify-center gap-0.5 text-[#c2c6d7] active:text-white relative cursor-pointer">
          <span className="material-symbols-outlined text-xl">group</span>
          <span className="text-[10px] font-medium tracking-wide">Family</span>
          {!hasFamily && (
            <span className="absolute top-0 right-1 w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          )}
        </div>

        <div className="flex flex-col items-center justify-center gap-0.5 text-[#c2c6d7] active:text-white cursor-pointer">
          <span className="material-symbols-outlined text-xl">settings</span>
          <span className="text-[10px] font-medium tracking-wide">
            Settings
          </span>
        </div>
      </nav>
    </>
  );
}

export default Sidebar;
