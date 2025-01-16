import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="w-full h-auto xl:h-[540px] rounded-[20px] shadow bg-white p-3 animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-[193px] rounded-[14px] bg-gray-300 relative flex items-center justify-center">
        <div className="w-full h-full rounded-[14px] bg-gray-300"></div>
        <div className="w-[36px] h-[18px] absolute top-2 right-2 rounded-full bg-gray-400 flex items-center p-[1.5px]">
          <span className="w-[15px] h-[15px] rounded-full bg-gray-200"></span>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="w-full relative xl:h-[calc(100%-193px)] mt-3 px-[1px] flex flex-col gap-3">
        {/* Title and Category Skeleton */}
        <div className="w-full flex justify-between items-center">
          <div className="w-[60%] h-[18px] bg-gray-300 rounded-md"></div>
          <div className="w-[20%] h-[14px] bg-gray-300 rounded-md"></div>
        </div>

        {/* Description Skeleton */}
        <div className="w-[80%] h-[14px] bg-gray-300 rounded-md"></div>
        <div className="w-full h-[1.5px] bg-gray-300 rounded-full my-2"></div>

        {/* Pickup Location and Quantity Skeleton */}
        <div className="w-full flex justify-between items-start">
          <div className="w-[44%] flex flex-col gap-2">
            <div className="w-[60%] h-[14px] bg-gray-300 rounded-md"></div>
            <div className="w-[80%] h-[12px] bg-gray-300 rounded-md"></div>
            <div className="w-[40%] h-[12px] bg-gray-300 rounded-md"></div>
          </div>
          <div className="w-[3%] h-20 flex items-center justify-center">
            <div className="w-[1.5px] h-full bg-gray-300"></div>
          </div>
          <div className="w-[48%] flex flex-col gap-2">
            <div className="w-[50%] h-[14px] bg-gray-300 rounded-md"></div>
            <div className="w-[40%] h-[12px] bg-gray-300 rounded-md"></div>
            <div className="w-[60%] h-[12px] bg-gray-300 rounded-md"></div>
          </div>
        </div>
        <div className="w-full h-[1.5px] bg-gray-300 rounded-full my-2"></div>

        {/* Available Days and Pickup/DropOff Skeleton */}
        <div className="w-full flex justify-between items-start">
          <div className="w-[44%] flex flex-col gap-2">
            <div className="w-[60%] h-[14px] bg-gray-300 rounded-md"></div>
            <div className="w-[80%] h-[12px] bg-gray-300 rounded-md"></div>
          </div>
          <div className="w-[3%] h-16 flex items-center justify-center">
            <div className="w-[1.5px] h-full bg-gray-300"></div>
          </div>
          <div className="w-[48%] flex flex-col gap-2">
            <div className="w-[60%] h-[14px] bg-gray-300 rounded-md"></div>
            <div className="w-[80%] h-[12px] bg-gray-300 rounded-md"></div>
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="w-full h-[49px] rounded-[8px] bg-gray-300"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
