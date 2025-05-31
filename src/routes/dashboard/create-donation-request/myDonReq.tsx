import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/context";

import { Link } from "react-router";
import { formatTime } from "../../../utils/utilities";
import React, { useState } from "react";
interface DonationItem {
  _id: string;
  recipientName: string;
  recipientDistrict: string;
  recipientUpazila?: string;
  donationDate: string;
  donationTime: string;
  bloodGroup: string;
  donationStatus: "pending" | "inProgress" | "done" | "cancelled" | "completed";
  requesterEmail: string; // Important for this component's filter
  requesterName?: string;
  // ... other properties
}

interface ApiPage {
  donations: DonationItem[];
  nextCursor: number | null;
}
type Props = {};

function MyDonReq({}: Props) {
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
  } = useInfiniteQuery<ApiPage,Error>({
    queryKey: ["myDonationRequests", currentUser?.email, selectedStatus],
    queryFn: async ({ pageParam = 0 }) => {
      // Added default for pageParam
      const { api } = await import("../../../services/api");
      const token = await getAuthToken();
      // Consider adding currentUser.email and selectedStatus to the API call if server-side filtering is desired
      const response = await api.get(
        // Example for server-side filtering:
        // `/api/getDonationRequests?limit=3&cursor=<span class="math-inline">\{pageParam\}&requesterEmail\=</span>{currentUser?.email}${selectedStatus ? `&status=${selectedStatus}` : ''}`,
        `/api/getDonationRequests?limit=3&cursor=${pageParam}`, // Current implementation
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = response?.data;
      if (!result || !Array.isArray(result.donations)) {
        console.error("API response is not in the expected format:", result);
        return { donations: [], nextCursor: null }; // Fallback
      }
      return result; // Return the object { donations: [...], nextCursor: ... }
    },

    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    maxPages: 3,
  });
  console.log("data", data);

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
        const response = await api.delete(`/api/deleteDonation/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
      }
    );
  }
  async function handleDone(id: string) {
    const { api } = await import("../../../services/api");
    const token = await getAuthToken();
    const response = await api.patch(
      `/api/updateDonationRequest/${id}`,
      {
        donationStatus: "done",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(response);
  }
  async function handleCancel(id: string) {
    const { api } = await import("../../../services/api");
    const token = await getAuthToken();
    const response = await api.patch(
      `/api/updateDonationRequest/${id}`,
      {
        donationStatus: "cancelled",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(response);
  }
  console.log("data", data);

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
            {data?.pages?.map((page, i) => (
              <React.Fragment key={i}>
                {page.donations
                  ?.filter(
                    (item: any) =>
                      (selectedStatus
                        ? item.donationStatus === selectedStatus
                        : true) && item.requesterEmail === currentUser?.email
                  )
                  .map((item: any) => {
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
                        <td className="flex flex-col">
                          <span
                            className={`badge ${
                              item.donationStatus === "pending"
                                ? "badge-warning"
                                : item.donationStatus === "completed"
                                ? "badge-success"
                                : "badge-error"
                            }`}
                          >
                            {item.donationStatus}
                          </span>
                          {item.donationStatus === "inProgress" && (
                            <div className="flex gap-1 m-2">
                              <button
                                className="btn btn-xs btn-outline btn-secondary"
                                onClick={() => handleCancel(item._id)}
                              >
                                Cancel
                              </button>
                              <button
                                className="btn btn-xs btn-outline btn-warning"
                                onClick={() => handleDone(item._id)}
                              >
                                Done
                              </button>
                            </div>
                          )}

                          {(item.donationStatus === "cancelled" ||
                            item.donationStatus === "done") && (
                            <div>{/* No buttons rendered here */}</div>
                          )}
                        </td>
                        <td>
                          {item.donationStatus === "inProgress" ? (
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
                            className="btn btn-outline btn-accent"
                          >
                            Edit
                          </Link>
                        </td>
                        <td>
                          <Link
                            to={`/dashboard/detailsView/${item._id}`}
                            className="btn btn-outline btn-secondary"
                          >
                            View
                          </Link>
                        </td>
                        <td>
                          <button
                            className="btn btn-outline btn-error"
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

export default MyDonReq;
