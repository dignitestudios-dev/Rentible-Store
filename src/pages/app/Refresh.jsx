import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { ErrorToast } from "../../components/global/Toaster";
import { ImSpinner9 } from "react-icons/im";
const Refresh = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const resp = await axios.post("/store/becomeSeller");
        if (resp?.status == 200) {
          window.location.href = resp?.data?.data?.url;
        }
      } catch (err) {
        ErrorToast(err?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    }, 3000);
  }, []);
  return (
    <div class="w-screen h-screen flex flex-col gap-4 justify-center items-center">
      <img src="/refresh_vector.png" alt="" class="w-56" />
      <span class="text-4xl text-orange-600 font-bold">
        Account not created!
      </span>
      <span class="text-gray-500 text-xl text-center font-medium">
        Your seller account could not be created. <br /> Redirecting you to the
        stripe's wallet configuration screen.
      </span>

      {loading && (
        <ImSpinner9 className="animate-spin text-orange-600 text-3xl" />
      )}
    </div>
  );
};

export default Refresh;
