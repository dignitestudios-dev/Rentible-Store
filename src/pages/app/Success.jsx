import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/dashboard");
      localStorage.setItem("activeLink", "Dashboard");
    }, 5000);
  }, []);
  return (
    <div class="w-screen h-screen flex flex-col gap-4 justify-center items-center">
      <img src="/success_vector.png" alt="" class="" />
      <span class="text-4xl text-orange-600 font-bold">Congratulations!</span>
      <span class="text-gray-500 text-xl text-center font-medium">
        Your seller account has been successfully submitted. <br />
        Redirecting you to the business dashboard.
      </span>

      <button
        onClick={() => {
          navigate("/dashboard");
          localStorage.setItem("activeLink", "Dashboard");
        }}
        className="w-auto h-10 rounded-lg px-3 flex items-center justify-center text-white text-xs font-medium bg-orange-600"
      >
        Continue to Dashboard
      </button>
    </div>
  );
};

export default Success;
