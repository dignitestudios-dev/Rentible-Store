import React, { useEffect, useState } from "react";
import {
  HiOutlineArrowTrendingDown,
  HiOutlineArrowTrendingUp,
} from "react-icons/hi2";
import {
  OrderAnalytics,
  SalesAnalytics,
  UserAnalytics,
} from "../../../assets/export";
import { TbProgress } from "react-icons/tb";
import { IoCalendarOutline } from "react-icons/io5";
import axios from "../../../axios";
import { ErrorToast } from "../../global/Toaster";
const Analytics = () => {
  const [openCalendar, setOpenCalendar] = useState(false);

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAnalytics = async (query = "") => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/booking/dashboard`);
      setAnalytics(data?.data);
      false;
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAnalytics();
  }, []);

  return (
    <div className="w-full h-auto flex flex-col gap-3 justify-start items-start">
      <div className="w-full relative flex justify-between items-center">
        <span className="text-[28px] md:text-[28px] lg:text-[32px] font-bold leading-[48px] text-[#202224]">
          Dashboard
        </span>
        {/* <button
          onClick={() => setOpenCalendar((prev) => !prev)}
          className="w-[49px] h-[49px] rounded-[8px] bg-[#F85E00] flex items-center justify-center"
        >
          <img src="/filter_icon.png" alt="" className="w-[27px] h-[27px]" />
        </button> */}

        <div
          className={`w-[330px] h-[316px] absolute top-14 right-0 transition-all duration-300 z-50 bg-white rounded-[14px] shadow-md py-3 px-6 ${
            openCalendar ? "translate-x-0" : "translate-x-[600px]"
          } flex flex-col justify-start items-start`}
        >
          <span className="w-full h-9 text-[18px] font-semibold text-black flex items-center justify-start  border-b border-gray-300">
            Filter
          </span>
          <div className="w-full mt-4 flex flex-col justify-start items-start gap-3 ">
            <div className="w-full flex flex-col gap-1  justify-start items-start ">
              <label
                htmlFor=""
                className="text-[14px] ml-1 font-normal text-black"
              >
                Start Date
              </label>
              <div className="w-full h-[49px] relative rounded-[14px] bg-gray-50 flex items-center justify-start px-3">
                <span className="text-md font-normal text-black">
                  10/12/2024
                </span>
                <span className="absolute cursor-pointer top-1/2 text-xl right-3 transform -translate-y-1/2 text-orange-500">
                  <IoCalendarOutline />
                </span>
              </div>
            </div>
            <div className="w-full flex flex-col gap-1  justify-start items-start ">
              <label
                htmlFor=""
                className="text-[14px] ml-1 font-normal text-black"
              >
                End Date
              </label>
              <div className="w-full h-[49px] relative rounded-[14px] bg-gray-50 flex items-center justify-start px-3">
                <span className="text-md font-normal text-black">
                  12/12/2024
                </span>
                <span className="absolute cursor-pointer top-1/2 text-xl right-3 transform -translate-y-1/2 text-orange-500">
                  <IoCalendarOutline />
                </span>
              </div>
            </div>
            <div className="w-full h-auto grid grid-cols-2 mt-2 gap-2 justify-start items-center">
              <button
                onClick={() => setOpenCalendar(false)}
                className="w-full h-[49px] rounded-[8px] bg-gray-50 text-[#6A6A6A] text-md font-normal flex items-center justify-center"
              >
                Clear
              </button>
              <button className="w-full h-[49px] rounded-[8px] bg-[#F85E00] text-[#fff] text-md font-normal flex items-center justify-center">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-start items-start gap-4">
        <div className="w-full h-[161px] rounded-[14px] bg-white shadow-md grid grid-cols-5 p-4">
          <div className="w-full col-span-4 flex flex-col justify-between items-start ">
            <span className="text-[16px] font-normal leading-[24px] text-[#202224]">
              Total Customers
            </span>
            <h1 className="font-bold text-[27px] leading-[42px] text-black">
              {analytics?.totalCustomers || 0}
            </h1>

            <div className="w-auto flex justify-start items-center gap-1">
              {analytics?.changes?.totalCustomers?.change == "positive" ? (
                <span className="w-auto flex justify-start items-center gap-[5px]  ">
                  <HiOutlineArrowTrendingUp className="text-black text-xl" />
                  <span className="text-black text-xs">
                    {analytics?.changes?.totalCustomers?.percent}%
                  </span>
                  <span className="text-xs text-[#606060]">
                    Up from yesterday
                  </span>
                </span>
              ) : analytics?.changes?.totalCustomers?.change == "negative" ? (
                <span className="w-auto flex justify-start items-center gap-[5px]  ">
                  <HiOutlineArrowTrendingDown className="text-red-500 text-xl" />
                  <span className="text-red-500 text-xs">
                    {analytics?.changes?.totalCustomers?.percent}%
                  </span>
                  <span className="text-xs text-[#606060]">
                    Down from yesterday
                  </span>
                </span>
              ) : (
                <span className="w-auto flex justify-start items-center gap-[5px]  ">
                  <TbProgress className="text-yellow-500 text-xl" />
                  <span className="text-xs text-[#606060]">
                    0% change from yesterday
                  </span>
                </span>
              )}
            </div>
          </div>
          <div className="w-full col-span-1 flex justify-end items-start">
            <img
              src={UserAnalytics}
              alt="user_analytics"
              className="w-[60px] h-[60px] "
            />
          </div>
        </div>
        <div className="w-full h-[161px] rounded-[14px] bg-white shadow-md grid grid-cols-5 p-4">
          <div className="w-full col-span-4 flex flex-col justify-between items-start ">
            <span className="text-[16px] font-normal leading-[24px] text-[#202224]">
              Total Order
            </span>
            <h1 className="font-bold text-[27px] leading-[42px] text-black">
              {analytics?.totalOrders || 0}
            </h1>

            <div className="w-auto flex justify-start items-center gap-1">
              {analytics?.changes?.totalOrders?.change == "positive" ? (
                <span className="w-auto flex justify-start items-center gap-[5px]  ">
                  <HiOutlineArrowTrendingUp className="text-black text-xl" />
                  <span className="text-black text-xs">
                    {analytics?.changes?.totalOrders?.percent}%
                  </span>
                  <span className="text-xs text-[#606060]">
                    Up from yesterday
                  </span>
                </span>
              ) : analytics?.changes?.totalOrders?.change == "negative" ? (
                <span className="w-auto flex justify-start items-center gap-[5px]  ">
                  <HiOutlineArrowTrendingDown className="text-red-500 text-xl" />
                  <span className="text-red-500 text-xs">
                    {analytics?.changes?.totalOrders?.percent}%
                  </span>
                  <span className="text-xs text-[#606060]">
                    Down from yesterday
                  </span>
                </span>
              ) : (
                <span className="w-auto flex justify-start items-center gap-[5px]  ">
                  <TbProgress className="text-yellow-500 text-xl" />
                  <span className="text-xs text-[#606060]">
                    0% change from yesterday
                  </span>
                </span>
              )}
            </div>
          </div>
          <div className="w-full col-span-1 flex justify-end items-start">
            <img
              src={OrderAnalytics}
              alt="user_analytics"
              className="w-[60px] h-[60px] "
            />
          </div>
        </div>
        <div className="w-full h-[161px] rounded-[14px] bg-white shadow-md grid grid-cols-5 p-4">
          <div className="w-full col-span-4 flex flex-col justify-between items-start ">
            <span className="text-[16px] font-normal leading-[24px] text-[#202224]">
              Total Sales Revenue
            </span>
            <h1 className="font-bold text-[27px] leading-[42px] text-black">
              ${analytics?.totalRevenue || 0}
            </h1>

            <div className="w-auto flex justify-start items-center gap-1">
              {analytics?.changes?.totalRevenue?.change == "positive" ? (
                <span className="w-auto flex justify-start items-center gap-[5px]  ">
                  <HiOutlineArrowTrendingUp className="text-black text-xl" />
                  <span className="text-black text-xs">
                    {analytics?.changes?.totalRevenue?.percent}%
                  </span>
                  <span className="text-xs text-[#606060]">
                    Up from yesterday
                  </span>
                </span>
              ) : analytics?.changes?.totalRevenue?.change == "negative" ? (
                <span className="w-auto flex justify-start items-center gap-[5px]  ">
                  <HiOutlineArrowTrendingDown className="text-red-500 text-xl" />
                  <span className="text-red-500 text-xs">
                    {analytics?.changes?.totalRevenue?.percent}%
                  </span>
                  <span className="text-xs text-[#606060]">
                    Down from yesterday
                  </span>
                </span>
              ) : (
                <span className="w-auto flex justify-start items-center gap-[5px]  ">
                  <TbProgress className="text-yellow-500 text-xl" />
                  <span className="text-xs text-[#606060]">
                    0% change from yesterday
                  </span>
                </span>
              )}
            </div>
          </div>
          <div className="w-full col-span-1 flex justify-end items-start">
            <img
              src={SalesAnalytics}
              alt="user_analytics"
              className="w-[60px] h-[60px] "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
