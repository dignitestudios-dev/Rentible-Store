import React, { useState } from "react";
import { ForgotKey, OTPVector, USFlag } from "../../assets/export";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import axios from "../../axios";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import { FiLoader } from "react-icons/fi";
import { useFormik } from "formik";
import { verifyOtpValues } from "../../data/authentication";
import { verifytOtpSchema } from "../../schema/verifyOtpSchema";

const PhoneOtpVerification = () => {
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const resendPhoneOtp = async () => {
    try {
      setResendLoading(true);
      // API call to login using Axios interceptor
      const response = await axios.post(`/auth/phoneVerificationOTP`);

      if (response?.data?.success) {
        SuccessToast("OTP Resent successfully.");
        setResendLoading(false);
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setResendLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: verifyOtpValues,
      validationSchema: verifytOtpSchema,
      validateOnChange: true,
      validateOnBlur: false,

      onSubmit: async (values, action) => {
        try {
          setLoading(true);
          // API call to login using Axios interceptor
          const response = await axios.post(`/auth/verifyPhone`, {
            otp: values?.otp,
          });

          if (response?.data?.success) {
            SuccessToast("OTP Verfied Successfully.");
            navigate("/complete-profile");
            setLoading(false);
          }
        } catch (error) {
          ErrorToast(error?.response?.data?.message || "Something went wrong.");
        } finally {
          setLoading(false);
        }
      },
    });

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
      className="w-full h-auto md:w-[499px] md:h-[489px] flex flex-col gap-8 justify-center items-center"
    >
      <div className="w-full h-auto flex flex-col items-center px-8 py-16 justify-center md:w-[499px] md:h-[542px]  rounded-[19px] bg-white">
        <img src={OTPVector} alt="otp-verification-vector" className="" />
        <div className="w-auto flex flex-col mt-4 justify-center items-center">
          <h2 className="text-[32px] font-bold leading-[48px]">
            Verify Phone OTP
          </h2>
          <p className="text-[18px] font-normal text-center leading-[27px] text-[#3C3C43D9]">
            The code was sent to <br />
            <span className="text-black">+{localStorage.getItem("phone")}</span>
          </p>
          {/* <p className="text-[18px] font-normal text-center leading-[27px] mt-2 text-black">
            00:00
          </p> */}
        </div>

        <div className="w-full md:w-[393px] mt-5 flex flex-col justify-start items-start gap-4">
          <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
            <div className="h-[49px]  gap-3  items-start w-full relative ">
              <input
                type="text"
                id="otp"
                name="otp"
                value={values.otp}
                onChange={handleChange}
                minLength={6}
                maxLength={6}
                onBlur={handleBlur}
                className={`w-full h-[49px] border-[0.8px] bg-[#F8F8F899] outline-none  rounded-[8px] placeholder:text-[#959393] text-[#262626] px-3 text-[16px] font-normal leading-[20.4px] ${
                  errors?.otp && touched?.otp
                    ? "border-red-500"
                    : "border-[#D9D9D9]"
                }`}
                placeholder="XXXXXX"
              />
              <span
                onClick={resendPhoneOtp}
                className="absolute w-16 cursor-pointer h-[40px] rounded-[7px] top-1 right-1 bg-[#565656] text-white flex items-center justify-center text-sm font-medium"
              >
                {resendLoading ? (
                  <FiLoader className="animate-spin text-lg " />
                ) : (
                  "Resend"
                )}
              </span>
            </div>

            {errors.otp && touched.otp ? (
              <p className="text-red-700 text-sm font-medium">{errors.otp}</p>
            ) : null}
          </div>

          <button
            type="submit"
            className="w-full h-[49px] rounded-[8px] bg-[#F85E00] text-white flex gap-2 items-center justify-center text-md font-medium"
          >
            <span>Verify</span>
            {loading && <FiLoader className="animate-spin text-lg " />}
          </button>
        </div>
      </div>
      <Link
        to={-1}
        className="text-sm font-medium text-white hover:no-underline hover:text-white flex items-center justify-center"
      >
        <IoIosArrowRoundBack className="text-[28px]" />
        <span>Back</span>
      </Link>
    </form>
  );
};

export default PhoneOtpVerification;
