import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import MapController from "../components/MapController";
import { useAuth } from "../context/AuthContext";
import { useLocationContext } from "../context/LocationContext";
import { createCustomMarkerIcon } from "../components/CustomMarker";

function Map() {
  const { user, activeFamily } = useAuth();
  const { markers, ensureLocationsLoaded, sendLiveLocation } =
    useLocationContext();

  const [coords, setCoords] = useState([]);
  const lastSentCoords = useRef(null);
  const lastSentTime = useRef(0);

  const [fitMap, setFitMap] = useState(null);
  const [goToMe, setGoToMe] = useState(null);
  const [liveFollow, setLiveFollow] = useState(false);

  // console.log("Active Family", activeFamily);

  // 1. Seed the map with last-known/offline positions from the REST snapshot
  useEffect(() => {
    if (activeFamily?.familyId) {
      ensureLocationsLoaded(activeFamily.familyId);
    }
  }, [activeFamily?.familyId]);

  // 2. Live socket updates
  useEffect(() => {
    // socket.on("connect", () => {
    //   console.log("Server Connected!!");
    // });

    // socket.emit("join_family_room", activeFamily.familyId);

    const watchId = navigator.geolocation?.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords([latitude, longitude]);

        if (liveFollow) {
          goToMe?.();
        }

        const now = Date.now();

        if (!lastSentCoords.current || now - lastSentTime.current >= 5000) {
          sendLiveLocation({ lat: latitude, lng: longitude });
          lastSentCoords.current = { lat: latitude, lng: longitude };
          lastSentTime.current = now;
        }
      },
      (error) => console.log("Error in fetching location:", error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    );
    return () => {
      if (watchId != null) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  if (coords.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#0e0e0e] text-white">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 animate-ping rounded-full bg-emerald-500"></span>
          <h2 className="text-sm font-semibold tracking-wider text-zinc-400">
            LOCATING GPS SIGNAL...
          </h2>
        </div>
      </div>
    );
  }

  // console.log("Markers", markers);
  return (
    <div className="relative top-10 h-full w-full">
      <div className="absolute right-5 top-5 z-[1000] flex flex-col gap-3">
        {/* Me */}
        <button
          onClick={() => goToMe?.()}
          className="flex items-center gap-2 rounded-xl bg-[#1e1e1e]/90 px-4 py-2.5 text-xs font-semibold text-zinc-200 border border-white/10 shadow-lg backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10 hover:text-black active:scale-95 cursor-pointer "
        >
          📍 My Positon
        </button>

        {/* Family */}
        <button
          onClick={() => fitMap?.()}
          className="flex items-center gap-2 rounded-xl bg-[#1e1e1e]/90 px-4 py-2.5 text-xs font-semibold text-zinc-200 border border-white/10 shadow-lg backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10 hover:text-black active:scale-95 cursor-pointer "
        >
          👨‍👩‍👧 Fit Circle
        </button>

        {/* Live Follow */}
        <button
          onClick={() => setLiveFollow((prev) => !prev)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-lg backdrop-blur-md transition-all border cursor-pointer active:scale-95 ${
            liveFollow
              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              : "bg-[#1e1e1e]/90 border-white/10 text-zinc-200 hover:bg-white/10 hover:text-black"
          }`}
        >
          <span className={liveFollow ? "animate-pulse" : ""}>🛰</span>{" "}
          {liveFollow ? "Live Tracking" : "Track Me"}
        </button>
      </div>
      <MapContainer
        center={coords}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController
          markers={markers}
          coords={coords}
          setFitMap={setFitMap}
          setGoToMe={setGoToMe}
        />
        <MarkerClusterGroup
          showCoverageOnHover={false}
          spiderfyOnMaxZoom={true}
          zoomToBoundsOnClick={true}
        >
          {Object.entries(markers).map(([userId, m]) => {
            const isCurrentUser = user?._id === userId || user?.id === userId;
            return (
              <Marker
                key={userId}
                position={[m.lat, m.lng]}
                icon={createCustomMarkerIcon(m, isCurrentUser)}
              >
                <Tooltip
                  direction="top"
                  offset={[0, -45]}
                  opacity={1}
                  className="!bg-[#1e1e1e] !border-white/10 !text-white !font-semibold !rounded-lg !px-3 !py-1.5 !shadow-xl"
                >
                  {m.userName} {isCurrentUser ? "(You)" : ""}
                </Tooltip>
                <Popup className="sentry-custom-popup">
                  <div className="w-48 bg-[#1e1e1e] p-3 text-white rounded-xl border border-white/10 shadow-2xl">
                    <div className="flex items-center gap-2.5 border-b border-white/10 pb-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#b0c6ff] text-[11px] font-bold text-[#002d6e]">
                        {m.userName ? m.userName[0].toUpperCase() : "U"}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="truncate text-xs font-bold text-white">
                          {m.userName}
                        </h3>
                        <p className="text-[10px] text-zinc-400">
                          {isCurrentUser ? "Your Device" : "Circle Member"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          m.isOnline
                            ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                            : "bg-zinc-500"
                        }`}
                      ></span>
                      <span className="text-[11px] font-medium text-zinc-300">
                        {m.isOnline ? "Live Signal" : "Last Seen Offline"}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}

export default Map;
