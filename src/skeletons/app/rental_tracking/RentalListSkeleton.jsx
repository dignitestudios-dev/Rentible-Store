import React from "react";

const RentalListSkeleton = () => {
  return (
    <div className="w-full grid grid-cols-12 h-[77px] animate-pulse">
      <span className="w-full px-4 col-span-3 flex items-center gap-2">
        <span className="w-[44px] h-[44px] bg-gray-300 rounded-full"></span>
        <span className="w-[120px] h-4 bg-gray-300 rounded-md"></span>
      </span>

      <span className="w-full col-span-2 flex items-center">
        <span className="w-[200px] h-4 bg-gray-300 rounded-md"></span>
      </span>

      <span className="w-full col-span-1 flex items-center">
        <span className="w-[40px] h-4 bg-gray-300 rounded-md"></span>
      </span>

      <span className="w-full col-span-2 flex items-center">
        <span className="w-[100px] h-4 bg-gray-300 rounded-md"></span>
      </span>

      <span className="w-full col-span-2 flex items-center">
        <span className="w-[120px] h-4 bg-gray-300 rounded-md"></span>
      </span>

      <span className="w-full col-span-1 flex items-center">
        <span className="w-[60px] h-4 bg-gray-300 rounded-md"></span>
      </span>

      <span className="w-full col-span-1 flex items-center justify-end px-6">
        <span className="w-[20px] h-[20px] bg-gray-300 rounded-full"></span>
      </span>
    </div>
  );
};

export default RentalListSkeleton;
