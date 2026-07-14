import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

function Header({ activeTab, onTriggerAuth, onSignOut }) {
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`flex items-center justify-between w-full border-b border-white/5 pb-6 z-50 transition-all duration-200 ${
        activeTab === "dashboard"
          ? "fixed top-0 left-0 right-0 bg-[#0e0e0e]/90 backdrop-blur-md p-6 md:px-12 h-16"
          : "absolute top-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto bg-transparent"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className="material-symbols-outlined text-[#b0c6ff] text-2xl select-none">
          shield
        </span>
        <span className="text-[13px] font-black tracking-[0.15em] text-white uppercase">
          Sentry
        </span>
      </div>

      {activeTab === "" && (
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
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setIsOpen(!isOpen)}
              className={`flex items-center gap-3 bg-white/5 hover:bg-white/10 border pl-3 pr-1 py-1 rounded-full cursor-pointer transition-all group ${
                isOpen
                  ? "border-[#00a572] shadow-[0_0_15px_rgba(0,165,114,0.25)]"
                  : "border-white/10"
              }`}
            >
              <span className="text-xs font-semibold text-[#c2c6d7] group-hover:text-white hidden md:block">
                {user?.name || "Operator"}
              </span>
              {/* Initials Circle Avatar */}
              <div className="w-8 h-8 rounded-full bg-[#b0c6ff] text-[#002d6e] flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(176,198,255,0.1)]">
                {user?.name ? user.name[0].toUpperCase() : "S"}
              </div>
            </div>

            {/* Dropdown Options Panel */}
            <div
              className={`absolute right-0 mt-3.5 w-56 bg-[#1e1e1e]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-200 origin-top-right transform ${
                isOpen
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              {/* Account Overview Header */}
              <div className="p-3.5 border-b border-white/5 flex flex-col gap-0.5">
                <p className="text-xs font-semibold text-[#e5e2e1] truncate">
                  {user?.name || "Sentry User"}
                </p>
                {user?.phone && (
                  <p className="text-[10px] font-mono text-zinc-400 tracking-wide mt-0.5 truncate">
                    {user.phone}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-1.5 space-y-0.5">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#c2c6d7] hover:text-white hover:bg-white/5 rounded-lg transition-all text-left group cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base text-zinc-500 group-hover:text-[#b0c6ff]">
                    settings
                  </span>
                  Settings
                </button>
              </div>

              {/* Danger Zone / Disconnect */}
              <div className="p-1.5 border-t border-white/5 bg-[#171717]/50 rounded-b-xl">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onSignOut();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all text-left group cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base text-red-400/60 group-hover:text-red-400">
                    logout
                  </span>
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
