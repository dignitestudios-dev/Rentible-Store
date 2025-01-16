import React, { useEffect } from "react";
import { WaitingApprove } from "../../assets/export";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const WaitingApproval = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      Cookies.remove("token");
      navigate("/login");
    }, 5000);
  }, []);
  return (
    <div className="w-screen h-screen flex justify-center items-center gap-2 flex-col bg-white">
      <img
        src={WaitingApprove}
        alt="awaiting-approval"
        className="w-full lg:w-auto lg:h-[501px]"
      />
    </div>
  );
};

export default WaitingApproval;
