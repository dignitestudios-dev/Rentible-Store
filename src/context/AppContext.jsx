import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { onMessageListener } from "../firebase/messages";
import getFCMToken from "../firebase/getFcmToken";
import Cookies from "js-cookie";
import axios from "../axios";
import {
  ErrorToast,
  NotificationToast,
  WarningToast,
} from "../components/global/Toaster";
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  // notifications:
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [rejectReason, setRejectReason] = useState(Cookies.get("rejectReason"));
  const [notification, setNotification] = useState({ title: "", body: "" });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [isTokenFound, setTokenFound] = useState(false);

  // Send fcm to backend:
  const fetchToken = async () => {
    const token = await getFCMToken(setTokenFound);
    const authToken = Cookies.get("token");
    if (!authToken) {
      ErrorToast("Un authorized | Please relogin.");
      navigate("/login");
    } else if (authToken && token) {
      const response = await axios.post(`/auth/updateFCM`, {
        fcmToken: token,
      });
    }

    // You can send this token to your server or use it as needed
  };

  onMessageListener()
  .then((payload) => {
    let data = {};

    try {
      if (payload?.data?.data) {
        data = JSON.parse(payload.data.data);
      } else {
        console.warn("No JSON data found in payload:", payload);
        return;
      }
    } catch (err) {
      console.error("Invalid JSON in FCM payload:", err, payload?.data?.data);
      return; // Stop execution — invalid payload
    }

    let route = null;

    if (data?.type === "booking") {
      route = `/rental-tracking/${data?.booking?._id}`;
    } else if (data?.type === "product") {
      route = `/products/${data?.product?._id}`;
    } else if (data?.type === "chat") {
      route = `/messages/${data?.chatUser?.chatId}`;
    } else {
      console.warn("Unknown notification type:", data?.type);
      return;
    }

    NotificationToast({
      title: payload?.notification?.title || "Notification",
      message: payload?.notification?.body || "",
      route,
    });
  })
  .catch((err) => console.error("onMessageListener failed:", err));


  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [userInput, setUserInput] = useState("");

  // Chat related states:
  const [uid, setUid] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [latLng, setLatLng] = useState(null);
  return (
    <AppContext.Provider
      value={{
        show,
        notification,
        isTokenFound,
        fetchToken,
        setShow,
        latitude,
        longitude,
        setLatitude,
        setLongitude,
        userInput,
        setUserInput,
        uid,
        setUid,
        setNotifications,
        notifications,
        sidebarOpen,
        setSidebarOpen,
        latLng,
        setLatLng,
        unreadCount,
        setUnreadCount,
        setRejectReason,
        rejectReason,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
