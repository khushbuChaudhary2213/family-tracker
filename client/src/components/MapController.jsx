// MapController.jsx
import { useEffect, useCallback, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

function MapController({ markers, coords, setFitMap, setGoToMe }) {
  const map = useMap();
  const markersRef = useRef(markers);
  const coordsRef = useRef(coords);

  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);
  useEffect(() => {
    coordsRef.current = coords;
  }, [coords]);

  const fitAll = useCallback(() => {
    const locations = Object.values(markersRef.current || {}).filter(
      (m) => m && typeof m.lat === "number" && typeof m.lng === "number",
    );
    if (!locations.length) return;

    if (locations.length === 1) {
      map.flyTo([locations[0].lat, locations[0].lng], 16, { duration: 1.2 });
      return;
    }

    const bounds = L.latLngBounds(locations.map((m) => [m.lat, m.lng]));
    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 16,
        animate: true,
        duration: 1.2,
      });
    }
  }, [map]); // 👈 only depends on map now

  const goMe = useCallback(() => {
    const c = coordsRef.current;
    if (!c || c.length !== 2) return;
    map.flyTo(c, 16, { duration: 1.2 });
  }, [map]); // 👈 only depends on map now

  useEffect(() => {
    setFitMap(() => fitAll);
  }, [fitAll, setFitMap]);
  useEffect(() => {
    setGoToMe(() => goMe);
  }, [goMe, setGoToMe]);

  return null;
}

export default MapController;
