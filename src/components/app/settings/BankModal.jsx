import React, { useEffect, useState } from "react";
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
import { addBankSchema } from "../../../schema/addBankSchema";
import { addBank } from "../../../data/addBank";

const BankModal = ({ isOpen, onRequestClose }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [bank, setBank] = useState(null);
  const [bankLoading, setBankLoading] = useState(false);
  const getBank = async () => {
    try {
      setBankLoading(true);
      const { data } = await axios.get(`/balance/bank`);

      setBank(data?.data); // Store the actual data from the response
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
      console.log("Error:", error);
    } finally {
      setBankLoading(false);
    }
  };

  useEffect(() => {
    isOpen && getBank();
  }, [isOpen]);

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: addBank,
      validationSchema: addBankSchema,
      validateOnChange: true,
      validateOnBlur: true,
      onSubmit: async (values, action) => {
        try {
          setLoading(true);
          // API call to login using Axios interceptor
          const response = await axios.post(`/balance/bank`, {
            accountHolderName: values?.accountHolderName,
            routingNumber: values?.routingNumber,
            accountNumber: values?.accountNumber,
          });

          if (response?.data?.success) {
            values.accountHolderName = "";
            values.routingNumber = "";
            values.accountNumber = "";
            SuccessToast("Bank updated successfully.");
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
          Update Bank
        </h2>

        <div className="w-[385px] flex flex-col justify-start items-start gap-3">
          {bank?.status == "active" && (
            <div className="w-full h-[56px] relative flex flex-col items-start justify-center px-3 rounded-[8px] bg-orange-500/10 border border-orange-500 text-orange-500 text-sm font-medium">
              <span>{bank?.bank_name}</span>
              <span>XXXX-XXXX-XXXX-{bank?.last4}</span>
              {bank?.status == "active" ? (
                <span className="w-auto py-1 rounded-full absolute top-1/4 right-2 px-2 text-xs bg-orange-500 text-white">
                  Active
                </span>
              ) : (
                <span className="w-auto py-1 rounded-full absolute top-1/4 right-2 px-2 text-xs bg-red-500 text-white">
                  Inactive
                </span>
              )}
            </div>
          )}

          <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
            <div
              className={`h-[49px] flex justify-start bg-[#F8F8F899] items-start w-full relative border-[0.8px]  border-[#D9D9D9] rounded-[8px] ${
                errors?.accountHolderName && touched?.accountHolderName
                  ? "border-red-500"
                  : "border-[#D9D9D9]"
              }`}
            >
              <input
                type={"text"}
                id="accountHolderName"
                name="accountHolderName"
                value={values.accountHolderName}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-[90%] h-full  bg-transparent rounded-l-[8px] placeholder:text-[#959393] outline-none text-[#262626] px-3 text-[16px] font-normal leading-[20.4px]"
                placeholder="Account Holder Name"
              />
            </div>
            {errors.accountHolderName && touched.accountHolderName ? (
              <p className="text-red-700 text-sm font-medium">
                {errors.accountHolderName}
              </p>
            ) : null}
          </div>
          <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
            <div
              className={`h-[49px] flex justify-start bg-[#F8F8F899] items-start w-full relative border-[0.8px]  border-[#D9D9D9] rounded-[8px] ${
                errors?.accountNumber && touched?.accountNumber
                  ? "border-red-500"
                  : "border-[#D9D9D9]"
              }`}
            >
              <input
                type={"text"}
                id="accountNumber"
                name="accountNumber"
                value={values.accountNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={13}
                className="w-[90%] h-full  bg-transparent rounded-l-[8px] placeholder:text-[#959393] outline-none text-[#262626] px-3 text-[16px] font-normal leading-[20.4px]"
                placeholder="Account Number"
              />
            </div>
            {errors.accountNumber && touched.accountNumber ? (
              <p className="text-red-700 text-sm font-medium">
                {errors.accountNumber}
              </p>
            ) : null}
          </div>
          <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
            <div
              className={`h-[49px] flex justify-start bg-[#F8F8F899] items-start w-full relative border-[0.8px]  border-[#D9D9D9] rounded-[8px] ${
                errors?.routingNumber && touched?.routingNumber
                  ? "border-red-500"
                  : "border-[#D9D9D9]"
              }`}
            >
              <input
                type={"text"}
                id="routingNumber"
                name="routingNumber"
                value={values.routingNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={9}
                className="w-[90%] h-full  bg-transparent rounded-l-[8px] placeholder:text-[#959393] outline-none text-[#262626] px-3 text-[16px] font-normal leading-[20.4px]"
                placeholder="Routing Number"
              />
            </div>
            {errors.routingNumber && touched.routingNumber ? (
              <p className="text-red-700 text-sm font-medium">
                {errors.routingNumber}
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
              <span>Update Bank</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BankModal;
