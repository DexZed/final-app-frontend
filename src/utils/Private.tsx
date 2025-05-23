import { useLocation, Navigate } from "react-router";
import { useAuthContext } from "../contexts/context";




interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  
  
   const { currentUser } = useAuthContext(); // change for different purposes
  const location = useLocation();

  return currentUser ? (
    <>{children}</>
  ) : (
    <Navigate to="/signIn" state={{ from: location }} replace />
  );
};