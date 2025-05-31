import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../../contexts/context";
import { getDateRange } from "../../../utils/utilities";

type Props = {};

function adminhome({}: Props) {
  const { getAuthToken, currentUser } = useAuthContext();
  const { isLoading, isError, data, error } = useQuery({
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
  //console.log("length", data?.users?.length);
  const users = data?.users || [];
  // Add your admin home page logic here
  const dateRange = getDateRange(users);

  const {
    isPending: pending,
    isError: Err,
    data: Donations,
    error: err,
  } = useQuery({
    queryKey: ["donations"],
    queryFn: async () => {
      const { api } = await import("../../../services/api");
      const token = await getAuthToken();
      const response = await api.get(`/api/getDonationRequests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response) {
        return undefined;
      }
      return response.data;
    },
  });
  const DonationsReq = Donations?.donations || [];
  //console.log("Donations", DonationsReq);
  const donationsRange = getDateRange(DonationsReq);
  if (isLoading && pending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message} </span>;
  }
  if (Err) {
    return <span>Error: {err.message} </span>;
  }
  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold m-5">
              Welcome : {currentUser?.displayName}
            </h1>
            <p className="text-xl m-5">Conversions Statistics</p>
            <div className="">
              <div className="stats stats-vertical lg:stats-horizontal shadow md:-translate-x-20">
                <div className="stat">
                  <div className="stat-title">Users</div>
                  <div className="stat-value">{data?.users?.length}</div>
                  <div className="stat-desc">
                    {dateRange || "No users found"}
                  </div>
                </div>

                <div className="stat">
                  <div className="stat-title">Funds</div>
                  <div className="stat-value">4,200 BDT</div>
                  <div className="stat-desc">↗︎ 400 (22%)</div>
                </div>

                <div className="stat">
                  <div className="stat-title">Donations</div>
                  <div className="stat-value">{DonationsReq?.length}</div>
                  <div className="stat-desc">
                    ↗︎ {donationsRange || "No Donations Found"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default adminhome;
