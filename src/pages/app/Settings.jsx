import React, { useContext, useEffect, useState } from "react";
import ReportReviewConfirm from "../../components/app/products/ReportReviewConfirm";
import { SuccessToast } from "../../components/global/Toaster";
import Cookies from "js-cookie";
import ChangePasswordModal from "../../components/app/settings/ChangePasswordModal";
import axios from "../../axios";
import { AppContext } from "../../context/AppContext";
import BankModal from "../../components/app/settings/BankModal";

const Settings = () => {
  const { fetchToken } = useContext(AppContext);
  const [active, setActive] = useState(false);

  const store = Cookies.get("store") ? JSON.parse(Cookies.get("store")) : null;

  const [changePassOpen, setChangePassOpen] = useState(false);
  const [notification, setNotification] = useState(false);

  const getSettings = async () => {
    const { data } = await axios.get("/settings");
    setNotification(data?.data?.notification);
  };
  useEffect(() => {
    getSettings();
  }, []);

  const toggleNotification = async (bool) => {
    const { data } = await axios.put("/settings", {
      notification: bool,
    });
    if (bool && data?.success) {
      fetchToken();
    }
  };

  const [openBank, setOpenBank] = useState(false);

  return (
    <div className="w-full h-full  flex flex-col  py-4 px-2 lg:px-6 justify-start items-start gap-6">
      <div className="w-full h-auto  pb-4 flex flex-col gap-3 justify-start items-start">
        <div className="w-full relative flex justify-between items-center">
          <span className="text-[32px] font-bold leading-[48px] text-[#202224]">
            Settings
          </span>
        </div>
      </div>

      <div className="w-full rounded-[18px] divide-y-[1px] bg-white p-4 lg:p-7 flex justify-start items-start flex-col">
        <div className="w-full h-auto  pb-4 flex flex-col justify-start items-start">
          <span className="w-auto text-[18px] font-medium text-black leading-[27px]">
            Email Address
          </span>
          <span className="w-auto text-[16px] font-normal leading-[24px] text-[#050405]/[0.5]">
            {store?.email || "N/A"}
          </span>
        </div>

        <div className="w-full  py-4 flex justify-between items-center">
          <div className="w-full h-auto  flex flex-col justify-start items-start">
            <span className="w-auto text-[18px] font-medium text-black leading-[27px]">
              Notifications
            </span>
            <span className="w-auto text-[16px] font-normal leading-[24px] text-[#050405]/[0.5]">
              Activate/deactivate notifications.
            </span>
          </div>

          {/* <ReportReviewConfirm
            isOpen={active}
            onRequestClose={() => setActive(false)}
            onConfirm={() => SuccessToast("Confirmed")}
            loading={!active}
          /> */}
          <button
            onClick={() => {
              setNotification((prev) => !prev);
              toggleNotification(notification ? false : true);
            }}
            className={`w-[36px] h-[18px] rounded-full   flex ${
              notification
                ? "bg-[#F85E00] justify-end"
                : "justify-start bg-[#d9d9d9]"
            }  p-[1.5px]  `}
          >
            <span className="w-[15px] h-[15px] rounded-full bg-white shadow "></span>
          </button>
        </div>

        <div className="w-full  py-4 flex justify-between items-center">
          <div className="w-full h-auto  flex flex-col justify-start items-start">
            <span className="w-auto text-[18px] font-medium text-black leading-[27px]">
              Password
            </span>
            <span className="w-auto text-[16px] font-normal leading-[24px] text-[#050405]/[0.5]">
              *******
            </span>
          </div>

          <button
            onClick={() => {
              setChangePassOpen(true);
            }}
            className="w-[162px] h-[51px] flex items-center justify-center rounded-[6px] text-[#7D7C7D] bg-[#F4F4F4] leading-[24px] font-normal text-[16px]"
          >
            Change
          </button>
        </div>

        <ChangePasswordModal
          isOpen={changePassOpen}
          onRequestClose={() => setChangePassOpen(false)}
        />

        <div className="w-full py-4 flex justify-between items-center">
          <div className="w-full h-auto   flex flex-col justify-start items-start">
            <span className="w-auto text-[18px] font-medium text-black leading-[27px]">
              Bank Account
            </span>
            <span className="w-auto text-[16px] font-normal leading-[24px] text-[#050405]/[0.5]">
              Change Bank Account and Card Details
            </span>
          </div>

          <button
            onClick={() => setOpenBank(true)}
            className="w-[162px] h-[51px] flex items-center justify-center rounded-[6px] text-[#7D7C7D] bg-[#F4F4F4] leading-[24px] font-normal text-[16px]"
          >
            Change
          </button>
        </div>

        <BankModal
          isOpen={openBank}
          onRequestClose={() => setOpenBank(false)}
        />

        <div className="w-full flex py-4 justify-between items-center">
          <div className="w-full h-auto   flex flex-col justify-start items-start">
            <span className="w-auto text-[18px] font-medium text-black leading-[27px]">
              Contract Management
            </span>
            <span className="w-auto text-[16px] font-normal leading-[24px] text-[#050405]/[0.5]">
              View your contract details
            </span>
          </div>

          <button className="w-[162px] h-[51px] flex items-center justify-center rounded-[6px] text-[#7D7C7D] bg-[#F4F4F4] leading-[24px] font-normal text-[16px]">
            View Contract
          </button>
        </div>

        <div className="w-full flex pt-4 justify-between items-center">
          <div className="w-full h-auto   flex flex-col justify-start items-start">
            <span className="w-auto text-[18px] font-medium text-black leading-[27px]">
              Support
            </span>
            <span className="w-auto text-[16px] font-normal leading-[24px] text-[#050405]/[0.5]">
              Have any question? Contact us
            </span>
          </div>

          <a
            href="mailto:support@rentibles.com"
            className="w-[268px] h-[51px] flex items-center justify-center rounded-[6px] text-[#fff] hover:text-white focus-within:text-white focus:text-white focus-visible:text-white focus-within:no-underline bg-[#F85E00] leading-[24px] font-normal text-[12px] lg:text-[16px]"
          >
            support@rentbiles.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Settings;
