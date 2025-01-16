import React, { useState } from "react";
import { ForgotKey, USFlag } from "../../assets/export";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useFormik } from "formik";
import { verifyEmailSchema } from "../../schema/verifyEmailSchema";
import { verifyEmailValues } from "../../data/authentication";
import axios from "../../axios";
import Cookies from "js-cookie";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import { FiLoader } from "react-icons/fi";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: verifyEmailValues,
      validationSchema: verifyEmailSchema,
      validateOnChange: true,
      validateOnBlur: false,

      onSubmit: async (values, action) => {
        try {
          setLoading(true);
          // API call to login using Axios interceptor
          const response = await axios.post(`/auth/forgot`, {
            email: values?.email,
            role: "store",
          });
          console.log(response);
          // Handle the response (e.g., save token, redirect)
          if (response?.data?.success) {
            localStorage.setItem("email", values?.email);

            SuccessToast("Email verification OTP sent to your email.");
            navigate("/forgot-password/verify-otp/email");
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
      onSubmit={handleSubmit}
      className="w-full h-auto md:w-[499px] md:h-[489px] flex flex-col gap-8 justify-center items-center"
    >
      <div className="w-full h-auto flex flex-col items-center px-8 py-16 justify-center md:w-[499px] md:h-[489px]  rounded-[19px] bg-white">
        <img
          src={ForgotKey}
          alt="forgot-password-vector"
          className="w-[148.4px]"
        />
        <div className="w-auto flex flex-col mt-4 justify-center items-center">
          <h2 className="text-[32px] font-bold leading-[48px]">
            Forgot Password
          </h2>
          <p className="text-[18px] font-normal text-center leading-[27px] text-[#3C3C43D9]">
            Enter your email We'll <br /> send you OTP for new password
          </p>
        </div>

        <div className="w-full md:w-[393px] mt-5 flex flex-col justify-start items-start gap-4">
          <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
            <input
              type="text"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full h-[49px] border-[0.8px] bg-[#F8F8F899] outline-none  rounded-[8px] placeholder:text-[#959393] text-[#262626] px-3 text-[16px] font-normal leading-[20.4px] ${
                errors?.email && touched?.email
                  ? "border-red-500"
                  : "border-[#D9D9D9]"
              }`}
              placeholder="Store Email Address"
            />
            {errors.email && touched.email ? (
              <p className="text-red-700 text-sm font-medium">{errors.email}</p>
            ) : null}
          </div>

          <button
            type="submit"
            className="w-full h-[49px] mt-2 rounded-[8px] bg-[#F85E00] text-white flex gap-2 items-center justify-center text-md font-medium"
          >
            <span>Send</span>
            {loading && <FiLoader className="animate-spin text-lg " />}
          </button>
        </div>
      </div>
      <Link
        to={-1}
        className="text-sm font-medium text-white hover:no-underline hover:text-[#fff] flex items-center justify-center"
      >
        <IoIosArrowRoundBack className="text-[28px]" />
        <span>Back</span>
      </Link>
    </form>
  );
};

export default ForgotPassword;
