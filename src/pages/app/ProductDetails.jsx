import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "../../axios";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import { MdKeyboardBackspace } from "react-icons/md";
import { FiLoader } from "react-icons/fi";
import { Swiper } from "swiper/react";
import { SwiperSlide } from "swiper/react";
import { convertEpochTo12HourFormat } from "../../utils/helper";
import DeleteProductConfirm from "../../components/app/products/DeleteProductConfirm";
import ProductReviews from "../../components/app/products/ProductReviews";

const ProductDetails = () => {
  const navigate = useNavigate();

  const [update, setUpdate] = useState(false);
  const location = useLocation();
  const [product, setProduct] = useState(null); // Updated variable name to camelCase
  const [loading, setLoading] = useState(false);
  // const store = JSON.parse(Cookies.get("store"));
  const { id } = useParams();

  const getProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/product/${id}/all`);
      console.log("🚀 ~  ~ data:", data);
      setProduct(data?.data); // Store the actual data from the response
      setActive(data?.data?.isActive);
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getProduct();
  }, [update]);

  const allImages = product?.cover
    ? [product?.cover, ...product?.images]
    : product?.images;

  const coverIndex = allImages?.findIndex(
    (element) => element === product?.cover
  );

  const [index, setIndex] = useState(coverIndex);

  const [active, setActive] = useState(product?.isActive);

  const toggleActivation = async () => {
    try {
      const response = await axios.post("/product/toggleActivation", {
        productId: product?._id,
        isActive: active,
      });
      if (response?.data?.success) {
        SuccessToast(
          `Product ${active ? "activated" : "deactivated"} successfully.`
        );
        setUpdate((prev) => !prev);
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
    } finally {
      // test
    }
  };

  const [deleting, setDeleting] = useState(false);
  const deleteProduct = async () => {
    try {
      setDeleting(true);
      const response = await axios.delete(`/product/${product?._id}`);
      if (response?.data?.success) {
        SuccessToast(`Product deleted successfully.`);
        navigate("/products");
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
    } finally {
      // test
      setDeleting(false);
    }
  };

  useEffect(() => {
    active !== product?.isActive && toggleActivation();
  }, [active]);

  useEffect(() => {
    setIndex(coverIndex);
  }, [product]);

  const [confirm, setConfirm] = useState(false);

  return loading ? (
    <div className="w-full h-full  flex flex-col gap-6  py-4 px-2 lg:px-6 justify-start items-start ">
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
            <span className="text-[26px] md:text-[28px] lg:text-[32px] font-bold leading-[48px] text-[#202224]">
              Product Details
            </span>
          </div>
          <div className="w-auto flex justify-start items-center gap-3">
            <button
              type="button"
              disabled
              onClick={() => setConfirm(true)}
              className="w-[49px] h-[49px] rounded-[8px] flex items-center justify-center text-white bg-[#FF3E46]"
            >
              <img
                src="/trash-icon.png"
                alt="delete-button-icon"
                className="w-[28.28px]"
              />
            </button>

            <button
              type="button"
              disabled
              onClick={() =>
                navigate(`/products/update/${product?._id}`, { state: product })
              }
              className="w-[150px] h-[49px] rounded-[8px] bg-[#F85E00] text-white flex gap-2 items-center justify-center"
            >
              <span className="text-[14px] font-normal leading-[21px] ">
                Edit Product
              </span>
              {/* {loading && <FiLoader className="animate-spin text-lg " />} */}
            </button>
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
  ) : product !== null ? (
    <div className="w-full h-full  flex flex-col gap-6  py-4 px-2 lg:px-6 justify-start items-start ">
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
            <span className="text-[26px] md:text-[28px] lg:text-[32px] font-bold leading-[48px] text-[#202224]">
              Product Details
            </span>
          </div>
          <div className="w-auto flex justify-start items-center gap-3">
            <button
              type="button"
              onClick={() => setConfirm(true)}
              className="w-[49px] h-[49px] rounded-[8px] flex items-center justify-center text-white bg-[#FF3E46]"
            >
              <img
                src="/trash-icon.png"
                alt="delete-button-icon"
                className="w-[28.28px]"
              />
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(`/products/update/${product?._id}`, { state: product })
              }
              className="w-[150px] h-[49px] rounded-[8px] bg-[#F85E00] text-white flex gap-2 items-center justify-center"
            >
              <span className="text-[14px] font-normal leading-[21px] ">
                Edit Product
              </span>
              {/* {loading && <FiLoader className="animate-spin text-lg " />} */}
            </button>
          </div>
        </div>
      </div>

      <DeleteProductConfirm
        isOpen={confirm}
        onRequestClose={() => setConfirm(false)}
        loading={deleting}
        onConfirm={() => deleteProduct()}
      />

      <div className="w-full h-auto rounded-[18px] bg-white p-5 flex flex-col lg:flex-row justify-start items-start gap-4">
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
          <div className="w-full flex justify-between items-center">
            <h1 className="text-[22px] font-semibold leading-[33px] ">
              {product?.name || "N/A"}
            </h1>
            <div className="w-auto flex flex-col justify-start items-start">
              <span className="text-[12px] font-normal leading-[18px] text-[#818181]">
                {product?.isActive ? "Active" : "In Active"}
              </span>

              <button
                onClick={() => setActive((prev) => !prev)}
                className={`w-[36px] h-[18px] rounded-full   flex ${
                  active
                    ? "bg-[#F85E00] justify-end"
                    : "justify-start bg-[#d9d9d9]"
                }  p-[1.5px]  `}
              >
                <span className="w-[15px] h-[15px] rounded-full bg-white shadow "></span>
              </button>
            </div>
          </div>

          <span className="w-full my-2 h-[0.5px] bg-[#d4d4d4] rounded-full"></span>

          <div className="w-full flex  flex-col lg:flex-row justify-between items-start">
            <div className="w-full lg:w-[22%] h-full flex flex-col gap-1 justify-start items-start">
              <span className="text-[14px] font-medium leading-[21px]">
                Category
              </span>
              <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
                {product?.category?.name || "N/A"}
              </span>
            </div>
            <div className="lg:w-[3%] lg:h-14 w-full h-1 flex items-center justify-start">
              <span className="lg:w-[1.5px] lg:h-10 w-full h-[0.5px] rounded-full bg-[#d4d4d4]"></span>
            </div>
            <div className="w-full lg:w-[22%] h-full flex flex-col gap-1 justify-start items-start">
              <span className="text-[14px] font-medium leading-[21px]">
                Sub Category
              </span>
              <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
                {product?.subCategory?.name || "N/A"}
              </span>
            </div>
            <div className="lg:w-[3%] lg:h-14 w-full h-1 flex items-center justify-start">
              <span className="lg:w-[1.5px] lg:h-10 w-full h-[0.5px] rounded-full bg-[#d4d4d4]"></span>
            </div>
            <div className="w-full lg:w-[22%] h-full flex flex-col gap-1 justify-start items-start">
              <span className="text-[14px] font-medium leading-[21px]">
                Available Items
              </span>
              <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
                {product?.quantity || 0}
              </span>
            </div>
            <div className="lg:w-[3%] lg:h-14 w-full h-1 flex items-center justify-start">
              <span className="lg:w-[1.5px] lg:h-10 w-full h-[0.5px] rounded-full bg-[#d4d4d4]"></span>
            </div>
            <div className="w-full lg:w-[22%] h-full flex flex-col gap-1 justify-start items-start">
              <span className="text-[14px] font-medium leading-[21px]">
                Phone Number
              </span>
              <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
                {product?.store?.phone || "N/A"}
              </span>
            </div>
          </div>

          <span className="w-full my-2 h-[0.5px] bg-[#d4d4d4] rounded-full"></span>
          <div className="w-full flex flex-col lg:flex-row justify-between items-start">
            <div className="w-full lg:w-[35%] h-full flex flex-col gap-1 justify-start items-start">
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
                  {product?.pickupAddress || "N/A"}
                </span>
              </div>
            </div>
            <div className="lg:w-[3%] lg:h-14 w-full h-1 flex items-center justify-start">
              <span className="lg:w-[1.5px] lg:h-10 w-full h-[0.5px] rounded-full bg-[#d4d4d4]"></span>
            </div>
            <div className="w-full lg:w-[22%] h-full flex flex-col gap-1 justify-start items-start">
              <span className="text-[14px] font-medium leading-[21px]">
                Pickup And Drop Off
              </span>
              <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
                {convertEpochTo12HourFormat(product?.pickupTime) || "N/A"}
                {"-"}
                {convertEpochTo12HourFormat(product?.dropOffTime) || "N/A"}
              </span>
            </div>
            <div className="lg:w-[3%] lg:h-14 w-full h-1 flex items-center justify-start">
              <span className="lg:w-[1.5px] lg:h-10 w-full h-[0.5px] rounded-full bg-[#d4d4d4]"></span>
            </div>

            <div className="w-full lg:w-[35%] h-full flex flex-col gap-1 justify-start items-start">
              <span className="text-[14px] font-medium leading-[21px]">
                Available Days For Rental
              </span>
              <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
                {product?.availableDays[0] || "N/A"}
                {"-"}
                {product?.availableDays[product?.availableDays?.length - 1] ||
                  "N/A"}
              </span>
            </div>
          </div>

          <span className="w-full my-2 h-[0.5px] bg-[#d4d4d4] rounded-full"></span>

          <div className="w-full flex flex-col justify-start items-start gap-2">
            <h1 className="text-[22px] font-semibold leading-[33px] ">
              Biography
            </h1>
            <span className="text-[12px] font-normal text-[#818181] leading-[18px]">
              {product?.description || "N/A"}
            </span>
          </div>

          {/* {JSON.stringify(product)} */}
        </div>
      </div>

      <ProductReviews />
    </div>
  ) : (
    "Product Not Found"
  );
};

export default ProductDetails;
