import React, { useEffect, useState } from "react";
import { PiCaretDownBold, PiCaretUpBold } from "react-icons/pi";
import { filterWeeks } from "../../../../utils/helper";

const ProductDayPicker = ({
  label,
  selectedDays,
  setSelectedDays,
  placeholder,
  errors,
  touched,
  values,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);
  const daysOfWeek = [
    "All Day",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const toggleDaySelection = (day) => {
    setSelectedDays((prev) => {
      const isAllDaySelected = day === "All Day";
      const allDays = daysOfWeek.filter((d) => d !== "All Day");

      if (isAllDaySelected) {
        const isCurrentlyAllSelected = prev.length === allDays.length;
        const newSelection = isCurrentlyAllSelected ? [] : allDays;

        // Set isAllDay based on the new selection
        setIsAllDay(!isCurrentlyAllSelected);

        return newSelection;
      } else {
        const isSelected = prev.includes(day);
        const updatedDays = isSelected
          ? prev.filter((d) => d !== day) // Remove the day
          : [...prev, day]; // Add the day

        // Update isAllDay if all individual days are selected
        const isAllDaysSelected = updatedDays.length === allDays.length;
        setIsAllDay(isAllDaysSelected);

        return updatedDays;
      }
    });
  };

  useEffect(() => {
    values.availableDays =
      selectedDays?.length > 0 ? filterWeeks(selectedDays) : "";
  }, [selectedDays]);

  return (
    <div className="w-full h-auto flex flex-col justify-start items-start gap-2">
      <label className="text-[14px] font-medium leading-[21px] ">{label}</label>
      <div className="relative w-full">
        {/* Selected Days Display */}
        <button
          type="button"
          onClick={toggleDropdown}
          className={`px-4 py-2 text-left w-full h-[49px] flex justify-between items-center rounded-[8px] outline-none ${
            errors?.availableDays && touched?.availableDays
              ? " border border-red-500"
              : "border-[#D9D9D9]"
          } focus:border bg-[#f8f8f8]/[0.6] focus:outline-none`}
        >
          <span>
            {selectedDays?.length > 0 ? selectedDays?.join(", ") : placeholder}
          </span>
          {isOpen ? <PiCaretUpBold /> : <PiCaretDownBold />}
        </button>
        {errors?.availableDays && touched?.availableDays ? (
          <p className="text-red-700 text-sm font-medium">
            {errors?.availableDays}
          </p>
        ) : null}

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-2 bg-[#f8f8f8] border rounded-md shadow-md">
            <div className="flex flex-col ">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className={`w-full px-4 py-2 text-left text-sm flex justify-between items-center border-b-[0.8px] border-[#d9d9d9] transition-all duration-200 `}
                >
                  <span>{day}</span>
                  <button
                    type="button"
                    onClick={() => toggleDaySelection(day)}
                    className={`w-[36px] transition-all duration-200 h-[18px] flex rounded-full ${
                      selectedDays.includes(day) || isAllDay
                        ? "bg-orange-500 justify-end"
                        : "justify-start bg-[#d9d9d9]"
                    }   p-[1.5px]`}
                  >
                    <span className="w-[15px] transition-all duration-200 h-[15px] rounded-full bg-white shadow "></span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDayPicker;
