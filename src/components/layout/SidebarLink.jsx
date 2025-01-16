import React from "react";
import { Link, useNavigate } from "react-router-dom";

const SidebarLink = ({ title, light_icon, dark_icon, url }) => {
  const active = localStorage.getItem("activeLink") == title;
  const navigate = useNavigate();
  return (
    <div className="w-full bg-white h-[50px] flex justify-start items-start">
      <span
        className={`w-[4px] rounded-r-md ${active && "bg-[#F85E00] "} h-full`}
      ></span>
      <button
        onClick={() => {
          navigate(url);
          localStorage.setItem("activeLink", title);
        }}
        className="w-[calc(100%-4px)] pr-2 flex items-center justify-end h-full"
      >
        <span
          className={`w-[211px] ${
            active ? "bg-[#F85E00]  text-white" : "text-black"
          } flex items-center justify-start gap-3 px-3 h-full rounded-md`}
        >
          <img
            src={active ? light_icon : dark_icon}
            alt="sidebarlink-icon"
            className="w-[24px] h-[24px]  object-center"
          />
          <span className={`text-[14px] font-medium leading-[21px]`}>
            {title}
          </span>
        </span>
      </button>
    </div>
  );
};

export default SidebarLink;
