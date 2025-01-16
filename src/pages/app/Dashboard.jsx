import React from "react";
import Analytics from "../../components/app/dashboard/Analytics";
import RentalsBooking from "../../components/app/dashboard/RentalsBooking";
import RentalTracking from "./RentalTracking";

const Dashboard = () => {
  return (
    <div className="w-full h-full  flex flex-col  py-4  justify-start items-start gap-6">
      <div className="w-full px-2 lg:px-6 h-auto">
        <Analytics />
      </div>
      <RentalTracking />
    </div>
  );
};

export default Dashboard;
