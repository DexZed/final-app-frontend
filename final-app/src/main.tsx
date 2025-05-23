import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import ErrorPage from "./routes/error";
import SignIn from "./routes/Sign-In/SignIn";

import Register from "./routes/Donor Register/Register";

import ProfilePage from "./routes/profile/Profile";
import ReqDon from "./routes/dashboard/create-donation-request/ReqDon";
import EditDon from "./routes/dashboard/create-donation-request/EditDon";
import DonationsHome from "./routes/dashboard/create-donation-request/indexDon";
import MyDonReq from "./routes/dashboard/create-donation-request/myDonReq";
import DetailsView from "./routes/dashboard/create-donation-request/DetailsView";
import AdminApp from "./routes/dashboard/admin/AdminApp";
import App2 from "./routes/dashboard/create-donation-request/App2";
import Adminhome from "./routes/dashboard/admin/Adminhome";
import AllUsers from "./routes/dashboard/admin/AllUsers";
import AdminAllDonations from "./routes/dashboard/admin/AdminAllDonations";
import Content from "./routes/dashboard/admin/Content";
import Blog from "./routes/dashboard/admin/Blog";
import PublicHome from "./routes/public/PublicHome";
import SignUp from "./routes/Sign-In/SignUp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,

    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        index: true,
        element: <PublicHome />,
      },
      {
        path: "signIn",
        element: (
          <>
            <SignIn />
          </>
        ),
      },
      {
        path: "signUp",
        element: (
          <>
            <SignUp/>
          </>
        ),
      },
      {
        path: "donorRegister",
        element: (
          <>
            <Register />
          </>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: <App2 />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true, // Default route for /dashboard
        element: <DonationsHome />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "donationRequest",
        element: <ReqDon />,
      },
      {
        path: "updateDonation/:id",
        element: <EditDon />,
      },
      {
        path: "viewMyDonations",
        element: <MyDonReq />,
      },
      {
        path: "detailsView/:id",
        element: <DetailsView />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminApp />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <>
            <Adminhome />
          </>
        ),
      },
      {
        path: "allUsers",
        element: (
          <>
            <AllUsers />
          </>
        ),
      },
      {
        path: "allDonations",
        element: (
          <>
            <AdminAllDonations />
          </>
        ),
      },
      {
        path: "content",
        element: (
          <>
            <Content />
          </>
        ),
      },
      {
        path: "blog",
        element: (
          <>
            <Blog />
          </>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
