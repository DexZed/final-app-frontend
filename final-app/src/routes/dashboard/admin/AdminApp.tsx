import { ReactNode, Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router";
import AppContainer from "../../../ui/container/container";
import AuthProvider from "../../../contexts/context";
import { PrivateRoute } from "../../../utils/Private";
import { AdminRoute } from "./adminroute";
import AdminNav from "../../../ui/nav/AdminNav";


// Lazy load components for code splitting
const Footer = lazy(() => import("../../../ui/footer/Footer"));
const ReactQueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then((module) => ({
    default: module.ReactQueryDevtools,
  }))
);

const queryClient = new QueryClient();

function AdminApp({}: { children?: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PrivateRoute>
          <AdminRoute>
          <AppContainer>
            <Suspense fallback={<div>Loading navigation...</div>}>
              <AdminNav>
                  {/* Only render active child routes */}
                  <Outlet />
              </AdminNav>
            </Suspense>

            <Suspense fallback={<div>Loading footer...</div>}>
              <Footer />
            </Suspense>
          </AppContainer>
          </AdminRoute>
        </PrivateRoute>
      </AuthProvider>

      <Suspense fallback={null}>
        <ReactQueryDevtools initialIsOpen={false} />
      </Suspense>
    </QueryClientProvider>
  );
}

export default AdminApp;
