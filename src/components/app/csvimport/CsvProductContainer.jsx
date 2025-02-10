import React, { useContext, useEffect, useState } from "react";
import GoogleMaps from "../../onboarding/GoogleMaps";
import axios from "../../../axios";
import Cookies from "js-cookie";
import { AppContext } from "../../../context/AppContext";
import CsvProductInput from "./CsvProductInput";
import CsvProductTextarea from "./CsvProductTextarea";
import CsvProductDayPicker from "./CsvProductDayPicker";
import CsvProductTimePicker from "./CsvProductTimePicker";
import CsvProductCategoryDropdown from "./CsvProductCategoryDropdown";
import CsvDragDropImage from "./CsvDragDropImage";
import { ErrorToast } from "../../global/Toaster";
import { convertToEpochTime, filterWeeks } from "../../../utils/helper";

const CsvProductContainer = ({
  number,
  product,
  setProducts,
  products,
  categories,
  onUpdate,
  errorObj,
}) => {
  const { userInput, setUserInput } = useContext(AppContext);
  const [val, setval] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [address, setAddress] = useState("");
  const [latlng, setLatLng] = useState({ lat: null, lng: null });

  const [selectedPickupTime, setSelectedPickupTime] = useState(null);
  const [selectedDropOffTime, setSelectedDropOffTime] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [subCategories, setSubCategories] = useState([]);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);

  let index = 0;
  const getSubCategories = async () => {
    try {
      setSubCategoriesLoading(true);
      const { data } = await axios.get(`/category/${selectedCategory?._id}`);
      setSubCategories(data?.data); // Store the actual data from the response
      index = 1;
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setSubCategoriesLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory && index === 0) {
      getSubCategories();
    }
  }, [selectedCategory]);

  const [cover, setCover] = useState(null);

  const store = Cookies.get("store") ? JSON.parse(Cookies.get("store")) : null;

  const convertTo24HourFormat = (time) => {
    let [hour, period] = time.split(" ");
    hour = parseInt(hour);

    if (period === "PM" && hour !== 12) {
      hour += 12; // Convert PM to 24-hour format
    } else if (period === "AM" && hour === 12) {
      hour = 0; // Midnight case
    }

    return hour;
  };

  useEffect(() => {
    setName(product?.name);
    setDescription(product?.description);
    setQuantity(product?.quantity);

    console.log(product?.categoryId, product, "sdfsdfsdf");

    setSelectedCategory(product?.categoryId);
    // setSelectedSubCategory(product?.subCategoryId);
    setSelectedDays(
      typeof product?.availableDays === "string"
        ? product?.availableDays?.split(",")
        : selectedDays
    );
    setAddress(product?.pickupAddress || store?.address);
    setPricePerDay(product?.pricePerDay || "");
    setPricePerHour(product?.pricePerHour || "");

    setCover(product?.cover || null);

    if (product?.pickupTime && typeof product?.pickupTime === "string") {
      const pickupTimeParts = product?.pickupTime.split(" ");
      if (pickupTimeParts.length === 2) {
        const [hour, period] = pickupTimeParts;
        if ((period === "AM" || period === "PM") && hour.length === 2) {
          setSelectedPickupTime(`${hour}:00 ${period}`);
        }
      }
    }

    if (product?.dropOffTime && typeof product?.dropOffTime === "string") {
      const dropOffTimeParts = product?.dropOffTime.split(" ");
      if (dropOffTimeParts.length >= 2) {
        const [hour, period] = dropOffTimeParts;
        if ((period === "AM" || period === "PM") && hour.length === 2) {
          const dropOffHour24 = convertTo24HourFormat(`${hour} ${period}`);
          const pickupTimeParts = product?.pickupTime.split(" ");
          const pickupHour24 = convertTo24HourFormat(
            `${pickupTimeParts[0]} ${pickupTimeParts[1]}`
          );

          const timeDifference = dropOffHour24 - pickupHour24;

          if (timeDifference >= 4) {
            setSelectedDropOffTime(`${hour}:00 ${period}`);
          } else {
            console.log("Drop-off time is not 4 hours ahead of pickup time");
          }
        }
      }
    } else {
      // Handle missing or invalid dropOffTime
      console.log("Drop-off time is invalid or missing");
    }
  }, []);
  const handleUpdate = () => {
    onUpdate(product?._id, {
      name: name,
      description: description,
      quantity: quantity,
      pricePerDay: pricePerDay,
      pricePerHour: pricePerHour,
      availableDays: filterWeeks(selectedDays?.length > 0 ? selectedDays : []),
      pickupTime: convertToEpochTime(`${selectedPickupTime}`),
      categoryId: selectedCategory?._id,
      subCategoryId: selectedSubCategory?._id,
      dropOffTime: convertToEpochTime(`${selectedDropOffTime}`),
      pickupAddress: address,
      latitude: latlng?.lat,
      longitude: latlng?.lng,
    });
  };
  useEffect(() => {
    handleUpdate();
  }, [
    name,
    description,
    quantity,
    selectedDays,
    selectedPickupTime,
    selectedCategory,
    selectedSubCategory,
    selectedDropOffTime,
    address,
    pricePerHour,
    pricePerDay,
    latlng,
  ]);

  const error = errorObj?.find((err) => err?.index === number);

  return (
    <div
      className={`w-full h-auto   flex flex-col gap-6   justify-start items-start `}
    >
      <div className="w-full h-auto flex flex-col-reverse lg:flex-row gap-3 justify-start items-start ">
        <div
          className={`w-full rounded-[18px] bg-white  h-auto flex flex-col gap-3 justify-start items-start ${
            error ? "border border-red-500" : ""
          }`}
        >
          <div className="w-full grid grid-cols-3 gap-4 justify-start items-start">
            <div className="w-full h-auto rounded-[18px] bg-white  flex flex-col p-5 justify-start items-start gap-5">
              <h1 className="text-[24px] font-medium leading-[36px]">
                General Information
              </h1>

              <CsvProductInput
                type={"text"}
                id={"name"}
                name={"name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                label={"Product Name"}
                placeholder={"Enter Product Name"}
                error={error}
              />
              <CsvProductTextarea
                type={"text"}
                id={"description"}
                name={"description"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                label={"Product Description"}
                placeholder={"Enter Product Description"}
                error={error}
              />

              <div className="w-full h-auto rounded-[18px] bg-white flex flex-col  justify-start items-start gap-5">
                <h1 className="text-[24px] font-medium leading-[36px]">
                  Set Availability
                </h1>
                <CsvProductDayPicker
                  label={"Available Days"}
                  selectedDays={selectedDays}
                  setSelectedDays={setSelectedDays}
                  placeholder={"Select Days"}
                  error={error}
                  name={"availableDays"}
                />
                <div className="w-full grid grid-cols-2 gap-2">
                  <CsvProductTimePicker
                    label={"Pickup Time"}
                    selectedTime={selectedPickupTime}
                    setSelectedTime={setSelectedPickupTime}
                    name={"pickupTime"}
                    error={error}
                  />
                  <CsvProductTimePicker
                    label={"Drop Off Time"}
                    selectedTime={selectedDropOffTime}
                    setSelectedTime={setSelectedDropOffTime}
                    name={"dropOffTime"}
                    error={error}
                    pickupTime={selectedPickupTime}
                    isDropOff={true}
                  />
                </div>
              </div>
            </div>
            <div className="w-full h-auto rounded-[18px] bg-white   flex flex-col p-5 justify-start items-start gap-5">
              <h1 className="text-[24px] font-medium leading-[36px]">
                Category
              </h1>
              <CsvProductCategoryDropdown
                label={"Category"}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                placeholder={"Select Category"}
                categories={categories}
                name={"categoryId"}
                error={error}
              />
              <CsvProductCategoryDropdown
                label={"Sub Category"}
                selectedCategory={selectedSubCategory}
                setSelectedCategory={setSelectedSubCategory}
                placeholder={"Select Sub Category"}
                categories={subCategories}
                name={"subCategoryId"}
                error={error}
              />
              <div className="w-full h-auto rounded-[18px] bg-white flex flex-col  justify-start items-start gap-5 ">
                <div className="w-full flex justify-between items-center">
                  <h1 className="text-[24px] font-medium leading-[36px]">
                    Pickup Address
                  </h1>
                </div>

                <CsvProductInput
                  type={"text"}
                  id={"pickupAddress"}
                  name={"pickupAddress"}
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                  label={"Same as profile"}
                  placeholder={"ABCD, 12345, Street 2, Florida, USA"}
                  error={error}
                />
                <div className="w-full h-[175px] rounded-[16px]">
                  <GoogleMaps address={address} setAddress={setUserInput} />
                </div>
              </div>
            </div>
            <div
              className={`w-full h-auto  rounded-[18px] bg-white flex flex-col p-5 justify-start items-start gap-5 `}
            >
              <h1 className="text-[24px] font-medium leading-[36px]">
                Upload Image
              </h1>
              <CsvDragDropImage cover={cover} setCover={setCover} />

              <div className="w-full h-auto rounded-[18px] bg-white flex flex-col  justify-start items-start gap-5 ">
                <h1 className="text-[24px] font-medium leading-[36px]">
                  Price & Stock
                </h1>
                <div className="w-full grid grid-cols-2 gap-3">
                  <CsvProductInput
                    type={"text"}
                    id={"pricePerHour"}
                    name={"pricePerHour"}
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(e.target.value)}
                    label={"Hourly Price"}
                    placeholder={"Enter Hourly Price"}
                    error={error}
                  />
                  <CsvProductInput
                    type={"text"}
                    id={"pricePerDay"}
                    name={"pricePerDay"}
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(e.target.value)}
                    label={"Daily Price"}
                    placeholder={"Enter Daily Price"}
                    error={error}
                  />
                </div>
                <CsvProductInput
                  type={"text"}
                  id={"quantity"}
                  name={"quantity"}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  label={"Stock"}
                  placeholder={"Enter Stock"}
                  error={error}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CsvProductContainer;
