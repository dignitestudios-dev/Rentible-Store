import React, { useEffect } from "react";
import axios from "../../axios";
import { ErrorToast } from "../../components/global/Toaster";
const Refresh = () => {
  useEffect(async () => {
    try {
      const resp = await axios.post("/store/becomeSeller");
      if (resp?.status == 200) {
        window.location.href = resp?.data?.data?.url;
      }
    } catch (err) {
      ErrorToast(err?.response?.data?.message);
    }
  }, []);
  return (
    <div className="w-screen h-screen flex justify-center items-center gap-[2px] flex-col bg-white">
      <h1 className="text-[32px] font-bold leading-[48px]">
        Stripe Refresh Redirection
      </h1>
      <p className="text-[18px] font-normal text-center leading-[27px] text-[#262626]">
        Please wait while we redirect you to the stripe wallet configuration
        screen.
      </p>
    </div>
  );
};

export default Refresh;
