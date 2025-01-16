import AuthLayout from "../layouts/AuthLayout";
import OnboardLayout from "../layouts/OnboardLayout";
import ChangePassword from "../pages/authentication/ChangePassword";
import ForgotPassword from "../pages/authentication/ForgotPassword";
import Login from "../pages/authentication/Login";
import OtpVerification from "../pages/authentication/OtpVerification";
import PasswordReset from "../pages/authentication/PasswordReset";
import CompleteProfile from "../pages/onboarding/CompleteProfile";
import EmailOtpVerification from "../pages/onboarding/EmailOtpVerification";
import IdentityVerification from "../pages/onboarding/IdentityVerification";
import PhoneOtpVerification from "../pages/onboarding/PhoneOtpVerification";
import RejectedProfile from "../pages/onboarding/RejectedProfile";
import Signup from "../pages/onboarding/Signup";
import WaitingApproval from "../pages/onboarding/WaitingApproval";

export const onboarding = [
  {
    title: "Signup",
    url: "/signup",
    page: <AuthLayout children={<Signup />} />,
  },
  {
    title: "Verify Email OTP",
    url: "/signup/verify-otp/email",
    page: <AuthLayout children={<EmailOtpVerification />} />,
  },
  {
    title: "Verify Phone OTP",
    url: "/signup/verify-otp/phone",
    page: <AuthLayout children={<PhoneOtpVerification />} />,
  },
  {
    title: "Complete Profile",
    url: "/complete-profile",
    page: <OnboardLayout children={<CompleteProfile />} />,
  },
  {
    title: "Profile Rejection",
    url: "/profile/rejected",
    page: <OnboardLayout children={<RejectedProfile />} />,
  },
  {
    title: "Identity Verification",
    url: "/identity-verification",
    page: <OnboardLayout children={<IdentityVerification />} />,
  },
  {
    title: "Waiting Approval",
    url: "/waiting-approval",
    page: <WaitingApproval />,
  },
];
