import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import getFamilyLocations from "../apiFuncs/getFamilyLocations";

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const { user, activeFamily } = useAuth();

  const [locationsByFamily, setLocationsByFamily] = useState({});

  const fetchedFamiliesRef = useRef(new Set()); // which familyIds we've already REST-fetched
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
      const { familyId, userId, userName, currentLocation, isOnline } = data;
      setLocationsByFamily((prev) => ({
        ...prev,
        [familyId]: {
          ...(prev[familyId] || {}),
          [userId]: {
            userName,
            lat: currentLocation.lat,
            lng: currentLocation.lng,
            isOnline,
            locationUpdatedAt: new Date().toISOString(),
          },
        },
      }));
    });

    socket.on("family_member_status", (data) => {
      const { familyId, userId, userName, isOnline, lastKnownLocation } = data;
      setLocationsByFamily((prev) => {
        const familyMarkers = prev[familyId] || {};
        const existing = familyMarkers[userId];
        const source = lastKnownLocation || existing;
        if (!source) return prev; // nothing to show yet for this member

        return {
          ...prev,
          [familyId]: {
            ...familyMarkers,
            [userId]: {
              userName: userName || existing?.userName,
              lat: source.lat,
              lng: source.lng,
              isOnline,
              locationUpdatedAt: new Date().toISOString(),
            },
          },
        };
      });
    });

    socket.on("error", (err) => console.log("Socket error:", err));

    return () => {
      socket.disconnect();
      socketRef.current = null;
      fetchedFamiliesRef.current = new Set();
      joinedFamilyRef.current = null;
      setLocationsByFamily({});
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
  const ensureLocationsLoaded = async (familyId) => {
    if (!familyId) return;
    if (fetchedFamiliesRef.current.has(familyId)) return;
    fetchedFamiliesRef.current.add(familyId);

    try {
      const res = await getFamilyLocations(familyId);
      const locations = res?.data?.locations || [];
      console.log(locations);

      setLocationsByFamily((prev) => {
        const familyMarkers = { ...(prev[familyId] || {}) };

        locations.forEach((loc) => {
          if (!loc.currentLocation?.coordinates) return;
          const [lng, lat] = loc.currentLocation.coordinates;
          if (lat === 0 && lng === 0) return; // never-set default coords

          // Don't clobber a marker already updated live via socket
          if (familyMarkers[loc._id]) return;

          familyMarkers[loc._id] = {
            userName: loc.name,
            lat,
            lng,
            isOnline: loc.isOnline,
            locationUpdatedAt: loc.locationUpdatedAt,
          };
        });

        return { ...prev, [familyId]: familyMarkers };
      });
    } catch (err) {
      console.error("Failed to load family locations:", err);
      fetchedFamiliesRef.current.delete(familyId); // allow a retry if it failed
    }
  };

  const updateMyLocation = (coords) => {
    if (!activeFamily || !user) return;

    setLocationsByFamily((prev) => ({
      ...prev,
      [activeFamily.familyId]: {
        ...(prev[activeFamily.familyId] || {}),
        [user._id]: {
          ...(prev[activeFamily.familyId]?.[user._id] || {}),
          userName: user.name,
          lat: coords.lat,
          lng: coords.lng,
          isOnline: true,
          locationUpdatedAt: new Date().toISOString(),
        },
      },
    }));
  };

  const sendLiveLocation = (coords) => {
    if (!socketRef.current || !activeFamily) return;
    socketRef.current.emit("send_live_location", {
      familyId: activeFamily.familyId,
      coords,
    });
  };

  const markers = activeFamily
    ? locationsByFamily[activeFamily.familyId] || {}
    : {};

  return (
    <LocationContext.Provider
      value={{
        markers,
        ensureLocationsLoaded,
        sendLiveLocation,
        updateMyLocation,
      }}
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
