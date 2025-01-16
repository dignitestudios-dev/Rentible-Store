import React from "react";

const OnboardLayout = ({ children }) => {
  return (
    <div className="w-full bg-[#F85E00] p-2 lg:p-[15px] flex items-center justify-center">
      {children}
    </div>
  );
};

export default OnboardLayout;
