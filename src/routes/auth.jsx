import AuthLayout from "../layouts/AuthLayout";
import ChangePassword from "../pages/authentication/ChangePassword";
import ForgotPassword from "../pages/authentication/ForgotPassword";
import Login from "../pages/authentication/Login";
import OtpVerification from "../pages/authentication/OtpVerification";
import PasswordReset from "../pages/authentication/PasswordReset";

export const auth = [
  {
    title: "Login",
    url: "/login",
    page: <AuthLayout children={<Login />} />,
  },
  {
    title: "Forgot Password",
    url: "/forgot-password",
    page: <AuthLayout children={<ForgotPassword />} />,
  },
  {
    title: "Verify Otp",
    url: "/forgot-password/verify-otp/email",
    page: <AuthLayout children={<OtpVerification />} />,
  },
  {
    title: "Change Password",
    url: "/change-password",
    page: <AuthLayout children={<ChangePassword />} />,
  },
  {
    title: "Password Reset",
    url: "/password-updated",
    page: <AuthLayout children={<PasswordReset />} />,
  },
];
