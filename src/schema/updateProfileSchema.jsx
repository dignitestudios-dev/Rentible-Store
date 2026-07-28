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

export const updateProfileSchema = Yup.object({
  name: Yup.string()
    .min(4, "Name must contain atleast 4 characters.")
    .required("Please enter your store name."),
  description: Yup.string().required("Please enter store description."),
  apartment: Yup.string(),
  address: Yup.string().required("Please enter your street address."),
  city: Yup.string().required("Please select your city."),
  state: Yup.string().required("Please select your state."),
  zipCode: Yup.string().required("Please enter your zip code."),
  profilePicture: imageValidation("Store logo is required."),
  cover: imageValidation("Store cover image is required."),
});

