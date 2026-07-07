function Header({ activeTab, onTriggerAuth, onSignOut }) {
  return (
    <header className="flex items-center justify-between w-full border-b border-white/5 pb-6">
      <div className="flex items-center gap-2.5">
        <span className="material-symbols-outlined text-[#b0c6ff] text-2xl select-none">
          shield
        </span>
        <span className="text-[13px] font-black tracking-[0.15em] text-white uppercase">
          Sentry
        </span>
      </div>

      {activeTab === "landing" && (
        <nav className="flex items-center gap-6">
          <button
            onClick={() => onTriggerAuth("login")}
            className="text-sm font-medium text-[#c2c6d7] hover:text-white transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => onTriggerAuth("signup")}
            className="text-sm font-bold bg-white/5 border border-white/10 hover:bg-white/10 px-5 py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer"
          >
            Create Circle
          </button>
        </nav>
      )}
      {activeTab === "dashboard" && (
        <div className="flex items-center gap-4">
          {/* Notifications Toggle */}
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 text-[#c2c6d7] hover:text-white transition-all hidden sm:flex">
            <span className="material-symbols-outlined text-lg">
              notifications
            </span>
          </div>

          {/* Profile Pill Wrapper */}
          <div
            onClick={onSignOut} // Quick utility fallback click to disconnect
            title="Click to Disconnect"
            className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 pl-3 pr-1 py-1 rounded-full cursor-pointer transition-all group"
          >
            <span className="text-xs font-semibold text-[#c2c6d7] group-hover:text-white hidden md:block">
              Sarah Chen
            </span>
            {/* Initials Circle Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#b0c6ff] text-[#002d6e] flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(176,198,255,0.1)]">
              SC
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
