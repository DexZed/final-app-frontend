import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/context";

import { Link } from "react-router";
import { formatTime } from "../../../utils/utilities";

type Props = {};

function DonationsHome({}: Props) {
  const { getAuthToken, currentUser } = useAuthContext();

  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: ["donations"],
    queryFn: async () => {
      const { api } = await import("../../../services/api");
      const token = await getAuthToken();
      const response = await api.get(`/api/getDonationRequests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if(!response){return undefined}
      return response.data;
    },
  });
  if (isPending) return <span>Loading...</span>;
  if (isError) return <span>Error: {error.message}</span>;
  //console.log(data);
  const recentDonations = data
    ?.donations?.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ) // Sort descending
    .slice(0, 3); // Get top 3

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
        //const response = 
        await api.delete(`/api/deleteDonation/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        //console.log(response.data);
      }
    );

    refetch();
  }
  async function handleDone(id: string) {
    const { api } = await import("../../../services/api");
    const token = await getAuthToken();
    //const response =
     await api.patch(
      `/api/updateDonationRequest/${id}`,
      {
        donationStatus: "done",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    //console.log(response);
    refetch();
  }
  async function handleCancel(id: string) {
    const { api } = await import("../../../services/api");
    const token = await getAuthToken();
    //const response = 
    await api.patch(
      `/api/updateDonationRequest/${id}`,
      {
        donationStatus: "cancelled",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    //console.log(response);
    refetch();
  }
  return (
    <>
      <div className="text-3xl font-bold flex justify-center m-10">
        Welcome {currentUser?.displayName}
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
            {recentDonations?.map((item: any) => {
              return (
                <tr key={item._id} className="hover">
                  <td>{item.recipientName}</td>
                  <td>
                    {item.recipientDistrict}, {item.recipientUpazila || "N/A"}
                  </td>
                  <td>{new Date(item.donationDate).toLocaleDateString()}</td>
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
          </tbody>
        </table>
        <div className="flex justify-center m-5">
          <Link
            to={"/dashboard/viewMyDonations"}
            className="btn btn-primary btn-outline"
          >
            View My Donations
          </Link>
        </div>
      </div>
    </>
  );
}

export default DonationsHome;
