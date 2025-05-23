import { useState } from "react";
import { dist } from "../../../assets/districts";
import { Upazila } from "../../../assets/upazilas";
import { useAuthContext } from "../../../contexts/context";
import { useQuery } from "@tanstack/react-query";

import { useParams } from "react-router";

type Props = {};

function EditDon({}: Props) {
    const { id } = useParams(); 
  const { getAuthToken, currentUser } = useAuthContext();
  const [fields, setFields] = useState({
    name: "",
    email: "",

    recipientName: "",
    recipientDistrict: "",
    recipientUpazila: "",
    hospitalName: "",
    fullAddress: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    requestMessage: "",
    donationStatus: "pending",
  });
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedUpazila, setSelectedUpazila] = useState<string>("");
  const [filteredUpazilas, setFilteredUpazilas] = useState<typeof Upazila>([]);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target ;

    // Handle regular input changes (excluding "picture")
    setFields((prev) => ({ ...prev, [name]: value }));
    console.log(fields)
  };
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtName = e.target.value;
    setSelectedDistrict(districtName);

    const filtered = Upazila.filter(
      (upazila) =>
        upazila.district_id === dist.find((d) => d.name === districtName)?.id
    );
    setFilteredUpazilas(filtered);
    setSelectedUpazila("");
  };

  const handleUpazilaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUpazila(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
        recipientName,
        recipientDistrict,
        recipientUpazila,
        hospitalName,
        fullAddress,
        bloodGroup,
        donationDate,
        donationTime,
        requestMessage,
      } = fields;
      const donationRequest = {
        requesterName: currentUser?.displayName, 
        requesterEmail: currentUser?.email, 
        recipientName,
        recipientDistrict,
        recipientUpazila,
        hospitalName,
        fullAddress,
        bloodGroup,
        donationDate,
        donationTime,
        requestMessage,
        donationStatus: "pending", // Default value for status
      };
    const token = await getAuthToken();
      console.log(donationRequest);
    try {
      const {api} = await import ("../../../services/api")
      await api.patch(`/api/updateDonationRequest/${id}`, donationRequest, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { showSuccessAlert } = await import("../../../utils/utilities");
      showSuccessAlert(
        "Success!",
        "Donation updated successfully."
      );
    } catch (error) {
      const { showErrorAlert, errMsg } = await import(
        "../../../utils/utilities"
      );
      showErrorAlert("Error", errMsg(error) as unknown as string);
    }
  };
  const { isPending, isError, data, error, } = useQuery({
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
  if (isPending) return <span>Loading...</span>;
  if (isError) return <span>Error: {error.message}</span>;

  return (
    <>
      { data.data?.user?.status==="blocked" ?<><div className="font-bold text-5xl bg-red-800">You Have been Uanauthorized to perform this action</div></>:<>
        <div className="hero bg-base-200 min-h-screen">
        <div className="card bg-base-100 shadow-2xl rounded-5xl m-10">
          <div className="avatar flex flex-col gap-5 mt-5">
            <h2 className="place-self-center">Update Donation</h2>
            
          </div>

          <form
            onSubmit={handleSubmit}
            className="card-body grid grid-cols-1 md:grid-cols-2 gap-5 w-96 md:w-full"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Recipient Name</span>
              </label>
              <input
                name="recipientName"
                type="text"
                placeholder="John Doe"
               className="input input-bordered input-info w-full max-w-xs"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Recipient Email</span>
              </label>
              <input
                type="email"
                name="recipientEmail"
                placeholder="email@email.com"
                className="input input-bordered input-success w-full max-w-xs" 
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Hospital Name</span>
              </label>
              <input
                type="text"
                name="hospitalName"
                placeholder="Dhaka Medical College Hospital"
                className="input input-bordered input-warning w-full max-w-xs"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Address</span>
              </label>
              <input
                name="fullAddress"
                type="text"
                placeholder="Zahir Raihan Rd, Dhaka"
               className="input input-bordered input-info w-full max-w-xs"
                onChange={handleChange}
                required
              />
            </div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Select your blood group</span>
                <span className="label-text-alt">Required</span>
              </div>
              <select
                onChange={handleChange}
                name="bloodGroup"
                className="select select-primary w-full max-w-xs"
                required
              >
                <option disabled>Select your blood group</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>O+</option>
                <option>O-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">District</span>
              </div>
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  handleChange(e);
                  handleDistrictChange(e);
                }}
                name="recipientDistrict"
                className="select select-primary w-full max-w-xs"
                required
              >
                <option disabled>Select District</option>
                {dist.map((item) => {
                  return (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Upazila</span>
              </div>
              <select
                value={selectedUpazila}
                onChange={(e) => {
                  handleChange(e);
                  handleUpazilaChange(e);
                }}
                name="recipientUpazila"
                className="select select-primary w-full max-w-xs"
                required
                disabled={!filteredUpazilas.length}
              >
                <option disabled>Select Upazilla</option>

                {filteredUpazilas.map((item) => {
                  return (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </label>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Donation Date</span>
              </label>
              <input
                name="donationDate"
                type="date"
                 className="input input-bordered input-accent w-full max-w-xs"
                onChange={handleChange}
                required
                onFocus={(e) => {
                  e.target.placeholder = `${new Date()}`;
                }}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Donation Time</span>
              </label>
              <input
                name="donationTime"
                type="time"
                className="input input-bordered input-secondary"
                onChange={handleChange}
                required
                placeholder="HH:mm:ss"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Request Message</span>
              </label>
              <textarea
                name="requestMessage"
                placeholder="Explain why you need blood"
                className="textarea textarea-bordered textarea-error textarea-lg w-full max-w-xs"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control mt-6 col-start-2">
              <button type="submit" className="btn btn-primary btn-outline">
               Update
              </button>
            </div>
          </form>
        </div>
      </div></>}
    </>
  );
}

export default EditDon;
