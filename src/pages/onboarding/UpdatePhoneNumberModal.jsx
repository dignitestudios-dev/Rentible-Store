import React, { useState } from "react";
import Modal from "react-modal";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import { useFormik } from "formik";
import { updatePhoneValues } from "../../data/updatePhone";
import { updatePhoneSchema } from "../../schema/updatePhoneSchema";
import axios from "../../axios";
import { FiLoader } from "react-icons/fi";
import { USFlag } from "../../assets/export";

const UpdatePhoneNumberModal = ({ isOpen, onRequestClose }) => {
  const [loading, setLoading] = useState(false);
  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: updatePhoneValues,
      validationSchema: updatePhoneSchema,
      validateOnChange: true,
      validateOnBlur: false,

      onSubmit: async (values, action) => {
        try {
          setLoading(true);
          const formdata = new FormData();
          formdata.append("phone", `1${values?.phone}`);
          const { data } = await axios.put(`/store`, formdata);
          if (data?.success) {
            localStorage.setItem("phone", `1${values?.phone}`);
            const response = await axios.post(`/auth/phoneVerificationOTP`);

            if (response?.data?.success) {
              SuccessToast(
                "Phone Updated & OTP sent on updated number successfully."
              );
              onRequestClose();
            }
          }
        } catch (error) {
          ErrorToast(error?.response?.data?.message || "Something went wrong.");
        } finally {
          setLoading(false);
        }
      },
    });

  const formatPhoneNumberInput = (input) => {
    const cleaned = input.replace(/\D/g, ""); // Remove all non-numeric characters

    if (cleaned.length > 3 && cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else if (cleaned.length > 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
        6,
        10
      )}`;
    } else if (cleaned.length > 0) {
      return `(${cleaned}`;
    }
    return cleaned;
  };

  // Handle raw phone number update
  const handlePhoneChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Extract plain number
    handleChange({ target: { name: e.target.name, value: rawValue } }); // Update raw value
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center outline-none z-[1000] "
      overlayClassName="fixed inset-0 bg-[#C6C6C6] outline-none bg-opacity-50 backdrop-blur-sm z-[1000]  flex justify-center items-center"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-[16px] shadow-lg max-w-lg w-[360px] lg:w-[461px]  items-start flex flex-col gap-4 justify-center "
      >
        <h2 className=" font-semibold text-black mb-1 leading-[36px] text-[24px]">
          Update Phone Number
        </h2>
        <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
          <div className="h-[49px] flex justify-start gap-2  items-start w-full relative ">
            <span
              className={`w-[15%]  bg-[#F8F8F899] border-[0.8px]    ${
                errors?.phone && touched?.phone
                  ? "border-red-500"
                  : "border-[#D9D9D9]"
              } rounded-[8px] h-full   text-md text-[#959393] flex items-center justify-center`}
            >
              <img src={USFlag} alt="us_phone_number" />
              <span className="ml-[3px]">+1</span>
            </span>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formatPhoneNumberInput(values.phone)} // Display formatted number
              onChange={handlePhoneChange} // Update with raw number
              maxLength={14} // Adjust for formatted length
              onBlur={handleBlur}
              autoComplete="off" // Disable autofill
              className={`w-full h-[49px] border-[0.8px] bg-[#F8F8F899] outline-none rounded-[8px] placeholder:text-[#959393] text-[#262626] px-3 text-[16px] font-normal leading-[20.4px] ${
                errors?.phone && touched?.phone
                  ? "border-red-500"
                  : "border-[#D9D9D9]"
              }`}
              placeholder="Phone Number"
            />
          </div>

          {errors.phone && touched.phone ? (
            <p className="text-red-700 text-sm font-medium">{errors.phone}</p>
          ) : null}
        </div>

        <button
          type="submit"
          className="w-full h-[49px] rounded-[8px] bg-[#F85E00] text-white flex gap-2 items-center justify-center text-md font-medium"
        >
          <span>Update</span>
          {loading && <FiLoader className="animate-spin text-lg " />}
        </button>
      </form>
    </Modal>
  );
};

export default UpdatePhoneNumberModal;
