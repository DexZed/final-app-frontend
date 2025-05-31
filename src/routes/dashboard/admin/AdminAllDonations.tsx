import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router";
import { useAuthContext } from "../../../contexts/context";
import { formatTime } from "../../../utils/utilities";


interface DonationItem { // Define a type for your donation items for better type safety
  _id: string;
  recipientName: string;
  recipientDistrict: string;
  recipientUpazila?: string;
  donationDate: string;
  donationTime: string;
  bloodGroup: string;
  donationStatus: "pending" | "inProgress" | "done" | "cancelled" | "completed"; // Add 'completed' if used
  requesterName?: string;
  requesterEmail?: string;
  // Add any other properties your item has
}
interface ApiPage { // Define the structure returned by your API and queryFn
  donations: DonationItem[];
  nextCursor: number | null;
}
export default function AdminAllDonations() { // Added export default
  const { getAuthToken, currentUser } = useAuthContext();
  const [selectedStatus, setSelectedStatus] = useState("");

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<ApiPage, Error>({ // Specify types for useInfiniteQuery
    queryKey: ["donations", selectedStatus], // Add selectedStatus to queryKey if API should refetch on change
    queryFn: async ({ pageParam = 0 }) => { // Default pageParam to 0 if initialPageParam can be undefined
      const { api } = await import("../../../services/api");
      const token = await getAuthToken();
      // If your API supports filtering by status, pass selectedStatus as a query parameter
      // Example: `/api/getDonationRequests?limit=3&cursor=${pageParam}&status=${selectedStatus}`
      // For now, the provided API snippet doesn't show filtering by status via query param in getDonationRequests
      // The filtering is done client-side in this component.
      const response = await api.get(
        `/api/getDonationRequests?limit=3&cursor=${pageParam}`, // If API filters by status: `&status=${selectedStatus}`
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = response?.data;

      // Ensure the API returns the expected structure
      if (!result || !Array.isArray(result.donations)) {
        // You might want to throw an error or return a default structure
        // to prevent crashes if the API response is not as expected.
        console.error("API response is not in the expected format:", result);
        return { donations: [], nextCursor: null };
      }
      return result as ApiPage; // ✅ Return the whole object { donations: [...], nextCursor: ... }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // lastPage is now an object: { donations: [], nextCursor: ... }
      return lastPage.nextCursor; // ✅ This will now correctly get the nextCursor value
    },
    // maxPages: 3, // Optional: if you want to limit total pages
  });

  // console.log("data", data); // For debugging

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error") return <div>Error : {error.message}</div>;

  async function handleDelete(id: string) {
    const { api } = await import("../../../services/api");
    const token = await getAuthToken();
    const { showConfirmationAlert } = await import("../../../utils/utilities");
    showConfirmationAlert(
      "Delete Donation",
      "Are you sure you want to delete this donation?",
      "Affirmative",
      "I changed my mind",
      async () => {
        try {
          const response = await api.delete(`/api/deleteDonation/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(response.data);
          // TODO: Invalidate queries to refetch data after deletion
          // queryClient.invalidateQueries({ queryKey: ['donations'] });
        } catch (err) {
          console.error("Failed to delete donation:", err);
          // TODO: Show error notification to user
        }
      }
    );
  }

  async function handleUpdateStatus(id: string, newStatus: "done" | "cancelled") {
    const { api } = await import("../../../services/api");
    const token = await getAuthToken();
    try {
      const response = await api.patch(
        `/api/updateDonationRequest/${id}`,
        {
          donationStatus: newStatus,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data); // Use response.data for consistency
      // TODO: Invalidate queries to refetch data after update
      // queryClient.invalidateQueries({ queryKey: ['donations'] });
    } catch (err) {
      console.error(`Failed to update donation to ${newStatus}:`, err);
      // TODO: Show error notification to user
    }
  }


  return (
    <>
      <div className="text-3xl font-bold flex justify-center m-10">
        Welcome {currentUser?.displayName}
      </div>
      <div className="flex justify-start md:justify-end m-5">
        <label className="form-control w-full max-w-xs ">
          <div className="label">
            <span className="label-text">Filter by Status</span>
          </div>
          <select
            className="select select-primary w-full max-w-xs"
            name="search"
            id="search"
            onChange={(e) => setSelectedStatus(e.target.value)}
            value={selectedStatus}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
            <option value="cancelled">Cancelled</option>
            <option value="inProgress">In Progress</option>
            {/* <option value="completed">Completed</option>  Consider if 'completed' is a status */}
          </select>
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Recipient name</th>
              <th>Recipient location</th>
              <th>Date</th>
              <th>Time</th>
              <th>Blood Type</th>
              <th>Status</th>
              <th>Donor Info</th>
              <th>Action: Edit</th>
              <th>Action: View</th>
              <th>Action: Delete</th>
            </tr>
          </thead>
          <tbody>
            {data?.pages?.map((page, i) => ( // page is now { donations: [...], nextCursor: ... }
              <React.Fragment key={i}>
                {page.donations // ✅ Iterate over page.donations
                  ?.filter((item: DonationItem) => // Use the defined type
                    selectedStatus ? item.donationStatus === selectedStatus : true
                  )
                  .map((item: DonationItem) => { // Use the defined type
                    return (
                      <tr key={item._id} className="hover">
                        <td>{item.recipientName}</td>
                        <td>
                          {item.recipientDistrict},{" "}
                          {item.recipientUpazila || "N/A"}
                        </td>
                        <td>
                          {new Date(item.donationDate).toLocaleDateString()}
                        </td>
                        <td>{formatTime(item.donationTime)}</td>
                        <td>{item.bloodGroup}</td>
                        <td className="flex flex-col items-start"> {/* Adjusted for better layout */}
                          <span
                            className={`badge ${
                              item.donationStatus === "pending"
                                ? "badge-warning"
                                : item.donationStatus === "completed" || item.donationStatus === "done" // Assuming 'done' means 'completed'
                                ? "badge-success"
                                : item.donationStatus === "inProgress"
                                ? "badge-info" // Suggestion: use badge-info for inProgress
                                : "badge-error" // For cancelled
                            }`}
                          >
                            {item.donationStatus}
                          </span>
                          {item.donationStatus === "inProgress" && (
                            <div className="flex gap-1 mt-2"> {/* Use mt-2 for spacing */}
                              <button
                                className="btn btn-xs btn-outline btn-error" // Changed to btn-error for "Cancel"
                                onClick={() => handleUpdateStatus(item._id, "cancelled")}
                              >
                                Cancel
                              </button>
                              <button
                                className="btn btn-xs btn-outline btn-success" // Changed to btn-success for "Done"
                                onClick={() => handleUpdateStatus(item._id, "done")}
                              >
                                Done
                              </button>
                            </div>
                          )}
                          {/* No buttons needed for 'cancelled' or 'done' as per original logic */}
                        </td>
                        <td>
                          {item.donationStatus === "inProgress" && item.requesterName ? ( // Check for requesterName
                            <>
                              {item.requesterName} <br />
                              {item.requesterEmail}
                            </>
                          ) : (
                            <>N/A</>
                          )}
                        </td>
                        <td>
                          <Link
                            to={`/dashboard/updateDonation/${item._id}`}
                            className="btn btn-outline btn-accent btn-sm" // Suggestion: btn-sm for consistency
                          >
                            Edit
                          </Link>
                        </td>
                        <td>
                          <Link to={`/dashboard/detailsView/${item._id}`}
                            className="btn btn-outline btn-secondary btn-sm" // Suggestion: btn-sm
                          >
                            View
                          </Link >
                        </td>
                        <td>
                          <button
                            className="btn btn-outline btn-error btn-sm" // Suggestion: btn-sm
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center m-10">
          <button
            className="btn btn-outline btn-primary"
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
              ? "Load More"
              : "Nothing more to load"}
          </button>
        </div>
        <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
      </div>
    </>
  );
}

