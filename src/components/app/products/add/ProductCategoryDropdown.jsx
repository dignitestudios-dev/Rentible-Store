import React, { useEffect, useState } from "react";
import { PiCaretDownBold, PiCaretUpBold } from "react-icons/pi";

const ProductCategoryDropdown = ({
  label,
  categories, // Categories list from backend (array of objects with title and _id)
  selectedCategory, // Selected category _id
  setSelectedCategory, // Function to set the selected category _id
  placeholder,
  name,
  values,
  touched,
  errors,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle dropdown open/close
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Handle category selection
  const selectCategory = (category) => {
    setSelectedCategory(category?._id); // Store the _id of the selected category
    setIsOpen(false); // Close the dropdown after selection
  };

  // Find the selected category object based on _id
  const selectedCategoryObj = categories?.find(
    (category) => category?._id === selectedCategory
  );

  useEffect(() => {
    values[name] = selectedCategory !== null ? selectedCategory?._id : "";
  }, [selectCategory]);

  return (
    <div className="w-full h-auto flex flex-col justify-start items-start gap-2">
      <label className="text-[14px] font-medium leading-[21px] ">{label}</label>
      <div className="relative w-full">
        {/* Selected Category Display */}
        <button
          type="button"
          onClick={toggleDropdown}
          className={`px-4 py-2 text-left w-full h-[49px] flex justify-between items-center rounded-[8px] outline-none focus:border bg-[#f8f8f8]/[0.6] focus:outline-none ${
            errors[name] && touched[name]
              ? " border border-red-500"
              : "border-[#D9D9D9]"
          }`}
        >
          <span>{selectedCategory ? selectedCategory?.name : placeholder}</span>
          {isOpen ? <PiCaretUpBold /> : <PiCaretDownBold />}
        </button>

        {errors[name] && touched[name] ? (
          <p className="text-red-700 text-sm font-medium">{errors[name]}</p>
        ) : null}

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-20 w-full mt-2 bg-[#f8f8f8] border rounded-md shadow-md">
            <div className="flex flex-col">
              {categories?.length > 0 ? (
                categories?.map((category) => (
                  <div
                    key={category?._id}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-2 cursor-pointer text-left text-sm flex justify-between items-center border-b-[0.8px] border-[#d9d9d9] transition-all duration-200 ${
                      selectedCategory?._id === category?._id
                        ? "bg-gray-200  justify-end"
                        : "justify-start "
                    }`}
                  >
                    <div className="w-auto flex items-center justify-start gap-2">
                      <img
                        src={category?.cover}
                        alt=""
                        className="w-7 h-7 rounded-full"
                      />
                      <span>{category?.name}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full h-24 flex items-center justify-center text-xs font-medium text-gray-500">
                  No Data Available
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCategoryDropdown;
