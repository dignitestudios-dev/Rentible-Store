import React from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { formatDateToMMDDYYYY } from "../../../utils/helper";

const ProductRequestModal = ({ isOpen, onRequestClose, request }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center outline-none z-[1000] p-4"
      overlayClassName="fixed inset-0 bg-[#C6C6C6] outline-none bg-opacity-50 backdrop-blur-sm z-[1000] flex justify-center items-center"
    >
      <div className="bg-white p-6 rounded-[16px] shadow-lg max-w-lg w-full sm:w-[461px] items-start flex flex-col gap-3 justify-center max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="w-full flex justify-between items-center">
          <h2 className="font-semibold text-black leading-[32px] text-[22px] lg:text-[24px]">
            Product Request Details
          </h2>
          <button
            type="button"
            onClick={onRequestClose}
            className="text-gray-500 hover:text-black text-2xl cursor-pointer p-1"
          >
            <IoMdClose />
          </button>
        </div>

        {/* User Info */}
        <div className="w-full flex justify-start items-center gap-3 min-w-0">
          <span className="w-[77px] h-[77px] min-w-[77px] border border-[#F85E00] rounded-full flex items-center justify-center shrink-0">
            <img
              src={
                request?.user?.profilePicture ||
                "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
              }
              alt="store_image"
              className="w-[67px] h-[67px] rounded-full object-cover"
            />
          </span>
          <div className="w-full flex flex-col justify-start items-start min-w-0">
            <h3
              className="text-[18px] font-semibold text-black leading-[22px] line-clamp-2 break-words [overflow-wrap:anywhere]"
              title={request?.user?.name || "N/A"}
            >
              {request?.user?.name || "N/A"}
            </h3>
            <h3
              className="text-[15px] font-normal text-black leading-[20px] line-clamp-2 break-words [overflow-wrap:anywhere]"
              title={request?.user?.email || "N/A"}
            >
              {request?.user?.email || "N/A"}
            </h3>
          </div>
        </div>

        <span className="w-full my-1 h-[1px] bg-[#d4d4d4] rounded-full"></span>

        {/* Product Details Grid */}
        <div className="w-full grid grid-cols-3 gap-3 items-start min-w-0">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[14px] font-normal leading-[18px] text-[#959393]">
              Product Name
            </span>
            <span
              className="text-[15px] font-medium text-[#000] leading-[22px] line-clamp-3 break-words [overflow-wrap:anywhere]"
              title={request?.name || "N/A"}
            >
              {request?.name || "N/A"}
            </span>
          </div>

          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[14px] font-normal leading-[18px] text-[#959393]">
              Category
            </span>
            <span
              className="text-[15px] font-medium text-[#000] leading-[22px] line-clamp-3 break-words [overflow-wrap:anywhere]"
              title={request?.category?.name || "N/A"}
            >
              {request?.category?.name || "N/A"}
            </span>
          </div>

          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[14px] font-normal leading-[18px] text-[#959393]">
              Posted Date
            </span>
            <span className="text-[15px] font-medium text-[#000] leading-[22px] whitespace-nowrap">
              {formatDateToMMDDYYYY(request?.createdAt)}
            </span>
          </div>
        </div>

        <span className="w-full my-1 h-[1px] bg-[#d4d4d4] rounded-full"></span>

        {/* Description */}
        <div className="w-full flex flex-col gap-1 justify-start items-start min-w-0">
          <span className="text-[14px] font-normal leading-[18px] text-[#959393]">
            Description
          </span>
          <span className="text-[15px] font-normal text-[#000] leading-[22px] break-words [overflow-wrap:anywhere] whitespace-pre-wrap max-h-[160px] overflow-y-auto w-full pr-1">
            {request?.description || "N/A"}
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default ProductRequestModal;
