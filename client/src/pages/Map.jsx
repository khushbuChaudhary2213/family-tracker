import { useEffect, useRef, useState } from "react";

function Map() {
  const mapContainerRef = useRef(null);
  const mapImageRef = useRef(null);
  const [showMobilePanel, setShowMobilePanel] = useState(false);

  // Parallax map panning micro-interaction on mouse move
  useEffect(() => {
    const mapContainer = mapContainerRef.current;
    const mapImage = mapImageRef.current;
    if (!mapContainer || !mapImage) return;

    const handleMouseMove = (e) => {
      const xAxis = (window.innerWidth / 2 - e.pageX) / 45;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 45;
      mapImage.style.transform = `scale(1.05) translate(${xAxis}px, ${yAxis}px)`;
    };

    const handleMouseLeave = () => {
      mapImage.style.transform = `scale(1) translate(0, 0)`;
      mapImage.style.transition = "transform 0.5s ease-out";
    };

    const handleMouseEnter = () => {
      mapImage.style.transition = "none";
    };

    mapContainer.addEventListener("mousemove", handleMouseMove);
    mapContainer.addEventListener("mouseleave", handleMouseLeave);
    mapContainer.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      mapContainer.removeEventListener("mousemove", handleMouseMove);
      mapContainer.removeEventListener("mouseleave", handleMouseLeave);
      mapContainer.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);
  return (
    <main
      ref={mapContainerRef}
      className="w-full h-screen lg:pl-64 pt-16 relative select-none"
    >
      {/* Virtual Map Layer */}
      <div className="absolute inset-0 z-0">
        <div
          ref={mapImageRef}
          className="w-full h-full bg-cover bg-center grayscale contrast-[1.1] brightness-[0.4] origin-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCTufJ8RkhSe1QwdWk-fv2iWcKhltrE48vNryh4oW1Hv4KAQ4FVHEPvqh8l_84DKyT9gEgfo5kti8x2ifdcFQmi_Ft3mru-peiCeHw0phsTwwYj2N9wRlTWVGWnvAneZ3bwRfVkNbfEmIqmjr9hSUvuxM70roDYsa_jPbeCSQk2Mvj8BhTZ5alPIWSGvLTRJF3nxqCrXEW_NQfEIFNkZd-1d4ufNMzjZoBxG7fm-SydYzdV08uMO5omKDzi0TcJga7GiHpgCpdKhhXx')",
          }}
        ></div>

        {/* Absolute Map Pins Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Primary User Marker (Sarah) */}
          <div className="absolute top-[45%] left-[52%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#b0c6ff]/20 animate-ping w-12 h-12 -left-3 -top-3"></div>
              <div className="w-6 h-6 rounded-full bg-[#b0c6ff] border-2 border-white shadow-[0_0_12px_rgba(176,198,255,0.4)] relative z-10"></div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-[#201f1f] px-3 py-1 rounded-full border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[10px] font-bold text-[#e5e2e1]">
                  YOU (Sarah)
                </span>
              </div>
            </div>
          </div>

          {/* Marcus Pin */}
          <div className="absolute top-[30%] left-[40%] pointer-events-auto cursor-pointer group">
            <div className="w-4 h-4 rounded-full bg-[#4edea3] border-2 border-white shadow-[0_0_12px_rgba(78,222,163,0.4)] relative z-10"></div>
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-[#201f1f] px-3 py-1 rounded-full border border-white/10 whitespace-nowrap">
              <span className="text-[10px] font-bold text-[#e5e2e1]">
                Dad (Home)
              </span>
            </div>
          </div>

          {/* Leo Pin */}
          <div className="absolute top-[60%] left-[65%] pointer-events-auto cursor-pointer group">
            <div className="w-4 h-4 rounded-full bg-[#ffb95f] border-2 border-white relative z-10"></div>
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-[#201f1f] px-3 py-1 rounded-full border border-white/10 whitespace-nowrap">
              <span className="text-[10px] font-bold text-[#e5e2e1]">
                Leo (School)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Ambient Status HUD Chips */}
      <div className="absolute top-5 left-5 right-5 lg:left-5 lg:top-5 flex flex-wrap gap-4 z-20 pointer-events-none">
        <div className="bg-[#1e1e1e]/70 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex items-center gap-4 pointer-events-auto shadow-2xl">
          <div className="w-10 h-10 rounded-full border-2 border-[#4edea3] p-0.5">
            <img
              className="w-full h-full rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtirskA00wdQ0QDIum7VkS36MprFF8yw9obkALrbS237Bughj6Qq6U-NT7zNWh8cohMVkeIv213R5-ketaFpfUM09GN5VmwXOofyY7UtB8TBPWdTGahjLsu1dTQh48QwmmL5SDgRLlrk_dkroXfE9HBtrAbCAQ-EfArdDdFoYt03mPOHAysnE4pYH43Lhh7cEFVDPrzGodfuHMVikWk0RMOvHu1FK4A3e5_CUs2u9b9aCAcXPQNOalwiHBzj_9MfNUmtz21p7MWzBM"
              alt="Marcus profile panel snapshot"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#e5e2e1]">Marcus (Lead)</span>
              <span className="text-[10px] bg-[#00a572]/20 text-[#4edea3] px-2 py-0.5 rounded-full font-semibold tracking-wider">
                HOME
              </span>
            </div>
            <span className="text-xs text-[#c2c6d7] font-medium">
              Last seen 2m ago • 88% Bat
            </span>
          </div>
        </div>

        <div className="bg-[#1e1e1e]/70 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex items-center gap-4 pointer-events-auto shadow-2xl">
          <div className="w-10 h-10 rounded-full border-2 border-[#b0c6ff] p-0.5">
            <img
              className="w-full h-full rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3rw42eWrv71soFTgTsGAI3eF0PkXB5D9zW2Tiv23mgABwHPdNOboic8P_WPP5_gaVrf1C_hfjZEYK_4Cemt1G0CJKPFaCsI79KlJz6L1ab8aHuzFEapRwOayPMzlZqHmL5h6P5_W6cjW6QGefIiP25FqUQ4UBlIpE4MtIK228QV7IC6lWVvrKIAjKC6udWZmmz-nhMAqsksMPzcdqRFw-brfs4VVuhqhtXRF9YVaxma4TR4G2gkM2GMLq6PFuek3jxgHPGel3UG19"
              alt="Leo status panel thumbnail"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#e5e2e1]">Leo</span>
              <span className="text-[10px] bg-[#558dff]/20 text-[#b0c6ff] px-2 py-0.5 rounded-full font-semibold tracking-wider">
                SCHOOL
              </span>
            </div>
            <span className="text-xs text-[#c2c6d7] font-medium">
              Active now • 42% Bat
            </span>
          </div>
        </div>
      </div>

      {/* ================= RIGHT FLOATING SIDEBAR (Desktop & Tablet Layout) ================= */}
      <div
        className={`absolute right-5 top-5 bottom-5 w-80 z-30 flex flex-col pointer-events-none transition-all duration-300 lg:flex ${showMobilePanel ? "flex !left-5 !right-5 !w-auto pointer-events-auto" : "hidden xl:flex"}`}
      >
        <div className="bg-[#1e1e1e]/70 backdrop-blur-xl w-full h-full rounded-3xl overflow-hidden flex flex-col pointer-events-auto border border-white/10 shadow-2xl">
          {/* Mobile Close Button Inside Panel View */}
          <div className="xl:hidden p-4 flex justify-between items-center border-b border-white/5 bg-white/5">
            <span className="text-sm font-bold tracking-wider text-[#b0c6ff]">
              EXPANDED CONTEXT VIEW
            </span>
            <button
              onClick={() => setShowMobilePanel(false)}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#e5e2e1] flex items-center"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <div className="p-4 border-b border-white/5">
            <h3 className="text-lg font-medium text-[#e5e2e1]">
              Family Circle
            </h3>
            <p className="text-xs text-[#c2c6d7]">3 active connections</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
            {/* Member Row 1 */}
            <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-white/10 group">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#4edea3]"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYeiHCV_fdWuJCD3YG9VHU9oEoDxSak7TIzu8PuNyxaK3Am-9Aw3SJLj_xPiRXfBslTlztwPftcypklqZ5WP7NaRGewZ-zUfPVzMxJQyDvUVc3BmRwWIs-x_6w89v0przKv-ko1qAtpF9jJWfPEjcPu0GeflNPwPLFfskqPv4UePZBb4eGLlCAm_DZqTLdEe_jZRyu6esnvE2ulMlvAiSxOXIcg6Dg4Ld38VeAP5cdjmRvy-1AePEmv-xfr3FFf97mdq0tNYjF2Vfq"
                    alt="Elena profile card"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#4edea3] rounded-full border-2 border-[#201f1f] shadow-[0_0_12px_rgba(78,222,163,0.4)]"></div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#e5e2e1]">Elena</span>
                    <span className="material-symbols-outlined text-[#c2c6d7] text-sm">
                      battery_full
                    </span>
                  </div>
                  <p className="text-xs text-[#c2c6d7]">
                    1.2 miles away • Driving
                  </p>
                </div>
              </div>
            </div>

            {/* Member Row 2 (Self Status Paragraph Layout Block) */}
            <div className="p-3 rounded-xl bg-[#558dff]/10 border border-[#b0c6ff]/20 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#b0c6ff]"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC16hpzDCfBkLueoJ7_rusZdMQT_GsNSOKRDBevSjc_D1yPbLPYC4GIM8TY06u2z8812JQK88s8KQH6AXPV266ZpABnUkiauNveMzl-Pc1RDc66gtkjw0dyQKbyBh85SW71suAS9r7FzWOfzddA50lrYAvR2BYUkk4YL4yRM3VFGcT94ylZlKzgq1FvSiPUDbzqUWBrH2S_RLRskOJ5Ej9qdMLssqKiZCSdUhTjTvkDsI8dQn6vtc1n3Bl2SiqI7-j7PXgMbwn85awi"
                    alt="Sarah status block preview"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#b0c6ff] rounded-full border-2 border-[#201f1f] shadow-[0_0_12px_rgba(176,198,255,0.4)]"></div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#e5e2e1]">
                      Sarah (You)
                    </span>
                    <span className="material-symbols-outlined text-[#b0c6ff] text-sm">
                      battery_5_bar
                    </span>
                  </div>
                  <p className="text-[10px] text-[#b0c6ff] font-bold uppercase tracking-wider mt-0.5">
                    Reporting • Walking
                  </p>
                </div>
              </div>
            </div>

            {/* Member Row 3 */}
            <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-white/10 group opacity-60">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#c2c6d7]"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIccoVb4TC4nzoQDpkvZhTOsWGonSJXkR7QY8XOdJqkDIRveUyw_BmL8ndcC-h680_-5cJ8bJcjHluM3zSY_EsKtAxwN0zHK8XZU61F3RR7ycYyP2ZsmxsSws5QuzlSburmuQuYqH387086UZaShJvojGjfx70coRROXncOraE-DvuZSJsBgyYQMLZg5SK33k5DzIf891ll5rAxyc56riazV10lcYf6AcIELJD35bKEQQ2TsSl5VnJhBECYdl2P9533VQ09Nt5HqXx"
                    alt="Grandpa network status card"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#c2c6d7] rounded-full border-2 border-[#201f1f]"></div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#e5e2e1]">Grandpa</span>
                    <span className="material-symbols-outlined text-[#c2c6d7] text-sm">
                      battery_alert
                    </span>
                  </div>
                  <p className="text-xs text-[#c2c6d7]">Offline • 4h ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#353534]/30 border-t border-white/5">
            <button className="w-full py-3 bg-[#b0c6ff] text-[#002d6e] rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[#b0c6ff]/20">
              <span className="material-symbols-outlined">sos</span>
              SEND SOS ALERT
            </button>
            <p className="text-[10px] text-center mt-3 text-[#c2c6d7]/50 font-semibold tracking-wider">
              EMERGENCY CONTACTS ONLY
            </p>
          </div>
        </div>
      </div>

      {/* ================= CONDITIONALLY TRIGGERED RESPONSIVE LAYOUT ELEMENT (< 1024px) ================= */}
      {/* Paragraph Info Bar layout containing the custom requested action button on the far right edge */}
      <div className="absolute bottom-32 left-5 right-5 xl:left-5 xl:right-auto xl:w-96 z-20 pointer-events-none">
        <div className="bg-[#1e1e1e]/70 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex items-center justify-between pointer-events-auto shadow-2xl gap-4">
          <div className="flex flex-col flex-1">
            <span className="text-[10px] font-bold tracking-wider text-[#c2c6d7] uppercase">
              CURRENT SAFE STATUS
            </span>
            <p className="text-sm font-medium text-[#e5e2e1] mt-0.5 leading-snug">
              Secure in Safe Zone. Secure Network protocol shielding is active
              across device endpoints.
            </p>
          </div>

          {/* 💡 Custom Mobile Toggle Action Button placed precisely on the right-side of the paragraph view */}
          <button
            type="button"
            onClick={() => setShowMobilePanel(true)}
            className="lg:hidden shrink-0 w-12 h-12 bg-[#4edea3]/20 hover:bg-[#4edea3]/30 text-[#4edea3] rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-[0_0_12px_rgba(78,222,163,0.15)]"
            title="Open Circle Vault"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shield_person
            </span>
          </button>

          {/* Desktop Only Default Placeholder status indicator graphic */}
          <div className="hidden lg:flex w-12 h-12 bg-[#4edea3]/20 text-[#4edea3] rounded-xl items-center justify-center">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shield
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Map;
