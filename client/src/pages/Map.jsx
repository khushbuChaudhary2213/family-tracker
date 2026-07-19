import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useAuth } from "../context/AuthContext";

function Map() {
  const { user, activeFamily } = useAuth();
  console.log(user);
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
  const [markers, setMarkers] = useState({});
  const lastSentCoords = useRef(null);
  const lastSentTime = useRef(0);

  console.log("Active Family", activeFamily);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Server Connected!!");
    });

    socket.emit("join_family_room", activeFamily.familyId);

    navigator.geolocation?.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCoords([latitude, longitude]);

        // if (accuracy > 50) {
        //   console.log("Ignoring inaccurate location: ", accuracy);
        //   return;
        // }

        const now = Date.now();
        // console.log(`LAT: ${latitude}; LNG: ${longitude}`);

        // for sending the very first location immediately
        if (!lastSentCoords.current) {
          socket.emit("send_live_location", {
            userId: user._id,
            userName: user.name,
            familyId: activeFamily.familyId,
            coords: {
              lat: latitude,
              lng: longitude,
            },
          });

          lastSentCoords.current = {
            lat: latitude,
            lng: longitude,
          };

          lastSentTime.current = now;
          return;
        }

        //  Throttle: wait at least 5 seconds before resending the location
        if (now - lastSentTime.current < 5000) {
          return;
        }

        // Simple movement check (~20–25 meters) for future use!
        // const latDiff = Math.abs(latitude - lastSentCoords.current.lat);
        // const lngDiff = Math.abs(longitude - lastSentCoords.current.lng);

        // if (latDiff > 0.0002 || lngDiff > 0.0002) {
        //   socket.emit("send-live-location", {
        //     userId: user._id,
        //     userName: user.name,
        //     familyId: activeFamily.familyId,
        //     lat: latitude,
        //     lng: longitude,
        //   });

        //   lastSentCoords.current = {
        //     lat: latitude,
        //     lng: longitude,
        //   };

        //   lastSentTime.current = now;

        //   console.log("Location sent");
        // }
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

    socket.on("receive_live_location", (data) => {
      const { userId, userName, currentLocation } = data;
      setMarkers((prevData) => ({
        ...prevData,
        [`${userId}-${userName}`]: currentLocation,
      }));
      // console.log(markers);
    });

    socket.on("error", (error) => {
      console.log("Socket Error: ", error);
    });

    // return () => {
    //   navigator.geolocation.clearWatch(location);
    //   socket.disconnect();
    // };
  }, [socket]);

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
      {Object.entries(markers).map(([user, location]) => (
        <Marker
          key={user.split("-")[0]}
          position={[location.lat, location.lng]}
        >
          <Popup className="family-popup">
            <div className="w-30 py-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {user.split("-")[1]}
              </h3>

              <div className="mt-2 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>

                <span className="text-sm text-gray-600">Live Location</span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Map;
