import React, { useEffect, useState } from "react";
import { ForgotKey, USFlag } from "../../assets/export";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useFormik } from "formik";
import { changePassValues } from "../../data/authentication";
import { changePassSchema } from "../../schema/changePassSchema";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import { FiLoader } from "react-icons/fi";
import axios from "../../axios";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import Cookies from "js-cookie";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfPasswordVisible, setIsConfPasswordVisible] = useState(false);

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: changePassValues,
      validationSchema: changePassSchema,
      validateOnChange: true,
      validateOnBlur: false,

      onSubmit: async (values, action) => {
        try {
          setLoading(true);
          // API call to login using Axios interceptor
          const response = await axios.post(`/auth/updatePassword`, {
            password: values?.password,
          });

          if (response?.data?.success) {
            const store = Cookies.get("store")
              ? JSON.parse(Cookies.get("store"))
              : null;

            const user = await signInWithEmailAndPassword(
              auth,
              store?.email,
              values?.password
            );

            Cookies.set("user", JSON.stringify(user), { expires: 15 });

            SuccessToast("Password updated successfully.");
            navigate("/password-updated");
            setLoading(false);
          }
        } catch (error) {
          console.log(error);
          ErrorToast(error?.response?.data?.message || "Something went wrong.");
        } finally {
          setLoading(false);
        }
      },
    });

  useEffect(() => {
    window.addEventListener("beforeunload", function (e) {
      e.preventDefault();
      e.returnValue = "";
      Cookies.remove("token");
    });
  }, []);
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-auto md:w-[499px] md:h-[489px] flex flex-col gap-8 justify-center items-center"
    >
      <div className="w-full h-auto flex flex-col items-center px-8 py-16 justify-center md:w-[499px] md:h-[552px]  rounded-[19px] bg-white">
        <img
          src={ForgotKey}
          alt="forgot-password-vector"
          className="w-[148.4px]"
        />
        <div className="w-auto flex flex-col mt-4 justify-center items-center">
          <h2 className="text-[32px] font-bold leading-[48px]">
            Set New Password
          </h2>
          <p className="text-[18px] font-normal text-center leading-[27px] text-[#3C3C43D9]">
            Set New Password so you can login
            <br /> and access Rentibles
          </p>
        </div>

        <div className="w-full md:w-[393px] mt-5 flex flex-col justify-start items-start gap-4">
          <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
            <div
              className={`h-[49px] flex justify-start bg-[#F8F8F899] items-start w-full relative border-[0.8px]  border-[#D9D9D9] rounded-[8px] ${
                errors?.password && touched?.password
                  ? "border-red-500"
                  : "border-[#D9D9D9]"
              }`}
            >
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-[90%] h-full  bg-transparent rounded-l-[8px] placeholder:text-[#959393] outline-none text-[#262626] px-3 text-[16px] font-normal leading-[20.4px]"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible((prev) => !prev)}
                className="w-[10%] h-full rounded-r-[8px] bg-transparent text-md text-[#959393] flex items-center justify-center"
              >
                {isPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
            {errors.password && touched.password ? (
              <p className="text-red-700 text-sm font-medium">
                {errors.password}
              </p>
            ) : null}
          </div>
          <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
            <div
              className={`h-[49px] flex justify-start bg-[#F8F8F899] items-start w-full relative border-[0.8px]  border-[#D9D9D9] rounded-[8px] ${
                errors?.confirm_password && touched?.confirm_password
                  ? "border-red-500"
                  : "border-[#D9D9D9]"
              }`}
            >
              <input
                type={isConfPasswordVisible ? "text" : "password"}
                id="confirm_password"
                name="confirm_password"
                value={values.confirm_password}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-[90%] h-full  bg-transparent rounded-l-[8px] placeholder:text-[#959393] outline-none text-[#262626] px-3 text-[16px] font-normal leading-[20.4px]"
                placeholder="Re-enter Password"
              />
              <button
                type="button"
                onClick={() => setIsConfPasswordVisible((prev) => !prev)}
                className="w-[10%] h-full rounded-r-[8px] bg-transparent text-md text-[#959393] flex items-center justify-center"
              >
                {isConfPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
            {errors.confirm_password && touched.confirm_password ? (
              <p className="text-red-700 text-sm font-medium">
                {errors.confirm_password}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            className="w-full h-[49px] mt-2 rounded-[8px] bg-[#F85E00] text-white flex gap-2 items-center justify-center text-md font-medium"
          >
            <span>Update</span>
            {loading && <FiLoader className="animate-spin text-lg " />}
          </button>
        </div>
      </div>
      <button
        onClick={() => {
          Cookies.remove("token");
          navigate(-1);
        }}
        className="text-sm font-medium text-white hover:no-underline hover:text-white flex items-center justify-center"
      >
        <IoIosArrowRoundBack className="text-[28px]" />
        <span>Back</span>
      </button>
    </form>
  );
};

export default ChangePassword;
