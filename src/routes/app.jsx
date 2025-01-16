import AppLayout from "../layouts/AppLayout";
import Dashboard from "../pages/app/Dashboard";
import Customers from "../pages/app/Customers";
import Products from "../pages/app/Products";
import AddProduct from "../pages/app/AddProduct";
import ProductDetails from "../pages/app/ProductDetails";
import EditProduct from "../pages/app/EditProduct";
import Orders from "../pages/app/Orders";
import RentalTracking from "../pages/app/RentalTracking";
import ProductRequests from "../pages/app/ProductRequests";
import ProductIssues from "../pages/app/ProductIssues";
import Settings from "../pages/app/Settings";
import Messages from "../pages/app/Messages";
import RentalDetails from "../pages/app/RentalDetails";
import MyProfile from "../pages/app/MyProfile";
import UpdateProfile from "../pages/app/UpdateProfile";
import Notifications from "../pages/app/Notifications";
import CustomerDetails from "../pages/app/CustomerDetails";
import Wallet from "../pages/app/Wallet";
import Success from "../pages/app/Success";
import Refresh from "../pages/app/Refresh";

export const app = [
  {
    title: "Dashboard",
    url: "/dashboard",
    page: <AppLayout page={<Dashboard />} />,
  },
  {
    title: "Customer",
    url: "/customers",
    page: <AppLayout page={<Customers />} />,
  },
  {
    title: "Customer Detail",
    url: "/customers/:id",
    page: <AppLayout page={<CustomerDetails />} />,
  },
  {
    title: "Products",
    url: "/products",
    page: <AppLayout page={<Products />} />,
  },
  {
    title: "Add Product",
    url: "/products/add",
    page: <AppLayout page={<AddProduct />} />,
  },
  {
    title: "Edit Product",
    url: "/products/update/:id",
    page: <AppLayout page={<EditProduct />} />,
  },
  {
    title: "Product Detail",
    url: "/products/:id",
    page: <AppLayout page={<ProductDetails />} />,
  },
  // {
  //   title: "Orders",
  //   url: "/orders",
  //   page: <AppLayout page={<Orders />} />,
  // },
  {
    title: "Rental Tracking",
    url: "/rental-tracking",
    page: <AppLayout page={<RentalTracking />} />,
  },
  {
    title: "Rental Tracking",
    url: "/rental-tracking/:id",
    page: <AppLayout page={<RentalDetails />} />,
  },
  {
    title: "Product Issues",
    url: "/product-issues",
    page: <AppLayout page={<ProductIssues />} />,
  },
  {
    title: "Product Requests",
    url: "/product-requests",
    page: <AppLayout page={<ProductRequests />} />,
  },
  {
    title: "Settings",
    url: "/settings",
    page: <AppLayout page={<Settings />} />,
  },
  {
    title: "Wallet",
    url: "/wallet",
    page: <AppLayout page={<Wallet />} />,
  },
  {
    title: "Profile",
    url: "/profile",
    page: <AppLayout page={<MyProfile />} />,
  },
  {
    title: "Notifcations",
    url: "/notifications",
    page: <AppLayout page={<Notifications />} />,
  },
  {
    title: "Update Profile",
    url: "/profile/update",
    page: <AppLayout page={<UpdateProfile />} />,
  },
  {
    title: "Messages",
    url: "/messages",
    page: <AppLayout page={<Messages />} />,
  },
  {
    title: "Messages",
    url: "/messages/:chatId",
    page: <AppLayout page={<Messages />} />,
  },

  {
    title: "Success",
    url: "/success",
    page: <Success />,
  },
  {
    title: "Refresh",
    url: "/refresh",
    page: <Refresh />,
  },
];
