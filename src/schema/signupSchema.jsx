import * as Yup from "yup";

export const signUpSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Please enter your email"),
  password: Yup.string()
    .matches(/^(?!\s)(?!.*\s$)/, "Password must not begin or end with spaces")
    .min(6, "Password must contain atleast 6 alphanumeric characters.")
    .required("Please enter your password"),
  name: Yup.string()
    .min(4, "Name must contain at least 4 characters.")
    .max(20, "Name must contain at most 20 characters.")
    .matches(/^[A-Za-z\s]+$/, "Name must contain only alphabets.")
    .required("Please enter your store name."),
  phone: Yup.string()
    .matches(/^[2-9]\d{2}[2-9]\d{2}\d{4}$/, "Phone number must be valid.")
    .min(10, "Phone number must be 10 digits long")
    .required("Please enter your phone number"),
});
