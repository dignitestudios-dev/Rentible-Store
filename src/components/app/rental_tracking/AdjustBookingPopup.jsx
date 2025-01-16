import React from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { FaExclamation } from "react-icons/fa";

const AdjustBookingPopup = ({
  isOpen,
  onRequestClose,
  onConfirm,
  onSkip,
  skipLoading,
  confirmLoading,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center z-[1000] "
      overlayClassName="fixed inset-0 bg-[#C6C6C6] bg-opacity-50 backdrop-blur-sm z-[1000]  flex justify-center items-center"
    >
      <div className="bg-white p-6 rounded-[16px] shadow-lg max-w-lg w-[461px] max-h-[430px] items-center flex flex-col justify-center text-center">
        <div className="flex justify-center mb-4">
          <img src="/cancel-modal-icon.png" alt="" className="h-[129px]" />
        </div>
        <h2 className=" font-semibold text-black mb-1 leading-[36px] text-[24px]">
          Product Damage ?
        </h2>
        <p className="text-[#3C3C43D9] text-[18px] font-normal leading-[27px] mb-6">
          Click 'Adjust Booking' if there are any bookings scheduled within the
          next 24 hours that you want to cancel.
        </p>

        <div className="flex w-full justify-center space-x-2">
          <button
            onClick={onSkip}
            className="px-6 flex items-center justify-center bg-[#aeadad] w-1/2 h-[49px] text-gray-800  rounded-[8px]  transition text-[13px] font-medium "
          >
            {skipLoading ? (
              <div
                class="animate-spin inline-block size-3 border-[3px] border-current border-t-transparent text-white rounded-full"
                role="status"
                aria-label="loading"
              >
                <span class="sr-only">Loading...</span>
              </div>
            ) : (
              <span>Skip</span>
            )}
          </button>
          <button
            onClick={onConfirm}
            className="px-6 flex items-center justify-center bg-[#F85E00] w-1/2 h-[49px] text-white  rounded-[8px] hover:bg-orange-600 transition text-[13px] font-medium "
          >
            {confirmLoading ? (
              <div
                class="animate-spin inline-block size-3 border-[3px] border-current border-t-transparent text-white rounded-full"
                role="status"
                aria-label="loading"
              >
                <span class="sr-only">Loading...</span>
              </div>
            ) : (
              <span>Adjust Booking</span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AdjustBookingPopup;
