import { Link } from "react-router";
import { useAuthContext } from "../../../contexts/context";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type Props = {};

function Content({}: Props) {
  const { getAuthToken } = useAuthContext();
  const [selectedStatus, setSelectedStatus] = useState("");
  // Fetch data on initial render
  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { api } = await import("../../../services/api");

      const token = await getAuthToken();
      const response = await api.get(`/api/getPost`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });
  //console.log("data", data);
  const posts = data || [];
  const handlePublish = async (postId: string) => {
    //console.log(`Publishing post: ${postId}`);
    try {
      const { api } = await import("../../../services/api");
      const token = await getAuthToken();
      const response = await api.patch(
        `/api/updatePost/${postId}`,
        { status: "published" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //console.log("Post published successfully:", response.data);
      const { showSuccessAlert } = await import("../../../utils/utilities");
      showSuccessAlert("Success", "Post published successfully");
      refetch();
    } catch (error) {
      const { showErrorAlert } = await import("../../../utils/utilities");
      showErrorAlert("Error", error as string);
      console.error("Error publishing post:", error);
    }
  };

  const handleUnpublish = async (postId: string) => {
    //console.log(`Unpublishing post: ${postId}`);
    try {
      const token = await getAuthToken();
      const { api } = await import("../../../services/api");
      const response = await api.patch(
        `/api/updatePost/${postId}`,
        { status: "draft" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //console.log("Post unpublished successfully:", response.data);
      const { showSuccessAlert } = await import("../../../utils/utilities");
      showSuccessAlert("Success!", "Post unpublished successfully.");
      refetch();
    } catch (error) {
      const { showErrorAlert } = await import("../../../utils/utilities");
      showErrorAlert("Error", error as string);
      console.error("Error unpublishing post:", error);
    }
  };

  const handleDelete = async (postId: string) => {
    //console.log(`Deleting post: ${postId}`);
    try {
      const { api } = await import("../../../services/api");
      const token = await getAuthToken();
      const { showConfirmationAlert } = await import(
        "../../../utils/utilities"
      );
      showConfirmationAlert(
        "Deletion",
        "Are you sure you want to delete",
        "Delete",
        "Cancel",
        async () => {
          const response = await api.delete(`/api/deletePost/${postId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          //console.log("Post deleted successfully:", response.data);
        }
      );

      refetch();
    } catch (error) {
      const { showErrorAlert } = await import("../../../utils/utilities");
      showErrorAlert("Error", error as string);
      console.error("Error deleting post:", error);
    }
  };
 
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="place-self-start md:place-self-end m-10">
          <Link to={"/admin/blog"} className="btn btn-outline btn-secondary">
            Add Blog
          </Link>
        </div>
        <div className="m-10">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Filter</span>
            </div>
            <select
              className="select select-bordered select-accent"
              name="search"
              id="search"
              onChange={(e) => setSelectedStatus(e.target.value)}
              value={selectedStatus}
            >
              <option value={""} disabled>
                Pick one
              </option>
              <option value="">All</option>
              <option value="draft">Draft</option>
              <option value={"published"}>Published</option>
            </select>
          </label>
        </div>
      </div>

      <div className="overflow-x-auto mx-10">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Content</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {posts
              .filter((xn: any) => {
                return selectedStatus ? xn.status === selectedStatus : true;
              })
              .map((x: any) => {
                return (
                  <tr key={x._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img src={x.picture} alt={x.title} />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{x.title}</td>
                    <td>{x.content}</td>
                    <td>{x.status}</td>
                    <th className="flex gap-2">
                      {x.status === "draft" ? (
                        <button
                          className="btn btn-outline btn-xs btn-secondary"
                          onClick={() => handlePublish(x._id)}
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline btn-xs btn-primary"
                          onClick={() => handleUnpublish(x._id)}
                        >
                          Unpublish
                        </button>
                      )}
                      <button
                        className="btn btn-outline btn-xs btn-error"
                        onClick={() => handleDelete(x._id)}
                      >
                        Delete
                      </button>
                    </th>
                  </tr>
                );
              })}
          </tbody>
          {/* foot */}
        </table>
      </div>
    </>
  );
}

export default Content;
