import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RejectedProfile = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/identity-verification");
    }, 6000);
  }, []);
  return (
    <div className="w-full h-auto  lg:h-screen flex items-center justify-center">
      <img
        src="/rejected_profile.png"
        alt=""
        onClick={() => navigate("/identity-verification")}
        className="w-full lg:w-auto lg:h-[574px] cursor-pointer"
      />
    </div>
  );
};

export default RejectedProfile;
