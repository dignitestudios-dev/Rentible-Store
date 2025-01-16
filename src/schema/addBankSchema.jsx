import * as Yup from "yup";

export const addBankSchema = Yup.object({
  routingNumber: Yup.string()
    .max(9, "Routing Number must be maximum 9 characters long.")
    .required("Please enter your routing number.")
    .matches(/^\d+$/, "Routing number must be a numeric value."),

  accountNumber: Yup.string()
    .min(12, "Account Number must be minimum 12 characters long.")
    .max(17, "Account number must be maximum 17 characters long.")
    .required("Please enter your account number.")
    .matches(/^\d+$/, "Account number must be a numeric value."),
  accountHolderName: Yup.string().required(
    "Please enter your account handler name."
  ),
});
