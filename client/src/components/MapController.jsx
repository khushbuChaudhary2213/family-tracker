// MapController.jsx
import { useEffect, useCallback } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

function MapController({ markers, coords, setFitMap, setGoToMe }) {
  const map = useMap();

  const fitAll = useCallback(() => {
    const locations = Object.values(markers || {}).filter(
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
  }, [map, markers]);

  const goMe = useCallback(() => {
    if (!coords || coords.length !== 2) return;

    map.flyTo(coords, 16, {
      duration: 1.2,
    });
  }, [map, coords]);

  // Keep parent control references updated with latest state
  useEffect(() => {
    setFitMap(() => fitAll);
  }, [fitAll, setFitMap]);

  useEffect(() => {
    setGoToMe(() => goMe);
  }, [goMe, setGoToMe]);

  return null;
}

export default MapController;
