import React, { useContext } from "react";
import { Link } from "react-router-dom";
import SidebarLink from "./SidebarLink";
import { sidebar } from "../../constants/sidebar";
import { AppContext } from "../../context/AppContext";

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useContext(AppContext);
  return (
    <div
      className={`w-full lg:w-[242.8px] h-[calc(100%-3.5rem)] flex justify-start items-start transition-all duration-300  absolute top-14 left-0 ${
        sidebarOpen ? "translate-x-0 z-40" : " -translate-x-full z-40"
      } lg:translate-x-0 lg:static lg:z-auto `}
    >
      <div
        className={`w-[242.8px] h-full overflow-y-auto z-40 bg-white py-2  flex flex-col justify-start items-start gap-[1px]  `}
      >
        {sidebar?.map((link, key) => {
          return (
            <SidebarLink
              title={link?.title}
              light_icon={link?.light_icon}
              dark_icon={link?.dark_icon}
              url={link?.url}
            />
          );
        })}
      </div>
      <div
        onClick={() => setSidebarOpen(false)}
        className="w-[calc(100%-242.8px)] h-full bg-transparent"
      ></div>
    </div>
  );
};

export default Sidebar;
