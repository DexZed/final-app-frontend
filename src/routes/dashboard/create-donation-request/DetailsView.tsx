import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useAuthContext } from "../../../contexts/context";
import { formatTime } from "../../../utils/utilities";

type Props = {};

function DetailsView({}: Props) {
  const { getAuthToken } = useAuthContext();
  const { id } = useParams();
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["donations"],
    queryFn: async () => {
      const { api } = await import("../../../services/api");
      const token = await getAuthToken();
      const response = await api.get(`/api/getDonationRequestById`, {
        params: { id },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });
  if (isPending) return <span>Loading...</span>;
  if (isError) return <span>Error: {error.message}</span>;
  console.log("data", data);
  return (
    <>
      <h2 className="text-3xl font-bold flex justify-center m-5">Details</h2>
      <div>
        <div className="grid grid-cols-2 gap-5 max-w-lg mx-auto mb-5">
          <h3>Recipient: <strong>{data?.recipientName}</strong></h3>
          <p>
            <strong>Requester Name:</strong> {data?.requesterName || "N/A"}
          </p>
          <p>
            <strong>Requester Email:</strong> {data?.requesterEmail || "N/A"}
          </p>
          <p>
            <strong>Recipient District:</strong>{" "}
            {data?.recipientDistrict || "N/A"}
          </p>
          <p>
            <strong>Recipient Upazila:</strong>{" "}
            {data?.recipientUpazila || "N/A"}
          </p>
          <p>
            <strong>Hospital Name:</strong> {data?.hospitalName || "N/A"}
          </p>
          <p>
            <strong>Full Address:</strong> {data?.fullAddress || "N/A"}
          </p>
          <p>
            <strong>Blood Group:</strong> {data?.bloodGroup || "N/A"}
          </p>
          <p>
            <strong>Donation Date:</strong>{" "}
            {data?.donationDate
              ? new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                }).format(new Date(data.donationDate))
              : "N/A"}
          </p>
          <p>
            <strong>Donation Time:</strong>{" "}
            {formatTime(data?.donationTime) || "N/A"}
          </p>
          <p>
            <strong>Request Message:</strong> {data?.requestMessage || "N/A"}
          </p>
          <p>
            <strong>Donation Status:</strong> {data?.donationStatus || "N/A"}
          </p>
          <p>
            <strong>Created At:</strong> {data?.createdAt ? new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                }).format(new Date(data.donationDate))
              : "N/A"}
          </p>
        </div>
      </div>
    </>
  );
}

export default DetailsView;
