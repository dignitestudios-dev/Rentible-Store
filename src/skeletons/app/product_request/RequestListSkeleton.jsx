import React from "react";

const RequestListSkeleton = () => {
  return (
    <div className="w-full grid grid-cols-12 h-[77px] text-[#202224]">
      {/* Skeleton for the second column (image and name) */}
      <span className="w-full col-span-2 px-4 flex items-center gap-2 justify-start h-full">
        <div className="w-[44px] h-[44px] bg-gray-300 rounded-full flex items-center justify-center animate-pulse"></div>
        <div className="w-[100px] h-[13px] bg-gray-300 rounded-sm animate-pulse"></div>
      </span>

      {/* Skeleton for the third column */}
      <span className="w-full col-span-2 flex items-center justify-start h-full">
        <div className="w-[120px] h-[13px] bg-gray-300 rounded-sm animate-pulse"></div>
      </span>

      {/* Skeleton for the fourth column */}
      <span className="w-full col-span-2 flex items-center justify-start h-full">
        <div className="w-[120px] h-[13px] bg-gray-300 rounded-sm animate-pulse"></div>
      </span>

      {/* Skeleton for the fifth column */}
      <span className="w-full col-span-2 flex items-center justify-start h-full">
        <div className="w-[160px] h-[13px] bg-gray-300 rounded-sm animate-pulse"></div>
      </span>

      {/* Skeleton for the sixth column */}
      <span className="w-full col-span-3 flex items-center justify-start h-full">
        <div className="w-[200px] h-[13px] bg-gray-300 rounded-sm animate-pulse"></div>
      </span>

      {/* Skeleton for the last column (caret icon) */}
      <span className="w-full col-span-1 flex items-center justify-end h-full px-6">
        <div className="w-[20px] h-[20px] bg-gray-300 rounded-full animate-pulse"></div>
      </span>
    </div>
  );
};

export default RequestListSkeleton;
