import React, { useState, useEffect, useContext } from "react";
import { useSwipeable } from "react-swipeable";
import { FaTrash, FaCheck } from "react-icons/fa";
import axios from "../../axios.js";
import Cookies from "js-cookie";
import { AppContext } from "../../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster.jsx";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";

// Child Component to Handle Swipe
const SwipeableNotification = ({
  notification,
  handleSwipe,
  getTimeAgo,
  deleteOne,
  readOne,
}) => {
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleSwipeStart = () => {
    setIsSwiping(true);
  };

  const handleSwipeMove = (deltaX) => {
    setTranslateX(deltaX);
  };

  const handleSwipeEnd = (deltaX) => {
    setIsSwiping(false);

    if (deltaX <= -100) {
      handleSwipe("Left", notification?._id); // Trigger delete
    } else if (deltaX >= 100) {
      handleSwipe("Right", notification?._id); // Trigger read
    } else {
      setTranslateX(0); // Reset position if threshold not met
    }
  };

  const swipeHandlers = useSwipeable({
    onSwiping: (eventData) => handleSwipeMove(eventData.deltaX),
    onSwipedLeft: () => handleSwipeEnd(translateX),
    onSwipedRight: () => handleSwipeEnd(translateX),
    onSwipeStart: handleSwipeStart,
    onSwipeEnd: () => handleSwipeEnd(translateX),
    delta: 10, // Sensitivity for swipe
    trackMouse: true, // Enable mouse tracking for desktop
  });

  const navigate = useNavigate();

  const readNotification = (id) => {
    axios
      .post(`/notification/read`, {
        notificationId: id,
      })
      .then((response) => {
        return true;
      })
      .catch((error) => {
        ErrorToast(error?.response?.data?.message);
        return false;
      });
  };

  const route = async (e, type, id, notificationId) => {
    e.preventDefault();
    readNotification(notificationId);
    if (type == "booking") {
      navigate(`/rental-tracking/${id}`);
    } else if (type == "product") {
      navigate(`/products/${id}`);
    } else {
      // WarningToast("Can't route. Something went wrong.");
      return;
    }
  };
  return (
    <div className="w-full h-auto relative -z-10 grid grid-cols-5 justify-start items-start">
      {translateX <= -100 && (
        <div className="absolute right-4 top-1/2 w-16 h-16 bg-red-500 flex items-center justify-center rounded-full transform -translate-y-1/2">
          {deleteOne ? (
            <div
              class="animate-spin inline-block size-3 border-[3px] border-current border-t-transparent text-white rounded-full"
              role="status"
              aria-label="loading"
            >
              <span class="sr-only">Loading...</span>
            </div>
          ) : (
            <FaTrash className="text-xl text-white" />
          )}
        </div>
      )}
      {translateX >= 100 && (
        <div className="absolute left-4 top-1/2 w-16 h-16 bg-orange-500 flex items-center justify-center rounded-full transform -translate-y-1/2">
          {readOne ? (
            <div
              class="animate-spin inline-block size-3 border-[3px] border-current border-t-transparent text-white rounded-full"
              role="status"
              aria-label="loading"
            >
              <span class="sr-only">Loading...</span>
            </div>
          ) : (
            <FaCheck className="text-white" />
          )}
        </div>
      )}
      <div
        {...swipeHandlers}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isSwiping ? "none" : "transform 0.3s ease",
        }}
        key={notification?._id}
        className={`w-full col-span-5 select-none cursor-pointer grid grid-cols-1 md:grid-cols-5 notification border-b gap-x-4 ${
          notification?.isRead
            ? " px-3 rounded-t-lg"
            : " px-3 border-[#F85E00] rounded-t-lg"
        }  ${
          translateX <= -100
            ? "bg-red-100"
            : translateX >= 100
            ? "bg-orange-100 "
            : !notification?.isRead
            ? "bg-[#F85E00]/[0.2]"
            : "bg-white"
        } `}
      >
        <div className="col-span-3 md:border-b py-4">
          <p className="font-medium select-none text-base text-[#F85E00]">
            {notification?.title}
          </p>
          <p className="font-normal select-none text-base text-[#222222]">
            {notification?.description}
          </p>
        </div>
        <div className="col-span-2 flex flex-col  gap-1 items-end justify-center text-end md:border-b py-4">
          <p className="text-[#5C5C5C] text-sm font-medium pt-1">
            {getTimeAgo(notification?.createdAt)}
          </p>
          {notification?.metaData?.type !== "user" && (
            <button
              onClick={(e) =>
                route(
                  e,
                  notification?.metaData?.type,
                  notification?.metaData?.type == "booking"
                    ? notification?.metaData?.booking?._id
                    : notification?.metaData?.product?._id,
                  notification?._id
                )
              }
              className="w-auto px-3 h-7 flex items-center justify-center bg-orange-600 text-white rounded-xl"
            >
              View
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Notifications = () => {
  const { notifications, setNotifications } = useContext(AppContext);
  const [data, setData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [pagination, setPagination] = useState({
    itemsPerPage: 0,
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  }); // Updated variable name to camelCase
  const [currentPage, setCurrentPage] = useState(1);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const getNotifications = () => {
      const token = Cookies.get("token");
      if (token) {
        setDataLoading(true);
        axios
          .get(`/notification?page=${currentPage}&limit=9`)
          .then((response) => {
            setData(response?.data?.data);
            setPagination(response?.data?.pagination);
            setNotifications(response?.data?.data);
            setDataLoading(false);
          })
          .catch((error) => {
            ErrorToast(error?.response?.data?.message);
            setDataLoading(false);
          });
      }
    };

    getNotifications();
  }, [update, currentPage]);

  const [deleteOne, setDeleteOne] = useState(false);
  const deleteNotification = async (id) => {
    try {
      setDeleteOne(true);
      const response = await axios.delete(`/notification/${id}`);
      if (response?.data?.success) {
        setUpdate((prev) => !prev);
        SuccessToast("Notification deleted successfully.");
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setDeleteOne(false);
    }
  };

  const [readOne, setReadOne] = useState(false);

  const readNotification = (id) => {
    setReadOne(true);
    axios
      .post(`/notification/read`, {
        notificationId: id,
      })
      .then((response) => {
        setUpdate((prev) => !prev);
        setReadOne(false);
        SuccessToast("Notification marked as read.");
        return true;
      })
      .catch((error) => {
        setReadOne(false);
        ErrorToast(error?.response?.data?.message);
        return false;
      });
  };

  const handleSwipe = (direction, id) => {
    if (direction === "Left") {
      deleteNotification(id);
    }
    if (direction === "Right") {
      readNotification(id);
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count > 0) {
        return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  };

  const [reading, setReading] = useState(false);

  const readAllNotifications = () => {
    setReading(true);
    axios
      .post(`/notification/all`)
      .then((response) => {
        setReading(false);
        setUpdate((prev) => !prev);
      })
      .catch((error) => {
        ErrorToast(error?.response?.data?.message);
      });
  };

  return (
    <div className="w-full h-auto overflow-x-hidden flex justify-center items-center">
      <div className="  w-full  h-full p-6  flex flex-col gap-6">
        <div className="w-full flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <h1 className="text-sm font-medium text-gray-500">
              Swipe Left to delete the notification & swipe right to mark
              notification as read.
            </h1>
          </div>

          <button
            onClick={() => readAllNotifications()}
            className="bg-[#F85E00] rounded-[10px] text-[13px] font-semibold text-white py-2.5 w-[118px]"
          >
            {reading ? (
              <div
                class="animate-spin inline-block size-3 border-[3px] border-current border-t-transparent text-white rounded-full"
                role="status"
                aria-label="loading"
              >
                <span class="sr-only">Loading...</span>
              </div>
            ) : (
              "Read All"
            )}
          </button>
        </div>

        <div className="w-full flex z-0 flex-col gap-2">
          {dataLoading ? (
            [1, 2, 3, 4, 5]?.map((item) => (
              <div className="w-full h-24 rounded-t-[15px] bg-gray-200 animate-pulse"></div>
            ))
          ) : data?.length < 1 ? (
            <div className="w-full h-96 flex items-center justify-center text-lg">
              No notifications available.
            </div>
          ) : (
            data.map((notification) => (
              <SwipeableNotification
                key={notification?._id}
                notification={notification}
                handleSwipe={handleSwipe}
                getTimeAgo={getTimeAgo}
                deleteOne={deleteOne}
                readOne={readOne}
              />
            ))
          )}
        </div>

        <div className="w-full pb-4">
          {!dataLoading && notifications?.length > 0 && (
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
    </div>
  );
};

export default Notifications;
