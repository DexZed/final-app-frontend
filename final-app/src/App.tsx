import { ReactNode, Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router";
import AuthProvider from "./contexts/context";
import AppContainer from "./ui/container/container";

// Lazy load components for code splitting
const Nav = lazy(() => import("./ui/nav/Nav"));
const Footer = lazy(() => import("./ui/footer/Footer"));
const ReactQueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then((module) => ({
    default: module.ReactQueryDevtools,
  }))
);

const queryClient = new QueryClient();

function App({ children }: { children?: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContainer>
          <Suspense fallback={<div>Loading navigation...</div>}>
            <Nav />
          </Suspense>

          <Suspense fallback={<div>Loading content...</div>}>
          {children}
            <Outlet />
          </Suspense>

          <Suspense fallback={<div>Loading footer...</div>}>
            <Footer />
          </Suspense>
        </AppContainer>
      </AuthProvider>

      <Suspense fallback={null}>
        <ReactQueryDevtools initialIsOpen={false} />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
