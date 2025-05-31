import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";

import App from "./App";
const ErrorPage = lazy(() => import("./routes/error"));
const SignIn = lazy(() => import("./routes/Sign-In/SignIn"));
const SignUp = lazy(() => import("./routes/Sign-In/SignUp"));
const Register = lazy(() => import("./routes/Donor Register/Register"));
const ProfilePage = lazy(() => import("./routes/profile/Profile"));
const ReqDon = lazy(() => import("./routes/dashboard/create-donation-request/ReqDon"));
const EditDon = lazy(() => import("./routes/dashboard/create-donation-request/EditDon"));
const DonationsHome = lazy(() => import("./routes/dashboard/create-donation-request/indexDon"));
const MyDonReq = lazy(() => import("./routes/dashboard/create-donation-request/myDonReq"));
const DetailsView = lazy(() => import("./routes/dashboard/create-donation-request/DetailsView"));
const AdminApp = lazy(() => import("./routes/dashboard/admin/AdminApp"));
const App2 = lazy(() => import("./routes/dashboard/create-donation-request/App2"));
const Adminhome = lazy(() => import("./routes/dashboard/admin/Adminhome"));
const AllUsers = lazy(() => import("./routes/dashboard/admin/AllUsers"));
const AdminAllDonations = lazy(() => import("./routes/dashboard/admin/AdminAllDonations"));
const Content = lazy(() => import("./routes/dashboard/admin/Content"));
const Blog = lazy(() => import("./routes/dashboard/admin/Blog"));
const PublicHome = lazy(() => import("./routes/public/PublicHome"));

const suspenseWrap = (element: JSX.Element) => <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: suspenseWrap(<ErrorPage />),
    children: [
      {
        index: true,
        element: suspenseWrap(<PublicHome />),
      },
      {
        path: "signIn",
        element: suspenseWrap(<SignIn />),
      },
      {
        path: "signUp",
        element: suspenseWrap(<SignUp />),
      },
      {
        path: "donorRegister",
        element: suspenseWrap(<Register />),
      },
    ],
  },
  {
    path: "/dashboard",
    element: suspenseWrap(<App2 />),
    errorElement: suspenseWrap(<ErrorPage />),
    children: [
      {
        index: true,
        element: suspenseWrap(<DonationsHome />),
      },
      {
        path: "profile",
        element: suspenseWrap(<ProfilePage />),
      },
      {
        path: "donationRequest",
        element: suspenseWrap(<ReqDon />),
      },
      {
        path: "updateDonation/:id",
        element: suspenseWrap(<EditDon />),
      },
      {
        path: "viewMyDonations",
        element: suspenseWrap(<MyDonReq />),
      },
      {
        path: "detailsView/:id",
        element: suspenseWrap(<DetailsView />),
      },
    ],
  },
  {
    path: "/admin",
    element: suspenseWrap(<AdminApp />),
    errorElement: suspenseWrap(<ErrorPage />),
    children: [
      {
        index: true,
        element: suspenseWrap(<Adminhome />),
      },
      {
        path: "allUsers",
        element: suspenseWrap(<AllUsers />),
      },
      {
        path: "allDonations",
        element: suspenseWrap(<AdminAllDonations />),
      },
      {
        path: "content",
        element: suspenseWrap(<Content />),
      },
      {
        path: "blog",
        element: suspenseWrap(<Blog />),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
