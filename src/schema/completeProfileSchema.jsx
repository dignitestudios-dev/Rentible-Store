import * as Yup from "yup";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
export const completeProfileSchema = Yup.object({
  description: Yup.string()
    .max(200, "Description must be less than 200 characters.")
    .required("Please enter store description."),
  apartment: Yup.string(),
  address: Yup.string().required("Please enter your street address."),
  city: Yup.string().required("Please select city."),
  state: Yup.string().required("Please select state."),
  zipCode: Yup.string().required("Please enter your zip code."),
  profilePicture: Yup.mixed().required("Store logo is required."),
  cover: Yup.mixed().required("Store cover image is required."),
});
