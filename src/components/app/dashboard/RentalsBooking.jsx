import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { BsCheckLg } from "react-icons/bs";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
const RentalsBooking = () => {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="w-full h-auto flex flex-col gap-3 justify-start items-start">
      <div className="w-full flex justify-between items-center">
        <span className="text-[32px] font-bold leading-[48px] text-[#202224]">
          Rental Bookings
        </span>
        <div className="w-auto flex justify-start items-center gap-3">
          <div className="relative w-[256px] bg-white h-[49px] flex items-start justify-start rounded-[8px] border border-gray-300">
            <span className="w-[40px] h-full flex items-center justify-center ">
              <FiSearch className="  text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search"
              className="    text-sm text-gray-700 focus:outline-none w-[calc(100%-40px)] h-full rounded-r-[8px]" // Increased size
            />
          </div>
          <div className="flex  px-[2px] py-[2px] border border-gray-300 bg-white h-[49px] rounded-[8px]">
            {["All", "Upcoming", "In Progress", "Completed"].map(
              (tab, index, array) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`min-w-[90px] px-4 py-2 text-sm font-normal leading-[17.58px] ${
                    activeTab === tab
                      ? "bg-[#F85E00] text-white"
                      : "bg-white text-black"
                  } ${index === 0 ? "rounded-l-[7px]" : ""} ${
                    index === array.length - 1 ? "rounded-r-[7px]" : ""
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col justify-start items-start">
        <div className="w-full border-t border-x h-[49px] bg-[#FCFDFD] border-gray-300 rounded-t-[14px] grid grid-cols-12 ">
          <span className="w-full h-full col-span-1 flex items-center justify-start gap-2 px-4">
            <button className="w-[14px] h-[14px] group border border-gray-300 hover:border-none cursor-pointer focus-within:border-none rounded-sm flex items-center justify-center">
              <span className="w-full h-full rounded-sm bg-orange-500 text-white group-hover:flex group-focus-within:flex hidden items-center justify-center text-xs">
                <BsCheckLg />
              </span>
            </button>
            <span className="text-[13px] font-medium">#</span>
          </span>

          <span className="w-full col-span-2 flex items-center justify-start h-full ">
            <span className="text-[13px] font-medium">Product Name</span>
          </span>
          <span className="w-full col-span-2 flex items-center justify-start h-full ">
            <span className="text-[13px] font-medium">Description</span>
          </span>
          <span className="w-full col-span-1 flex items-center justify-start h-full ">
            <span className="text-[13px] font-medium">Qty</span>
          </span>
          <span className="w-full col-span-2 flex items-center justify-start h-full ">
            <span className="text-[13px] font-medium">Booking Type</span>
          </span>
          <span className="w-full col-span-2 flex items-center justify-start h-full ">
            <span className="text-[13px] font-medium">Booking Date</span>
          </span>
          <span className="w-full col-span-1 flex items-center justify-start h-full ">
            <span className="text-[13px] font-medium">Status</span>
          </span>
          <span className="w-full col-span-1 flex items-center justify-end h-full  px-4">
            <span className="text-[13px] font-medium">Action</span>
          </span>
        </div>
        <div className="w-full h-auto border divide-y divide-gray-300 border-gray-300 bg-white rounded-b-[14px] flex  flex-col justify-start items-start">
          <div className="w-full grid grid-cols-12 h-[77px] text-[#202224] ">
            <span className="w-full h-full col-span-1 flex items-center justify-start gap-2 px-4">
              <button className="w-[14px] h-[14px] group border border-gray-300 hover:border-none cursor-pointer focus-within:border-none rounded-sm flex items-center justify-center">
                <span className="w-full h-full rounded-sm bg-orange-500 text-white group-hover:flex group-focus-within:flex hidden items-center justify-center text-xs">
                  <BsCheckLg />
                </span>
              </button>
              <span className="text-[13px] font-normal">1</span>
            </span>

            <span className="w-full col-span-2 flex items-center gap-2 justify-start h-full ">
              <span className="w-[44px] h-[44px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                <img
                  src="https://marketplace.canva.com/EAFaFUz4aKo/2/0/1600w/canva-yellow-abstract-cooking-fire-free-logo-JmYWTjUsE-Q.jpg"
                  alt="store_image"
                  className="w-[38px] h-[38px] rounded-full"
                />
              </span>
              <span className="text-[13px] font-normal">Product Name</span>
            </span>
            <span className="w-full col-span-2 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">
                Lorem ipsum dolor sit amet...
              </span>
            </span>
            <span className="w-full col-span-1 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">14</span>
            </span>
            <span className="w-full col-span-2 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">4hrs</span>
            </span>
            <span className="w-full col-span-2 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">10/May/2024</span>
            </span>
            <span className="w-full col-span-1 flex items-center justify-start h-full ">
              <span className="text-[13px] text-[#7D72F1] font-normal">
                Upcoming
              </span>
            </span>
            <span className="w-full col-span-1 flex items-center justify-end h-full  px-6">
              <span className="text-[20px] font-normal">
                <RxCaretRight />
              </span>
            </span>
          </div>
          <div className="w-full grid grid-cols-12 h-[77px] text-[#202224] ">
            <span className="w-full h-full col-span-1 flex items-center justify-start gap-2 px-4">
              <button className="w-[14px] h-[14px] group border border-gray-300 hover:border-none cursor-pointer focus-within:border-none rounded-sm flex items-center justify-center">
                <span className="w-full h-full rounded-sm bg-orange-500 text-white group-hover:flex group-focus-within:flex hidden items-center justify-center text-xs">
                  <BsCheckLg />
                </span>
              </button>
              <span className="text-[13px] font-normal">1</span>
            </span>

            <span className="w-full col-span-2 flex items-center gap-2 justify-start h-full ">
              <span className="w-[44px] h-[44px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                <img
                  src="https://marketplace.canva.com/EAFaFUz4aKo/2/0/1600w/canva-yellow-abstract-cooking-fire-free-logo-JmYWTjUsE-Q.jpg"
                  alt="store_image"
                  className="w-[38px] h-[38px] rounded-full"
                />
              </span>
              <span className="text-[13px] font-normal">Product Name</span>
            </span>
            <span className="w-full col-span-2 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">
                Lorem ipsum dolor sit amet...
              </span>
            </span>
            <span className="w-full col-span-1 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">14</span>
            </span>
            <span className="w-full col-span-2 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">4hrs</span>
            </span>
            <span className="w-full col-span-2 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">10/May/2024</span>
            </span>
            <span className="w-full col-span-1 flex items-center justify-start h-full ">
              <span className="text-[13px] text-[#7D72F1] font-normal">
                Upcoming
              </span>
            </span>
            <span className="w-full col-span-1 flex items-center justify-end h-full  px-6">
              <span className="text-[20px] font-normal">
                <RxCaretRight />
              </span>
            </span>
          </div>
          <div className="w-full grid grid-cols-12 h-[77px] text-[#202224] ">
            <span className="w-full h-full col-span-1 flex items-center justify-start gap-2 px-4">
              <button className="w-[14px] h-[14px] group border border-gray-300 hover:border-none cursor-pointer focus-within:border-none rounded-sm flex items-center justify-center">
                <span className="w-full h-full rounded-sm bg-orange-500 text-white group-hover:flex group-focus-within:flex hidden items-center justify-center text-xs">
                  <BsCheckLg />
                </span>
              </button>
              <span className="text-[13px] font-normal">1</span>
            </span>

            <span className="w-full col-span-2 flex items-center gap-2 justify-start h-full ">
              <span className="w-[44px] h-[44px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                <img
                  src="https://marketplace.canva.com/EAFaFUz4aKo/2/0/1600w/canva-yellow-abstract-cooking-fire-free-logo-JmYWTjUsE-Q.jpg"
                  alt="store_image"
                  className="w-[38px] h-[38px] rounded-full"
                />
              </span>
              <span className="text-[13px] font-normal">Product Name</span>
            </span>
            <span className="w-full col-span-2 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">
                Lorem ipsum dolor sit amet...
              </span>
            </span>
            <span className="w-full col-span-1 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">14</span>
            </span>
            <span className="w-full col-span-2 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">4hrs</span>
            </span>
            <span className="w-full col-span-2 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">10/May/2024</span>
            </span>
            <span className="w-full col-span-1 flex items-center justify-start h-full ">
              <span className="text-[13px] text-[#7D72F1] font-normal">
                Upcoming
              </span>
            </span>
            <span className="w-full col-span-1 flex items-center justify-end h-full  px-6">
              <span className="text-[20px] font-normal">
                <RxCaretRight />
              </span>
            </span>
          </div>
          <div className="w-full grid grid-cols-12 h-[77px] text-[#202224] ">
            <span className="w-full h-full col-span-1 flex items-center justify-start gap-2 px-4">
              <button className="w-[14px] h-[14px] group border border-gray-300 hover:border-none cursor-pointer focus-within:border-none rounded-sm flex items-center justify-center">
                <span className="w-full h-full rounded-sm bg-orange-500 text-white group-hover:flex group-focus-within:flex hidden items-center justify-center text-xs">
                  <BsCheckLg />
                </span>
              </button>
              <span className="text-[13px] font-normal">1</span>
            </span>

            <span className="w-full col-span-2 flex items-center gap-2 justify-start h-full ">
              <span className="w-[44px] h-[44px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                <img
                  src="https://marketplace.canva.com/EAFaFUz4aKo/2/0/1600w/canva-yellow-abstract-cooking-fire-free-logo-JmYWTjUsE-Q.jpg"
                  alt="store_image"
                  className="w-[38px] h-[38px] rounded-full"
                />
              </span>
              <span className="text-[13px] font-normal">Product Name</span>
            </span>
            <span className="w-full col-span-2 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">
                Lorem ipsum dolor sit amet...
              </span>
            </span>
            <span className="w-full col-span-1 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">14</span>
            </span>
            <span className="w-full col-span-2 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">4hrs</span>
            </span>
            <span className="w-full col-span-2 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">10/May/2024</span>
            </span>
            <span className="w-full col-span-1 flex items-center justify-start h-full ">
              <span className="text-[13px] text-[#7D72F1] font-normal">
                Upcoming
              </span>
            </span>
            <span className="w-full col-span-1 flex items-center justify-end h-full  px-6">
              <span className="text-[20px] font-normal">
                <RxCaretRight />
              </span>
            </span>
          </div>
          <div className="w-full grid grid-cols-12 h-[77px] text-[#202224] ">
            <span className="w-full h-full col-span-1 flex items-center justify-start gap-2 px-4">
              <button className="w-[14px] h-[14px] group border border-gray-300 hover:border-none cursor-pointer focus-within:border-none rounded-sm flex items-center justify-center">
                <span className="w-full h-full rounded-sm bg-orange-500 text-white group-hover:flex group-focus-within:flex hidden items-center justify-center text-xs">
                  <BsCheckLg />
                </span>
              </button>
              <span className="text-[13px] font-normal">1</span>
            </span>

            <span className="w-full col-span-2 flex items-center gap-2 justify-start h-full ">
              <span className="w-[44px] h-[44px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                <img
                  src="https://marketplace.canva.com/EAFaFUz4aKo/2/0/1600w/canva-yellow-abstract-cooking-fire-free-logo-JmYWTjUsE-Q.jpg"
                  alt="store_image"
                  className="w-[38px] h-[38px] rounded-full"
                />
              </span>
              <span className="text-[13px] font-normal">Product Name</span>
            </span>
            <span className="w-full col-span-2 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">
                Lorem ipsum dolor sit amet...
              </span>
            </span>
            <span className="w-full col-span-1 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">14</span>
            </span>
            <span className="w-full col-span-2 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">4hrs</span>
            </span>
            <span className="w-full col-span-2 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">10/May/2024</span>
            </span>
            <span className="w-full col-span-1 flex items-center justify-start h-full ">
              <span className="text-[13px] text-[#7D72F1] font-normal">
                Upcoming
              </span>
            </span>
            <span className="w-full col-span-1 flex items-center justify-end h-full  px-6">
              <span className="text-[20px] font-normal">
                <RxCaretRight />
              </span>
            </span>
          </div>
          <div className="w-full grid grid-cols-12 h-[77px] text-[#202224] ">
            <span className="w-full h-full col-span-1 flex items-center justify-start gap-2 px-4">
              <button className="w-[14px] h-[14px] group border border-gray-300 hover:border-none cursor-pointer focus-within:border-none rounded-sm flex items-center justify-center">
                <span className="w-full h-full rounded-sm bg-orange-500 text-white group-hover:flex group-focus-within:flex hidden items-center justify-center text-xs">
                  <BsCheckLg />
                </span>
              </button>
              <span className="text-[13px] font-normal">1</span>
            </span>

            <span className="w-full col-span-2 flex items-center gap-2 justify-start h-full ">
              <span className="w-[44px] h-[44px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                <img
                  src="https://marketplace.canva.com/EAFaFUz4aKo/2/0/1600w/canva-yellow-abstract-cooking-fire-free-logo-JmYWTjUsE-Q.jpg"
                  alt="store_image"
                  className="w-[38px] h-[38px] rounded-full"
                />
              </span>
              <span className="text-[13px] font-normal">Product Name</span>
            </span>
            <span className="w-full col-span-2 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">
                Lorem ipsum dolor sit amet...
              </span>
            </span>
            <span className="w-full col-span-1 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">14</span>
            </span>
            <span className="w-full col-span-2 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">4hrs</span>
            </span>
            <span className="w-full col-span-2 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">10/May/2024</span>
            </span>
            <span className="w-full col-span-1 flex items-center justify-start h-full ">
              <span className="text-[13px] text-[#7D72F1] font-normal">
                Upcoming
              </span>
            </span>
            <span className="w-full col-span-1 flex items-center justify-end h-full  px-6">
              <span className="text-[20px] font-normal">
                <RxCaretRight />
              </span>
            </span>
          </div>
          <div className="w-full grid grid-cols-12 h-[77px] text-[#202224] ">
            <span className="w-full h-full col-span-1 flex items-center justify-start gap-2 px-4">
              <button className="w-[14px] h-[14px] group border border-gray-300 hover:border-none cursor-pointer focus-within:border-none rounded-sm flex items-center justify-center">
                <span className="w-full h-full rounded-sm bg-orange-500 text-white group-hover:flex group-focus-within:flex hidden items-center justify-center text-xs">
                  <BsCheckLg />
                </span>
              </button>
              <span className="text-[13px] font-normal">1</span>
            </span>

            <span className="w-full col-span-2 flex items-center gap-2 justify-start h-full ">
              <span className="w-[44px] h-[44px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                <img
                  src="https://marketplace.canva.com/EAFaFUz4aKo/2/0/1600w/canva-yellow-abstract-cooking-fire-free-logo-JmYWTjUsE-Q.jpg"
                  alt="store_image"
                  className="w-[38px] h-[38px] rounded-full"
                />
              </span>
              <span className="text-[13px] font-normal">Product Name</span>
            </span>
            <span className="w-full col-span-2 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">
                Lorem ipsum dolor sit amet...
              </span>
            </span>
            <span className="w-full col-span-1 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">14</span>
            </span>
            <span className="w-full col-span-2 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">4hrs</span>
            </span>
            <span className="w-full col-span-2 flex items-center justify-start h-full ">
              <span className="text-[13px] font-normal">10/May/2024</span>
            </span>
            <span className="w-full col-span-1 flex items-center justify-start h-full ">
              <span className="text-[13px] text-[#7D72F1] font-normal">
                Upcoming
              </span>
            </span>
            <span className="w-full col-span-1 flex items-center justify-end h-full  px-6">
              <span className="text-[20px] font-normal">
                <RxCaretRight />
              </span>
            </span>
          </div>
        </div>

        <div className="w-full my-6 px-2 flex justify-between items-center">
          <span className="text-[16px] font-normal text-black">
            You have 10 of 24 Pages
          </span>

          <div className="w-auto flex items-center justify-start px-3 h-[61px] gap-2 rounded-full bg-white">
            <button className="w-[43px] h-[43px] rounded-full bg-gray-200 flex items-center justify-center text-3xl text-[#909090]">
              <RxCaretLeft />
            </button>

            <div className="w-auto flex justify-center items-center h-[43px] rounded-full px-2  bg-gray-200">
              <button className="w-[33px] h-[33px] bg-transparent text-[#909090] hover:bg-[#F85E00] hover:text-[#fff] flex items-center rounded-full justify-center">
                1
              </button>
              <button className="w-[33px] h-[33px] bg-[#F85E00] text-[#fff] shadow-md shadow-[#F85E00] flex items-center rounded-full justify-center">
                2
              </button>
              <button className="w-[33px] h-[33px] bg-transparent text-[#909090] hover:bg-[#F85E00] hover:text-[#fff] flex items-center rounded-full justify-center">
                3
              </button>
            </div>
            <button className="w-[43px] h-[43px] rounded-full bg-gray-200 flex items-center justify-center text-3xl text-[#000]">
              <RxCaretRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalsBooking;
