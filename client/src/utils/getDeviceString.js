import { UAParser } from "ua-parser-js";

export const getDeviceString = () => {
  const parser = new UAParser();
  const result = parser.getResult();
  const osName = result.os.name || "Unknown OS";
  const deviceVendor = result.device.vendor || "";
  const deviceModel = result.device.model || "";
  const deviceType = result.device.type || "Desktop";

  // console.log(result);

  if (deviceVendor || deviceModel) {
    return `${deviceVendor} ${deviceModel}`.trim();
  }
  return `${osName} (${deviceType})`;
};
