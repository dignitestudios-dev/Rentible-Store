import React, { useCallback, useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoCalendarOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/app/products/ProductCard";
import axios from "../../axios";
import Cookies from "js-cookie";
import { ErrorToast } from "../../components/global/Toaster";
import ProductCardSkeleton from "../../skeletons/app/products/ProductCardSkeleton";
import DateFilterModal from "../../components/app/products/DateFilterModal";
import {
  convertToUTCTimestamp,
  formatDateToMMDDYYYY,
} from "../../utils/helper";
import _ from "lodash";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { BsCheckLg } from "react-icons/bs";
import CustomerTableSkeleton from "../../skeletons/app/customers/CustomerTableSkeleton";
import CSVImport from "./CSVImport";
import Papa from "papaparse";

const Products = () => {
  const navigate = useNavigate();
  const [openFilterFrom, setOpenFilterFrom] = useState(false);
  const [openFilterTo, setOpenFilterTo] = useState(false);
  const [search, setSearch] = useState("");
  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  // Throttled function using lodash.throttle
  const throttledSearch = useCallback(
    _.throttle((query) => {
      getProducts(query);
    }, 1000),
    []
  );

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    throttledSearch(value); // Call the throttled function
  };

  const [products, setProducts] = useState([]); // Updated variable name to camelCase
  const [pagination, setPagination] = useState({
    itemsPerPage: 0,
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  }); // Updated variable name to camelCase
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  // const store = JSON.parse(Cookies.get("store"));

  const getProducts = async (query = "") => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/product/all?search=${query}${
          initialDate
            ? `&startDate=${convertToUTCTimestamp(
                formatDateToMMDDYYYY(initialDate)
              )}`
            : ""
        }${
          finalDate
            ? `&endDate=${convertToUTCTimestamp(
                formatDateToMMDDYYYY(finalDate),
                "end"
              )}`
            : ""
        }&page=${currentPage}&limit=9`
      );
      setProducts(data?.data); // Store the actual data from the response
      setPagination(data?.pagination);
      setIsApplied(false);
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  //

  useEffect(() => {
    getProducts();
  }, [update, isApplied, currentPage]);

  const [isCSV, setIsCSV] = useState(false);
  const [csvProducts, setCsvProducts] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // console.log(results, "sdsfghjshghjhgfd");
          const parsedData = results.data.map((item, key) => ({
            _id: key,
            name: item.name || "",
            description: item.description || "",
            quantity: item.quantity || "",
            categoryId: item?.categoryId || null,
            subCategoryId: item?.subCategoryId || null,
            availableDays: item?.availableDays ? item?.availableDays : [],
            pickupTime: item.pickupTime || "",
            dropOffTime: item.dropOffTime || "",
            cover: item?.cover || null,
            pickupAddress: item?.pickupAddress || "",
            pricePerHour: item?.pricePerHour || "",
            pricePerDay: item?.pricePerDay || "",
            latitude: null,
            longitude: null,
          }));

          setCsvProducts(parsedData);
          setIsCSV(true);
        },
      });
    }
  };

  return isCSV ? (
    <CSVImport
      setIsCSV={setIsCSV}
      products={csvProducts}
      setProducts={setCsvProducts}
      setUpdate={setUpdate}
    />
  ) : (
    <div className="w-full h-full  flex flex-col  py-4 px-2 lg:px-6 justify-start items-start gap-6">
      <div className="w-full h-auto flex flex-col gap-3 justify-start items-start">
        <div className="w-full relative flex flex-col lg:flex-row justify-between lg:items-center">
          <span className="text-[32px] font-bold leading-[48px] text-[#202224]">
            Products
          </span>
          <div className="w-auto flex flex-wrap lg:flex-nowrap justify-end lg:justify-start items-center gap-3">
            <div className="relative w-full lg:w-[256px] bg-white h-[49px] flex items-start justify-start rounded-[8px] border border-gray-300">
              <span className="w-[40px] h-full flex items-center justify-center ">
                <FiSearch className="  text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={handleInputChange}
                className="    text-sm text-gray-700 focus:outline-none w-[calc(100%-40px)] h-full rounded-r-[8px]" // Increased size
              />
            </div>

            <button
              onClick={() => {
                document.getElementById("csv-picker").click();
              }}
              className="w-full lg:w-[148px] h-[49px] rounded-[8px] bg-[#F85E00]/[0.12]  flex gap-2 items-center justify-center"
            >
              <img
                src="/import_csv_icon.png"
                alt=""
                className="w-[17.02px] h-[18.8px]"
              />
              <span className="text-[14px] font-medium leading-[21px] text-[#F85E00]">
                CSV Import
              </span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                id="csv-picker"
              />
            </button>

            <button
              onClick={() => navigate("/products/add")}
              className="w-[150px] h-[49px] rounded-[8px] bg-[#F85E00] flex items-center justify-center"
            >
              <span className="text-[14px] font-normal leading-[21px] text-white">
                Add New Product
              </span>
            </button>

            <button
              onClick={() => {
                setIsApplied(openCalendar && false);
                setOpenCalendar((prev) => !prev);
              }}
              className="w-[49px] h-[49px] rounded-[8px] bg-[#F85E00] flex items-center justify-center"
            >
              <img
                src="/filter_icon.png"
                alt=""
                className="w-[27px] h-[27px]"
              />
            </button>
          </div>

          <div
            className={`w-[330px] h-[316px] absolute top-14 right-0 transition-all duration-300 bg-white rounded-[14px] shadow-md py-3 px-6 ${
              openCalendar ? "translate-x-0" : "translate-x-[600px]"
            } flex flex-col justify-start items-start z-50`}
          >
            <span className="w-full h-9 text-[18px] font-semibold text-black flex items-center justify-start  border-b border-gray-300">
              Filter
            </span>
            <div className="w-full mt-4 flex flex-col justify-start items-start gap-3 ">
              <div className="w-full flex flex-col gap-1  justify-start items-start ">
                <label
                  htmlFor=""
                  className="text-[14px] ml-1 font-normal text-black"
                >
                  Start Date
                </label>
                <div className="w-full h-[49px] relative rounded-[14px] bg-gray-50 flex items-center justify-start px-3">
                  <span className="text-md font-normal text-black">
                    {initialDate
                      ? formatDateToMMDDYYYY(initialDate)
                      : "--/--/----"}
                  </span>
                  <buton
                    onClick={() => setOpenFilterFrom(true)}
                    className="absolute cursor-pointer top-1/2 text-xl right-3 transform -translate-y-1/2 text-orange-500"
                  >
                    <IoCalendarOutline />
                  </buton>
                </div>
              </div>
              <div className="w-full flex flex-col gap-1  justify-start items-start ">
                <label
                  htmlFor=""
                  className="text-[14px] ml-1 font-normal text-black"
                >
                  End Date
                </label>
                <div className="w-full h-[49px] relative rounded-[14px] bg-gray-50 flex items-center justify-start px-3">
                  <span className="text-md font-normal text-black">
                    {finalDate ? formatDateToMMDDYYYY(finalDate) : "--/--/----"}
                  </span>
                  <button
                    onClick={() => setOpenFilterTo(true)}
                    className="absolute cursor-pointer top-1/2 text-xl right-3 transform -translate-y-1/2 text-orange-500"
                  >
                    <IoCalendarOutline />
                  </button>
                </div>
              </div>
              <div className="w-full h-auto grid grid-cols-2 mt-2 gap-2 justify-start items-center">
                <button
                  onClick={() => {
                    setOpenCalendar(false);
                    setInitialDate(null);
                    setFinalDate(null);
                    setIsApplied(true);
                  }}
                  className="w-full h-[49px] rounded-[8px] bg-gray-50 text-[#6A6A6A] text-md font-normal flex items-center justify-center"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    setIsApplied(true);
                    setOpenCalendar(false);
                  }}
                  className="w-full h-[49px] rounded-[8px] bg-[#F85E00] text-[#fff] text-md font-normal flex items-center justify-center"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
          <DateFilterModal
            isOpen={openFilterFrom}
            setIsOpen={setOpenFilterFrom}
            date={initialDate}
            setDate={setInitialDate}
          />

          <DateFilterModal
            isOpen={openFilterTo}
            setIsOpen={setOpenFilterTo}
            date={finalDate}
            setDate={setFinalDate}
            prevDate={initialDate}
          />
        </div>
      </div>

      <div className="w-full h-auto grid grid-cols-1  md:grid-cols-2 xl:grid-cols-3 justify-start items-start gap-4">
        {loading ? (
          [1, 2, 3, 4, 5]?.map((item) => {
            return <ProductCardSkeleton key={item} />;
          })
        ) : products?.length > 0 ? (
          products?.map((product) => {
            return (
              <ProductCard
                key={product?.id}
                product={product}
                setUpdate={setUpdate}
              />
            );
          })
        ) : (
          <div className="w-full col-span-3 flex items-center justify-center text-xl font-semibold h-56 bg-white rounded-[18px]">
            No data available
          </div>
        )}
      </div>

      <div className="w-full pb-4">
        {!loading && products?.length > 0 && (
          <div className="w-full   flex flex-col lg:flex-row lg:items-center  justify-between pl-5 py-2 lg:py-0 pr-3 lg:h-[61px] gap-2 rounded-lg lg:rounded-full bg-white">
            <span className="text-[16px] font-normal text-black">
              You have {pagination?.currentPage} of {pagination?.totalPages}{" "}
              Pages
            </span>

            <div className="w-auto flex items-center justify-start  h-[61px] gap-2 rounded-full bg-white">
              <button
                disabled={currentPage == 1}
                onClick={() =>
                  setCurrentPage((prev) => (prev !== 1 ? prev - 1 : prev))
                }
                className="w-[43px] h-[43px] rounded-full bg-gray-200 flex items-center justify-center text-3xl text-[#000] disabled:text-[#909090]"
              >
                <RxCaretLeft />
              </button>

              <div className="w-auto flex justify-center items-center h-[43px] rounded-full px-2  bg-gray-200">
                {Array.from({ length: pagination?.totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-[33px] h-[33px]  ${
                      currentPage == index + 1
                        ? "bg-[#F85E00] text-white"
                        : "bg-transparent text-[#909090]"
                    } hover:bg-[#F85E00]/[0.4] hover:text-[#000]/[0.8] flex items-center rounded-full justify-center`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage == pagination?.totalPages}
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev !== pagination?.totalPages ? prev + 1 : prev
                  )
                }
                className="w-[43px] h-[43px] rounded-full bg-gray-200 flex items-center justify-center text-3xl text-[#000] disabled:text-[#909090]"
              >
                <RxCaretRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
