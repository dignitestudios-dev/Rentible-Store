import React from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { FaExclamation } from "react-icons/fa";

const CustomerReportConfirm = ({
  isOpen,
  onRequestClose,
  onConfirm,
  loading,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center z-[1000] "
      overlayClassName="fixed inset-0 bg-[#C6C6C6] bg-opacity-50 backdrop-blur-sm z-[1000]  flex justify-center items-center"
    >
      <div className="bg-white p-6 rounded-[16px] shadow-lg max-w-lg w-[417px]  text-center">
        <div className="flex justify-center mb-4">
          <img src="/info-icon.png" alt="" />
        </div>
        <h2 className=" font-semibold text-black mb-1 leading-[36px] text-[24px]">
          Report User
        </h2>
        <p className="text-[#3C3C43D9] text-[18px] font-normal leading-[27px] mb-6">
          Are you sure you want to <br /> report this user.
        </p>

        <div className="flex justify-center space-x-2">
          <button
            onClick={onRequestClose}
            className="w-[165px] h-[49px] flex items-center justify-center  text-[13px] font-medium   text-[#59595F]  rounded-[8px] bg-[#d9d9d9] transition"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-6 flex items-center justify-center bg-[#F85E00] w-[165px] h-[49px] text-white  rounded-[8px] hover:bg-orange-600 transition text-[13px] font-medium "
          >
            {loading ? (
              <div
                class="animate-spin inline-block size-3 border-[3px] border-current border-t-transparent text-white rounded-full"
                role="status"
                aria-label="loading"
              >
                <span class="sr-only">Loading...</span>
              </div>
            ) : (
              <span>Yes</span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomerReportConfirm;
