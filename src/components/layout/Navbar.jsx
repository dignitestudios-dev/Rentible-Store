import React, { useContext, useState } from "react";
import { RxCaretDown } from "react-icons/rx";
import { AppContext } from "../../context/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoNotificationsOutline } from "react-icons/io5";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import Cookies from "js-cookie";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import axios from "../../axios";
import { ErrorToast } from "../global/Toaster";

const Navbar = () => {
  const { notifications, setSidebarOpen } = useContext(AppContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;
  const store = Cookies.get("store") ? JSON.parse(Cookies.get("store")) : null;
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const logout = async () => {
    try {
      const response = await axios.post("/auth/logout");
      if (response) {
        Cookies.remove("token");
        Cookies.remove("store");
        Cookies.remove("user");
        setOpen(false);
        signOut(auth);
        localStorage.setItem("activeLink", "Dashboard");
        navigate("/login");
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className={`h-14 lg:h-[70px] ${
        location?.pathname == "/messages" && "border-b"
      } flex justify-between w-full items-center bg-white pr-3`}
    >
      <div className="w-auto ml-3 h-full flex items-center justify-start lg:ml-[66px]">
        <button onClick={() => setSidebarOpen((prev) => !prev)}>
          <HiOutlineMenuAlt2 className="text-3xl lg:hidden" />
        </button>
        <img
          src="/orange_logo.png"
          alt=""
          className="h-10 md:block hidden  lg:h-[52.48px]"
        />
      </div>
      <div className="w-auto h-full flex justify-start items-center gap-4">
        <Link
          to="/notifications"
          className="w-[29px] h-[29px] rounded-lg flex items-center justify-center bg-[#e7e6e6] p-1 relative"
        >
          <IoNotificationsOutline className="text-[#F85E00] w-full h-full" />

          {unreadCount > 0 && (
            <span className="w-[18px] h-[18px] bg-[#F85E00] text-white text-xs rounded-full flex  items-center justify-center absolute -top-2 -right-2">
              {unreadCount}
            </span>
          )}
        </Link>
        <div className="w-auto h-full flex justify-start items-center gap-2">
          <span className="w-[44px] h-[44px] border border-[#F85E00] rounded-full flex items-center justify-center ">
            <img
              src={
                store?.profilePicture ||
                "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
              }
              alt="store_image"
              className="w-[38px] h-[38px] rounded-full"
            />
          </span>
          <h3 className="text-[12px] lg:text-[14px] font-semibold text-black leading-[19.1px]">
            {store?.name?.slice(0, 15) || "N/A"}
          </h3>

          <button
            onClick={() => {
              setOpen((prev) => !prev);
            }}
            className="w-[18px] h-[18px] rounded-full flex items-center justify-center border-[0.2px] border-[#5C5C5C]"
          >
            <RxCaretDown className="text-[#5C5C5C]" />
          </button>
          {open && (
            <div className="w-40 fixed top-[75px] rounded-lg shadow border right-2 z-50 bg-white h-auto py-2 flex flex-col justify-start items-start">
              <button
                onClick={() => {
                  localStorage.setItem("activeLink", "Profile");
                  setOpen(false);
                  navigate("/profile");
                }}
                className="w-full h-8 px-3 hover:bg-gray-50 flex items-center justify-start text-sm font-medium text-gray-700 "
              >
                My Profile
              </button>
              <button
                onClick={() => {
                  logout();
                }}
                className="w-full h-8 px-3 hover:bg-gray-50 flex items-center justify-start text-sm font-medium text-gray-700 "
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
