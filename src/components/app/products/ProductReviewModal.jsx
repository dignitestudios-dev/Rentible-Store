import React, { useContext } from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { FaExclamation, FaStar } from "react-icons/fa";
import { formatDateToMMDDYYYY } from "../../../utils/helper";
import { AppContext } from "../../../context/AppContext";
import { useNavigate } from "react-router-dom";

const ProductReviewModal = ({ isOpen, onRequestClose, issue }) => {
  const { setUid } = useContext(AppContext);
  const navigate = useNavigate();
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center outline-none z-[1000] "
      overlayClassName="fixed inset-0 bg-[#C6C6C6] outline-none bg-opacity-50 backdrop-blur-sm z-[1000]  flex justify-center items-center"
    >
      <div className="bg-white p-6 rounded-[16px] shadow-lg max-w-lg w-[360px] lg:w-[461px] max-h-[686px] items-start flex flex-col gap-2 justify-center ">
        <h2 className=" font-semibold text-black mb-1 leading-[36px] text-[24px]">
          Product Review
        </h2>

        {/* <div className="w-full h-auto flex gap-4 justify-start items-center">
          <img
            src={issue?.booking?.product?.cover}
            alt="product_cover"
            className="w-[114.5px] h-[114.5px] rounded-md bg-gray-200 object-contain"
          />
          <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
            <h3 className="text-[18px] font-semibold leading-[27px] text-black">
              {issue?.booking?.product?.name}
            </h3>

            <div className="w-full flex justify-start items-start">
              <div className="w-[45%] h-full flex flex-col gap-1 justify-start items-start">
                <span className="text-[14px] font-medium leading-[20px] text-[#000]  ">
                  Category
                </span>
                <span className="text-[13px] font-normal text-[#959393] leading-[20px]">
                  {issue?.booking?.product?.category?.name || "N/A"}
                </span>
              </div>
              <div className="w-[3%] h-14 flex items-center justify-start">
                <span className="w-[1px] h-10 rounded-full bg-[#d4d4d4]"></span>
              </div>
              <div className="w-[45%] h-full ml-3 flex flex-col gap-1 justify-start items-start">
                <span className="text-[14px] font-medium text-[#000] leading-[20px] ">
                  Sub Category
                </span>
                <span className="text-[13px] font-normal text-[#959393]  leading-[20px]">
                  {issue?.booking?.product?.subCategory?.name || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div> */}

        {/* <div className="w-full h-full flex justify-start items-center gap-2">
          <span className="w-[77px] h-[77px] border border-[#F85E00] rounded-full flex items-center justify-center ">
            <img
              src={request?.user?.profilePicture}
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
        </div> */}
        {/* <span className="w-full my-2 h-[1px] bg-[#d4d4d4] rounded-full"></span> */}

        <div className="w-full flex  justify-between items-start">
          <div className="w-[45%] h-full flex flex-col gap-1 justify-start items-start">
            <span className="text-[16px] font-normal leading-[20px] text-[#959393]">
              Posted Date
            </span>
            <span className="text-[16px] font-normal text-[#000] leading-[23px]">
              {formatDateToMMDDYYYY(issue?.createdAt)}
            </span>
          </div>
          <div className="w-[3%] h-14 flex items-center justify-start">
            <span className="w-[1px] h-10 rounded-full bg-[#d4d4d4]"></span>
          </div>
          <div className="w-[45%] h-full flex flex-col gap-1 justify-start items-start">
            <span className="text-[16px] font-normal leading-[20px] text-[#959393]">
              Ratings
            </span>
            <div className="w-auto flex  justify-start items-center gap-1">
              <FaStar className="text-sm text-yellow-500" />
              <span className="text-[14px] font-semibold text-black leading-[28px]">
                {issue?.stars?.toFixed(1) || 0.0}
              </span>
            </div>
          </div>
        </div>
        <span className="w-full my-2 h-[1px] bg-[#d4d4d4] rounded-full"></span>

        <div className="w-full h-full flex flex-col gap-1 justify-start items-start">
          <div className="w-full h-full flex flex-col gap-1 justify-start items-start">
            <span className="text-[16px] font-normal leading-[20px] text-[#959393]">
              Posted By
            </span>
            <div className="w-full h-full flex justify-between items-center gap-2">
              <div className="w-auto flex justify-start items-center gap-2">
                <span className="w-[35px] h-[35px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                  <img
                    src={
                      issue?.user?.profilePicture ||
                      "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                    }
                    alt="store_image"
                    className="w-[27px] h-[27px] rounded-full"
                  />
                </span>
                <div className="w-auto flex flex-col justify-start items-start">
                  <h3 className="text-[16px] font-normal text-black leading-[20.1px]">
                    {issue?.user?.name || "N/A"}
                  </h3>
                </div>
              </div>

              {/* <button
                onClick={() => {
                  navigate("/messages");
                  localStorage.setItem("activeLink", "Messages");
                  setUid(issue?.reportedBy?.uid);
                }}
                className="w-[31px] h-[31px] flex items-center justify-center"
              >
                <img
                  src="/chat-icon.png"
                  alt="Chat Icon"
                  className="w-full h-full"
                />
              </button> */}
            </div>
          </div>
        </div>

        <span className="w-full my-2 h-[1px] bg-[#d4d4d4] rounded-full"></span>

        <div className="w-full h-full flex flex-col gap-1 justify-start items-start">
          <span className="text-[16px] font-normal leading-[20px] text-[#959393]">
            Description
          </span>
          <span className="text-[16px] font-normal text-[#000] leading-[23px]">
            {issue?.description || "N/A"}
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default ProductReviewModal;
