import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

function Map() {
  const socket = useMemo(
    () =>
      io(import.meta.env.VITE_BASE_BACKEND_URL, {
        auth: {
          token: localStorage.getItem("token"),
        },
      }),
    [],
  );
  const [coords, setCoords] = useState([]);
  const [markers, setMarkers] = useState(null);
  // console.log(coords.lat, coords.lng);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Server Connected!!");
    });

    navigator.geolocation?.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords([latitude, longitude]);

        console.log(`LAT: ${latitude}; LNG: ${longitude}`);
        socket.emit("send_live_location", { lat: latitude, lng: longitude });
      },
      (error) => {
        console.log("Error in fetching location:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );

    // return () => {
    //   navigator.geolocation.clearWatch(location);
    //   socket.disconnect();
    // };
  }, [socket]);

  if (coords.length === 0) {
    return <h2>Fetching your location...</h2>;
  }

  return (
    // <div>
    <MapContainer
      center={coords}
      // center={[51.505, -0.09]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={coords}></Marker>
    </MapContainer>
    // </div>
  );
}

export default Map;
