import * as Yup from "yup";

export const verifytOtpSchema = Yup.object({
  otp: Yup.string().min(6).required("Please provide the otp."),
});
