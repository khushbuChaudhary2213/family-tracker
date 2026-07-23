import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useAuth } from "../context/AuthContext";
import { useLocationContext } from "../context/LocationContext";
import FitBounds from "../components/FitBounds";
import MapController from "../components/MapController";

function Map() {
  const { activeFamily } = useAuth();
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
    return <h2>Fetching your location...</h2>;
  }

  console.log("Markers", markers);
  return (
    <div className="relative top-10 h-full w-full">
      <div className="absolute right-5 top-5 z-[1000] flex flex-col gap-3">
        {/* Me */}
        <button
          onClick={() => goToMe?.()}
          className="rounded-xl bg-gray-700 px-4 py-3 shadow-lg transition hover:scale-105 hover:bg-gray-100 hover:text-black"
        >
          📍 Me
        </button>

        {/* Family */}
        <button
          onClick={() => fitMap?.()}
          className="rounded-xl bg-gray-700 px-4 py-3 shadow-lg transition hover:scale-105 hover:bg-gray-100 hover:text-black"
        >
          👨‍👩‍👧 Family
        </button>

        {/* Live Follow */}
        <button
          onClick={() => setLiveFollow((prev) => !prev)}
          className={`rounded-xl px-4 py-3 shadow-lg transition hover:scale-105 ${
            liveFollow
              ? "bg-green-600 text-white-700"
              : "bg-white text-gray-700"
          }`}
        >
          🛰 {liveFollow ? "Following" : "Follow"}
        </button>
      </div>
      <MapContainer
        center={coords}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
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
            console.log("Rendering marker:", userId, m);
            return (
              <Marker key={userId} position={[m.lat, m.lng]}>
                <Tooltip>{m.userName}</Tooltip>
                <Popup className="family-popup">
                  <div className="w-30 py-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {m.userName}
                    </h3>

                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          m.isOnline ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></span>

                      <span className="text-sm text-gray-600">
                        {m.isOnline ? "Live Location" : "Last seen: offline"}
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
