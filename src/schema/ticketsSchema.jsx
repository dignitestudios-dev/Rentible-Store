import * as Yup from "yup";

export const ticketsSchema = Yup.object({
  title: Yup.string()
    .min(2, "Tickets name must contain atleast 2 characters.")
    .max(50, "Name must contain atmost 50 characters.")
    .required("Tickets name is required."),
  description: Yup.string()
    .min(30, "Tickets description must be atleast 30 characters.")
    .max(200, "Tickets description must be less than 200 characters.")
    .required("Tickets description is required."),

});
