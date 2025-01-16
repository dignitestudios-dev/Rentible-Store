import React, { useEffect } from "react";
import { ForgotKey, OTPVector, SuccessTick, USFlag } from "../../assets/export";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";

const PasswordReset = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  }, []);
  return (
    <div className="w-full h-auto flex flex-col items-center px-8 py-16 justify-center md:w-[499px] md:h-[413px]  rounded-[19px] bg-white">
      <img src={SuccessTick} alt="otp-verification-vector" className="" />
      <div className="w-auto flex flex-col mt-4 justify-center items-center">
        <h2 className="text-[32px] font-bold leading-[48px]">
          Password Reset!
        </h2>
        <p className="text-[18px] font-normal text-center leading-[27px] text-[#3C3C43D9]">
          Your Password Has been Successfully <br /> Reset, Click below to
          continue your access
        </p>
      </div>

      <div className="w-full md:w-[393px] mt-5 flex flex-col justify-start items-start gap-4">
        <Link
          to={"/dashboard"}
          className="w-full h-[49px] mt-2 rounded-[8px] bg-[#F85E00] text-white hover:no-underline hover:text-[#fff] flex items-center justify-center text-md font-medium"
        >
          Continue
        </Link>
      </div>
    </div>
  );
};

export default PasswordReset;
