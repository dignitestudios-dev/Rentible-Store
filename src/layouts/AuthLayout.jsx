import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="w-screen min-h-screen  flex justify-center items-center auth_bg p-3 md:py-8">
      {children}
    </div>
  );
};

export default AuthLayout;
