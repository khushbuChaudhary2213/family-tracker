import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import getFamilyLocations from "../apiFuncs/getFamilyLocations";

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const { user, activeFamily } = useAuth();
  const [markers, setMarkers] = useState({});

  const hasFetchedRef = useRef(false); // guards the one-time REST fetch
  const socketRef = useRef(null);
  const joinedFamilyRef = useRef(null);

  // Create the socket exactly once per logged-in session — not per page visit
  useEffect(() => {
    if (!user || user.placeholder) return;

    const socket = io(import.meta.env.VITE_BASE_BACKEND_URL, {
      auth: { token: localStorage.getItem("token") },
    });
    socketRef.current = socket;

    socket.on("receive_live_location", (data) => {
      const { userId, userName, currentLocation, isOnline } = data;
      setMarkers((prev) => ({
        ...prev,
        [userId]: {
          userName,
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          isOnline,
          locationUpdatedAt: new Date().toISOString(),
        },
      }));
    });

    socket.on("family_member_status", (data) => {
      const { userId, userName, isOnline, lastKnownLocation } = data;
      setMarkers((prev) => {
        const existing = prev[userId];
        const source = lastKnownLocation || existing;
        if (!source) return prev; // nothing to show yet for this member

        return {
          ...prev,
          [userId]: {
            userName: userName || existing?.userName,
            lat: source.lat,
            lng: source.lng,
            isOnline,
            locationUpdatedAt: new Date().toISOString(),
          },
        };
      });
    });

    socket.on("error", (err) => console.log("Socket error:", err));

    return () => {
      socket.disconnect();
      socketRef.current = null;
      hasFetchedRef.current = false;
      joinedFamilyRef.current = null;
      setMarkers({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.placeholder ? null : user?._id]); // recreate only on login/logout, not every render

  // Join (or switch) the family room whenever the active family changes
  useEffect(() => {
    if (!socketRef.current || !activeFamily) return;
    if (joinedFamilyRef.current === activeFamily.familyId) return;

    socketRef.current.emit("join_family_room", activeFamily.familyId);
    joinedFamilyRef.current = activeFamily.familyId;
  }, [activeFamily]);

  // Fetches the REST snapshot exactly once per session — safe to call from
  // anywhere, anytime; it's a no-op after the first successful call.
  const ensureLocationsLoaded = async () => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    try {
      const res = await getFamilyLocations();
      const locations = res?.data?.locations || [];

      setMarkers((prev) => {
        const seeded = { ...prev };
        locations.forEach((loc) => {
          if (!loc.currentLocation?.coordinates) return;
          const [lng, lat] = loc.currentLocation.coordinates;
          if (lat === 0 && lng === 0) return; // never-set default coords

          // Don't overwrite a marker that's already been updated live by a socket event
          if (seeded[loc._id]) return;

          seeded[loc._id] = {
            userName: loc.name,
            lat,
            lng,
            isOnline: loc.isOnline,
            locationUpdatedAt: loc.locationUpdatedAt,
          };
        });
        return seeded;
      });
    } catch (err) {
      console.error("Failed to load family locations:", err);
      hasFetchedRef.current = false; // allow a retry if it failed
    }
  };

  const sendLiveLocation = (coords) => {
    if (!socketRef.current || !activeFamily) return;
    socketRef.current.emit("send_live_location", {
      familyId: activeFamily.familyId,
      coords,
    });
  };

  return (
    <LocationContext.Provider
      value={{ markers, ensureLocationsLoaded, sendLiveLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error(
      "useLocationContext must be used within a LocationProvider",
    );
  }
  return ctx;
}
