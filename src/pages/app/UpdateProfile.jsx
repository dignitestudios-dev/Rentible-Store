import React, { useContext, useEffect, useState } from "react";
import {
  BigCameraIcon,
  CameraIcon,
  OrangeLogo,
  USFlag,
} from "../../assets/export";
import { RxCaretDown } from "react-icons/rx";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { data } from "../../constants/cities";
import { useFormik } from "formik";
import { completeProfileValues } from "../../data/completeProfile";
import { completeProfileSchema } from "../../schema/completeProfileSchema";
import axios from "../../axios";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import { FiLoader } from "react-icons/fi";
import GoogleMaps from "../../components/onboarding/GoogleMaps";
import { AppContext } from "../../context/AppContext";
import { updateProfileValues } from "../../data/updateProfile";
import { updateProfileSchema } from "../../schema/updateProfileSchema";
import EditProfileModal from "../../components/app/profile/EditProfileModal";
import { BsCamera } from "react-icons/bs";

const UpdateProfile = () => {
  const location = useLocation();
  const profile = location.state;
  console.log(profile);
  const {
    userInput,
    setUserInput,
    latitude,
    setLatitude,
    setLongitude,
    longitude,
  } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [coverImage, setCoverImage] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState(null);

  const [logo, setLogo] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);

  const handleLogoClick = (e) => {
    e.preventDefault();
    document.getElementById("profilePicture").click();
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setLogo(file);
    }
  };

  const handleCoverClick = (e) => {
    e.preventDefault();
    document.getElementById("cover").click();
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setCoverImage(file);
    }
  };

  const getCoordinates = async (address) => {
    const API_KEY = import.meta.env.VITE_APP_GMAPS_KEY; // Replace with your Google Maps API key
    const formattedAddress = encodeURIComponent(address); // Encode the address
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;
        console.log("Latitude:", lat, "Longitude:", lng);
        return [lat, lng];
      } else if (data.status === "ZERO_RESULTS") {
        ErrorToast("Invalid address: No results found.");
        return null;
      } else {
        ErrorToast(
          "Error:",
          data.status,
          data.error_message || "Unknown error."
        );
        return null;
      }
    } catch (error) {
      ErrorToast("Error fetching geolocation:", error);
      return null;
    }
  };

  const [open, setOpen] = useState(false);

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: updateProfileValues,
      validationSchema: updateProfileSchema,
      validateOnChange: true,
      validateOnBlur: false,

      onSubmit: async (values, action) => {
        try {
          setLoading(true);

          if (latitude !== null && longitude !== null) {
            const coordinates = [latitude, longitude];
            const formdata = new FormData();

            formdata.append("description", values?.description);
            formdata.append("name", values?.name);

            formdata.append("address", values?.address);
            formdata.append("city", values?.city);
            formdata.append("country", "USA");
            formdata.append("state", values?.state);
            formdata.append("zipCode", values?.zipCode);
            coverImage && formdata.append("cover", coverImage);
            logo && formdata.append("profilePicture", logo);
            formdata.append("latitude", latitude);
            formdata.append("longitude", longitude);

            formdata.append("apartment", values?.apartment);

            // API call to login using Axios interceptor
            const response = await axios.put(`/store`, formdata);

            if (response?.data?.success) {
              setUserInput("");
              setLatitude(0);
              setLongitude(0);
              setOpen(true);
              setLoading(false);
            }
          } else {
            ErrorToast("Please input a valid address.");
            return;
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
    values.address = userInput;
  }, [userInput]);

  useEffect(() => {
    values.city = profile?.city;
    values.name = profile?.name;
    values.state = profile?.state;
    values.address = profile?.address;
    values.zipCode = profile?.zipCode;
    values.description = profile?.description;
    values.apartment = profile?.apartment;
    values.cover = profile?.coverPicture;
    values.profilePicture = profile?.profilePicture;
    setCoverImageUrl(profile?.coverPicture);
    setLogoUrl(profile?.profilePicture);
    setUserInput(profile?.address);
  }, []);

  return (
    <div className="w-full h-auto flex justify-start items-start p-2 lg:p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full h-auto rounded-[20px] p-6 flex flex-col items-center border border-gray-300 justify-start bg-white"
      >
        <div className="w-auto flex flex-col mt-4 justify-center items-center">
          <h2 className="text-[32px] text-center font-bold lg:leading-[48px]">
            Update Profile Details
          </h2>
          <p className="text-[18px] font-normal text-center leading-[27px] text-[#262626]">
            Please complete details to access all features
          </p>
        </div>

        <div className="w-full mt-8 flex flex-col lg:flex-row justify-center gap-8 items-start">
          <EditProfileModal
            isOpen={open}
            onRequestClose={() => setOpen(false)}
            onConfirm={() => {
              navigate("/profile");
              setOpen(false);
            }}
          />
          <div className="w-full lg:w-[350px] h-auto  flex flex-col justify-start items-start gap-4">
            <div className="w-full h-[126px]  relative rounded-[18px]">
              <div
                onClick={handleCoverClick}
                className="w-full h-[63px] border-[0.8px] relative flex justify-end p-2 items-end bg-[#FBFBFB] border-[#D9D9D9] rounded-t-[18px] "
              >
                {coverImageUrl ? (
                  <>
                    <img
                      src={coverImageUrl}
                      className="w-full h-full object-scale-down rounded-t-[18px]"
                    />
                    <div className="w-auto absolute bottom-2 right-2  cursor-pointer flex justify-start items-center gap-1">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-orange-500">
                        <BsCamera className="text-white text-md" />
                      </span>
                      {/* <p className="text-xs font-medium ">Update Cover Image</p> */}
                    </div>
                  </>
                ) : (
                  <div className="w-auto  cursor-pointer flex justify-start items-center gap-1">
                    <img src={CameraIcon} alt="camera_icon" />
                    <p className="text-xs font-medium ">Add Cover Image</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                id="cover"
                name="cover"
                accept="image/*"
                className="hidden"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleCoverChange(e);
                  handleChange(e);
                }}
              />
              {errors.cover && touched.cover ? (
                <p className="text-red-700 text-xs w-full flex border-x-[0.8px] border-[#D9D9D9] justify-end mr-1 bg-transparent font-medium">
                  {errors.cover}
                </p>
              ) : null}
              <button
                type="button"
                onClick={handleLogoClick}
                className="w-[86px] h-[86px] bg-[#FBFBFB] flex items-center justify-center absolute top-[20px] left-4 border-[0.8px] border-[#D9D9D9] rounded-full"
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    className="w-full h-full object-scale-down rounded-full"
                  />
                ) : (
                  <img
                    src={BigCameraIcon}
                    alt="camera_icon"
                    className="w-[26.17px]"
                  />
                )}
              </button>
              {errors.profilePicture && touched.profilePicture ? (
                <p className="text-red-700 text-xs w-full flex border-x-[0.8px] border-[#D9D9D9] justify-end mr-1 bg-transparent font-medium">
                  {errors.profilePicture}
                </p>
              ) : null}
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                accept="image/*"
                className="hidden"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleLogoChange(e);
                  handleChange(e);
                }}
              />
              {!errors?.profilePicture && !errors?.cover && (
                <div className="w-full h-[43px] border-x-[0.8px] flex justify-end  items-center  border-[#D9D9D9]  ">
                  <div className="w-full pl-28  cursor-pointer flex justify-start items-center gap-1">
                    <img src={CameraIcon} alt="camera_icon" />
                    <p className="text-xs font-medium ">
                      Update Profile Picture
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full h-auto grid grid-cols-2 gap-2 justify-start items-start">
              <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full h-[49px] border-[0.8px] bg-[#F8F8F899] outline-none  rounded-[8px] placeholder:text-[#959393] text-[#262626] px-3 text-[16px] font-normal leading-[20.4px] ${
                    errors?.name && touched?.name
                      ? "border-red-500"
                      : "border-[#D9D9D9]"
                  }`}
                  placeholder="Store Name"
                />

                {errors.name && touched.name ? (
                  <p className="text-red-700 text-sm font-medium">
                    {errors.name}
                  </p>
                ) : null}
              </div>
              <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
                <input
                  type="text"
                  id="email"
                  name="email"
                  disabled
                  value={profile?.email}
                  className={`w-full h-[49px] border-[0.8px] bg-[#E0E0E0] outline-none  rounded-[8px] placeholder:text-[#959393] text-[#262626] px-3 text-[16px] font-normal leading-[20.4px] border-[#D9D9D9]
                  `}
                  placeholder="Store Email Address"
                />
              </div>
            </div>

            <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
              <div className="h-[49px] flex justify-start gap-2  items-start w-full relative ">
                <span
                  className={`w-[20%]  bg-[#E0E0E0] border-[0.8px]    border-[#D9D9D9]
                  } rounded-[8px] h-full   text-md text-[#959393] flex items-center justify-center`}
                >
                  <img src={USFlag} alt="us_phone_number" />
                  <span className="ml-[3px]">+1</span>
                </span>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={profile?.phone?.slice(1)}
                  disabled
                  maxLength={10}
                  className={`w-full h-[49px] border-[0.8px] bg-[#E0E0E0] outline-none  rounded-[8px] placeholder:text-[#959393] text-[#262626] px-3 text-[16px] font-normal leading-[20.4px] border-[#D9D9D9]
                  `}
                  placeholder="Phone Number"
                />
              </div>
            </div>
          </div>

          <span className="lg:h-[261px] w-full h-[1px] lg:w-[1px] bg-[#0000001F] rounded-full"></span>
          <div className="w-full lg:w-[350px] h-auto flex flex-col justify-start items-start gap-4">
            <div className="w-full h-auto grid grid-cols-2 gap-4 justify-start items-start">
              <div className="h-[49px] flex justify-start bg-[#F8F8F899] border-[0.8px] border-[#D9D9D9] items-start w-full relative  rounded-[8px]">
                <input
                  type="text"
                  disabled
                  value={"USA"}
                  className="w-[80%] h-full   bg-transparent rounded-[8px] placeholder:text-[#959393] outline-none text-[#262626] px-3 text-[16px] font-normal leading-[20.4px]"
                  placeholder="USA"
                />
                <span className="w-[20%] flex items-center justify-start h-full">
                  <img
                    src="/united-states.png"
                    alt=""
                    className="w-[70%] rounded-md"
                  />
                </span>
              </div>
              <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
                <div className="h-[49px] flex justify-start bg-[#F8F8F899] items-start w-full relative  rounded-[8px]">
                  <select
                    id="state"
                    name="state"
                    onChange={(e) => {
                      values.city = "";
                      setUserInput(`${e.target.value}, USA`);
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    className="w-full border-[0.8px] border-[#D9D9D9] h-full  bg-transparent rounded-[8px] placeholder:text-[#959393] outline-none text-[#262626] px-3 text-[16px] font-normal leading-[20.4px]"
                    placeholder="State"
                  >
                    {" "}
                    {values?.state !== "" && (
                      <option selected value={values.state}>
                        {values.state}
                      </option>
                    )}
                    <option value={""}>--Select State--</option>
                    {Object.keys(data).map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {/* <button className="w-[15%] h-full rounded-r-[8px]  text-md text-[#959393] flex items-center justify-start">
                <RxCaretDown />
              </button> */}
                </div>
                {errors.state && touched.state ? (
                  <p className="text-red-700 text-xs font-medium">
                    {errors.state}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="w-full h-auto grid grid-cols-2 gap-4 justify-start items-start">
              <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
                <div className="h-[49px] flex justify-start bg-[#F8F8F899] items-start w-full relative  rounded-[8px]">
                  <select
                    id="city"
                    name="city"
                    onChange={(e) => {
                      handleChange(e);
                      setUserInput(`${e.target.value},${values?.state}, USA`);
                    }}
                    onBlur={handleBlur}
                    className="w-full border-[0.8px] border-[#D9D9D9] h-full  bg-transparent rounded-[8px] placeholder:text-[#959393] outline-none text-[#262626] px-3 text-[16px] font-normal leading-[20.4px]"
                    placeholder="City"
                  >
                    {" "}
                    {values?.city !== "" && (
                      <option selected value={values.city}>
                        {values.city}
                      </option>
                    )}
                    <option value={""}>--Select City--</option>
                    {values.state &&
                      data[values.state].map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                  </select>
                  {/* <button className="w-[15%] h-full rounded-r-[8px]  text-md text-[#959393] flex items-center justify-start">
                <RxCaretDown />
              </button> */}
                </div>
                {errors.city && touched.city ? (
                  <p className="text-red-700 text-xs font-medium">
                    {errors.city}
                  </p>
                ) : null}
              </div>
              <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
                <div className="h-[49px] flex justify-start bg-[#F8F8F899] items-start w-full relative rounded-[8px]">
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={values.zipCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full h-full border-[0.8px] bg-[#F8F8F899] outline-none  rounded-[8px] placeholder:text-[#959393] text-[#262626] px-3 text-[16px] font-normal leading-[20.4px] ${
                      errors?.zipCode && touched?.zipCode
                        ? "border-red-500"
                        : "border-[#D9D9D9]"
                    }`}
                    placeholder="Zip Code"
                    maxLength={5}
                  />
                </div>
                {errors.zipCode && touched.zipCode ? (
                  <p className="text-red-700 text-xs font-medium">
                    {errors.zipCode}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
              <textarea
                id="description"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full h-32 bg-[#F8F8F899] border-[0.8px] outline-none rounded-[8px] placeholder:text-[#959393] text-[#262626] p-3 text-[16px] font-normal leading-[20.4px] resize-none ${
                  errors?.description && touched?.description
                    ? "border-red-500"
                    : "border-[#D9D9D9]"
                }`}
                placeholder="Store Description"
              ></textarea>
              {errors.description && touched.description ? (
                <p className="text-red-700 text-xs font-medium">
                  {errors.description}
                </p>
              ) : null}
            </div>
          </div>
          <span className="lg:h-[261px] w-full h-[1px] lg:w-[1px] bg-[#0000001F] rounded-full"></span>

          <div className="w-full lg:w-[350px] h-auto flex flex-col justify-start items-start gap-4">
            <div className="w-full grid grid-cols-3 gap-2 justify-start items-start">
              <div className="w-full col-span-2 h-auto flex flex-col justify-start items-start gap-1">
                <div className="h-[49px] flex justify-start bg-[#F8F8F899] items-start w-full relative rounded-[8px]">
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={values.address}
                    onChange={(e) => {
                      handleChange(e);
                      setUserInput(e.target.value);
                    }}
                    onBlur={handleBlur}
                    className={`w-full h-full border-[0.8px] bg-[#F8F8F899] outline-none  rounded-[8px] placeholder:text-[#959393] text-[#262626] px-3 text-[16px] font-normal leading-[20.4px] ${
                      errors?.address && touched?.address
                        ? "border-red-500"
                        : "border-[#D9D9D9]"
                    }`}
                    placeholder="Street Address"
                  />
                </div>
                {errors.address && touched.address ? (
                  <p className="text-red-700 text-xs font-medium">
                    {errors.address}
                  </p>
                ) : null}
              </div>

              <div className="w-full col-span-1 h-auto flex flex-col justify-start items-start gap-1">
                <div className="h-[49px] flex justify-start bg-[#F8F8F899] items-start w-full relative rounded-[8px]">
                  <input
                    type="text"
                    id="apartment"
                    name="apartment"
                    value={values.apartment}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    className={`w-full h-full border-[0.8px]  bg-[#F8F8F899] outline-none  rounded-[8px] placeholder:text-[#959393] text-[#262626] px-3 text-[16px] font-normal leading-[20.4px] ${
                      errors?.apartment && touched?.apartment
                        ? "border-red-500"
                        : "border-[#D9D9D9]"
                    }`}
                    placeholder="Apt#"
                  />
                </div>
                {errors.apartment && touched.apartment ? (
                  <p className="text-red-700 text-xs font-medium">
                    {errors.apartment}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="w-full h-48 flex flex-col gap-1 justify-start items-start">
              <GoogleMaps state={values.state} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-[322px] h-[49px] rounded-[8px] mt-8 bg-[#F85E00] text-white flex gap-2 items-center justify-center text-md font-medium"
        >
          <span>Update Profile</span>
          {loading && <FiLoader className="animate-spin text-lg " />}
        </button>

        <Link
          to={-1}
          className="text-sm font-medium text-black hover:no-underline hover:text-black mt-5 flex items-center justify-center"
        >
          <IoIosArrowRoundBack className="text-[28px]" />
          <span>Back</span>
        </Link>
      </form>
    </div>
  );
};

export default UpdateProfile;
