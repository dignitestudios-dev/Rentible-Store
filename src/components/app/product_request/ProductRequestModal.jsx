import React from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { FaExclamation } from "react-icons/fa";
import { formatDateToMMDDYYYY } from "../../../utils/helper";

const ProductRequestModal = ({ isOpen, onRequestClose, request }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center outline-none z-[1000] "
      overlayClassName="fixed inset-0 bg-[#C6C6C6] outline-none bg-opacity-50 backdrop-blur-sm z-[1000]  flex justify-center items-center"
    >
      <div className="bg-white p-6 rounded-[16px] shadow-lg max-w-lg w-[360px] lg:w-[461px]  items-start flex flex-col gap-2 justify-center ">
        <h2 className=" font-semibold text-black mb-1 leading-[36px] text-[24px]">
          Product Request Details
        </h2>

        <div className="w-full h-full flex justify-start items-center gap-2">
          <span className="w-[77px] h-[77px] border border-[#F85E00] rounded-full flex items-center justify-center ">
            <img
              src={
                request?.user?.profilePicture ||
                "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
              }
              alt="store_image"
              className="w-[67px] h-[67px] rounded-full"
            />
          </span>
          <div className="w-auto flex flex-col justify-start items-start">
            <h3 className="text-[18px] font-semibold text-black leading-[19.1px]">
              {request?.user?.name || "N/A"}
            </h3>
            <h3 className="text-[16px] font-normal text-black leading-[24.1px]">
              {request?.user?.email || "N/A"}
            </h3>
          </div>
        </div>
        <span className="w-full my-2 h-[1px] bg-[#d4d4d4] rounded-full"></span>

        <div className="w-full flex  justify-between items-start">
          <div className="w-[32%] h-full flex flex-col gap-1 justify-start items-start">
            <span className="text-[16px] font-normal leading-[20px] text-[#959393]">
              Product Name
            </span>
            <span className="text-[16px] font-normal text-[#000] leading-[23px]">
              {request?.name || "N/A"}
            </span>
          </div>
          <div className="w-[3%] h-14 flex items-center justify-start">
            <span className="w-[1px] h-10 rounded-full bg-[#d4d4d4]"></span>
          </div>
          <div className="w-[32%] h-full flex flex-col gap-1 justify-start items-start">
            <span className="text-[16px] font-normal leading-[20px] text-[#959393]">
              Category
            </span>
            <span className="text-[16px] font-normal text-[#000] leading-[23px]">
              {request?.category?.name || "N/A"}
            </span>
          </div>
          <div className="w-[3%] h-14 flex items-center justify-start">
            <span className="w-[1px] h-10 rounded-full bg-[#d4d4d4]"></span>
          </div>
          <div className="w-[32%] h-full flex flex-col gap-1 justify-start items-start">
            <span className="text-[16px] font-normal leading-[20px] text-[#959393]">
              Posted Date
            </span>
            <span className="text-[16px] font-normal text-[#000] leading-[23px]">
              {formatDateToMMDDYYYY(request?.createdAt)}
            </span>
          </div>
        </div>

        <span className="w-full my-2 h-[1px] bg-[#d4d4d4] rounded-full"></span>

        <div className="w-full h-full flex flex-col gap-1 justify-start items-start">
          <span className="text-[16px] font-normal leading-[20px] text-[#959393]">
            Description
          </span>
          <span className="text-[16px] font-normal text-[#000] leading-[23px]">
            {request?.description || "N/A"}
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default ProductRequestModal;
