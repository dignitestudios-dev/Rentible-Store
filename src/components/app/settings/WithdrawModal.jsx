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
import { withdraw } from "../../../data/withdraw";
import { withdrawSchema } from "../../../schema/withdrawSchema";

const WithdrawModal = ({ isOpen, setUpdate, onRequestClose }) => {
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
      initialValues: withdraw,
      validationSchema: withdrawSchema,
      validateOnChange: true,
      validateOnBlur: true,
      onSubmit: async (values, action) => {
        try {
          setLoading(true);
          // API call to login using Axios interceptor
          const response = await axios.post(`/balance`, {
            amount: values?.amount,
          });

          if (response?.data?.success) {
            values.amount = "";
            setUpdate((prev) => !prev);
            SuccessToast("Amount withdrawn successfully.");
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
          Withdraw
        </h2>

        <div className="w-[385px] flex flex-col justify-start items-start gap-3">
          {bank?.status == "active" && (
            <div className="w-full flex flex-col justify-start items-start gap-[2px]">
              <span className="text-[12px] font-normal leading-[18px] text-[#1C1B1F]">
                Attached Bank Account
              </span>

              <div className="w-full h-[56px] relative flex flex-col items-start justify-center px-3 rounded-[8px] bg-[#ECE8E8]  text-[#202020] text-sm font-medium">
                <span>****-****-****-{bank?.last4}</span>
              </div>
            </div>
          )}

          <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
            <span className="text-[18px] font-semibold leading-[27px] text-[#000000]">
              Withdraw Funds
            </span>

            <span className="text-[14px] font-normal leading-[20px] text-[#1C1B1F] ">
              Enter Amount
            </span>
            <button
              type="button"
              className={`h-[49px] flex justify-start bg-white items-start w-full relative border-[0.8px]  border-[#D9D9D9] focus-within:border-orange-500 rounded-[8px] ${
                errors?.amount && touched?.amount
                  ? "border-red-500"
                  : "border-[#D9D9D9]"
              }`}
            >
              <span className="w-[6%] text-gray-500 h-full flex justify-end items-center">
                $
              </span>
              <input
                type={"text"}
                id="amount"
                name="amount"
                value={values.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-[94%] h-full  bg-transparent rounded-l-[8px] placeholder:text-[#959393] outline-none text-[#262626] px-3 text-[16px] font-normal leading-[20.4px]"
                placeholder="Enter Amount"
              />
            </button>
            {errors.amount && touched.amount ? (
              <p className="text-red-700 text-sm font-medium">
                {errors.amount}
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
              <span>Withdraw</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default WithdrawModal;
