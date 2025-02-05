import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "../../axios";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import { MdKeyboardBackspace } from "react-icons/md";
import { FiLoader } from "react-icons/fi";
import { Swiper } from "swiper/react";
import { SwiperSlide } from "swiper/react";
import {
  convertEpochTo12HourFormat,
  convertEpochToMMDDYYYY,
  formatDateToMMDDYYYY,
  formatEpochToMMDDYYYY,
  formatPhoneNumberInput,
  getDetailedStatusClasses,
  getStatusClasses,
  isTimeRemaining,
} from "../../utils/helper";
import DeleteProductConfirm from "../../components/app/products/DeleteProductConfirm";
import { AppContext } from "../../context/AppContext";
import StarRating from "../../components/app/products/StarRating";
import RentalCancelConfirm from "../../components/app/rental_tracking/RentalCancelConfirm";
import RentalCancelReason from "../../components/app/rental_tracking/RentalCancelReason";
import RentalCancelled from "../../components/app/rental_tracking/RentalCancelled";
import Timer from "../../components/app/rental_tracking/Timer";
import ProductDeliveredModal from "../../components/app/rental_tracking/ProductDeliveredModal";
import DeliverQRModal from "../../components/app/rental_tracking/DeliverQRModal";
import ProductReturnedModal from "../../components/app/rental_tracking/ProductReturnedModal";
import ReturnedQRModal from "../../components/app/rental_tracking/ReturnedQRModal";
import { FaStar } from "react-icons/fa6";
import AdjustBookingPopup from "../../components/app/rental_tracking/AdjustBookingPopup";
import ReviewReportConfirm from "../../components/app/rental_tracking/ReviewReportConfirm";
import ReviewReportReasons from "../../components/app/rental_tracking/ReviewReportReasons";
import ReviewReported from "../../components/app/rental_tracking/ReviewReported";
import NotReadyModal from "../../components/app/rental_tracking/NotReadyModal";
import ContractModal from "../../components/app/rental_tracking/ContractModal";

