import L from "leaflet";
export const createCustomMarkerIcon = (member, isCurrentUser) => {
  const initial = member.userName ? member.userName[0].toUpperCase() : "U";
  const isOnline = member.isOnline ?? true;

  const borderColor = isCurrentUser
    ? "#3b82f6"
    : isOnline
      ? "#10b981"
      : "#6b7280";

  const avatarBg = isCurrentUser ? "#1d4ed8" : "#27272a";

  const html = `
    <div class="relative group flex flex-col items-center justify-center">
      ${
        isOnline
          ? `<div class="absolute -inset-1 rounded-full animate-ping opacity-25" style="background-color: ${borderColor};"></div>`
          : ""
      }
      
      <div 
        class="relative flex items-center justify-center w-10 h-10 rounded-full border-2 shadow-2xl transition-all duration-300 transform hover:scale-110"
        style="background-color: ${avatarBg}; border-color: ${borderColor}; box-shadow: 0 0 15px ${borderColor}40;"
      >
        <span class="text-white font-bold text-sm tracking-wider select-none">
          ${initial}
        </span>

        <span 
          class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#27272a]"
          style="background-color: ${borderColor};"
        ></span>
      </div>

      <div 
        class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] -mt-0.5"
        style="border-t-color: ${borderColor};"
      ></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "custom-leaflet-marker",
    iconSize: [40, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0, -48],
  });
};
