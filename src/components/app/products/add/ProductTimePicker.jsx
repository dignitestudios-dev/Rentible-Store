import React, { useEffect, useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { convertToEpochTime } from "../../../../utils/helper";

const ProductTimePicker = ({
  label,
  selectedTime,
  setSelectedTime,
  values,
  errors,
  touched,
  name,
  isDropOff = false,
  pickupTime,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleTimeChange = (value) => {
    setSelectedTime(value);
  };

  const hours = [...Array(12).keys()].map((h) =>
    (h + 1).toString().padStart(2, "0")
  );

  const [times, setTimes] = useState([]);

  function generateFullDayTimeArray(pickupTime) {
    console.log(pickupTime);

    // Parse the hour from pickupTime, if available
    const pickupHour = pickupTime ? parseInt(pickupTime.split(":")[0]) : null;
    const isPM = pickupTime?.includes("PM"); // Check if it's PM
    const startHour =
      pickupHour !== null
        ? (isPM && pickupHour !== 12 ? pickupHour + 12 : pickupHour) + 4
        : 1; // Start at 01:00 AM if pickupTime is null

    const times = [];

    if (pickupHour === null) {
      // Generate times from 01:00 AM to 07:00 PM
      for (let hour = 1; hour <= 19; hour++) {
        const period = hour < 12 ? "AM" : "PM";
        const displayHour =
          hour % 12 === 0 ? "12" : String(hour % 12).padStart(2, "0");
        times.push(`${displayHour}:00 ${period}`);
        setTimes(times);
      }
    } else {
      // Generate times starting 4 hours ahead of pickupTime
      for (let hour = startHour; hour < 24; hour++) {
        const period = hour < 12 ? "AM" : "PM";
        const displayHour =
          hour % 12 === 0 ? "12" : String(hour % 12).padStart(2, "0");
        times.push(`${displayHour}:00 ${period}`);
        setTimes(times);
      }
    }

    return times;
  }
  useEffect(() => {
    if (selectedTime) {
      // Default date = today
      let baseDate = new Date();

      if (isDropOff && pickupTime) {
        // Convert pickup time to date for comparison
        const pickupDate = new Date(convertToEpochTime(pickupTime) * 1000);
        const dropOffDate = new Date(convertToEpochTime(selectedTime) * 1000);

        // ⚠️ If drop-off time is earlier than pickup time, assume next day
        if (dropOffDate <= pickupDate) {
          pickupDate.setDate(pickupDate.getDate() + 1);
          baseDate = pickupDate;
        }
      }

      // Convert selected time to epoch using adjusted base date
      values[name] = convertToEpochTime(selectedTime, baseDate);
      setIsOpen(false);
    } else {
      values[name] = "";
    }
  }, [selectedTime]);

  useEffect(() => {
    generateFullDayTimeArray(pickupTime);
  }, [pickupTime]);

  useEffect(() => {
    generateFullDayTimeArray(pickupTime);
  }, []);

  useEffect(() => {
    if (selectedTime) {
      values[name] = convertToEpochTime(`${selectedTime}`);
      setIsOpen(false);
    } else {
      values[name] = "";
    }
  }, [selectedTime]);

  const disable = () => {
    if (isDropOff) {
      if (pickupTime) {
        return false;
      } else {
        return true;
      }
    }

    return false;
  };

  return (
    <div className="w-full h-auto flex flex-col justify-start items-start gap-2">
      <label className="text-[14px] font-medium leading-[21px] ">{label}</label>
      <div className="relative w-full">
        {/* Selected Time Display */}
        <button
          type="button"
          disabled={disable()}
          onClick={toggleDropdown}
          className={` px-4 py-2 text-left   w-full h-[49px] rounded-[8px] outline-none focus:border bg-[#f8f8f8]/[0.6] disabled:bg-gray-200  ${
            errors[name] && touched[name] ? "border border-red-500" : ""
          }  focus:outline-none `}
        >
          {selectedTime ? `${selectedTime}` : "Select"}
        </button>

        {errors[name] && touched[name] ? (
          <p className="text-red-700 text-sm font-medium">{errors[name]}</p>
        ) : null}

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-2 bg-[#f8f8f8] border rounded-md shadow-md">
            <div className="flex gap-3 justify-between p-4">
              {/* Hours */}
              <div className="w-full flex flex-col gap-2">
                <span className="text-xs font-semibold">Hours</span>
                <div className="border bg-gray-100 rounded-md p-1">
                  <div className="h-32 overflow-y-auto pr-1  ">
                    {times?.map((hour) => (
                      <button
                        type="button"
                        key={hour}
                        onClick={() => handleTimeChange(hour)}
                        className={`w-full px-4 py-2 text-xs rounded-md text-left hover:bg-orange-200 ${
                          selectedTime === hour
                            ? "bg-orange-200 font-semibold"
                            : ""
                        }`}
                      >
                        {hour}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Minutes */}
              {/* <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold">Minutes</span>
                <div className="border bg-gray-100 rounded-md p-1">
                  <div className="h-32 overflow-y-auto pr-1 ">
                    {minutes.map((minute) => (
                      <button
                        type="button"
                        key={minute}
                        onClick={() => handleTimeChange("minute", minute)}
                        className={`w-full px-4 py-2 text-left text-xs rounded-md hover:bg-orange-200 ${
                          selectedTime.minute === minute
                            ? "bg-orange-200 font-semibold"
                            : ""
                        }`}
                      >
                        {minute}
                      </button>
                    ))}
                  </div>
                </div>
              </div> */}

              {/* AM/PM */}
              {/* <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold">AM/PM</span>
                <div className="flex flex-col p-1 border bg-gray-100 rounded-md">
                  {["AM", "PM"].map((period) => (
                    <button
                      type="button"
                      key={period}
                      onClick={() => handleTimeChange("period", period)}
                      className={`w-full px-4 py-2 text-xs text-left rounded-md hover:bg-orange-200 ${
                        selectedTime.period === period
                          ? "bg-orange-200 font-semibold"
                          : ""
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div> */}
            </div>
            {/* <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-lg bg-orange-500 absolute bottom-2 right-2"
            >
              <IoMdCheckmark />
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTimePicker;
