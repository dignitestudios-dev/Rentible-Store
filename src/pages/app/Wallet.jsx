import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import { MdKeyboardBackspace } from "react-icons/md";

import React, { useCallback, useEffect, useState } from "react";
import DateFilterModal from "../../components/app/products/DateFilterModal";
import { FiSearch } from "react-icons/fi";
import {
  convertToUTCTimestamp,
  formatDateToMMDDYYYY,
  formatEpochToMMDDYYYY,
  getStatusClasses,
} from "../../utils/helper";
import { IoCalendarOutline } from "react-icons/io5";
import Cookies from "js-cookie";
import axios from "../../axios";
import _ from "lodash";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import RentalListSkeleton from "../../skeletons/app/rental_tracking/RentalListSkeleton";
import CustomerReportConfirm from "../../components/app/customers/CustomerReportConfirm";
import CustomerReportReasons from "../../components/app/customers/CustomerReportReasons";
import CustomerReported from "../../components/app/customers/CustomerReported";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import BankModal from "../../components/app/settings/BankModal";
import WithdrawModal from "../../components/app/settings/WithdrawModal";
import exportToExcel from "../../utils/dataexport";

const Wallet = () => {
  const navigate = useNavigate();

  const { id } = useParams();

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
      activeTab == "withdrawal" ? getWihtdrawal(query) : getTransaction(query);
    }, 1000),
    []
  );

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    throttledSearch(value); // Call the throttled function
  };

  const [rentals, setRentals] = useState([]); // Updated variable name to camelCase
  const [pagination, setPagination] = useState({
    itemsPerPage: 0,
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  }); // Updated variable name to camelCase

  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  //   const store = JSON.parse(Cookies.get("store"));
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("transaction");

  const getWihtdrawal = async (query = "") => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/balance/store?search=${query}${
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
      setRentals(data?.data); // Store the actual data from the response
      setPagination(data?.pagination);
      setIsApplied(false);
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const [transactions, setTransactions] = useState([]);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const getTransaction = async (query = "") => {
    try {
      setTransactionLoading(true);
      const { data } = await axios.get(
        `/transaction/store?search=${query}${
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
      setTransactions(data?.data); // Store the actual data from the response
      setPagination(data?.pagination);
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
      console.log("Error:", error);
    } finally {
      setTransactionLoading(false);
    }
  };

  const [balance, setBalance] = useState(null);
  const [balLoading, setBalLoading] = useState(false);
  const getBalance = async () => {
    try {
      setBalLoading(true);
      const { data } = await axios.get(`/balance`);

      setBalance(data?.data); // Store the actual data from the response
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
      console.log("Error:", error);
    } finally {
      setBalLoading(false);
    }
  };

  const [isBankOpen, setIsBankOpen] = useState(false);
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
    getBank();
  }, [isBankOpen]);
  //

  useEffect(() => {
    activeTab == "withdrawal" ? getWihtdrawal() : getTransaction();
  }, [update, isApplied, currentPage, activeTab]);

  useEffect(() => {
    getBalance();
  }, []);

  const [openWithdraw, setOpenWithdraw] = useState(false);

  const dataToExport =
    activeTab == "withdrawal"
      ? rentals?.map((item) => ({
          Date: item?.createdAt
            ? new Date(item?.createdAt).toLocaleDateString("en-US") // Format as mm/dd/yyyy
            : "N/A",
          TransactionID: item?._id || "N/A",
          "Account Number": `${item?.accountNumber}` || "N/A",
          "Transfer Method": `${item?.method}` || "N/A",
          Amount: item?.amount || 0,
        }))
      : transactions?.map((item) => ({
          Date: item?.createdAt
            ? new Date(item?.createdAt).toLocaleDateString("en-US") // Format as mm/dd/yyyy
            : "N/A",
          TransactionID: item?.booking?.shortCode || "N/A",
          "Product Name": item?.product?.name || "N/A",
          "Booking Type": item?.booking?.duration || "N/A",
          Qty: item?.booking?.quantity || "N/A",
          "Transaction Type": item?.type || "N/A",
          Price: item?.amount || 0,
        }));

  const dataWidths =
    activeTab == "withdrawal"
      ? [
          { wch: 15 }, // CreatedAt
          { wch: 35 }, // Transaction ID
          { wch: 35 }, // Account Number
          { wch: 35 }, // Transfer Method
          { wch: 10 }, // Price
        ]
      : [
          { wch: 15 }, // CreatedAt
          { wch: 25 }, // Transaction Id
          { wch: 20 }, // Product Name
          { wch: 15 }, // Booking Type
          { wch: 10 }, // Quantity
          { wch: 10 }, // Price
        ];

  return (
    <div className="w-full h-full  flex flex-col gap-6  py-4 px-2 lg:px-6 justify-start items-start ">
      <div className="w-full h-auto flex flex-col gap-3 justify-start items-start">
        <div className="w-full relative flex flex-col lg:flex-row justify-between lg:items-center">
          <div className="w-full h-auto flex flex-col justify-start items-start ">
            <span className="text-[26px] md:text-[28px] lg:text-[32px] font-bold leading-[48px] text-[#202224]">
              Wallet
            </span>
          </div>
          <div className="w-auto flex justify-end lg:justify-start items-center gap-3">
            {/* {location?.pathname !== "/dashboard" && ( */}
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
            {/* )} */}

            <div
              className={`w-[330px] h-[316px] absolute top-16 right-0 transition-all duration-300 bg-white rounded-[14px] shadow-md py-3 px-6 ${
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
                      {finalDate
                        ? formatDateToMMDDYYYY(finalDate)
                        : "--/--/----"}
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
      </div>

      {balLoading || bankLoading ? (
        <div className="w-full h-auto py-8 lg:py-0 lg:min-h-[137px] rounded-[18px] bg-white animate-pulse px-4 lg:px-8 flex flex-row justify-between items-center ">
          <div className="w-[70%] h-full flex flex-col justify-center  items-start">
            <h3 className="text-[20px] font-medium leading-[30px]">
              Available Balance
            </h3>

            <span className="text-[40px] font-bold leading-[60px] text-[#202224]">
              ${" "}
              {balance?.availableBalance
                ? balance?.availableBalance?.amount
                : 0}
            </span>
          </div>
          <button
            type="button"
            disabled
            className="w-[156px] h-[41px] rounded-[8px] bg-gray-200 text-white flex gap-2 items-center justify-center"
          >
            <span className="text-[14px] font-normal leading-[21px] "></span>
            {/* {loading && <FiLoader className="animate-spin text-lg " />} */}
          </button>
        </div>
      ) : (
        <div className="w-full h-auto py-8 lg:py-0 lg:min-h-[137px] rounded-[18px] bg-white px-4 lg:pl-4 lg:pr-8 flex flex-row justify-between items-center ">
          <div className="w-[70%] h-full flex  justify-start  items-center gap-2">
            <div className="w-auto py-2 px-4 flex flex-col justify-center bg-[#F85E00]  rounded-xl items-start">
              <h3 className="text-[20px] font-medium leading-[30px] text-white">
                Available Balance
              </h3>

              <span className="text-[40px] font-bold leading-[60px] text-[#fdfdfd]">
                ${" "}
                {balance?.availableBalance
                  ? balance?.availableBalance?.amount
                  : 0}
              </span>
            </div>
            <div className="w-auto py-2 px-4 flex flex-col justify-center bg-[#F85E00]  rounded-xl items-start">
              <h3 className="text-[20px] font-medium leading-[30px] text-white">
                Pending Balance
              </h3>

              <span className="text-[40px] font-bold leading-[60px] text-[#fdfdfd]">
                ${" "}
                {balance?.pendingBalance ? balance?.pendingBalance?.amount : 0}
              </span>
            </div>
          </div>
          {bank?.status == "active" ? (
            <button
              type="button"
              onClick={() => setOpenWithdraw(true)}
              className="w-[156px] h-[41px] rounded-[8px] bg-[#F85E00] text-white flex gap-2 items-center justify-center"
            >
              <span className="text-[14px] font-normal leading-[21px] ">
                Withdraw Cash
              </span>
              {/* {loading && <FiLoader className="animate-spin text-lg " />} */}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsBankOpen(true)}
              className="w-[156px] h-[41px] rounded-[8px] bg-[#F85E00] text-white flex gap-2 items-center justify-center"
            >
              <span className="text-[14px] font-normal leading-[21px] ">
                Add Bank Account
              </span>
              {/* {loading && <FiLoader className="animate-spin text-lg " />} */}
            </button>
          )}
        </div>
      )}

      <WithdrawModal
        isOpen={openWithdraw}
        setUpdate={setUpdate}
        onRequestClose={() => setOpenWithdraw(false)}
      />
      <BankModal
        isOpen={isBankOpen}
        onRequestClose={() => setIsBankOpen(false)}
      />

      <div className="w-full   flex flex-col  py-4  justify-start items-start gap-6">
        <div className="w-full h-auto flex flex-col gap-3 justify-start items-start">
          <div className="w-full relative flex flex-col lg:flex-row justify-between lg:items-center">
            <span className="text-[26px] md:text-[28px] lg:text-[32px] font-bold leading-[48px] text-[#202224]">
              {activeTab == "withdrawal" ? "Withdrawal" : "Transaction"} History
            </span>
            <div className="w-auto flex flex-col lg:flex-row justify-start items-start lg:items-center gap-3">
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
              <div className="w-full lg:w-auto grid grid-cols-2 lg:flex  px-[2px] py-[2px] border border-gray-300 bg-white h-[49px] rounded-[8px]">
                <button
                  onClick={() => setActiveTab("transaction")}
                  className={`min-w-[90px] px-4 py-2 capitalize text-sm font-normal leading-[17.58px] ${
                    activeTab === "transaction"
                      ? "bg-[#F85E00] text-white"
                      : "bg-white text-black"
                  } rounded-l-[7px] `}
                >
                  Transaction History
                </button>
                <button
                  onClick={() => setActiveTab("withdrawal")}
                  className={`min-w-[90px] px-4 py-2 capitalize text-sm font-normal leading-[17.58px] ${
                    activeTab === "withdrawal"
                      ? "bg-[#F85E00] text-white"
                      : "bg-white text-black"
                  } rounded-r-[7px] `}
                >
                  Withdrawal History
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  exportToExcel(
                    dataToExport,
                    activeTab == "withdrawal"
                      ? "Withdrawal Hisotry"
                      : "Transaction History",
                    dataWidths
                  )
                }
                className="w-full lg:w-[49px] h-[49px] rounded-[8px] bg-[#F85E00] text-white flex items-center justify-center"
              >
                <PiMicrosoftExcelLogoFill className="text-2xl" />
                <span className="lg:hidden">Export to Excel</span>
              </button>
            </div>
          </div>
          {loading || transactionLoading ? (
            <div className="w-full h-auto rounded-[18px] bg-white p-5 flex flex-col justify-start items-start gap-4 animate-pulse">
              {/* Info Section */}

              {[1, 2, 3, 5, 6, 7, 8]?.map((item) => (
                <RentalListSkeleton key={item} />
              ))}
            </div>
          ) : (
            <div className="w-full overflow-x-auto lg:overflow-x-hidden flex flex-col justify-start items-start gap-6">
              <div className="min-w-[960px] w-full flex flex-col justify-start pb-4 items-start">
                {activeTab == "transaction" ? (
                  <div className="w-full border-t border-x h-[49px] bg-[#FCFDFD] border-gray-300 rounded-t-[14px] grid grid-cols-12 ">
                    <span className="w-full col-span-2 px-4 flex items-center justify-start h-full ">
                      <span className="text-[13px] font-medium">
                        Transaction ID
                      </span>
                    </span>
                    <span className="w-full col-span-3 flex items-center justify-start h-full ">
                      <span className="text-[13px] font-medium">
                        Product Name
                      </span>
                    </span>
                    <span className="w-full col-span-2 flex items-center justify-start h-full ">
                      <span className="text-[13px] font-medium">
                        Boooking Type
                      </span>
                    </span>
                    <span className="w-full col-span-1 flex items-center justify-start h-full ">
                      <span className="text-[13px] font-medium">Qty</span>
                    </span>
                    <span className="w-full col-span-1 flex items-center justify-start h-full ">
                      <span className="text-[13px] font-medium">Price</span>
                    </span>
                    <span className="w-full col-span-2 flex items-center justify-start h-full ">
                      <span className="text-[13px] font-medium">
                        Transaction Type
                      </span>
                    </span>
                    <span className="w-full col-span-1 flex items-center justify-start h-full ">
                      <span className="text-[13px] font-medium">
                        Booking Date
                      </span>
                    </span>
                  </div>
                ) : (
                  <div className="w-full border-t border-x h-[49px] bg-[#FCFDFD] border-gray-300 rounded-t-[14px] grid grid-cols-10 ">
                    <span className="w-full col-span-2 px-4 flex items-center justify-start h-full ">
                      <span className="text-[13px] font-medium">
                        Transaction ID
                      </span>
                    </span>
                    <span className="w-full col-span-2 flex items-center justify-start h-full ">
                      <span className="text-[13px] font-medium">
                        Account Number
                      </span>
                    </span>
                    <span className="w-full col-span-2 flex items-center justify-start h-full ">
                      <span className="text-[13px] font-medium">
                        Withdrawal Amount
                      </span>
                    </span>
                    <span className="w-full col-span-2 flex items-center justify-start h-full ">
                      <span className="text-[13px] font-medium">
                        Transfer Method
                      </span>
                    </span>

                    <span className="w-full col-span-2 flex items-center justify-start h-full ">
                      <span className="text-[13px] font-medium">
                        Withdrawal Date
                      </span>
                    </span>
                  </div>
                )}
                <div className="w-full h-auto border divide-y divide-gray-300 border-gray-300 bg-white rounded-b-[14px] flex  flex-col justify-start items-start">
                  {loading ? (
                    [1, 2, 3, 4]?.map((item, key) => {
                      return <RentalListSkeleton key={key} />;
                    })
                  ) : activeTab == "transaction" && transactions?.length > 0 ? (
                    transactions?.map((rental, key) => {
                      return (
                        <div
                          key={key}
                          className="w-full  grid grid-cols-12 h-[77px] text-[#202224] "
                        >
                          <span className="w-full col-span-2 px-4 flex items-center justify-start h-full ">
                            <span className="text-[13px] font-normal">
                              {rental?.booking?.shortCode}
                            </span>
                          </span>
                          <span className="w-full col-span-3  flex items-center gap-2 justify-start h-full ">
                            <span className="w-[44px] h-[44px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                              <img
                                src={
                                  rental?.product?.cover ||
                                  "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                                }
                                alt="store_image"
                                className="w-[38px] h-[38px] rounded-full"
                              />
                            </span>
                            <span className="text-[13px] font-normal">
                              {rental?.product?.name || "N/A"}
                            </span>
                          </span>
                          <span className="w-full col-span-2 flex items-center justify-start h-full ">
                            <span className="text-[13px] font-normal">
                              {rental?.booking?.duration || "N/A"}
                            </span>
                          </span>
                          <span className="w-full col-span-1 flex items-center justify-start h-full ">
                            <span className="text-[13px] font-normal">
                              {rental?.booking?.quantity || "N/A"}
                            </span>
                          </span>
                          <span className="w-full col-span-1 flex items-center justify-start h-full ">
                            <span className="text-[13px] font-normal">
                              ${rental?.amount}
                            </span>
                          </span>

                          <span className="w-full col-span-2 flex items-center justify-start h-full ">
                            <span
                              className={`text-[13px] w-auto px-2 text-xs capitalize py-1 rounded-full ${
                                rental?.type == "credit"
                                  ? "bg-green-500/20 text-green-500"
                                  : "bg-red-500/20 text-red-500"
                              } font-normal`}
                            >
                              {rental?.type}
                            </span>
                          </span>
                          <span className="w-full col-span-1 flex items-center justify-start h-full ">
                            <span className="text-[13px] font-normal">
                              {formatDateToMMDDYYYY(rental?.createdAt)}
                            </span>
                          </span>
                          {/* <span className="w-full col-span-1 flex items-center justify-start h-full ">
                          <span
                            className={`text-[13px] capitalize ${getStatusClasses(
                              rental?.status
                            )} font-normal`}
                          >
                            {rental?.status}
                          </span>
                        </span> */}
                        </div>
                      );
                    })
                  ) : activeTab == "withdrawal" && rentals?.length > 0 ? (
                    rentals?.map((rental, key) => {
                      return (
                        <div
                          key={key}
                          className="w-full grid grid-cols-10 h-[77px] text-[#202224] "
                        >
                          <span className="w-full col-span-2 px-4 flex items-center justify-start h-full ">
                            <span className="text-[13px] font-normal">
                              {rental?._id}
                            </span>
                          </span>
                          <span className="w-full col-span-2  flex items-center gap-2 justify-start h-full ">
                            <span className="text-[13px] font-normal">
                              {rental?.accountNumber}
                            </span>
                          </span>
                          <span className="w-full col-span-2 flex items-center justify-start h-full ">
                            <span className="text-[13px] font-normal">
                              ${rental?.amount}
                            </span>
                          </span>
                          <span className="w-full col-span-2 flex items-center justify-start h-full ">
                            <span className="text-[13px] capitalize font-normal">
                              {rental?.method}
                            </span>
                          </span>

                          <span className="w-full col-span-2 flex items-center justify-start h-full ">
                            <span className="text-[13px] font-normal">
                              {formatDateToMMDDYYYY(rental?.createdAt)}
                            </span>
                          </span>
                          {/* <span className="w-full col-span-1 flex items-center justify-start h-full ">
                      <span
                        className={`text-[13px] capitalize ${getStatusClasses(
                          rental?.status
                        )} font-normal`}
                      >
                        {rental?.status}
                      </span>
                    </span> */}
                        </div>
                      );
                    })
                  ) : (
                    <div className="w-full flex items-center justify-center h-48">
                      No data Found
                    </div>
                  )}
                </div>

                {activeTab == "withdrawal" &&
                  !loading &&
                  rentals?.length > 0 && (
                    <div className="min-w-[960px] my-6 w-full  px-2 flex justify-between items-center">
                      <span className="text-[16px] font-normal text-black">
                        You have {pagination?.currentPage} of{" "}
                        {pagination?.totalPages} Pages
                      </span>

                      <div className="w-auto flex items-center justify-start  px-3 h-[61px] gap-2 rounded-full bg-white">
                        <button
                          disabled={currentPage == 1}
                          onClick={() =>
                            setCurrentPage((prev) =>
                              prev !== 1 ? prev - 1 : prev
                            )
                          }
                          className="w-[43px] h-[43px] rounded-full bg-gray-200 flex items-center justify-center text-3xl text-[#000] disabled:text-[#909090]"
                        >
                          <RxCaretLeft />
                        </button>

                        <div className="w-auto flex justify-center items-center h-[43px] rounded-full px-2  bg-gray-200">
                          {Array.from(
                            { length: pagination?.totalPages },
                            (_, index) => (
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
                            )
                          )}
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

                {activeTab == "transaction" &&
                  !transactionLoading &&
                  transactions?.length > 0 && (
                    <div className="min-w-[960px] my-6 w-full  px-2 flex justify-between items-center">
                      <span className="text-[16px] font-normal text-black">
                        You have {pagination?.currentPage} of{" "}
                        {pagination?.totalPages} Pages
                      </span>

                      <div className="w-auto flex items-center justify-start  px-3 h-[61px] gap-2 rounded-full bg-white">
                        <button
                          disabled={currentPage == 1}
                          onClick={() =>
                            setCurrentPage((prev) =>
                              prev !== 1 ? prev - 1 : prev
                            )
                          }
                          className="w-[43px] h-[43px] rounded-full bg-gray-200 flex items-center justify-center text-3xl text-[#000] disabled:text-[#909090]"
                        >
                          <RxCaretLeft />
                        </button>

                        <div className="w-auto flex justify-center items-center h-[43px] rounded-full px-2  bg-gray-200">
                          {Array.from(
                            { length: pagination?.totalPages },
                            (_, index) => (
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
                            )
                          )}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
