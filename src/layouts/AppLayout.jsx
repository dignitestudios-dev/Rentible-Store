import React, { useContext, useEffect } from "react";
import { RxCaretDown } from "react-icons/rx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { AppContext } from "../context/AppContext";
import axios from "../axios";
import { ErrorToast } from "../components/global/Toaster";
import Cookies from "js-cookie";
import { auth } from "../firebase/firebase";
const AppLayout = ({ page }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchToken, setNotifications } = useContext(AppContext);

  const getNotifications = () => {
    const token = Cookies.get("token");
    if (token) {
      axios
        .get(`/notification`)
        .then((response) => {
          setNotifications(response?.data?.data);
        })
        .catch((error) => {
          ErrorToast(error?.response?.data?.message);
        });
    }
  };
  useEffect(() => {
    location?.pathname == "/dashboard" &&
      localStorage.setItem("activeLink", "Dashboard");
    const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
    if (!user) {
      Cookies.remove("token");
      ErrorToast("Unautorized | Please re-login.");
      navigate("/login");
    }

    getNotifications();
    fetchToken();
  }, []);
  return (
    <div className="w-screen h-screen flex flex-col justify-start items-start">
      <Navbar />
      <div className="w-full  lg:top- h-[calc(100%-56px)] lg:h-[calc(100%-70px)] flex justify-start items-start ">
        <Sidebar />
        <div className="w-full lg:w-[calc(100%-242.8px)] h-[calc(100%)] overflow-y-auto overflow-x-hidden bg-gray-100">
          {page}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
