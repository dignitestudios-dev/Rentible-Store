import { toast, Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
export const ToasterContainer = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        style: {
          background: "#333",
          color: "#fff",
        },
      }}
    />
  );
};

export const SuccessToast = (message) => {
  console.log(message);
  toast.success(message, {
    duration: 3000, // customize as needed
    style: {
      background: "green",
      color: "#fff",
    },
    iconTheme: {
      primary: "white",
      secondary: "green",
    },
  });
};

export const NotificationToast = ({ title, message, route }) => {
  toast.custom(
    (t) => (
      <Link
        to={route}
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full no-underline hover:no-underline hover:text-gray-500 focus-within:no-underline focus:no-underline focus-within:text-gray-500 bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <img
                className="h-10 w-10 rounded-md"
                src={"/logo.png"}
                alt="User Avatar"
              />
            </div>
            <div className="ml-3 flex-1">
              <p
                className="text-sm font-medium no-underline hover:no-underline hover:text-gray-900 focus-within:no-underline focus:no-underline
 focus-within:text-gray-900 text-gray-900"
              >
                {title}
              </p>
              <p className="mt-1 text-sm no-underline text-gray-500 hover:text-gray-500 focus-within:no-underline focus:no-underline focus-within:text-gray-500">
                {message}
              </p>
            </div>
          </div>
        </div>
        {/* <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-orange-600 hover:text-orange-500 focus:outline-none "
          >
            Close
          </button>
        </div> */}
      </Link>
    ),
    {
      position: "bottom-right", // Set position to bottom-right
    }
  );
};

export const ErrorToast = (message) => {
  toast.error(message, {
    duration: 3000,
    style: {
      background: "#ff4d4d",
      color: "#fff",
    },
    iconTheme: {
      primary: "white",
      secondary: "#ff4d4d",
    },
  });
};

export const WarningToast = (message) => {
  toast(message, {
    icon: "⚠️",
    duration: 3000,
    style: {
      background: "#fff",
      color: "#1c1c1c",
    },
    iconTheme: {
      primary: "white",
      secondary: "#fff",
    },
  });
};
