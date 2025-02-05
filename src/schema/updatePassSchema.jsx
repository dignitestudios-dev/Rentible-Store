import * as Yup from "yup";

export const updatePassSchema = Yup.object({
  currentPassword: Yup.string()
    .matches(/^(?!\s)(?!.*\s$)/, "Password must not begin or end with spaces")
    .min(8, "Password must be at least 8 characters")
    .required("Please enter your current password"),

  newPassword: Yup.string()
    .matches(/^(?!\s)(?!.*\s$)/, "Password must not begin or end with spaces")
    .min(8, "Password must be at least 8 characters")
    .required("Please enter your new password")
    .test(
      "not-same-as-current",
      "New password cannot be the same as the current password",
      function (value) {
        // `this.parent` refers to the object containing all the fields
        return value !== this.parent.currentPassword;
      }
    ),

  confirmNewPassword: Yup.string()
    .matches(/^(?!\s)(?!.*\s$)/, "Password must not begin or end with spaces")
    .min(8, "Password must be at least 8 characters")
    .required("Please confirm your new password")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
});
