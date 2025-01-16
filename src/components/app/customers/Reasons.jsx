import React, { useState } from "react";

const Reaons = ({ reasons, setSelectedReason }) => {
  const [openIndex, setOpenIndex] = useState(null); // Track which item is open

  const toggleDescription = (index) => {
    setOpenIndex(openIndex === index ? null : index); // Toggle the current index
  };

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center my-4  space-y-4">
      {reasons.map((reason, index) => (
        <div key={index} className=" flex flex-col w-[385px] gap-2  ">
          <button
            onClick={() => {
              toggleDescription(index);
              setSelectedReason(reason);
            }}
            className="w-full text-left px-4 py-3 bg-white border rounded-lg shadow transition-colors font-medium text-lg flex gap-2 justify-start items-center"
          >
            <span
              className={`w-4 h-4 flex items-center justify-center ${
                openIndex === index
                  ? "border border-[#F85E00] p-[1px]"
                  : "border"
              } rounded-full`}
            >
              <span
                className={`w-[10px] h-[10px] rounded-full ${
                  openIndex === index ? "bg-[#F85E00] " : "bg-white"
                }`}
              ></span>
            </span>
            <span className="text-[14px] font-normal leading-[21px]">
              {reason.title}
            </span>
          </button>
          {openIndex === index && (
            <div className="px-4 py-3 w-full bg-[#FFE5D4] text-left rounded-lg shadow text-[14px] font-normal leading-[21px]">
              {reason.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Reaons;
