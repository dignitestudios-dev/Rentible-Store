import React from "react";

const IssueListSkeleton = () => {
  return (
    <div className="w-full grid grid-cols-12 gap-3 h-[77px] text-[#202224] animate-pulse">
      <span className="w-full px-4 col-span-2 flex items-center justify-start h-full">
        <span className="w-[60px] h-[20px] bg-gray-300 rounded"></span>
      </span>

      <span className="w-full col-span-2 flex items-center gap-2 justify-start h-full">
        <span className="w-[44px] h-[44px] bg-gray-300 rounded-full"></span>
        <span className="w-[80px] h-[20px] bg-gray-300 rounded"></span>
      </span>

      <span className="w-full col-span-4 flex flex-col items-start justify-center h-full">
        <span className="w-[150px] h-[20px] bg-gray-300 rounded mb-1"></span>
        <span className="w-[200px] h-[16px] bg-gray-300 rounded"></span>
      </span>

      <span className="w-full col-span-1 flex items-center justify-start h-full">
        <span className="w-[80px] h-[20px] bg-gray-300 rounded"></span>
      </span>

      <span className="w-full col-span-2 flex items-center gap-2 justify-start h-full">
        <span className="w-[44px] h-[44px] bg-gray-300 rounded-full"></span>
        <span className="w-[100px] h-[20px] bg-gray-300 rounded"></span>
      </span>

      <span className="w-full col-span-1 flex items-center justify-end h-full px-6">
        <span className="w-[20px] h-[20px] bg-gray-300 rounded"></span>
      </span>
    </div>
  );
};

export default IssueListSkeleton;
