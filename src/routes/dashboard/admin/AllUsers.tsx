import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/context";

type Props = {};

export default function AllUsers({}: Props) {
  const { getAuthToken } = useAuthContext();
  const { isLoading, isError, data, error,refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { api } = await import("../../../services/api");
      const token = await getAuthToken();
      const response = await api.get(`/api/getAllUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });
  console.log("data", data?.users);
  const users = data?.users || [];

  const handleRemovePrivilege = async (id: string) => {
    const { api } = await import("../../../services/api");
    const token = await getAuthToken();
    try {
      const response = await api.patch(
        `/api/updateUser/${id}`,
        {
          role: "donor", // Assuming "user" role is the default for non-admin
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Privileges removed:", response.data);
      refetch();
      // Optionally invalidate cache or update local state here
    } catch (error) {
      console.error("Error removing privilege:", error);
    }
  };

  // Function to handle making a user an admin
  const handleMakeAdmin = async (id: string) => {
    const { api } = await import("../../../services/api");
    const token = await getAuthToken();
    try {
      const response = await api.patch(
        `/api/updateUser/${id}`,
        {
          role: "admin",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("User made admin:", response.data);
      refetch();
    } catch (error) {
      console.error("Error making admin:", error);
    }
  };
  // Function to handle making a user a volunteer
  const handleMakeVolunteer = async (id: string) => {
    const { api } = await import("../../../services/api");
    const token = await getAuthToken();
    try {
      const response = await api.patch(
        `/api/updateUser/${id}`,
        {
          role: "volunteer",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("User made volunteer:", response.data);
      refetch();
    } catch (error) {
      console.error("Error making volunteer:", error);
    }
  };
  // Function to block a user (change status to "blocked")
  const handleBlockUser = async (id: string) => {
    const { api } = await import("../../../services/api");
    const token = await getAuthToken();
    try {
      const response = await api.patch(
        `/api/updateUser/${id}`,
        {
          status: "blocked",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("User blocked:", response.data);
      refetch();
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };
  const handleUnblockUser = async (id: string) => {
    const { api } = await import("../../../services/api");
    const token = await getAuthToken();
    try {
      const response = await api.patch(
        `/api/updateUser/${id}`,
        {
          status: "active",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("User unblocked:", response.data);
      refetch();
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };
  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message} </span>;
  }
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {users?.map((x: any) => {
              return (
                <tr key={x._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img src={x.picture} alt={x.name} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{x.name}</td>
                  <td>{x.email}</td>
                  <td>{x.role}</td>
                  <td>{x.status}</td>
                  <th className="flex flex-col gap-2">
                    {x.role === "admin"  ? (
                      <>
                        <button
                          className="btn btn-warning btn-outline btn-xs w-32 flex place-self-center"
                          onClick={() => handleRemovePrivilege(x.email)}
                        >
                          Remove Privilege
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-secondary btn-outline btn-xs w-32 flex place-self-center"
                          onClick={() => handleMakeAdmin(x.email)}
                        >
                          Make Admin
                        </button>
                      </>
                    )}

                    {x.role !== "volunteer" && x.role !== "admin" && (
                      <button
                        className="btn btn-info btn-outline btn-xs w-32 flex place-self-center"
                        onClick={() => handleMakeVolunteer(x.email)}
                      >
                        Make Volunteer
                      </button>
                    )}

                    {x.status === "active" && (
                      <button
                        className="btn btn-error btn-outline btn-xs w-32 flex place-self-center"
                        onClick={() => handleBlockUser(x.email)}
                      >
                        Block
                      </button>
                    )}

                    {x.status === "blocked" &&  (
                      <button
                        className="btn btn-primary btn-outline btn-xs w-32 flex place-self-center"
                        onClick={() => handleUnblockUser(x.email)}
                      >
                        Unblock
                      </button>
                    )}
                  </th>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
