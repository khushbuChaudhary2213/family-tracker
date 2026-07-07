function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col h-[calc(100vh-4rem)] fixed left-0 top-16 py-10 px-6 w-64 bg-[#201f1f] border-r border-white/5 shadow-2xl z-40 pt-24">
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-1 px-4">
          <span className="text-3xl font-black text-[#b0c6ff] tracking-tight">
            Member
          </span>
          <span className="text-xl font-medium text-[#c2c6d7] opacity-70">
            Sarah Chen
          </span>
        </div>

        <nav className="flex flex-col gap-2 mt-8">
          <div className="bg-[#00a572] text-[#00311f] rounded-xl flex items-center gap-3 px-4 py-3 cursor-pointer active:opacity-80 transition-all shadow-[0_0_12px_rgba(78,222,163,0.2)]">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-lg font-medium">Dashboard</span>
          </div>
          <div className="text-[#c2c6d7] hover:text-[#e5e2e1] flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 rounded-xl transition-all duration-200">
            <span className="material-symbols-outlined">group</span>
            <span className="text-lg font-medium">Family</span>
          </div>
          <div className="text-[#c2c6d7] hover:text-[#e5e2e1] flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 rounded-xl transition-all duration-200">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-lg font-medium">Settings</span>
          </div>
        </nav>

        {/* Persistent Protection Card Status */}
        <div className="mt-auto p-4 bg-[#1e1e1e]/70 backdrop-blur-2xl border border-white/5 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#4edea3] shadow-[0_0_12px_rgba(78,222,163,0.4)]"></div>
            <span className="text-[12px] font-semibold uppercase tracking-widest text-[#4edea3]">
              ACTIVE PROTECTION
            </span>
          </div>
          <p className="text-xs text-[#c2c6d7] mb-4 leading-relaxed">
            Your location is being shared with the Family Lead.
          </p>
          <button className="w-full py-2 bg-[#2a2a2a] hover:bg-[#393939] text-[#e5e2e1] rounded-lg text-xs font-bold transition-colors">
            Privacy Controls
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
