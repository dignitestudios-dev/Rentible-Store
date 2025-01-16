import * as Yup from "yup";

export const withdrawSchema = Yup.object({
  amount: Yup.string()
    .required("Please enter amount.")
    .matches(/^\d+$/, "Amount must be a numeric value."),
});
