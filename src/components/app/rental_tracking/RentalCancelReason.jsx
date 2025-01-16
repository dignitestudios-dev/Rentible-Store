import React, { useState } from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { FaExclamation } from "react-icons/fa";
import Reaons from "./Reasons";

const RentalCancelReason = ({
  isOpen,
  onRequestClose,
  onConfirm,
  loading,
  setSelectedReason,
}) => {
  const [reasons, setReasons] = useState([
    {
      title: "Change of Plans",
      description: "I need to cancel my booking due to a change in my plans.",
    },
    {
      title: "Product Availability",
      description: "The product I booked is no longer available or needed.",
    },
    {
      title: "Booking Error",
      description:
        "I made an error while booking and need to cancel to correct it.",
    },
    {
      title: "Financial Reasons",
      description:
        "I'm unable to proceed with the booking due to financial constraints.",
    },
    {
      title: "Personal Emergency",
      description:
        "A personal emergency has come up, and I need to cancel my booking.",
    },
  ]);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center z-[1000] "
      overlayClassName="fixed inset-0 bg-[#C6C6C6] bg-opacity-50 backdrop-blur-sm z-[1000]  flex justify-center items-center"
    >
      <div className="bg-white p-6 rounded-[16px] shadow-lg max-w-lg w-[461px] flex flex-col justify-center items-center   text-center">
        <h2 className=" font-semibold text-black mb-1 leading-[36px] text-[24px]">
          Cancellation Reason
        </h2>
        <div className="w-full flex flex-col justify-start items-start gap-2">
          <Reaons reasons={reasons} setSelectedReason={setSelectedReason} />
        </div>

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
              <span>Submit</span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RentalCancelReason;
