import * as Yup from "yup";

export const updatePassSchema = Yup.object({
  currentPassword: Yup.string().min(8).required("Please enter your password"),
  newPassword: Yup.string().min(8).required("Please enter your password"),
  confirmNewPassword: Yup.string()
    .min(8)
    .required("Please enter your password")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
});
