import React from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { FaExclamation } from "react-icons/fa";

const ContractModal = ({ isOpen, onRequestClose }) => {
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
          Contract Not Signed!
        </h2>
        <p className="text-[#3C3C43D9] text-[18px] font-normal leading-[27px] mb-6">
          You must sign the contract sent to your email before the renter can
          pick your item.
        </p>

        <div className="flex w-full justify-center space-x-2">
          <button
            onClick={onRequestClose}
            className="px-6 flex items-center justify-center bg-[#F85E00] w-1/2 h-[49px] text-white  rounded-[8px] hover:bg-orange-600 transition text-[13px] font-medium "
          >
            <span>Okay</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ContractModal;
