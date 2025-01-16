import React, { useEffect, useRef, useState } from "react";
import { Application, DatePicker } from "react-rainbow-components";

const DateFilterModal = ({
  isOpen,
  setIsOpen,
  date,
  setDate,
  prevDate = null,
}) => {
  console.log(prevDate);
  const initialState = {
    date: null,
    locale: { name: "en-US", label: "English (US)" },
  };

  useEffect(() => {
    setDate(initialState?.date);
  }, []);

  const theme = {
    rainbow: {
      palette: {
        brand: "#f85e00",
      },
    },
  };

  const modalRef = useRef();

  const toggleModal = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };
  function convertDateToISOString(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new TypeError("Expected a valid Date object");
    }
    return date.toISOString();
  }

  return (
    <div
      id="date-filter"
      onClick={toggleModal}
      className={`fixed top-0 left-0 z-[1000] ${
        isOpen ? "flex" : "hidden"
      } w-[100vw] h-screen justify-center items-center px-2 md:px-0 bg-[#000]/[0.46]`}
    >
      <div
        ref={modalRef}
        className=" w-[431px] h-[166px] bg-white rounded-3xl flex flex-col items-start justify-center "
      >
        <div className="w-full text-white text-xl font-medium h-[30%] flex justify-center px-4 items-center rounded-t-3xl bg-[#f85e00]">
          Select/Enter Date
        </div>
        <Application
          theme={theme}
          className="w-full h-[50%] px-6 flex gap-4 items-center justify-start"
        >
          <div
            className="w-[100%] h-full flex items-center"
            style={{ width: "100%", height: "50%" }}
          >
            <DatePicker
              value={date}
              minDate={prevDate ? new Date(prevDate) : new Date(2024, 0, 1)}
              onChange={(value) =>
                setDate(convertDateToISOString(new Date(value)))
              }
              borderRadius="rounded"
              className="w-full h-full"
            />
          </div>
        </Application>
        <div className="w-full h-[20%] flex items-center justify-end gap-4 mb-2 px-4">
          <button
            onClick={() => setIsOpen(false)}
            className="bg-[#000]/[0.8] w-14 rounded-full h-8 flex items-center justify-center text-[#fff] text-md font-semibold"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateFilterModal;
