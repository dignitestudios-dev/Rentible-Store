import * as Yup from "yup";

export const signUpSchema = Yup.object({
  email: Yup.string()
    .email("Email must've to be valid.")
    .required("Please enter your email"),
  password: Yup.string()
    .min(6, "Password must contain atleast 6 alphanumeric characters.")
    .required("Please enter your password"),
  name: Yup.string()
    .min(4, "Name must contain atleast 4 characters.")
    .required("Please enter your store name."),
  phone: Yup.string()
    .matches(/^[2-9]\d{2}[2-9]\d{2}\d{4}$/, "Phone number must be valid.")
    .min(10, "Phone number must be 10 digits long")
    .required("Please enter your phone number"),
});
