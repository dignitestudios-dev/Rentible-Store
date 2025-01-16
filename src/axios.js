import axios from "axios";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { UAParser } from "ua-parser-js";
import { v4 as uuidv4 } from "uuid";

export const baseUrl = "https://api.rentibles.com";
// export const baseUrl = "https://155e-45-199-187-86.ngrok-free.app";

const generateDeviceId = (rawId) => {
  return CryptoJS.MD5(rawId).toString();
};

const getDeviceName = () => {
  const parser = new UAParser();
  const result = parser.getResult();

  const deviceName = result.device.model || "Unknown";
  const deviceID = result.ua || "Unknown"; // User-Agent can serve as a unique identifier

  return deviceName;
};

const getDeviceId = () => {
  const parser = new UAParser();
  const result = parser.getResult();
  const uuid = uuidv4();

  const deviceName = `${result.device.model}` || "Unknown";
  const deviceID = result.ua || "Unknown"; // User-Agent can serve as a unique identifier

  const preId = deviceName + uuid;

  return preId;
};

const instance = axios.create({
  baseURL: baseUrl,
  headers: {
    devicemodel: getDeviceName(),
    deviceuniqueid: getDeviceId(),
    "ngrok-skip-browser-warning": "69420",
  },
});

instance.interceptors.request.use((request) => {
  const token = Cookies.get("token");

  // Merge existing headers with token
  request.headers = {
    ...request.headers, // Keep existing headers like devicemodel and deviceuniqueid
    Accept: "application/json, text/plain, */*",
    ...(token && { Authorization: `Bearer ${token}` }), // Add Authorization only if token exists
  };

  return request;
});

instance.interceptors.response.use(
  (response) => {
    // No need for explicit response check; just return it
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      sessionStorage.clear();
      Cookies.remove("token");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default instance;
