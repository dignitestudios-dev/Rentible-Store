import * as Yup from "yup";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
export const identityVerificationSchema = Yup.object({
  identificationFront: Yup.mixed().required(
    "Identity Verification Front image is required."
  ),
  identificationBack: Yup.mixed().required(
    "Identity Verification Back image is required."
  ),
  certificate: Yup.mixed().required(
    "Business ownership certificate image is required."
  ),
  proof: Yup.mixed().required("Proof of address image is required."),
});
