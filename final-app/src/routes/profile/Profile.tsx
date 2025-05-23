import { useEffect, useState } from "react";
import { dist } from "../../assets/districts";
import { Upazila } from "../../assets/upazilas";
import { useAuthContext } from "../../contexts/context";

import { useQuery } from "@tanstack/react-query";

type Props = {};

function Profile({}: Props) {
  const { getAuthToken, currentUser } = useAuthContext();
  const [fields, setFields] = useState({
    
    name: "",
    email: "",
    picture: "",
    bloodGroup: "",
    district: "",
    upazilla: "",
  });
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedUpazila, setSelectedUpazila] = useState<string>("");
  const [filteredUpazilas, setFilteredUpazilas] = useState<typeof Upazila>([]);
  const [edit, setEdit] = useState(false);

  const userEmail = currentUser?.email;
 

  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: ["User"],
    queryFn: async () => {
      const {api} = await import ("../../services/api")
      const token = await getAuthToken();
      const response = await api.get(`/api/getUser/${userEmail}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });
  console.log("User",JSON.stringify(data))
  useEffect(() => {
    if (data?.data?.user) {
      setFields(data.data.user);
    }
  
  }, [data?.data?.user]);
  console.log("Fields state:", fields); 
  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "picture" && files) {
      const file = files[0];
      const formData = new FormData();
      formData.append("image", file);
      
      // Dynamically import image upload logic
     

      const response = await fetch(
        `https://api.imgbb.com/1/upload?expiration=${import.meta.env.VITE_EXPIRES_TIME}&key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        { method: "POST", body: formData }
      );
      
      const data = await response.json();
      if (data.success) {
        setFields((prev) => ({ ...prev, [name]: data.data.url }));
        console.log("Image uploaded successfully", data.data.url);
      } else {
        console.log("Image upload failed", data.error || "Unknown error");
      }
    } else {
      setFields((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtName = e.target.value;
    setSelectedDistrict(districtName);

    const filtered = Upazila.filter(
      (upazila) => upazila.district_id === dist.find((d) => d.name === districtName)?.id
    );
    setFilteredUpazilas(filtered);
    setSelectedUpazila("");
  };

  const handleUpazilaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUpazila(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, picture, bloodGroup, district, upazilla } = fields;
    
    const userFields = { name, picture, bloodGroup, district, upazilla, role: "donor", status: "active" };
    const token = await getAuthToken();

    try {
      const {api} = await import ("../../services/api")
      await api.patch(`/api/updateUser/${userEmail}`, userFields, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { showSuccessAlert } = await import("../../utils/utilities");
      showSuccessAlert("Profile updated successfully", "You have updated your profile.");
      refetch();
      setEdit(false);
    } catch (error) {
      const { showErrorAlert, errMsg } = await import("../../utils/utilities");
      showErrorAlert("Error", errMsg(error) as unknown as string);
    }
  };

  if (isPending) return <span>Loading...</span>;
  if (isError) return <span>Error: {error.message}</span>;

 
  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="card bg-base-100 shadow-2xl rounded-5xl m-10">
          <div className="avatar flex flex-col gap-5 mt-5">
            <h2 className="place-self-center">
              Profile : {currentUser?.displayName}
            </h2>
            <div className="place-self-center ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
              <img src={ fields?.picture || "https://static.fandomspot.com/images/07/42775/00-featured-genshin-impact-raidens-elemental-burst-animation-screenshot.jpg"} alt={fields?.name} />
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="card-body grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                value={fields?.name || ""}
                name="name"
                type="text"
                placeholder="John Doe"
                className="input input-bordered"
                onChange={handleChange}
                required
                disabled={!edit}
              />
            </div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Avatar Image</span>
              </div>
              <input
                placeholder={fields?.picture || ""}
                onChange={handleChange}
                type="file"
                name="picture"
                className="file-input file-input-bordered w-full max-w-xs"
                disabled={!edit}
              />
            </label>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                value={fields?.email || ""}
                type="email"
                name="email"
                placeholder="email@email.com"
                className="input input-bordered"
                onChange={handleChange}
                required
                disabled
              />
            </div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Select your blood group</span>
                <span className="label-text-alt">Required</span>
              </div>
              <select
                value={fields?.bloodGroup || ""}
                onChange={handleChange}
                name="bloodGroup"
                className="select select-primary w-full max-w-xs"
                required
                disabled={!edit}
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
                <span className="label-text-alt">Required</span>
              </div>
              <select
                value={selectedDistrict || fields?.district || ""}
                onChange={(e) => {
                  handleChange(e);
                  handleDistrictChange(e);
                }}
                name="district"
                className="select select-primary w-full max-w-xs"
                required
                disabled={!edit}
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
                name="upazilla"
                className="select select-primary w-full max-w-xs"
                required
                disabled={!filteredUpazilas.length || !edit}
              >
                <option disabled>{fields?.upazilla ? `Current : ${fields?.upazilla}` : "Select District"}</option>

                
                {filteredUpazilas.map((item) => {
                  return (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </label>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary btn-outline">
                Update
              </button>
            </div>
            <div className="form-control mt-6">
              <button
                type="button"
                className="btn btn-primary btn-outline"
                onClick={() => setEdit(true)}
              >
                edit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Profile;
