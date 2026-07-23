import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

function FitBounds({ markers }) {
  const map = useMap();

  useEffect(() => {
    const locations = Object.values(markers);

    if (locations.length === 0) return;

    const bounds = L.latLngBounds(locations.map((m) => [m.lat, m.lng]));

    map.fitBounds(bounds, {
      padding: [70, 70],
    });
  }, [markers]);

  return null;
}

export default FitBounds;
