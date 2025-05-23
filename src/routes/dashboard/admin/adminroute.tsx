import { Navigate, useLocation } from "react-router";
import { useAuthContext } from "../../../contexts/context";
import { useQuery } from "@tanstack/react-query";


interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { currentUser,getAuthToken } = useAuthContext(); // Adjust as needed to access admin information
  
  const location = useLocation();
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["User"],
    queryFn: async () => {
      const {api} = await import ("../../../services/api")
      const token = await getAuthToken();
      const response = await api.get(`/api/getUser/${currentUser?.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });
 
 console.log("data",data)
  const status = data?.user?.role;
  console.log("status",status)
 
  if (isPending) return <span>Loading...</span>;
  if (isError) return <span>Error: {error.message}</span>;

  return status==="admin"?  (<>{children}</>): (
    <Navigate to="/error" state={{ from: location, message: "Unauthorized access. Admins only!", }} replace />
  );
};
