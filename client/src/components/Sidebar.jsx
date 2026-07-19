import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "dashboard",
    path: "/dashboard",
  },
  { key: "family", label: "Family", icon: "group", path: "/dashboard/family" },
  {
    key: "settings",
    label: "Settings",
    icon: "settings",
    path: "/dashboard/settings",
  },
  {
    key: "map",
    label: "Map",
    icon: "map",
    path: "/dashboard/map",
  },
];

function Sidebar() {
  const { user, families, activeFamily, switchActiveFamily } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isFamilyAdmin =
    activeFamily?.admins?.some((admin) => admin._id === user?._id) || false;

  const isActivePath = (path) =>
    path === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(path);

  return (
    <>
      <aside className="hidden lg:flex flex-col h-[calc(100vh-4rem)] fixed left-0 top-0 bottom-0 py-10 px-6 w-64 h-full bg-[#201f1f] border-r border-white/5 shadow-2xl z-40 pt-24">
        <div className="flex flex-col gap-6 h-full">
          <div className="flex flex-col gap-1 px-4">
            <span className="text-3xl font-black text-[#b0c6ff] tracking-tight">
              {activeFamily ? (isFamilyAdmin ? "Admin" : "Member") : "Solo"}
            </span>
            <span className="text-xl font-medium text-[#c2c6d7] opacity-70">
              {user?.name || "Sentry User"}
            </span>
          </div>

          {families.length > 0 ? (
            <div className="relative" ref={dropdownRef}>
              <label className="text-[10px] font-bold text-[#8c90a0] uppercase tracking-widest block mb-1.5 ml-1">
                Active Family Circle
              </label>

              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between bg-[#1a1a1c] border border-white/5 hover:border-white/15 focus:border-[#b0c6ff]/40 hover:bg-[#222225] px-4 py-3 rounded-xl text-sm text-[#e5e2e1] transition-all duration-200 cursor-pointer shadow-inner group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="material-symbols-outlined text-[#b0c6ff] text-[20px] transition-transform group-hover:scale-110 duration-200">
                    diversity_1
                  </span>
                  <div className="flex flex-col items-start truncate leading-tight">
                    <span className="truncate font-semibold text-[#e5e2e1] text-[13px]">
                      {activeFamily?.familyName || "Select Circle..."}
                    </span>
                    {activeFamily && (
                      <span className="text-[10px] text-[#8c90a0]">
                        {activeFamily.members?.length || 1} members active
                      </span>
                    )}
                  </div>
                </div>

                {/* Smoothly rotating chevron indicator */}
                <span
                  className={`material-symbols-outlined text-[#8c90a0] text-lg transition-transform duration-300 ${
                    dropdownOpen ? "rotate-180 text-white" : ""
                  }`}
                >
                  expand_more
                </span>
              </button>

              {/* Dropdown Menu Container */}
              {dropdownOpen && (
                <div className="absolute left-4 right-4 mt-2 bg-[#17171a]/95 border border-white/10 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl z-50 overflow-hidden max-h-60 flex flex-col p-1.5 animate-[fadeIn_0.15s_ease-out]">
                  <div className="text-[9px] font-bold text-[#5c5f6c] uppercase tracking-widest px-3 py-1.5 border-b border-white/5 mb-1">
                    Switch Workspace
                  </div>

                  <div className="overflow-y-auto max-h-48 pr-1 space-y-1">
                    {families.map((fam) => {
                      const isActive = activeFamily?.familyId === fam.familyId;
                      return (
                        <div
                          key={fam.familyId}
                          onClick={() => {
                            switchActiveFamily(fam.familyId);
                            setDropdownOpen(false);
                          }}
                          className={`px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-all duration-150 flex items-center justify-between group/item ${
                            isActive
                              ? "text-[#4edea3] bg-[#4edea3]/5 font-semibold"
                              : "text-[#c2c6d7] hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            {/* Subtle active status indicator dot */}
                            <span
                              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                isActive
                                  ? "bg-[#4edea3] shadow-[0_0_8px_#4edea3]"
                                  : "bg-transparent group-hover/item:bg-white/30"
                              }`}
                            />
                            <span className="truncate text-[13px]">
                              {fam.familyName}
                            </span>
                          </div>

                          <div className="flex items-center shrink-0 gap-2">
                            {/* Miniature member count bubble */}
                            <span className="text-[10px] text-[#8c90a0] bg-[#1e1e21] border border-white/5 px-2 py-0.5 rounded-md font-medium group-hover/item:border-white/10">
                              👤 {fam.members?.length || 1}
                            </span>

                            {isActive && (
                              <span className="material-symbols-outlined text-[16px] text-[#4edea3] animate-scale-up">
                                check_circle
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Elegant Empty State Card */
            <div className="mx-4 p-4 rounded-xl bg-[#231a1a] border border-amber-500/10 flex items-start gap-3">
              <span className="material-symbols-outlined text-amber-500 text-md pt-0.5">
                warning
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-amber-400/90 uppercase tracking-wide">
                  No Circle Available
                </span>
              </div>
            </div>
          )}
          <nav className="flex flex-col gap-2 mt-8">
            {NAV_ITEMS.map((item) => {
              const active = isActivePath(item.path);
              return (
                <div
                  key={item.key}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl cursor-pointer active:opacity-80 transition-all duration-300 ease-in-out group ${
                    active
                      ? "bg-[#00a572] text-[#00311f] shadow-[0_0_12px_rgba(78,222,163,0.2)]"
                      : "bg-[#00a572]/0 text-[#c2c6d7] hover:text-[#e5e2e1] hover:bg-white/5 shadow-[0_0_12px_rgba(78,222,163,0)]"
                  }`}
                >
                  <div className="relative z-10 flex items-center gap-3">
                    <span className="material-symbols-outlined">
                      {item.icon}
                    </span>
                    <span className="text-lg font-medium">{item.label}</span>
                  </div>

                  {item.key === "family" && !activeFamily && (
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      Empty
                    </span>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Persistent Protection Card Status */}
          <div className="mt-auto p-4 bg-[#1e1e1e]/70 backdrop-blur-2xl border border-white/5 rounded-xl">
            {activeFamily ? (
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
                <button
                  onClick={() => navigate("/dashboard/family")}
                  className="w-full py-2 bg-[#2a2a2a] hover:bg-[#393939] text-[#e5e2e1] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
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
                  You aren't linked to a family ecosystem.
                </p>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full py-2 bg-[#b0c6ff] hover:bg-[#9cb6f7] text-[#002d6e] rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer"
                >
                  Setup Family Circle
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#171717]/90 backdrop-blur-xl border-t border-white/5 px-6 flex items-center justify-around z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {NAV_ITEMS.map((item) => {
          const active = isActivePath(item.path);
          return (
            <div
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-0.5 relative cursor-pointer transition-colors duration-300 ease-out ${
                active ? "text-[#4edea3]" : "text-[#c2c6d7] active:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                {item.icon}
              </span>
              <span className="text-[10px] font-medium tracking-wide">
                {item.label}
              </span>
              {item.key === "family" && !activeFamily && (
                <span className="absolute top-0 right-1 w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}

export default Sidebar;
