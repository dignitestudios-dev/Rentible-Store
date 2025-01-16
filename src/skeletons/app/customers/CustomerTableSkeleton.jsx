import React from "react";

const CustomerTableSkeleton = () => {
  return (
    <div className="w-full grid grid-cols-12 h-[77px] text-[#202224] animate-pulse">
      <span className="w-full col-span-3 px-4 flex items-center gap-2 justify-start h-full">
        <span className="w-[44px] h-[44px] bg-gray-300 rounded-full"></span>
        <span className="w-[100px] h-[13px] bg-gray-300 rounded"></span>
      </span>

      <span className="w-full col-span-3 flex items-center justify-start h-full">
        <span className="w-[150px] h-[13px] bg-gray-300 rounded"></span>
      </span>

      <span className="w-full col-span-2 flex items-center justify-start h-full">
        <span className="w-[120px] h-[13px] bg-gray-300 rounded"></span>
      </span>

      <span className="w-full col-span-3 flex items-center justify-start h-full">
        <span className="w-[200px] h-[13px] bg-gray-300 rounded"></span>
      </span>

      <span className="w-full col-span-1 flex items-center justify-end h-full px-6">
        <span className="w-[20px] h-[20px] bg-gray-300 rounded-full"></span>
      </span>
    </div>
  );
};

export default CustomerTableSkeleton;
