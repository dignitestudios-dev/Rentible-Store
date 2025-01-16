import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import GoogleMaps from "../../components/onboarding/GoogleMaps";
import ProductInput from "../../components/app/products/add/ProductInput";
import ProductTextarea from "../../components/app/products/add/ProductTextarea";
import ProductTimePicker from "../../components/app/products/add/ProductTimePicker";
import ProductDayPicker from "../../components/app/products/add/ProductDayPicker";
import ProductCategoryDropdown from "../../components/app/products/add/ProductCategoryDropdown";
import axios from "../../axios";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import { AppContext } from "../../context/AppContext";
import Cookies from "js-cookie";
import DragDropImages from "../../components/app/products/add/DragDropImages";
import { useFormik } from "formik";
import { addProductValues } from "../../data/addProduct";
import { addProductSchema } from "../../schema/addProductSchema";
import { FiLoader } from "react-icons/fi";

const AddProduct = () => {
  const navigate = useNavigate();
  const {
    userInput,
    setUserInput,
    latitude,
    longitude,
    setLatitude,
    setLongitude,
  } = useContext(AppContext);
  const [val, setval] = useState("");
  const [selectedPickupTime, setSelectedPickupTime] = useState(null);
  const [selectedDropOffTime, setSelectedDropOffTime] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [categories, setCategories] = useState([]); // Updated variable name to camelCase
  const [categoryLoading, setCategoryLoading] = useState(false);

  const getCategories = async () => {
    try {
      setCategoryLoading(true);
      const { data } = await axios.get(`/category`);
      console.log("🚀 ~  ~ data:", data);
      setCategories(data?.data); // Store the actual data from the response
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
      console.log("Error:", error);
    } finally {
      setCategoryLoading(false);
    }
  };

  const [subCategories, setSubCategories] = useState([]);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const getSubCategories = async () => {
    try {
      setSubCategoriesLoading(true);
      const { data } = await axios.get(`/category/${selectedCategory?._id}`);
      setSubCategories(data?.data); // Store the actual data from the response
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
      console.log("Error:", error);
    } finally {
      setSubCategoriesLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    selectedCategory && getSubCategories();
  }, [selectedCategory]);

  const [files, setFiles] = useState([]);

  const [isAddNew, setIsAddNew] = useState(false);

  const store = Cookies.get("store") ? JSON.parse(Cookies.get("store")) : null;

  const [loading, setLoading] = useState(false);
  const [cover, setCover] = useState(0);

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: addProductValues,
      validationSchema: addProductSchema,
      validateOnChange: true,
      validateOnBlur: true,
      onSubmit: async (values, action) => {
        try {
          setLoading(true);

          const formdata = new FormData();
          formdata.append("name", values?.name);
          formdata.append("description", values?.description);
          formdata.append("categoryId", values?.categoryId);
          formdata.append("subCategoryId", values?.subCategoryId);
          formdata.append("quantity", values?.quantity);

          values?.availableDays?.forEach((day) => {
            formdata.append("availableDays", day);
          });
          formdata.append("pickupTime", values?.pickupTime);
          formdata.append("dropOffTime", values?.dropOffTime);
          formdata.append("pickupAddress", values?.pickupAddress);
          formdata.append("latitude", latitude);
          formdata.append("longitude", longitude);
          formdata.append("pricePerHour", values?.pricePerHour);
          formdata.append("pricePerDay", values?.pricePerDay);
          files?.forEach((file, index) => {
            if (index !== cover) {
              formdata.append("images", file);
            }
          });

          formdata.append("cover", files[cover]);

          const response = await axios.post("/product", formdata);
          if (response.status === 200) {
            SuccessToast("Product created successfully.");
            localStorage.setItem("activeLink", "Products");
            navigate(`/products/${response?.data?.data?._id}`, {
              state: response?.data?.data,
            });
          }
        } catch (err) {
          console.log("🚀 ~ createAccount ~ err:", err);
          ErrorToast(err?.response?.data?.message);
        } finally {
          setLoading(false);
        }
      },
    });

  useEffect(() => {
    if (isAddNew) {
      setUserInput("");
      values.pickupAddress = "";
    } else {
      setUserInput(store?.address);
      values.pickupAddress = store?.address;
    }
  }, [isAddNew]);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full  flex flex-col gap-6  py-4 px-2 lg:px-6 justify-start items-start "
    >
      <div className="w-full h-auto flex flex-col gap-3 justify-start items-start">
        <div className="w-full relative flex flex-col lg:flex-row justify-between lg:items-center">
          <div className="w-full h-auto flex flex-col justify-start items-start ">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-[14px] flex gap-[0.5px] items-center font-normal leading-[21px] text-[#202224] "
            >
              <MdKeyboardBackspace className="text-lg" />
              <span>Back</span>
            </button>
            <span className="text-[26px] lg:text-[32px] font-bold leading-[48px] text-[#202224]">
              Add New Product
            </span>
          </div>
          <div className="w-auto flex justify-start items-center gap-3">
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
        </div>
      </div>

      <div className="w-full h-auto flex flex-col-reverse lg:flex-row gap-3 justify-start items-start pb-4">
        <div className="w-full xl:w-[698px] 2xl:w-[900px] h-auto flex flex-col gap-3 justify-start items-start">
          <div className="w-full h-auto rounded-[18px] bg-white  flex flex-col p-5 justify-start items-start gap-5">
            <h1 className="text-[24px] font-medium leading-[36px]">
              General Information
            </h1>

            <ProductInput
              type={"text"}
              id={"name"}
              name={"name"}
              value={values?.name}
              onChange={handleChange}
              onBlur={handleBlur}
              errors={errors}
              touched={touched}
              label={"Product Name"}
              placeholder={"Enter Product Name"}
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
              label={"Product Description"}
              placeholder={"Enter Product Description"}
            />
          </div>
          <div className="w-full h-auto rounded-[18px] bg-white flex flex-col p-5 justify-start items-start gap-5">
            <h1 className="text-[24px] font-medium leading-[36px]">
              Set Availability
            </h1>
            <ProductDayPicker
              label={"Available Days"}
              selectedDays={selectedDays}
              setSelectedDays={setSelectedDays}
              placeholder={"Select Days"}
              values={values}
              errors={errors}
              touched={touched}
            />
            <div className="w-full grid grid-cols-2 gap-2">
              <ProductTimePicker
                label={"Pickup Time"}
                selectedTime={selectedPickupTime}
                setSelectedTime={setSelectedPickupTime}
                name={"pickupTime"}
                values={values}
                errors={errors}
                touched={touched}
                pickupTime={null}
              />
              <ProductTimePicker
                label={"Drop Off Time"}
                selectedTime={selectedDropOffTime}
                setSelectedTime={setSelectedDropOffTime}
                name={"dropOffTime"}
                values={values}
                errors={errors}
                touched={touched}
                isDropOff={true}
                pickupTime={selectedPickupTime}
              />
            </div>
          </div>
          <div className="w-full h-auto rounded-[18px] bg-white flex flex-col p-5 justify-start items-start gap-5 ">
            <div className="w-full flex justify-between items-center">
              <h1 className="text-[24px] font-medium leading-[36px]">
                Pickup Address
              </h1>
              <div className="w-[254px] h-[33px] grid grid-cols-2 p-[3px] rounded-[8px] border-[0.8px] border-[#d9d9d9] bg-[#f8f8f8]/[0.6]">
                <button
                  type="button"
                  onClick={() => setIsAddNew(false)}
                  className={`w-full h-full rounded-[6px]  flex items-center justify-center text-[12px] font-normal leading-[15.3px] ${
                    !isAddNew ? "bg-orange-500 text-white" : "text-[#505050]"
                  }`}
                >
                  Same as profile
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddNew(true)}
                  className={`w-full h-full rounded-[6px]  flex items-center justify-center text-[12px] font-normal leading-[15.3px] ${
                    isAddNew ? "bg-orange-500 text-white" : "text-[#505050]"
                  } `}
                >
                  + Add New
                </button>
              </div>
            </div>
            <ProductInput
              type={"text"}
              id={"pickupAddress"}
              name={"pickupAddress"}
              value={userInput}
              onChange={(e) => {
                setUserInput(e.target.value);
                handleChange(e);
              }}
              onBlur={handleBlur}
              errors={errors}
              touched={touched}
              label={"Same as profile"}
              placeholder={"ABCD, 12345, Street 2, Florida, USA"}
            />
            <div className="w-full h-[175px] rounded-[16px]">
              <GoogleMaps />
            </div>
          </div>
        </div>
        <div className="w-full xl:w-[423px] h-auto flex flex-col gap-3 justify-start items-start">
          <div
            className={`w-full h-auto ${
              errors?.browse && touched?.browse
                ? " border border-red-500"
                : "border-[#D9D9D9]"
            } rounded-[18px] bg-white flex flex-col p-5 justify-start items-start gap-5 `}
          >
            <h1 className="text-[24px] font-medium leading-[36px]">
              Upload Image
            </h1>
            <DragDropImages
              onFilesSelected={setFiles}
              touched={touched}
              errors={errors}
              values={values}
              cover={cover}
              setCover={setCover}
            />
          </div>
          <div className="w-full h-auto rounded-[18px] bg-white   flex flex-col p-5 justify-start items-start gap-5">
            <h1 className="text-[24px] font-medium leading-[36px]">Category</h1>
            <ProductCategoryDropdown
              label={"Category"}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              placeholder={"Select Category"}
              categories={categories}
              values={values}
              name={"categoryId"}
              errors={errors}
              touched={touched}
            />
            <ProductCategoryDropdown
              label={"Sub Category"}
              selectedCategory={selectedSubCategory}
              setSelectedCategory={setSelectedSubCategory}
              placeholder={"Select Sub Category"}
              categories={subCategories}
              values={values}
              name={"subCategoryId"}
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="w-full h-auto rounded-[18px] bg-white flex flex-col p-5 justify-start items-start gap-5 ">
            <h1 className="text-[24px] font-medium leading-[36px]">
              Price & Stock
            </h1>
            <div className="w-full grid grid-cols-2 gap-3">
              <ProductInput
                type={"text"}
                id={"pricePerHour"}
                name={"pricePerHour"}
                value={values?.pricePerHour}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
                label={"Hourly Price"}
                placeholder={"Enter Hourly Price"}
              />
              <ProductInput
                type={"text"}
                id={"pricePerDay"}
                name={"pricePerDay"}
                value={values?.pricePerDay}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
                label={"Daily Price"}
                placeholder={"Enter Daily Price"}
              />
            </div>
            <ProductInput
              type={"text"}
              id={"quantity"}
              name={"quantity"}
              value={values?.quantity}
              onChange={handleChange}
              onBlur={handleBlur}
              errors={errors}
              touched={touched}
              label={"Stock"}
              placeholder={"Enter Stock"}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddProduct;
