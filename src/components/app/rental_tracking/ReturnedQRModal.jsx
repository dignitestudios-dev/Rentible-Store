import React from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { FaExclamation } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";

const ReturnedQRModal = ({
  isOpen,
  onRequestClose,
  onConfirm,
  uid,
  loading,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center z-[1000] "
      overlayClassName="fixed inset-0 bg-[#C6C6C6] bg-opacity-50 backdrop-blur-sm z-[1000]  flex justify-center items-center"
    >
      <div className="bg-white p-6 rounded-[16px] shadow-lg max-w-lg w-[461px]  items-center flex flex-col gap-8 justify-center text-center">
        <h2 className=" font-semibold text-black mb-1 leading-[36px] text-[24px]">
          Please Scan QR Code For Return Order
        </h2>
        <QRCodeSVG value={uid} size={286} />

        <div className="flex justify-center space-x-2">
          <button
            onClick={onConfirm}
            className="px-6 flex items-center justify-center bg-[#F85E00] w-[385px] h-[49px] text-white  rounded-[8px] hover:bg-orange-600 transition text-[13px] font-medium "
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
              <span>Done</span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReturnedQRModal;
