import * as Yup from "yup";
export const verifyEmailSchema = Yup.object({
  email: Yup.string().email().required("Please enter your email."),
});
