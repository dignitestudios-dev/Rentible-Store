import React, { useEffect, useState } from "react";
import { OrangeLogo, USFlag } from "../../assets/export";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import {
  createUserWithEmailAndPassword,
  getIdToken,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useFormik } from "formik";
import { signUpSchema } from "../../schema/signupSchema";
import { signUpValues } from "../../data/signup";
import axios from "../../axios";
import {
  ErrorToast,
  SuccessToast,
  WarningToast,
} from "../../components/global/Toaster.jsx";
import Cookies from "js-cookie";
import { FiLoader } from "react-icons/fi";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [idToken, setIdToken] = useState(null);
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const sendEmailOTP = async () => {
    try {
      setLoading(true);
      // API call to login using Axios interceptor
      const response = await axios.post(`/auth/emailVerificationOTP`);

      if (response?.data?.success) {
        localStorage.setItem("email", values?.email);
        localStorage.setItem("phone", `1${values?.phone}`);

        navigate("/signup/verify-otp/email");
        setLoading(false);
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    try {
      const response = await axios.post("/auth/check", {
        email: values?.email,
        role: "store",
      });
      if (response) {
        return true;
      }
    } catch (error) {
      return true;
    }
  };

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: signUpValues,
      validationSchema: signUpSchema,
      validateOnChange: true,
      validateOnBlur: false,

      onSubmit: async (values, action) => {
        setLoading(true);
        try {
          const status = await checkStatus();
          if (status) {
            const newUser = await createUserWithEmailAndPassword(
              auth,
              values?.email,
              values?.password
            );
            const user = newUser.user;
            // Get the ID token
            const token = await getIdToken(user);
            if (token) {
              setIdToken(token);
              setLoading(true);
              try {
                // API call to login using Axios interceptor
                const response = await axios.post(`/auth/storeSignUp`, {
                  email: values?.email,
                  password: values?.password,
                  name: values?.name,
                  idToken: token,
                  role: "store",
                  phone: `1${values?.phone}`,
                });

                // Handle the response (e.g., save token, redirect)
                if (response?.data?.success) {
                  Cookies.set("token", response?.data?.data?.token);
                  sendEmailOTP();
                }
              } catch (error) {
                ErrorToast(
                  error?.response?.data?.message || "Something went wrong."
                );
              } finally {
                setLoading(false);
              }
            } else {
              ErrorToast(
                "Error fetching token. Please try signingup with a different email."
              );
              setLoading(false);
            }
          }
        } catch (error) {
          if (error.code === "auth/email-already-in-use") {
            // Try to sign in the user
            try {
              const userCredential = await signInWithEmailAndPassword(
                auth,
                values?.email,
                values?.password
              );
              const user = userCredential.user;
              //   // Get the ID token
              const token = await getIdToken(user);
              if (token) {
                setIdToken(token);
                setLoading(true);
                try {
                  // API call to login using Axios interceptor
                  const response = await axios.post(`/auth/storeSignUp`, {
                    email: values?.email,
                    password: values?.password,
                    name: values?.name,
                    idToken: token,
                    role: "store",
                    phone: `1${values?.phone}`,
                  });

                  // Handle the response (e.g., save token, redirect)
                  if (response?.data?.success) {
                    Cookies.set("token", response?.data?.data?.token);
                    sendEmailOTP();
                  }
                } catch (error) {
                  ErrorToast(
                    error?.response?.data?.message || "Something went wrong."
                  );
                } finally {
                  setLoading(false);
                }
              } else {
                ErrorToast(
                  "Error fetching token. Please try signingup with a different email."
                );
                setLoading(false);
              }
            } catch (error) {
              if (error.code === "auth/invalid-credential") {
                ErrorToast("Store already exists try logging in instead.");
                navigate("/login");
              }
            } finally {
              setLoading(false);
            }
          } else {
            ErrorToast("Error in signup. Conditions failed.");
            setLoading(false);
          }
        }
      },
    });

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/dashboard");
    } else {
      return;
    }
  }, []);

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
      className="w-full h-auto flex flex-col items-center p-6 justify-center md:w-[499px] md:min-h-[690px]  rounded-[19px] bg-white"
    >
      <img src={OrangeLogo} alt="orange_logo" className="w-[148.4px]" />
      <div className="w-auto flex flex-col mt-4 justify-center items-center">
        <h2 className="text-[32px] font-bold leading-[48px]">Sign Up</h2>
        <p className="text-[18px] font-normal text-center leading-[27px] text-[#3C3C43D9]">
          Please enter your details to continue
        </p>
      </div>

      <div className="w-full md:w-[393px] mt-5 flex flex-col justify-start items-start gap-4">
        <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
          <input
            type="text"
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full h-[49px] border-[0.8px] bg-[#F8F8F899] outline-none  rounded-[8px] placeholder:text-[#959393] text-[#262626] px-3 text-[16px] font-normal leading-[20.4px] ${
              errors?.name && touched?.name
                ? "border-red-500"
                : "border-[#D9D9D9]"
            }`}
            placeholder="Store Name"
          />

          {errors.name && touched.name ? (
            <p className="text-red-700 text-sm font-medium">{errors.name}</p>
          ) : null}
        </div>
        <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
          <input
            type="text"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full h-[49px] border-[0.8px] bg-[#F8F8F899] outline-none  rounded-[8px] placeholder:text-[#959393] text-[#262626] px-3 text-[16px] font-normal leading-[20.4px] ${
              errors?.email && touched?.email
                ? "border-red-500"
                : "border-[#D9D9D9]"
            }`}
            placeholder="Store Email Address"
          />
          {errors.email && touched.email ? (
            <p className="text-red-700 text-sm font-medium">{errors.email}</p>
          ) : null}
        </div>

        <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
          <div className="h-[49px] flex justify-start gap-2  items-start w-full relative ">
            <span
              className={`w-[15%]  bg-[#F8F8F899] border-[0.8px]    ${
                errors?.phone && touched?.phone
                  ? "border-red-500"
                  : "border-[#D9D9D9]"
              } rounded-[8px] h-full   text-md text-[#959393] flex items-center justify-center`}
            >
              <img src={USFlag} alt="us_phone_number" />
              <span className="ml-[3px]">+1</span>
            </span>
            <input
              type="text"
              id="phone"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              maxLength={10}
              onBlur={handleBlur}
              className={`w-full h-[49px] border-[0.8px] bg-[#F8F8F899] outline-none  rounded-[8px] placeholder:text-[#959393] text-[#262626] px-3 text-[16px] font-normal leading-[20.4px] ${
                errors?.phone && touched?.phone
                  ? "border-red-500"
                  : "border-[#D9D9D9]"
              }`}
              placeholder="Phone Number"
            />
          </div>

          {errors.phone && touched.phone ? (
            <p className="text-red-700 text-sm font-medium">{errors.phone}</p>
          ) : null}
        </div>
        <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
          <div
            className={`h-[49px] flex justify-start bg-[#F8F8F899] items-start w-full relative border-[0.8px]  border-[#D9D9D9] rounded-[8px] ${
              errors?.password && touched?.password
                ? "border-red-500"
                : "border-[#D9D9D9]"
            }`}
          >
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-[90%] h-full  bg-transparent rounded-l-[8px] placeholder:text-[#959393] outline-none text-[#262626] px-3 text-[16px] font-normal leading-[20.4px]"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              className="w-[10%] h-full rounded-r-[8px] bg-transparent text-md text-[#959393] flex items-center justify-center"
            >
              {isPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
          {errors.password && touched.password ? (
            <p className="text-red-700 text-sm font-medium">
              {errors.password}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          className="w-full h-[49px] rounded-[8px] bg-[#F85E00] text-white flex gap-2 items-center justify-center text-md font-medium"
        >
          <span>Sign Up</span>
          {loading && <FiLoader className="animate-spin text-lg " />}
        </button>

        <div className="w-full h-[49px] flex justify-center items-center">
          <span className="text-[14px] md:text-[18px] flex gap-1 font-normal leading-[27px] text-[#959393]">
            Already Have an Account?
            <Link
              className="font-semibold text-[#F85E00] hover:no-underline hover:text-[#F85E00]"
              to={"/login"}
            >
              Let’s Log In
            </Link>
          </span>
        </div>

        <div className="w-full flex justify-center capitalize items-center text-[16px] font-normal text-black">
          <span>
            I agree the{" "}
            <Link
              to={"/terms-and-conditions"}
              className="text-[#F85E00] hover:no-underline hover:text-[#F85E00]"
            >
              terms & conditions
            </Link>{" "}
            &{" "}
            <Link
              to={"/privacy-policy"}
              className="text-[#F85E00] hover:no-underline hover:text-[#F85E00]"
            >
              privacy policy
            </Link>
          </span>
        </div>
      </div>
    </form>
  );
};

export default Signup;
