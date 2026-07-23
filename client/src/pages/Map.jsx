import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useAuth } from "../context/AuthContext";
import { useLocationContext } from "../context/LocationContext";

function Map() {
  const { activeFamily } = useAuth();
  // console.log(user);
  const { markers, ensureLocationsLoaded, sendLiveLocation } =
    useLocationContext();
  // const socket = useMemo(
  //   () =>
  //     io(import.meta.env.VITE_BASE_BACKEND_URL, {
  //       auth: {
  //         token: localStorage.getItem("token"),
  //       },
  //     }),
  //   [],
  // );
  const [coords, setCoords] = useState([]);
  // const [markers, setMarkers] = useState({});
  const lastSentCoords = useRef(null);
  const lastSentTime = useRef(0);

  console.log("Active Family", activeFamily);

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

  return (
    <MapContainer
      center={coords}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {Object.entries(markers).map(([userId, m]) => (
        <Marker key={userId} position={[m.lat, m.lng]}>
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
      ))}
    </MapContainer>
  );
}

export default Map;
