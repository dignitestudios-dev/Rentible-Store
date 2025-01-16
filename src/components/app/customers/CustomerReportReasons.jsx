import React, { useState } from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { FaExclamation } from "react-icons/fa";
import Reaons from "./Reasons";

const CustomerReportReasons = ({
  isOpen,
  onRequestClose,
  onConfirm,
  loading,
  setSelectedReportReason,
}) => {
  const [reasons, setReasons] = useState([
    {
      title: "False Information",
      description:
        "The review contains inaccurate or misleading information about the product or service.",
    },
    {
      title: "Offensive or Inappropriate Language",
      description:
        "The review includes inappropriate, offensive, or abusive language.",
    },
    {
      title: "Spam or Irrelevant Content",
      description:
        "The review is irrelevant, spammy, or promotes unrelated products or services.",
    },
    {
      title: "Review Violates Guidelines",
      description:
        "The review violates the platform's review or community guidelines.",
    },
    {
      title: "Conflict of Interest",
      description:
        "The review was submitted by someone with a personal bias or conflict of interest.",
    },
  ]);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center z-[1000] "
      overlayClassName="fixed inset-0 bg-[#C6C6C6] bg-opacity-50 backdrop-blur-sm z-[1000]  flex justify-center items-center"
    >
      <div className="bg-white p-6 rounded-[16px] shadow-lg max-w-lg w-[461px] flex flex-col justify-center items-center  min-h-[430px] text-center">
        <h2 className=" font-semibold text-black mb-1 leading-[36px] text-[24px]">
          Report Reasons
        </h2>

        <div className="w-full flex flex-col justify-start items-start gap-2">
          <Reaons
            reasons={reasons}
            setSelectedReason={setSelectedReportReason}
          />
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

export default CustomerReportReasons;
