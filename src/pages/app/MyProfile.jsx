import React, { useEffect, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "../../axios";
import { ErrorToast } from "../../components/global/Toaster";
import Cookies from "js-cookie";

const MyProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const store = Cookies.get("store") ? JSON.parse(Cookies.get("store")) : null;

  const getProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/store/${store?._id}`);

      if (response?.data?.success) {
        setProfile(response?.data?.data);
        Cookies.set("store", JSON.stringify(response?.data?.data));
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);
  return (
    <div className="w-full h-full  flex flex-col gap-6  py-4 px-2 lg:px-6 justify-start items-start ">
      <div className="w-full h-auto flex flex-col gap-3 justify-start items-start">
        <div className="w-full relative flex justify-between items-center">
          <div className="w-full h-auto flex flex-col justify-start items-start ">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-[14px] flex gap-[0.5px] items-center font-normal leading-[21px] text-[#202224] "
            >
              <MdKeyboardBackspace className="text-lg" />
              <span>Back</span>
            </button>
            <span className="text-[32px] font-bold leading-[48px] text-[#202224]">
              Profile
            </span>
          </div>
          <div className="w-auto flex justify-start items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`/profile/update`, { state: profile })}
              className="w-[150px] h-[49px] rounded-[8px] bg-[#F85E00] text-white flex gap-2 items-center justify-center"
            >
              <span className="text-[14px] font-normal leading-[21px] ">
                Edit Profile
              </span>
              {/* {loading && <FiLoader className="animate-spin text-lg " />} */}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full h-auto rounded-[18px] border border-gray-300 bg-white flex flex-col justify-start items-start">
        <div className="w-full h-[204px] rounded-t-[18px] relative">
          <img
            src={
              profile?.coverPicture ||
              "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
            }
            alt=""
            className="w-full h-full rounded-t-[18px] bg-gray-200 object-contain"
          />
          <span className="w-[90px] lg:w-[144px] h-[90px] lg:h-[144px] absolute -bottom-11 left-2 lg:left-8 bg-white rounded-full border border-[#F85E00] flex items-center justify-center">
            <img
              src={
                profile?.profilePicture ||
                "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
              }
              alt=""
              className="w-[80px] lg:w-[132px] h-[80px] lg:h-[132px] rounded-full bg-gray-200 object-contain"
            />
          </span>

          <span className="text-[18px] lg:text-[24px] font-semibold absolute bottom-2 backdrop-blur-md left-28 lg:left-48 lg:leading-[36px] text-white">
            {profile?.name || "N/A"}
          </span>
        </div>

        <div className="w-full h-auto p-6 mt-10 flex flex-col justify-start items-start">
          <div className="w-full flex flex-col items-start justify-start gap-1">
            <h2 className="text-[16px] font-normal leading-[24px]">
              Store Description
            </h2>
            <p className="text-[16px] font-normal leading-[23px] text-[#939393]">
              {profile?.description || "N/A"}
            </p>
          </div>

          <span className="w-full my-4 h-[0.5px] max-h-[1.5px] bg-[#d4d4d4] rounded-full"></span>

          <div className="w-full grid grid-cols-1 lg:grid-cols-6 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-[#d4d4d4] items-start">
            <div className="w-full h-full flex flex-col gap-1 justify-start items-start">
              <span className="text-[14px] font-normal leading-[24px]">
                Full Name
              </span>
              <span className="text-[14px] font-normal text-[#818181] leading-[23px]">
                {profile?.name || "N/A"}
              </span>
            </div>

            <div className="w-full h-full flex flex-col lg:pl-6 gap-1 justify-start items-start">
              <span className="text-[14px] font-normal leading-[24px]">
                Email Address
              </span>
              <span className="text-[14px] font-normal text-[#818181] leading-[23px]">
                {profile?.email || "N/A"}
              </span>
            </div>

            <div className="w-full h-full flex flex-col lg:pl-6 gap-1 justify-start items-start">
              <span className="text-[14px] font-normal leading-[24px]">
                Phone Number
              </span>
              <span className="text-[14px] font-normal text-[#818181] leading-[23px]">
                {profile?.phone || "N/A"}
              </span>
            </div>

            <div className="w-full h-full flex flex-col lg:pl-6 gap-1 justify-start items-start">
              <span className="text-[14px] font-normal leading-[24px]">
                State
              </span>
              <span className="text-[14px] font-normal text-[#818181] leading-[23px]">
                {profile?.state || "N/A"}
              </span>
            </div>
            <div className="w-full h-full flex flex-col lg:pl-6 gap-1 justify-start items-start">
              <span className="text-[14px] font-normal leading-[24px]">
                City
              </span>
              <span className="text-[14px] font-normal text-[#818181] leading-[23px]">
                {profile?.city || "N/A"}
              </span>
            </div>

            <div className="w-full h-full flex flex-col lg:pl-6 gap-1 justify-start items-start">
              <span className="text-[14px] font-normal leading-[24px]">
                Address
              </span>
              <span className="text-[14px] font-normal text-[#818181] leading-[23px]">
                {profile?.address || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
