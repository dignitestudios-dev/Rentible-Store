import * as Yup from "yup";

export const updatePhoneSchema = Yup.object({
  phone: Yup.string()
    .matches(/^[2-9]\d{2}[2-9]\d{2}\d{4}$/, "Phone number must be valid.")
    .min(10, "Phone number must be 10 digits long")
    .required("Please enter your phone number"),
});
