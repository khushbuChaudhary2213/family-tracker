import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

function MapController({ markers, coords, setFitMap, setGoToMe }) {
  const map = useMap();

  const fitAll = () => {
    const locations = Object.values(markers);

    if (!locations.length) return;

    const bounds = L.latLngBounds(locations.map((m) => [m.lat, m.lng]));

    map.fitBounds(bounds, {
      padding: [80, 80],
    });
  };

  const goMe = () => {
    if (!coords.length) return;

    map.flyTo(coords, 16, {
      duration: 1.2,
    });
  };

  useEffect(() => {
    if (Object.keys(markers).length) {
      fitAll();
    }

    setFitMap(() => fitAll);
    setGoToMe(() => goMe);
  }, []);

  return null;
}

export default MapController;
