import * as Yup from "yup";

export const signInSchema = Yup.object({
  email: Yup.string()
    .email("Email must've to be valid.")
    .required("Please enter your email"),
  password: Yup.string()
    .min(6, "Password must contain atleast 6 alphanumeric characters.")
    .required("Please enter your password"),
});
