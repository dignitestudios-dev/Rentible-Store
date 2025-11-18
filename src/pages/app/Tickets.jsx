import React, { useState } from "react";
import ProductInput from "../../components/app/products/add/ProductInput";
import ProductTextarea from "../../components/app/products/add/ProductTextarea";
import { useFormik } from "formik";
import { ticketsSchema } from "../../schema/ticketsSchema";
import { ticketData } from "../../data/tickets";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import axios from "../../axios";
import { FiLoader } from "react-icons/fi";
const Tickets = () => {
  const [loading, setLoading] = useState(false);
  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
    resetForm,
  } = useFormik({
    initialValues: ticketData,
    validationSchema: ticketsSchema,
    validateOnChange: true,
    validateOnBlur: true,

    onSubmit: async (values, action) => {
      setLoading(true);
      const payload = {
        title: values.title,
        description: values.description,
      };
      try {
        const response = await axios.post("/support", payload);
        if (response.status === 200) {
          SuccessToast(response?.data?.message);
          resetForm();
        }
      } catch (err) {
        console.log("🚀 ~ createAccount ~ err:", err);
        ErrorToast(err?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    <div className="p-3">
      <div className="w-full  rounded-[18px] divide-y-[1px] bg-white p-10 mt-10">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <ProductInput
            type={"text"}
            id={"title "}
            name={"title"}
            value={values?.title}
            onChange={handleChange}
            onBlur={handleBlur}
            errors={errors}
            touched={touched}
            label={"Title"}
            placeholder={"Enter Title"}
          />
          <ProductTextarea
            type={"text"}
            id={"description"}
            name={"description"}
            value={values?.description}
            onChange={handleChange}
            onBlur={handleBlur}
            errors={errors}
            touched={touched}
            label={"Enter Description"}
            placeholder={"Enter  Description"}
          />
          <div className="w-auto mt-3 flex justify-start items-center gap-3">
            <button
              type="submit"
              className="w-[150px] h-[49px] rounded-[8px] bg-[#F85E00] text-white flex gap-2 items-center justify-center"
            >
              <span className="text-[14px] font-normal leading-[21px] ">
                Save
              </span>
              {loading && <FiLoader className="animate-spin text-lg " />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Tickets;
