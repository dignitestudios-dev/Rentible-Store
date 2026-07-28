import * as Yup from "yup";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const imageValidation = (requiredMessage) =>
  Yup.mixed()
    .required(requiredMessage)
    .test(
      "fileType",
      "Unsupported file format. Please upload JPG, JPEG, PNG, or WEBP.",
      (value) => {
        if (!value) return true;
        if (typeof value === "string") return true;
        if (value instanceof File) {
          return SUPPORTED_FORMATS.includes(value.type);
        }
        return true;
      }
    )
    .test("fileSize", "File size must be less than 5MB.", (value) => {
      if (!value) return true;
      if (typeof value === "string") return true;
      if (value instanceof File) {
        return value.size <= MAX_FILE_SIZE;
      }
      return true;
    });

export const identityVerificationSchema = Yup.object({
  identificationFront: imageValidation(
    "Identity Verification Front image is required."
  ),
  identificationBack: imageValidation(
    "Identity Verification Back image is required."
  ),
  certificate: imageValidation(
    "Business ownership certificate image is required."
  ),
  proof: imageValidation("Proof of address image is required."),
});

