import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useNavigate } from "react-router-dom";
import MapController from "../components/MapController";
import { useAuth } from "../context/AuthContext";
import { useLocationContext } from "../context/LocationContext";
import { createCustomMarkerIcon } from "../components/CustomMarker";

function Map() {
  const { user, activeFamily } = useAuth();
  const { markers, ensureLocationsLoaded, sendLiveLocation, myDeviceInfo } =
    useLocationContext();
  const navigate = useNavigate();

  const [coords, setCoords] = useState([]);
  const lastSentCoords = useRef(null);
  const lastSentTime = useRef(0);
  const initialZoomDone = useRef(false);

  const [fitMap, setFitMap] = useState(null);
  const [goToMe, setGoToMe] = useState(null);
  const [liveFollow, setLiveFollow] = useState(false);

  const selfId = user?._id || user?.id;

  const displayMarkers = useMemo(
    () => ({
      ...markers,
      ...(selfId
        ? {
            [selfId]: markers[selfId] || {
              userName: user?.name || "You",
              lat: coords[0],
              lng: coords[1],
              isOnline: true,
              deviceInfo: myDeviceInfo,
              locationUpdatedAt: new Date().toISOString(),
            },
          }
        : {}),
    }),
    [markers, selfId, coords, user?.name, myDeviceInfo],
  );

  // Load locations when active family changes
  useEffect(() => {
    initialZoomDone.current = false;

    if (activeFamily?.familyId) {
      ensureLocationsLoaded(activeFamily.familyId);
    }
  }, [activeFamily?.familyId]);

  useEffect(() => {
    // If we already zoomed, or map controllers aren't ready, or we have no GPS yet, do nothing
    if (initialZoomDone.current || !fitMap || !goToMe || coords.length === 0)
      return;

    if (activeFamily) {
      // Wait for family markers to actually arrive from the backend context
      // (When it loads, the markers object will have keys)
      if (Object.keys(markers).length > 0) {
        fitMap(); // Zooms out to fit the whole family circle
        initialZoomDone.current = true;
      }
    } else {
      // Solo Mode: Just jump to the user's location (it will use the default zoom=17)
      goToMe();
      initialZoomDone.current = true;
    }
  }, [activeFamily, markers, fitMap, goToMe, coords]);

  // Start continuous GPS tracking
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords([latitude, longitude]);

        const now = Date.now();
        if (!lastSentCoords.current || now - lastSentTime.current >= 5000) {
          sendLiveLocation({ lat: latitude, lng: longitude });
          lastSentCoords.current = { lat: latitude, lng: longitude };
          lastSentTime.current = now;
        }
      },
      (error) => console.error("Error fetching location:", error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );

    return () => {
      if (watchId != null) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Reactive Live Tracking Effect: Follow position changes dynamically
  useEffect(() => {
    if (liveFollow && coords.length === 2 && goToMe) {
      goToMe();
    }
  }, [coords, liveFollow, goToMe]);

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

  return (
    <div className="relative h-full w-full">
      {/* SOLO MODE INDICATOR */}
      {!activeFamily && (
        <div className="absolute left-3 sm:left-5 top-3 sm:top-5 z-[1000] flex items-center gap-2 sm:gap-3 rounded-xl bg-[#1e1e1e]/90 backdrop-blur-md border border-amber-500/20 pl-3 pr-2 sm:pl-4 sm:pr-2.5 py-2 sm:py-2.5 shadow-lg max-w-[calc(100vw-5.5rem)] sm:max-w-none">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)] shrink-0"></span>
            <span className="text-[11px] sm:text-xs font-semibold text-amber-300/90 tracking-wide truncate">
              Solo Mode — no family circle yet
            </span>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="shrink-0 text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-[#002d6e] bg-[#b0c6ff] hover:bg-[#9cb6ff] px-2.5 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer"
          >
            Set Up
          </button>
        </div>
      )}

      {/* FLOATING ACTION BUTTONS */}
      <div className="absolute right-3 sm:right-5 top-3 sm:top-5 z-[1000] flex flex-col gap-2 sm:gap-3">
        {/* My Position */}
        <button
          onClick={() => {
            setLiveFollow(false);
            goToMe?.();
          }}
          className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-[#1e1e1e]/90 px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold text-zinc-200 border border-white/10 shadow-lg backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
        >
          📍 <span className="hidden sm:inline">My Position</span>
        </button>

        {/* Fit Circle */}
        {activeFamily && (
          <button
            onClick={() => {
              setLiveFollow(false);
              fitMap?.();
            }}
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-[#1e1e1e]/90 px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold text-zinc-200 border border-white/10 shadow-lg backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
          >
            👨‍👩‍👧 <span className="hidden sm:inline">Fit Circle</span>
          </button>
        )}

        {/* Live Follow Toggle */}
        <button
          onClick={() => setLiveFollow((prev) => !prev)}
          className={`flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold shadow-lg backdrop-blur-md transition-all border cursor-pointer active:scale-95 ${
            liveFollow
              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              : "bg-[#1e1e1e]/90 border-white/10 text-zinc-200 hover:bg-white/10 hover:text-white"
          }`}
        >
          <span className={liveFollow ? "animate-pulse" : ""}>🛰</span>
          <span className="hidden sm:inline">
            {liveFollow ? "Live Tracking" : "Track Me"}
          </span>
        </button>
      </div>

      {/* MAP CONTAINER */}
      <MapContainer
        center={coords}
        zoom={17}
        maxZoom={19} // How far the user is allowed to zoom in
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution="Tiles &copy; Esri &mdash; Source: Esri..."
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
          maxNativeZoom={17} // The server only has tiles up to this zoom level. If the user zooms in closer than this, don't ask the server for new images. Instead, just visually stretch/magnify the images from the maximum native zoom.
        />
        <MapController
          markers={displayMarkers}
          coords={coords}
          setFitMap={setFitMap}
          setGoToMe={setGoToMe}
        />
        <MarkerClusterGroup
          showCoverageOnHover={false}
          spiderfyOnMaxZoom={true}
          zoomToBoundsOnClick={true}
          maxClusterRadius={50}
          disableClusteringAtZoom={17}
          spiderfyDistanceMultiplier={2}
        >
          {Object.entries(displayMarkers).map(([userId, m]) => {
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

                    <div className="mt-2.5 flex flex-col gap-1.5">
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
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-zinc-400 opacity-80">
                          📱 {m.deviceInfo || "Unknown Device"}
                        </span>
                      </div>
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
