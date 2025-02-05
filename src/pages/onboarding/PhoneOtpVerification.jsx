import React, { useEffect, useState } from "react";
import { ForgotKey, OTPVector, USFlag } from "../../assets/export";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import axios from "../../axios";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import { FiLoader } from "react-icons/fi";
import { useFormik } from "formik";
import { verifyOtpValues } from "../../data/authentication";
import { verifytOtpSchema } from "../../schema/verifyOtpSchema";
import Cookies from "js-cookie";
import UpdatePhoneNumberModal from "./UpdatePhoneNumberModal";
const PhoneOtpVerification = () => {
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  const [timer, setTimer] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    let interval;

    if (isDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      setIsDisabled(false);
      setTimer(null);
    }

    return () => clearInterval(interval); // Cleanup on unmount or when timer changes
  }, [isDisabled, timer]);

  const resendPhoneOtp = async () => {
    try {
      setResendLoading(true);
      // API call to login using Axios interceptor
      const response = await axios.post(`/auth/phoneVerificationOTP`);

      if (response?.data?.success) {
        SuccessToast("OTP Resent successfully.");
        setTimer(60);
        setIsDisabled(true);
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

  // useEffect(() => {
  //   window.addEventListener("beforeunload", function (e) {
  //     e.preventDefault();
  //     e.returnValue = "";
  //     Cookies.remove("token");
  //     navigate("/signup");
  //   });
  // }, []);

  const [openEdit, setOpenEdit] = useState(false);

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
            <button
              type="button"
              onClick={() => setOpenEdit(true)}
              className="text-orange-500 text-xs ml-1 font-bold underline underline-offset-2"
            >
              Change
            </button>
            <UpdatePhoneNumberModal
              isOpen={openEdit}
              onRequestClose={() => setOpenEdit(false)}
            />
            {/* /store */}
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
              <button
                type="button"
                tabIndex={0}
                disabled={resendLoading || loading || isDisabled}
                onClick={resendPhoneOtp}
                className="absolute w-16 cursor-pointer h-[40px] rounded-[7px] top-1 right-1 bg-[#565656] text-white flex items-center justify-center text-sm font-medium"
              >
                {resendLoading ? (
                  <FiLoader className="animate-spin text-lg " />
                ) : timer ? (
                  `00:${timer}`
                ) : (
                  "Resend"
                )}
              </button>
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
    </form>
  );
};

export default PhoneOtpVerification;
