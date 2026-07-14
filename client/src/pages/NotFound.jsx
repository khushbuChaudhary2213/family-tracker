import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleReturn = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] antialiased [font-family:'Geist',sans-serif] flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00a572]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#e5e2e1] to-[#1e1e1e] select-none">
          404
        </h1>

        <h2 className="text-lg md:text-xl font-bold uppercase tracking-widest text-[#00a572] mt-4 mb-2">
          Protocol Breach: Area Unknown
        </h2>

        <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8">
          The tracking grid coordinates you requested do not exist or have been
          classified. SENTRY protocols cannot map this viewport location.
        </p>

        <button
          onClick={handleReturn}
          className="w-full sm:w-auto px-8 py-3 bg-[#1e1e1e] hover:bg-[#252525] text-sm font-semibold text-[#e5e2e1] rounded-xl border border-white/10 hover:border-[#00a572]/40 transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[#00a572]/5 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-200">
            ←
          </span>
          Return to Secure Sector
        </button>
      </div>

      <div className="absolute bottom-6 text-[10px] uppercase tracking-widest text-zinc-600 font-mono">
        System Status // Terminal Offline
      </div>
    </div>
  );
}
