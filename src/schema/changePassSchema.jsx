import * as Yup from "yup";

export const changePassSchema = Yup.object({
  password: Yup.string()
    .matches(/^(?!\s)(?!.*\s$)/, "Password must not begin or end with spaces")
    .min(8, "Password must be at least 8 characters.")
    .required("Please enter your password"),
  confirm_password: Yup.string()
    .matches(/^(?!\s)(?!.*\s$)/, "Password must not begin or end with spaces")
    .min(8, "Password must be at least 8 characters.")
    .required("Please enter your password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});
