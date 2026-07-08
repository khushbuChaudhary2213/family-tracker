import { useNavigate } from "react-router-dom";

function Map() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full min-h-[500px] border border-dashed border-white/10 bg-[#0e0e0e]/40 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
      <span className="material-symbols-outlined text-[#b0c6ff] text-5xl mb-4 animate-pulse">
        location_on
      </span>
      <h3 className="text-xl font-bold text-white mb-2">
        Live Tracking Map Canvas
      </h3>
      <p className="text-sm text-[#8c90a0] max-w-md">
        This is the viewport shell where your map tracking engine (e.g.,
        Leaflet, OpenLayers, or Mapbox) will integrate.
      </p>
      <button
        onClick={() => navigate("landing")}
        className="mt-6 px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-semibold rounded-lg text-[#8c90a0] hover:text-white transition-all"
      >
        Sign Out / Reset Demo
      </button>
    </div>
  );
}

export default Map;
