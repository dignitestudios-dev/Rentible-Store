import * as Yup from "yup";

export const addProductSchema = Yup.object({
  name: Yup.string().required("Product name is required."),
  description: Yup.string().required("Product description is required."),
  categoryId: Yup.string().required("Please select a category."),
  subCategoryId: Yup.string().required("Please select a sub category."),
  quantity: Yup.string()
    .required("Please add product quantity.")
    .matches(/^\d+$/, "Quantity must only contain numbers.")
    .test(
      "is-greater-than-zero",
      "Quantity must be a positive integer.",
      (value) => parseInt(value, 10) > 0
    ),
  availableDays: Yup.array()
    .required("Please select availability days.") // Required validation
    .min(1, "You must've to select atleast one day."),
  pickupTime: Yup.string().required("Please select pickup time."),
  dropOffTime: Yup.string().required("Please select drop off time."),
  pickupAddress: Yup.string().required(
    "You need to provide a valid pickup address."
  ),
  pricePerHour: Yup.string().required(
    "Please provide hourly price of the product."
  ),
  pricePerDay: Yup.string().required(
    "Please provide daily price of the product."
  ),
  browse: Yup.array()
    .required("Please provide product images.") // Required validation
    .min(4, "You must've to select atleast four images."),
});
