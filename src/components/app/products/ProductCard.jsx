import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../axios";
import { ErrorToast, SuccessToast } from "../../global/Toaster";
import { convertEpochTo12HourFormat } from "../../../utils/helper";

const ProductCard = ({ product, setUpdate }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState(product?.isActive);

  const toggleActivation = async () => {
    try {
      const response = await axios.post("/product/toggleActivation", {
        productId: product?._id,
        isActive: active,
      });
      if (response?.data?.success) {
        SuccessToast(
          `Product ${active ? "activated" : "deactivated"} successfully.`
        );
        setUpdate((prev) => !prev);
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
    } finally {
      // test
    }
  };

  useEffect(() => {
    active !== product?.isActive && toggleActivation();
  }, [active]);
  return (
    <div className="w-full h-auto xl:h-[540px] rounded-[20px]  shadow bg-white p-3">
      <div className="w-full  h-[193px] rounded-[14px] bg-gray-100 relative flex items-center justify-center">
        <img
          src={
            product?.cover ||
            "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
          }
          alt="product_image"
          className="w-full h-full rounded-[14px] object-cover object-center"
        />
        <button
          onClick={() => setActive((prev) => !prev)}
          className={`w-[36px] h-[18px] rounded-full   flex ${
            active ? "bg-[#F85E00] justify-end" : "justify-start bg-[#d9d9d9]"
          }  p-[1.5px]  absolute top-2 right-2`}
        >
          <span className="w-[15px] h-[15px] rounded-full bg-white shadow "></span>
        </button>
      </div>
      <div className="w-full relative xl:h-[calc(100%-193px)] mt-3 px-[1px] flex flex-col justify-start items-start gap-1">
        <div className="w-full flex justify-between items-center">
          <h2 className="text-[16px] font-semibold leading">
            {product?.name?.length > 20
              ? product?.name?.slice(0, 20) + "..."
              : product?.name}
          </h2>
          <span className="text-[12px] font-medium leading-[21px]">
            {product?.category?.name || "N/A"}
          </span>
        </div>
        <span className="text-[11px] font-normal leading-[21px] text-[#818181]">
          {product?.description?.length > 150
            ? product?.description?.slice(0, 150) + "..."
            : product?.description}
        </span>
        <span className="w-full mb-2 h-[1.5px] bg-[#d4d4d4] rounded-full"></span>
        <div className="w-full flex min-h-16 justify-between items-start">
          <div className="w-[44%] h-full flex flex-col gap-0 justify-start items-start">
            <span className="text-[12px] font-medium leading-[21px]">
              Pickup Location
            </span>
            <div className="w-auto flex gap-1 justify-start items-start">
              <img
                src="/map_pin.png"
                alt="address_marker_pin"
                className="w-[9.29px] mt-1"
              />

              <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
                {product?.pickupAddress?.length > 40
                  ? product?.pickupAddress?.slice(0, 40) + "..."
                  : product?.pickupAddress}
              </span>
            </div>
            {/* <span className="text-[12px] font-medium  leading-[18px]">
              {product?.distance || "N/A"}
            </span> */}
          </div>
          <div className="w-[3%] h-16 flex items-center justify-start">
            <span className="w-[1.5px] h-14 rounded-full bg-[#d4d4d4]"></span>
          </div>
          <div className="w-[48%] h-full flex flex-col gap-0 justify-start items-start">
            <span className="text-[12px] font-medium leading-[21px]">
              Quantity
            </span>
            <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
              {product?.quantity || 0}
            </span>
            <span className="text-[10px] font-medium  leading-[18px]">
              {product?.subCategory?.name || "N/A"}
            </span>
          </div>
        </div>
        <span className="w-full h-[1.5px] mb-2 bg-[#d4d4d4] rounded-full"></span>
        <div className="w-full flex min-h-16 justify-between items-start">
          <div className="w-[44%] h-full flex flex-col gap-1 justify-start items-start">
            <span className="text-[12px] font-medium leading-[21px]">
              Available Days
            </span>
            <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
              {product?.availableDays[0] || "N/A"}
              {"-"}
              {product?.availableDays[product?.availableDays?.length - 1] ||
                "N/A"}
            </span>
          </div>
          <div className="w-[3%] h-16 flex items-center justify-start ">
            <span className="w-[1.5px] h-10 rounded-full bg-[#d4d4d4]"></span>
          </div>
          <div className="w-[48%] h-full flex flex-col gap-1 justify-start items-start">
            <span className="text-[12px] font-medium leading-[21px]">
              Pickup And DropOff
            </span>
            <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
              {convertEpochTo12HourFormat(product?.pickupTime) || "N/A"}
              {"-"}
              {convertEpochTo12HourFormat(product?.dropOffTime) || "N/A"}
            </span>
          </div>
        </div>

        <button
          onClick={() =>
            navigate(`/products/${product?._id}`, { state: product })
          }
          className="w-full  h-[40px] xl:absolute xl:bottom-3  rounded-[8px] bg-[#F85E00] text-white text-[14px] font-medium leading-[24px] flex items-center justify-center"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
