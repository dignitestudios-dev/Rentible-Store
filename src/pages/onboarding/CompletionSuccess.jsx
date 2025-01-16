import React, { useEffect } from "react";
import { OrangeLogo } from "../../assets/export";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

const CompletionSuccess = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/waiting-approval");
    }, 2000);
  }, []);
  return (
    <div className="w-screen h-screen fixed top-0 left-0 flex bg-[#C6C6C680]/[0.5] backdrop-blur-sm  items-center justify-center ">
      <div className="w-[499px] relative h-[423px] rounded-[20px] bg-white shadow p-6 flex justify-center items-center gap-2 flex-col">
        <button className="absolute top-3 right-3 ">
          <RxCross2 className="text-lg text-black" />
        </button>
        <img src={OrangeLogo} alt="" className="w-[213px]" />
        <div className="w-auto flex flex-col mt-4 justify-center items-center">
          <h2 className="text-[32px] font-bold leading-[48px]">
            Thanks for signing up!
          </h2>
          <p className="text-[18px] font-normal text-center leading-[27px] text-[#262626]">
            Your profile is currently under review. We'll <br /> update you once
            it's approved
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompletionSuccess;
