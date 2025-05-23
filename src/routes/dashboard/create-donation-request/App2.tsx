import { ReactNode, Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router";
import AppContainer from "../../../ui/container/container";
import AuthProvider from "../../../contexts/context";
import { PrivateRoute } from "../../../utils/Private";


// Lazy load components for code splitting
const SideNav = lazy(() => import("../../../ui/nav/SideNav"));
const Footer = lazy(() => import("../../../ui/footer/Footer"));
const ReactQueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then((module) => ({
    default: module.ReactQueryDevtools,
  }))
);

const queryClient = new QueryClient();

function App2({}: { children?: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PrivateRoute>
          <AppContainer>
            <Suspense fallback={<div>Loading navigation...</div>}>
              <SideNav>
                {/* Only render active child routes */}
                <Outlet />
              </SideNav>
            </Suspense>

            <Suspense fallback={<div>Loading footer...</div>}>
              <Footer />
            </Suspense>
          </AppContainer>
        </PrivateRoute>
      </AuthProvider>

      <Suspense fallback={null}>
        <ReactQueryDevtools initialIsOpen={false} />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App2;
