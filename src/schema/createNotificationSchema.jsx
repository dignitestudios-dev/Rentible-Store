import * as Yup from "yup";

export const createNotificationSchema = Yup.object({
  notification_title: Yup.string()
    .min(4)
    .required("Notification Title is a required field."),
  notification_message: Yup.string()
    .min(10)
    .required("Notification Message is a required field."),
});