const RentalDetails = () => {
  const navigate = useNavigate();
  const { uid, setUid } = useContext(AppContext);

  const [update, setUpdate] = useState(false);
  const location = useLocation();
  const [rental, setRental] = useState(null); // Updated variable name to camelCase
  const [loading, setLoading] = useState(false);
  // const store = JSON.parse(Cookies.get("store"));
  const { id } = useParams();
  const [isPopupShown, setIsPopupShown] = useState(false);

  const getRental = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/booking/${id}`);
      console.log("🚀 ~  ~ data:", data);
      setRental(data?.data); // Store the actual data from the response
      setIsPopupShown(
        data?.data?.isPopupShown == false && data?.data?.status == "completed"
          ? true
          : false
      );
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getRental();
  }, [update]);

  const allImages = rental?.product?.cover
    ? [rental?.product?.cover, ...rental?.product?.images]
    : rental?.product?.images;

  const coverIndex = allImages?.findIndex(
    (element) => element === rental?.product?.cover
  );

  const [index, setIndex] = useState(coverIndex);

  useEffect(() => {
    setIndex(coverIndex);
  }, [rental]);

  const [active, setActive] = useState(rental?.product?.isActive);

  const [cancelling, setCancelling] = useState(false);
  const [selectedReason, setSelectedReason] = useState("djdj dhdnddh");
  const [reasons, setReasons] = useState([]);
  const [openCancelConfirm, setOpenCancelConfirm] = useState(false);
  const [openCancelReason, setOpenCancelReason] = useState(false);
  const [openCancelled, setOpenCancelled] = useState(false);

  const cancelBooking = async () => {
    try {
      setCancelling(true);
      const response = await axios.post("/booking/reject", {
        id: rental?._id,
        cancellationReason: selectedReason?.title,
      });
      if (response?.data?.success) {
        setOpenCancelReason(false);
        setUpdate((prev) => !prev);
        setOpenCancelled(true);
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
    } finally {
      // test
      setCancelling(false);
    }
  };

  //   Delivery functions:
  const [openDelivered, setOpenDelivered] = useState(false);
  const [openQrDeliver, setOpenQrDeliver] = useState(false);
  const [booking, setBooking] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const checkStatus = async () => {
    try {
      setStatusLoading(true);
      const { data } = await axios.get(`/booking/${id}`);
      return data?.data?.status;
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
      console.log("Error:", error);
    } finally {
      setStatusLoading(false);
    }
  };

  const [skipping, setSkipping] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const adjustBooking = async (bool) => {
    try {
      bool ? setConfirming(true) : setSkipping(true);
      const response = await axios.post(`/booking/damage`, {
        bookingId: rental?._id,
        adjustBooking: bool,
      });

      if (response?.data?.success) {
        setIsPopupShown(false);
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
      console.log("Error:", error);
    } finally {
      bool ? setConfirming(false) : setSkipping(false);
    }
  };

  //   const recieve:
  const [openReturned, setOpenReturned] = useState(false);
  const [openQrReturned, setOpenQrReturned] = useState(false);

  const confirmDeliver = async () => {
    if ((await checkStatus()) == "in-progress") {
      setOpenDelivered(true);
      setOpenQrDeliver(false);
      setUpdate((prev) => !prev);
    } else {
      ErrorToast("Product's status not yet updated.");
    }
  };

  const confirmRecieved = async () => {
    if ((await checkStatus()) == "completed") {
      setOpenReturned(true);
      setOpenQrReturned(false);
      setUpdate((prev) => !prev);
    } else {
      ErrorToast("Product's status not yet updated.");
    }
  };

  // Report Review:
  const [reporting, setReporting] = useState(false);
  const [selectedReportReason, setSelectedReportReason] = useState({
    title: "",
    description: "",
  });
  const [reportReasons, setReportReasons] = useState([]);
  const [openReportConfirm, setOpenReportConfirm] = useState(false);
  const [openReportReason, setOpenReportReason] = useState(false);
  const [openReported, setOpenReported] = useState(false);

  const reportReview = async (id) => {
    try {
      setReporting(true);
      const response = await axios.post("/report/", {
        title: selectedReportReason?.title,
        description: selectedReportReason?.description,
        reviewId: id,
      });
      if (response?.data?.success) {
        setOpenReportReason(false);
        setOpenReported(true);
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
    } finally {
      // test
      setReporting(false);
    }
  };

  const [notReady, setNotReady] = useState(false);
  const [openContract, setOpenContract] = useState(false);

  return loading ? (
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
              Rental Tracking Details
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-auto rounded-[18px] bg-white p-5 flex justify-start items-start gap-4 animate-pulse">
        {/* Image Section */}
        <div className="min-w-[337.01px] w-[337.01px] flex flex-col justify-start items-start gap-2">
          <div className="h-[233px] w-full rounded-[18px] bg-gray-200"></div>
          <div className="flex gap-2">
            {Array(4)
              .fill(0)
              .map((_, idx) => (
                <div
                  key={idx}
                  className="w-[70px] h-16 bg-gray-200 rounded-xl"
                ></div>
              ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="w-[calc(100%-337.01px)] py-1 px-2 h-auto flex flex-col justify-start items-start">
          <div className="w-full flex justify-between items-center">
            <div className="w-1/2 h-6 bg-gray-200 rounded"></div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-4 bg-gray-200 rounded"></div>
              <div className="w-[36px] h-[18px] bg-gray-200 rounded-full"></div>
            </div>
          </div>

          <span className="w-full my-2 h-[1.5px] bg-gray-200"></span>

          <div className="w-full flex justify-between items-start">
            {Array(5)
              .fill(0)
              .map((_, idx) => (
                <React.Fragment key={idx}>
                  <div className="w-[22%] h-10 flex flex-col gap-2">
                    <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                    <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                  </div>
                  {idx < 4 && (
                    <div className="w-[3%] h-14 flex items-center justify-start">
                      <span className="w-[1.5px] h-10 bg-gray-200"></span>
                    </div>
                  )}
                </React.Fragment>
              ))}
          </div>

          <span className="w-full my-2 h-[1.5px] bg-gray-200"></span>

          <div className="w-full flex justify-between items-start">
            <div className="w-[35%] h-10 flex flex-col gap-2">
              <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
              <div className="w-full h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-[3%] h-20 flex items-center justify-start">
              <span className="w-[1.5px] h-16 bg-gray-200"></span>
            </div>
            <div className="w-[22%] h-10 flex flex-col gap-2">
              <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
              <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-[3%] h-20 flex items-center justify-start">
              <span className="w-[1.5px] h-16 bg-gray-200"></span>
            </div>
            <div className="w-[35%] h-10 flex flex-col gap-2">
              <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
              <div className="w-full h-4 bg-gray-200 rounded"></div>
            </div>
          </div>

          <span className="w-full my-2 h-[1.5px] bg-gray-200"></span>

          <div className="w-full flex flex-col justify-start items-start gap-2">
            <div className="w-1/4 h-6 bg-gray-200 rounded"></div>
            <div className="w-full h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  ) : rental !== null ? (
    <div className="w-full lg:h-full  flex flex-col gap-6  py-4 px-2 lg:px-6 justify-start items-start ">
      <div className="w-full h-auto flex flex-col gap-3 justify-start items-start">
        <div className="w-full relative flex lg:flex-row flex-col justify-between items-center">
          <div className="w-full h-auto flex flex-col justify-start items-start ">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-[14px] flex gap-[0.5px] items-center font-normal leading-[21px] text-[#202224] "
            >
              <MdKeyboardBackspace className="text-lg" />
              <span>Back</span>
            </button>
            <span className="text-[26px] md:text-[28px] lg:text-[32px] font-bold leading-[48px] text-[#202224]">
              Rental Tracking Details
            </span>
          </div>
          {!["rejected", "completed", "cancelled", "incomplete"].includes(
            rental?.status
          ) && (
            <div className="w-auto flex justify-start items-center gap-3">
              {!["in-progress", "completed", "cancelled"].includes(
                rental?.status
              ) && (
                <button
                  type="button"
                  onClick={() => setOpenCancelConfirm(true)}
                  className="w-[168px] h-[49px] rounded-[8px] flex items-center justify-center text-white bg-[#FF3E46]"
                >
                  <span className="text-[14px] font-normal leading-[21px]">
                    Reject Booking?
                  </span>
                </button>
              )}

              {rental?.status === "pending" ? (
                <div className="w-auto flex flex-col justify-start items-start gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      isTimeRemaining(rental?.pickupTime)
                        ? setNotReady(true)
                        : !rental?.isContractSigned
                        ? setOpenContract(true)
                        : setOpenQrDeliver(true);
                    }}
                    className="w-[150px] h-[49px] rounded-[8px] bg-[#F85E00] disabled:bg-[#464646] text-white flex gap-2 items-center justify-center"
                  >
                    <span className="text-[14px] font-normal leading-[21px]">
                      Mark As Delivered
                    </span>
                  </button>
                </div>
              ) : (
                rental?.status === "in-progress" && (
                  <button
                    type="button"
                    onClick={() => setOpenQrReturned(true)}
                    className="w-[150px] h-[49px] rounded-[8px] bg-[#F85E00] text-white flex gap-2 items-center justify-center"
                  >
                    <span className="text-[14px] font-normal leading-[21px]">
                      Mark As Received
                    </span>
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      <NotReadyModal
        isOpen={notReady}
        onRequestClose={() => setNotReady(false)}
      />

      <ContractModal
        isOpen={openContract}
        onRequestClose={() => setOpenContract(false)}
      />

      <AdjustBookingPopup
        isOpen={isPopupShown}
        onRequestClose={() => setIsPopupShown(false)}
        onConfirm={() => {
          adjustBooking(true);
        }}
        onSkip={() => {
          adjustBooking(false);
        }}
        skipLoading={skipping}
        confirmLoading={confirming}
      />

      <ProductDeliveredModal
        isOpen={openDelivered}
        onRequestClose={() => setOpenDelivered(false)}
        onConfirm={() => {
          setOpenDelivered(false);
        }}
      />

      <DeliverQRModal
        isOpen={openQrDeliver}
        onRequestClose={() => setOpenQrDeliver(false)}
        loading={statusLoading}
        uid={rental?._id}
        onConfirm={() => confirmDeliver()}
      />

      <ProductReturnedModal
        isOpen={openReturned}
        onRequestClose={() => setOpenReturned(false)}
        onConfirm={() => {
          setOpenReturned(false);
        }}
      />

      <ReturnedQRModal
        isOpen={openQrReturned}
        onRequestClose={() => setOpenQrReturned(false)}
        loading={statusLoading}
        uid={rental?._id}
        onConfirm={() => confirmRecieved()}
      />

      <RentalCancelConfirm
        isOpen={openCancelConfirm}
        onRequestClose={() => setOpenCancelConfirm(false)}
        onConfirm={() => {
          setOpenCancelReason(true);
          setOpenCancelConfirm(false);
        }}
      />

      <RentalCancelReason
        isOpen={openCancelReason}
        onRequestClose={() => setOpenCancelReason(false)}
        onConfirm={() => {
          cancelBooking();
        }}
        loading={cancelling}
        setSelectedReason={setSelectedReason}
      />

      <RentalCancelled
        isOpen={openCancelled}
        onRequestClose={() => setOpenCancelled(false)}
        onConfirm={() => {
          setOpenCancelled(false);
        }}
      />

      <div className="w-full flex flex-col gap-4 justify-start items-start rounded-[18px] bg-white p-2 lg:p-5">
        <div className="w-full h-auto  flex lg:flex-row flex-col justify-start items-start gap-4">
          <div className="w-full lg:min-w-[337.01px] lg:w-[337.01px] flex flex-col justify-start items-start gap-2">
            <img
              src={
                allImages[index] ||
                "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
              }
              alt="image-preview"
              className="h-[233px] w-full rounded-[18px] bg-gray-200 border border-gray-300 overflow-hidden object-contain"
            />
            <Swiper
              slidesPerView={4}
              spaceBetween={10}
              className="mySwiper w-full h-20"
            >
              {allImages?.map((preview, index) => (
                <SwiperSlide
                  key={index}
                  onClick={() => setIndex(index)}
                  className="relative w-full h-16 cursor-pointer bg-gray-200 border border-gray-300  rounded-xl"
                >
                  <img
                    src={
                      preview ||
                      "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                    }
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-contain rounded-xl"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="w-full lg:w-[calc(100%-337.01px)] py-1 px-2 h-auto flex flex-col justify-start items-start">
            <div className="w-full flex lg:flex-row flex-col justify-between lg:items-center">
              <div>
                <h1 className="text-[22px] font-semibold leading-[33px] ">
                  {rental?.product?.name || "N/A"}
                </h1>
                <div className="w-auto flex justify-start gap-1  items-center">
                  <StarRating rating={rental?.product?.productReview || 0.0} />
                  <span className="text-[18px] font-semibold text-black leading-[28px]">
                    {rental?.product?.productReview?.toFixed(1) || 0.0}
                  </span>
                  {/* <button onClick={()=>navigate("/pro")}>

                </button> */}
                </div>
              </div>
              <div className="w-auto flex justify-start gap-1  items-center">
                <span
                  className={`w-[91px] h-[30px]  flex items-center justify-center rounded-md ${getDetailedStatusClasses(
                    rental?.status
                  )} `}
                >
                  <span className={`text-[13px] capitalize  font-normal`}>
                    {rental?.status}
                  </span>
                </span>

                {![
                  "completed",
                  "cancelled",
                  "incomplete",
                  "rejected",
                  "pending",
                ].includes(rental?.status) && (
                  <Timer dropOffEpoch={rental?.dropOffTime} />
                )}
              </div>
            </div>

            <span className="w-full my-2 h-[0.5px] bg-[#d4d4d4] rounded-full"></span>

            <div className="w-full flex flex-col lg:flex-row justify-between items-start">
              <div className="w-full lg:w-[31%] h-full flex flex-col gap-1 justify-start items-start">
                <span className="text-[14px] font-medium leading-[21px]">
                  Category
                </span>
                <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
                  {rental?.product?.category?.name || "N/A"}
                </span>
              </div>
              <div className="lg:w-[3%] lg:h-14 w-full h-1 flex items-center justify-start">
                <span className="lg:w-[1.5px] lg:h-10 w-full h-[0.5px] rounded-full bg-[#d4d4d4]"></span>
              </div>
              <div className="w-full lg:w-[31%] h-full flex flex-col gap-1 justify-start items-start">
                <span className="text-[14px] font-medium leading-[21px]">
                  Sub Category
                </span>
                <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
                  {rental?.product?.subCategory?.name || "N/A"}
                </span>
              </div>
              {/* <div className="w-[3%] h-14 flex items-center justify-start">
              <span className="w-[1.5px] h-10 rounded-full bg-[#d4d4d4]"></span>
            </div>
            <div className="w-[31%] h-full flex flex-col gap-1 justify-start items-start">
              <span className="text-[14px] font-medium leading-[21px]">
                Available Items
              </span>
              <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
                {rental?.product?.quantity || 0}
              </span>
            </div> */}
              <div className="lg:w-[3%] lg:h-14 w-full h-1 flex items-center justify-start">
                <span className="lg:w-[1.5px] lg:h-10 w-full h-[0.5px] rounded-full bg-[#d4d4d4]"></span>
              </div>
              <div className="w-full lg:w-[31%] h-full flex flex-col gap-1 justify-start items-start">
                <span className="text-[14px] font-medium leading-[21px]">
                  Phone Number
                </span>
                <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
                  {formatPhoneNumberInput(rental?.store?.phone) || "N/A"}
                </span>
              </div>
            </div>
            <span className="w-full my-2 h-[0.5px] bg-[#d4d4d4] rounded-full"></span>

            <div className="w-full flex flex-col lg:flex-row  justify-between items-start">
              <div className="w-full lg:w-[31%] h-full flex flex-col gap-1 justify-start items-start">
                <span className="text-[14px] font-medium leading-[21px]">
                  Order ID
                </span>
                <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
                  {rental?.shortCode || "N/A"}
                </span>
              </div>
              <div className="lg:w-[3%] lg:h-14 w-full h-1 flex items-center justify-start">
                <span className="lg:w-[1.5px] lg:h-10 w-full h-[0.5px] rounded-full bg-[#d4d4d4]"></span>
              </div>
              <div className="w-full lg:w-[31%] h-full flex flex-col gap-1 justify-start items-start">
                <span className="text-[14px] font-medium leading-[21px]">
                  Order Created
                </span>
                <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
                  {formatDateToMMDDYYYY(rental?.createdAt) || "N/A"}
                </span>
              </div>
              {/* <div className="w-[3%] h-14 flex items-center justify-start">
              <span className="w-[1.5px] h-10 rounded-full bg-[#d4d4d4]"></span>
            </div>
            <div className="w-[31%] h-full flex flex-col gap-1 justify-start items-start">
              <span className="text-[14px] font-medium leading-[21px]">
                Available Items
              </span>
              <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
                {rental?.product?.quantity || 0}
              </span>
            </div> */}
              <div className="lg:w-[3%] lg:h-14 w-full h-1 flex items-center justify-start">
                <span className="lg:w-[1.5px] lg:h-10 w-full h-[0.5px] rounded-full bg-[#d4d4d4]"></span>
              </div>
              <div className="w-full lg:w-[31%] h-full flex flex-col gap-1 justify-start items-start">
                <span className="text-[14px] font-medium leading-[21px]">
                  Order Time
                </span>
                <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
                  {convertEpochTo12HourFormat(rental?.bookingDate) || "N/A"}
                </span>
              </div>
            </div>

            <span className="w-full my-2 h-[0.5px] bg-[#d4d4d4] rounded-full"></span>
            <div className="w-full flex flex-col lg:flex-row justify-between items-start">
              <div className="w-full lg:w-[22%] h-full flex flex-col gap-1 justify-start items-start">
                <span className="text-[14px] font-medium leading-[21px]">
                  Pickup Location
                </span>
                <div className="w-auto flex gap-1 justify-start items-start">
                  <img
                    src="/map_pin.png"
                    alt="address_marker_pin"
                    className="w-[9.29px] mt-1"
                  />

                  <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
                    {rental?.pickupAddress || "N/A"}
                  </span>
                </div>
              </div>

              <div className="lg:w-[3%] lg:h-14 w-full h-1 flex items-center justify-start">
                <span className="lg:w-[1.5px] lg:h-10 w-full h-[0.5px] rounded-full bg-[#d4d4d4]"></span>
              </div>
              <div className="w-full lg:w-[22%] h-full flex flex-col gap-1 justify-start items-start">
                <span className="text-[14px] font-medium leading-[21px]">
                  Date
                </span>
                <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
                  Picked Up:{" "}
                  {convertEpochToMMDDYYYY(rental?.pickupTime) || "N/A"}
                </span>
                <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
                  Dropped Rental:{" "}
                  {convertEpochToMMDDYYYY(rental?.dropOffTime) || "N/A"}
                </span>
              </div>
              <div className="lg:w-[3%] lg:h-14 w-full h-1 flex items-center justify-start">
                <span className="lg:w-[1.5px] lg:h-10 w-full h-[0.5px] rounded-full bg-[#d4d4d4]"></span>
              </div>

              <div className="w-full lg:w-[22%] h-full flex flex-col gap-1 justify-start items-start">
                <span className="text-[14px] font-medium leading-[21px]">
                  Duration
                </span>
                <span className="text-[12px] font-normal text-[#000] leading-[18px]">
                  {rental?.duration}{" "}
                  <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
                    {convertEpochTo12HourFormat(rental?.pickupTime) +
                      "-" +
                      convertEpochTo12HourFormat(rental?.dropOffTime)}
                  </span>
                </span>
                <span className="text-[12px] font-medium text-[#000] leading-[18px]">
                  ${rental?.totalAmount}
                </span>
              </div>
              <div className="lg:w-[3%] lg:h-14 w-full h-1 flex items-center justify-start">
                <span className="lg:w-[1.5px] lg:h-10 w-full h-[0.5px] rounded-full bg-[#d4d4d4]"></span>
              </div>

              <div className="w-full lg:w-[22%] h-full flex flex-col gap-1 justify-start items-start">
                <span className="text-[14px] font-medium leading-[21px]">
                  Customer Profile
                </span>
                <span className="w-full text-[12px] font-normal text-[#818181] leading-[18px]">
                  <span className="w-full  flex items-center gap-2 justify-between h-full ">
                    <div className="w-auto flex items-center justify-start gap-2">
                      <span className="w-[44px] h-[44px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                        <img
                          src={
                            rental?.customer?.profilePicture ||
                            "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                          }
                          alt="store_image"
                          className="w-[38px] h-[38px] rounded-full"
                        />
                      </span>
                      <span className="text-[13px] font-normal">
                        {rental?.customer?.name || "N/A"}
                      </span>
                    </div>

                    {![
                      "rejected",
                      "completed",
                      "cancelled",
                      "incomplete",
                    ].includes(rental?.status) && (
                      <button
                        onClick={() => {
                          navigate("/messages");
                          localStorage.setItem("activeLink", "Messages");
                          setUid(customer?.chatId);
                        }}
                        className="w-[31px] h-[31px] flex items-center justify-center"
                      >
                        <img
                          src="/chat-icon.png"
                          alt="Chat Icon"
                          className="w-full h-full"
                        />
                      </button>
                    )}
                  </span>
                </span>
              </div>
            </div>

            <span className="w-full my-2 h-[1.5px] bg-[#d4d4d4] rounded-full"></span>

            <div className="w-full flex flex-col justify-start items-start gap-2">
              <h1 className="text-[22px] font-semibold leading-[33px] ">
                Biography
              </h1>
              <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
                {rental?.product?.description || "N/A"}
              </span>
            </div>

            {/* {JSON.stringify(product)} */}
          </div>
        </div>

        {(rental?.status == "in-progress" ||
          rental?.detail?.pickupImages?.length > 0 ||
          rental?.detail?.pickupVideos?.length > 0) && (
          <>
            <span className="w-full my-2 h-[1.5px] bg-[#d4d4d4] rounded-full"></span>

            <div className="w-full h-auto flex flex-col justify-start items-start gap-3">
              <h1 className="text-[22px] font-semibold leading-[33px] ">
                Pickup Evidence
              </h1>

              <div className="w-full h-auto">
                <Swiper
                  slidesPerView={3}
                  spaceBetween={10}
                  className="mySwiper w-full h-[275px]"
                >
                  {rental?.detail?.pickupImages?.map((preview, index) => (
                    <SwiperSlide
                      key={index}
                      className="relative w-full h-[275px] cursor-pointer bg-gray-200 border border-gray-300  rounded-xl"
                    >
                      <img
                        src={
                          preview ||
                          "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                        }
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </SwiperSlide>
                  ))}

                  {rental?.detail?.pickupVideos?.map((preview, index) => (
                    <SwiperSlide
                      key={index}
                      className="relative w-full h-[275px] cursor-pointer bg-gray-200 border border-gray-300  rounded-xl"
                    >
                      <video
                        src={
                          preview ||
                          "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                        }
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-contain rounded-xl"
                        controls
                      ></video>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </>
        )}

        {(rental?.status == "completed" ||
          rental?.detail?.dropOffImages?.length > 0 ||
          rental?.detail?.dropOffVideos?.length > 0) && (
          <>
            <span className="w-full my-2 h-[1.5px] bg-[#d4d4d4] rounded-full"></span>

            <div className="w-full h-auto flex flex-col justify-start items-start gap-3">
              <h1 className="text-[22px] font-semibold leading-[33px] ">
                Drop Off Evidence
              </h1>

              <div className="w-full h-auto">
                <Swiper
                  slidesPerView={3}
                  spaceBetween={10}
                  className="mySwiper w-full h-[275px]"
                >
                  {rental?.detail?.dropOffImages?.map((preview, index) => (
                    <SwiperSlide
                      key={index}
                      className="relative w-full h-[275px] cursor-pointer bg-gray-200 border border-gray-300  rounded-xl"
                    >
                      <img
                        src={
                          preview ||
                          "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                        }
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </SwiperSlide>
                  ))}

                  {rental?.detail?.dropOffVideos?.map((preview, index) => (
                    <SwiperSlide
                      key={index}
                      className="relative w-full h-[275px] cursor-pointer bg-gray-200 border border-gray-300  rounded-xl"
                    >
                      <video
                        src={
                          preview ||
                          "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                        }
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-contain rounded-xl"
                        controls
                      ></video>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </>
        )}

        {rental?.review && (
          <>
            <span className="w-full my-2 h-[1.5px] bg-[#d4d4d4] rounded-full"></span>

            <div className="w-full h-auto flex flex-col justify-start items-start gap-3">
              <h1 className="text-[22px] font-semibold leading-[33px] ">
                Client Feedback
              </h1>

              <div className="w-full h-auto flex flex-col justify-start items-starts">
                <div className="w-full flex justify-between items-center">
                  <span className="w-full  flex items-center gap-2 justify-between h-full ">
                    <div className="w-auto flex items-center justify-start gap-2">
                      <span className="w-[66px] h-[66px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                        <img
                          src={
                            rental?.review?.user?.profilePicture ||
                            "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                          }
                          alt="store_image"
                          className="w-[56px] h-[56px] rounded-full"
                        />
                      </span>

                      <div className="w-auto flex flex-col justify-start items-start">
                        <span className="text-[20px] font-semibold leading-[26px]">
                          {rental?.review?.user?.name || "N/A"}
                        </span>

                        <div className="w-auto flex  justify-start items-center gap-1">
                          <FaStar className="text-xl text-yellow-500" />
                          <span className="text-[18px] font-semibold text-black leading-[28px]">
                            {rental?.review?.stars?.toFixed(1) || 0.0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </span>

                  <button
                    type="button"
                    onClick={() => setOpenReportConfirm(true)}
                    className="w-[144px] h-[40px] rounded-[8px] bg-[#F85E00] text-white flex gap-2 items-center justify-center"
                  >
                    <span className="text-[14px] font-normal leading-[21px] ">
                      Report Review
                    </span>
                  </button>

                  <ReviewReportConfirm
                    isOpen={openReportConfirm}
                    onRequestClose={() => setOpenReportConfirm(false)}
                    onConfirm={() => {
                      setOpenReportReason(true);
                      setOpenReportConfirm(false);
                    }}
                  />

                  <ReviewReportReasons
                    isOpen={openReportReason}
                    onRequestClose={() => setOpenReportReason(false)}
                    onConfirm={() => {
                      reportReview(rental?.review?._id);
                    }}
                    loading={reporting}
                    setSelectedReportReason={setSelectedReportReason}
                  />

                  <ReviewReported
                    isOpen={openReported}
                    onRequestClose={() => setOpenReported(false)}
                    onConfirm={() => {
                      setOpenReported(false);
                    }}
                  />
                </div>

                <div className="w-full text-[16px] mt-2 font-normal leading-[24px] text-[#959393">
                  {rental?.review?.description || "N/A"}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  ) : (
    "Rental Order Not Found"
  );
};

export default RentalDetails;
