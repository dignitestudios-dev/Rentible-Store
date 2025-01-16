import React, { useState } from "react";
import {
  BigCameraIcon,
  CameraIcon,
  FolderIcon,
  OrangeLogo,
  USFlag,
} from "../../assets/export";
import { RxCaretDown } from "react-icons/rx";
import { IoIosArrowRoundBack } from "react-icons/io";
import CompletionSuccess from "./CompletionSuccess";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { identityVerificationValues } from "../../data/identityVerification";
import { identityVerificationSchema } from "../../schema/identityVerificationSchema";
import { FiLoader } from "react-icons/fi";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import axios from "../../axios";
const IdentityVerification = () => {
  const [veirified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const [identificationFront, setIdentificationFront] = useState(null);
  const [identificationFrontUrl, setIdentificationFrontUrl] = useState(null);

  const handleDrop = (e, setFile, setFileUrl, fieldName) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setFile(file);

      // Update Formik field value
      setFieldValue(fieldName, file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleIdentificationFrontClick = (e) => {
    e.preventDefault();
    document.getElementById("identificationFront").click();
  };

  const handleIdentificationFrontChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdentificationFrontUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setIdentificationFront(file);
    }
  };

  const [identificationBack, setIdentificationBack] = useState(null);
  const [identificationBackUrl, setIdentificationBackUrl] = useState(null);

  const handleIdentificationBackClick = (e) => {
    e.preventDefault();
    document.getElementById("identificationBack").click();
  };

  const handleIdentificationBackChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdentificationBackUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setIdentificationBack(file);
    }
  };

  const [certificate, setCertificate] = useState(null);
  const [certificateUrl, setCertificateUrl] = useState(null);

  const handleCertificateClick = (e) => {
    e.preventDefault();
    document.getElementById("certificate").click();
  };

  const handleCertificateChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertificateUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setCertificate(file);
    }
  };

  const [proof, setProof] = useState(null);
  const [proofUrl, setProofUrl] = useState(null);

  const handleProofClick = (e) => {
    e.preventDefault();
    document.getElementById("proof").click();
  };

  const handleProofChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setProof(file);
    }
  };

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues: identityVerificationValues,
    validationSchema: identityVerificationSchema,
    validateOnChange: true,
    validateOnBlur: false,

    onSubmit: async (values, action) => {
      try {
        setLoading(true);
        const formdata = new FormData();

        formdata.append("front", identificationFront);
        formdata.append("back", identificationBack);
        formdata.append("ownershipCertificate", certificate);
        formdata.append("proofOfAddress", proof);
        const response = await axios.post(`/store/verifyIdentity`, formdata);

        if (response?.data?.success) {
          SuccessToast("Identity verification documents sent for approval.");
          setVerified(true);
          setLoading(false);
        }
      } catch (error) {
        ErrorToast(error?.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-auto rounded-[20px] lg:h-[908px] flex flex-col p-3 lg:p-0 items-center justify-center bg-white"
    >
      <div className="w-auto flex flex-col mt-4 justify-center items-center">
        <h2 className="text-[32px] font-bold leading-[48px]">
          Identity Verification
        </h2>
        <p className="text-[18px] font-normal text-center leading-[27px] text-[#262626]">
          Take a Front and Back Image and Owner Certification to Continue
        </p>
      </div>

      <div className="w-full lg:w-[768px] mt-8 grid grid-cols-1 lg:grid-cols-2 justify-center gap-6 items-start">
        <div className="w-full flex flex-col justify-start items-start gap-1">
          <label
            htmlFor=""
            className="text-sm text-black font-normal capitalize"
          >
            Owner’s Identification Front Card Side{" "}
            <span className="text-[#FF0000]">*</span>
          </label>
          <button
            type="button"
            onClick={handleIdentificationFrontClick}
            onDragOver={handleDragOver}
            onDrop={(e) =>
              handleDrop(
                e,
                setIdentificationFront,
                setIdentificationFrontUrl,
                "identificationFront"
              )
            }
            className="w-full h-[100px] rounded-[18px] border border-dashed border-[#d9d9d9] flex flex-col justify-center items-center gap-1"
          >
            {identificationFrontUrl ? (
              <img
                src={identificationFrontUrl}
                className="w-full h-full rounded-[18px] object-contain"
              />
            ) : (
              <>
                <img src={FolderIcon} alt="folder-icon" />
                <span className="text-[12px] font-normal text-[#959393]">
                  Drag & drop or <span className="text-black">choose file</span>{" "}
                  to upload
                </span>
              </>
            )}
          </button>

          <input
            type="file"
            id="identificationFront"
            name="identificationFront"
            accept="image/*"
            className="hidden"
            onBlur={handleBlur}
            onChange={(e) => {
              handleIdentificationFrontChange(e);
              handleChange(e);
            }}
          />
          {errors.identificationFront && touched.identificationFront ? (
            <p className="text-red-700 text-xs w-full flex  justify-start mr-1 bg-transparent font-medium">
              {errors.identificationFront}
            </p>
          ) : null}
        </div>
        <div className="w-full flex flex-col justify-start items-start gap-1">
          <label
            htmlFor=""
            className="text-sm text-black font-normal capitalize"
          >
            Owner’s Identification Back Card Side{" "}
            <span className="text-[#FF0000]">*</span>
          </label>
          <button
            type="button"
            onClick={handleIdentificationBackClick}
            onDragOver={handleDragOver}
            onDrop={(e) =>
              handleDrop(
                e,
                setIdentificationBack,
                setIdentificationBackUrl,
                "identificationBack"
              )
            }
            className="w-full h-[100px] rounded-[18px] border border-dashed border-[#d9d9d9] flex flex-col justify-center items-center gap-1"
          >
            {identificationBackUrl ? (
              <img
                src={identificationBackUrl}
                className="w-full h-full rounded-[18px] object-contain"
              />
            ) : (
              <>
                <img src={FolderIcon} alt="folder-icon" />
                <span className="text-[12px] font-normal text-[#959393]">
                  Drag & drop or <span className="text-black">choose file</span>{" "}
                  to upload
                </span>
              </>
            )}
          </button>

          <input
            type="file"
            id="identificationBack"
            name="identificationBack"
            accept="image/*"
            className="hidden"
            onBlur={handleBlur}
            onChange={(e) => {
              handleIdentificationBackChange(e);
              handleChange(e);
            }}
          />
          {errors.identificationBack && touched.identificationBack ? (
            <p className="text-red-700 text-xs w-full flex  justify-start mr-1 bg-transparent font-medium">
              {errors.identificationBack}
            </p>
          ) : null}
        </div>
        <div className="w-full flex flex-col justify-start items-start gap-1">
          <label
            htmlFor=""
            className="text-sm text-black font-normal capitalize"
          >
            Business/Ownership Certificate{" "}
            <span className="text-[#FF0000]">*</span>
          </label>
          <button
            type="button"
            onClick={handleCertificateClick}
            onDragOver={handleDragOver}
            onDrop={(e) =>
              handleDrop(e, setCertificate, setCertificateUrl, "certificate")
            }
            className="w-full h-[100px] rounded-[18px] border border-dashed border-[#d9d9d9] flex flex-col justify-center items-center gap-1"
          >
            {certificateUrl ? (
              <img
                src={certificateUrl}
                className="w-full h-full rounded-[18px] object-contain"
              />
            ) : (
              <>
                <img src={FolderIcon} alt="folder-icon" />
                <span className="text-[12px] font-normal text-[#959393]">
                  Drag & drop or <span className="text-black">choose file</span>{" "}
                  to upload
                </span>
              </>
            )}
          </button>

          <input
            type="file"
            id="certificate"
            name="certificate"
            accept="image/*"
            className="hidden"
            onBlur={handleBlur}
            onChange={(e) => {
              handleCertificateChange(e);
              handleChange(e);
            }}
          />
          {errors.certificate && touched.certificate ? (
            <p className="text-red-700 text-xs w-full flex  justify-start mr-1 bg-transparent font-medium">
              {errors.certificate}
            </p>
          ) : null}
        </div>
        <div className="w-full flex flex-col justify-start items-start gap-1">
          <label
            htmlFor=""
            className="text-sm text-black font-normal capitalize"
          >
            proof of address <span className="text-[#FF0000]">*</span>
          </label>
          <button
            type="button"
            onClick={handleProofClick}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, setProof, setProofUrl, "proof")}
            className="w-full h-[100px] rounded-[18px] border border-dashed border-[#d9d9d9] flex flex-col justify-center items-center gap-1"
          >
            {proofUrl ? (
              <img
                src={proofUrl}
                className="w-full h-full rounded-[18px] object-contain"
              />
            ) : (
              <>
                <img src={FolderIcon} alt="folder-icon" />
                <span className="text-[12px] font-normal text-[#959393]">
                  Drag & drop or <span className="text-black">choose file</span>{" "}
                  to upload
                </span>
              </>
            )}
          </button>

          <input
            type="file"
            id="proof"
            name="proof"
            accept="image/*"
            className="hidden"
            onBlur={handleBlur}
            onChange={(e) => {
              handleProofChange(e);
              handleChange(e);
            }}
          />
          {errors.proof && touched.proof ? (
            <p className="text-red-700 text-xs w-full flex  justify-start mr-1 bg-transparent font-medium">
              {errors.proof}
            </p>
          ) : null}
        </div>
      </div>

      <button
        type="submit"
        className="w-[322px] h-[49px] rounded-[8px] mt-8 bg-[#F85E00] text-white flex gap-2 items-center justify-center text-md font-medium"
      >
        <span>Save</span>
        {loading && <FiLoader className="animate-spin text-lg " />}
      </button>

      <Link
        to={-1}
        className="text-sm font-medium  text-black hover:no-underline hover:text-black mt-5 flex items-center justify-center"
      >
        <IoIosArrowRoundBack className="text-[28px]" />
        <span>Back</span>
      </Link>
      {veirified && <CompletionSuccess />}
    </form>
  );
};

export default IdentityVerification;
