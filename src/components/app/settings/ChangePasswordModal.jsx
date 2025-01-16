import React, { useState } from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { FaExclamation } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { updatePasswordValues } from "../../../data/authentication";
import { updatePassSchema } from "../../../schema/updatePassSchema";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { ErrorToast, SuccessToast } from "../../global/Toaster";
import axios from "../../../axios";
import { signInWithEmailAndPassword } from "firebase/auth";
import Cookies from "js-cookie";
import { auth } from "../../../firebase/firebase";

const ChangePasswordModal = ({ isOpen, onRequestClose }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfPasswordVisible, setIsConfPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: updatePasswordValues,
      validationSchema: updatePassSchema,
      validateOnChange: true,
      validateOnBlur: true,
      onSubmit: async (values, action) => {
        try {
          setLoading(true);
          // API call to login using Axios interceptor
          const response = await axios.post(`/auth/changePassword`, {
            password: values?.currentPassword,
            newPassword: values?.newPassword,
          });

          if (response?.data?.success) {
            const store = Cookies.get("store")
              ? JSON.parse(Cookies.get("store"))
              : null;

            const user = await signInWithEmailAndPassword(
              auth,
              store?.email,
              values?.newPassword
            );
            values.currentPassword = "";
            values.newPassword = "";
            values.confirmNewPassword = "";
            SuccessToast("Password updated successfully.");
            onRequestClose();
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
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center z-[1000] "
      overlayClassName="fixed inset-0 bg-[#C6C6C6] bg-opacity-50 backdrop-blur-sm z-[1000]  flex justify-center items-center"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-[16px] shadow-lg max-w-lg  items-center flex flex-col justify-center gap-3  text-center"
      >
        <h2 className=" font-semibold text-black mb-1 leading-[36px] text-[24px]">
          Change Password
        </h2>

        <div className="w-[385px] flex flex-col justify-start items-start gap-3">
          <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
            <div
              className={`h-[49px] flex justify-start bg-[#F8F8F899] items-start w-full relative border-[0.8px]  border-[#D9D9D9] rounded-[8px] ${
                errors?.currentPassword && touched?.currentPassword
                  ? "border-red-500"
                  : "border-[#D9D9D9]"
              }`}
            >
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={values.currentPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-[90%] h-full  bg-transparent rounded-l-[8px] placeholder:text-[#959393] outline-none text-[#262626] px-3 text-[16px] font-normal leading-[20.4px]"
                placeholder="Current Password"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible((prev) => !prev)}
                className="w-[10%] h-full rounded-r-[8px] bg-transparent text-md text-[#959393] flex items-center justify-center"
              >
                {isPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
            {errors.currentPassword && touched.currentPassword ? (
              <p className="text-red-700 text-sm font-medium">
                {errors.currentPassword}
              </p>
            ) : null}
          </div>
          <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
            <div
              className={`h-[49px] flex justify-start bg-[#F8F8F899] items-start w-full relative border-[0.8px]  border-[#D9D9D9] rounded-[8px] ${
                errors?.newPassword && touched?.newPassword
                  ? "border-red-500"
                  : "border-[#D9D9D9]"
              }`}
            >
              <input
                type={isNewPasswordVisible ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-[90%] h-full  bg-transparent rounded-l-[8px] placeholder:text-[#959393] outline-none text-[#262626] px-3 text-[16px] font-normal leading-[20.4px]"
                placeholder="New Password"
              />
              <button
                type="button"
                onClick={() => setIsNewPasswordVisible((prev) => !prev)}
                className="w-[10%] h-full rounded-r-[8px] bg-transparent text-md text-[#959393] flex items-center justify-center"
              >
                {isNewPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
            {errors.newPassword && touched.newPassword ? (
              <p className="text-red-700 text-sm font-medium">
                {errors.newPassword}
              </p>
            ) : null}
          </div>
          <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
            <div
              className={`h-[49px] flex justify-start bg-[#F8F8F899] items-start w-full relative border-[0.8px]  border-[#D9D9D9] rounded-[8px] ${
                errors?.confirmNewPassword && touched?.confirmNewPassword
                  ? "border-red-500"
                  : "border-[#D9D9D9]"
              }`}
            >
              <input
                type={isConfPasswordVisible ? "text" : "password"}
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={values.confirmNewPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-[90%] h-full  bg-transparent rounded-l-[8px] placeholder:text-[#959393] outline-none text-[#262626] px-3 text-[16px] font-normal leading-[20.4px]"
                placeholder="Confirm New Password"
              />
              <button
                type="button"
                onClick={() => setIsConfPasswordVisible((prev) => !prev)}
                className="w-[10%] h-full rounded-r-[8px] bg-transparent text-md text-[#959393] flex items-center justify-center"
              >
                {isConfPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
            {errors.confirmNewPassword && touched.confirmNewPassword ? (
              <p className="text-red-700 text-sm font-medium">
                {errors.confirmNewPassword}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex justify-center space-x-2">
          <button
            type="submit"
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
              <span>Update Password</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
