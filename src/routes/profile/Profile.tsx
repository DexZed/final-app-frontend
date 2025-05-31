import { useEffect, useState } from "react";
import { dist } from "../../assets/districts"; // Assuming 'dist' is an array like [{id: "1", name: "Dhaka"}, ...]
import { Upazila } from "../../assets/upazilas"; // Assuming 'Upazila' is an array like [{id: "1", district_id: "1", name: "Mirpur"}, ...]
import { useAuthContext } from "../../contexts/context";

import { useQuery } from "@tanstack/react-query";

type Props = {};

// Define a more specific type for Upazila items if possible
type UpazilaItem = { id: string; district_id: string; name: string; /* other properties */ };

function Profile({}: Props) {
  const { getAuthToken, currentUser } = useAuthContext();
  const [fields, setFields] = useState({
    name: "",
    email: "",
    picture: "",
    bloodGroup: "",
    district: "",
    upazilla: "", // Make sure this matches the name attribute of the upazila select
  });
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedUpazila, setSelectedUpazila] = useState<string>("");
  const [filteredUpazilas, setFilteredUpazilas] = useState<UpazilaItem[]>([]); // Use the specific type
  const [edit, setEdit] = useState(false);

  const userEmail = currentUser?.email;

  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: ["User", userEmail], // Add userEmail to queryKey to refetch if it changes
    queryFn: async () => {
      if (!userEmail) return null; // Don't fetch if no email
      const { api } = await import("../../services/api");
      const token = await getAuthToken();
      const response = await api.get(`/api/getUser/${userEmail}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!userEmail, // Only run query if userEmail exists
  });

  // console.log("User API data:", JSON.stringify(data));

  useEffect(() => {
    if (data?.user) {
      const userData = data.user;
      setFields(userData);

      // Initialize selectedDistrict and filter Upazilas
      if (userData.district) {
        setSelectedDistrict(userData.district);
        const districtObject = dist.find((d) => d.name === userData.district);
        if (districtObject) {
          const initialFilteredUpazilas = Upazila.filter(
            (upazila: UpazilaItem) => upazila.district_id === districtObject.id
          );
          setFilteredUpazilas(initialFilteredUpazilas);
        } else {
          setFilteredUpazilas([]); // Or Upazila if you want to show all
        }
      } else {
        // No initial district, perhaps clear or set to all upazilas
        setSelectedDistrict("");
        setFilteredUpazilas([]); // Or Upazila
      }

      // Initialize selectedUpazila
      // Ensure it's set after filteredUpazilas is potentially populated
      setSelectedUpazila(userData.upazilla || "");

    }
  }, [data]); // Depend on 'data' object

  //console.log("Fields state:", fields);
   //console.log("Selected District:", selectedDistrict);
   //console.log("Selected Upazila:", selectedUpazila);
  //console.log("Filtered Upazilas:", filteredUpazilas);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const target = e.target as HTMLInputElement; // Type assertion for files

    if (name === "picture" && target.files) {
      const file = target.files[0];
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch(
          `https://api.imgbb.com/1/upload?expiration=${import.meta.env.VITE_EXPIRES_TIME}&key=${import.meta.env.VITE_IMGBB_API_KEY}`,
          { method: "POST", body: formData }
        );
        const imgbbData = await response.json();
        if (imgbbData.success) {
          setFields((prev) => ({ ...prev, [name]: imgbbData.data.url }));
          //console.log("Image uploaded successfully", imgbbData.data.url);
        } else {
          //console.log("Image upload failed", imgbbData.error || "Unknown error");
          // Optionally, show an error to the user here
          const { showErrorAlert } = await import("../../utils/utilities");
          showErrorAlert("Image Upload Failed", imgbbData.error?.message || "Could not upload image.");
        }
      } catch (uploadError) {
        console.error("Image upload fetch error:", uploadError);
        const { showErrorAlert, errMsg } = await import("../../utils/utilities");
        showErrorAlert("Image Upload Error", errMsg(uploadError) as unknown as string);
      }
    } else {
      setFields((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtName = e.target.value;
    setSelectedDistrict(districtName);
    // Also update the main 'fields' state for district
    setFields((prev) => ({ ...prev, district: districtName }));


    const districtObject = dist.find((d) => d.name === districtName);
    if (districtObject) {
      const filtered = Upazila.filter(
        (upazila: UpazilaItem) => upazila.district_id === districtObject.id
      );
      setFilteredUpazilas(filtered);
    } else {
      setFilteredUpazilas([]);
    }
    setSelectedUpazila(""); // Reset upazila when district changes
    // Also reset in the main 'fields' state
    setFields((prev) => ({ ...prev, upazilla: "" }));
  };

  const handleUpazilaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const upazilaName = e.target.value;
    setSelectedUpazila(upazilaName);
    // Also update the main 'fields' state for upazila
    setFields((prev) => ({ ...prev, upazilla: upazilaName }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure fields sent to backend are from 'fields' state,
    // which should be correctly updated by handleChange, handleDistrictChange, and handleUpazilaChange
    const { name, picture, bloodGroup } = fields;
    // Make sure district and upazilla are taken from selectedDistrict and selectedUpazila
    // or ensure fields.district and fields.upazilla are the source of truth
    // The current handleChange and individual handlers should keep `fields` state updated.

    const userFields = {
      name,
      picture,
      bloodGroup,
      district: fields.district, // or selectedDistrict, ensure consistency
      upazilla: fields.upazilla, // or selectedUpazila, ensure consistency
      role: "donor", // Consider if these should be editable or are fixed
      status: "active",
    };

    const token = await getAuthToken();

    try {
      const { api } = await import("../../services/api");
      await api.patch(`/api/updateUser/${userEmail}`, userFields, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { showSuccessAlert } = await import("../../utils/utilities");
      showSuccessAlert("Profile updated successfully", "You have updated your profile.");
      refetch();
      setEdit(false);
    } catch (err) {
      const { showErrorAlert, errMsg } = await import("../../utils/utilities");
      showErrorAlert("Error updating profile", errMsg(err) as unknown as string);
    }
  };

  if (isPending) return <span>Loading...</span>;
  if (isError && error) return <span>Error: {error.message}</span>;
  if (!data && !isPending && userEmail) return <span>No profile data found.</span>; // Handle case where data is null after fetch

  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="card bg-base-100 shadow-2xl rounded-5xl m-10">
          <div className="avatar flex flex-col gap-5 mt-5">
            <h2 className="place-self-center">
              Profile : {currentUser?.displayName || fields?.name || "User"}
            </h2>
            <div className="place-self-center ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
              <img
                src={
                  fields?.picture ||
                  "https://static.fandomspot.com/images/07/42775/00-featured-genshin-impact-raidens-elemental-burst-animation-screenshot.jpg"
                }
                alt={fields?.name || "User avatar"}
              />
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
                // value={fields?.picture || ""} // File input cannot have a controlled value like this
                onChange={handleChange}
                type="file"
                name="picture"
                className="file-input file-input-bordered w-full max-w-xs"
                disabled={!edit}
                accept="image/*"
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
                onChange={handleChange} // Should not be changeable if it's an identifier
                required
                disabled // Email should generally be disabled from editing
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
                <option value="" disabled>Select your blood group</option>
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
                value={selectedDistrict} // Use selectedDistrict directly
                onChange={(e) => {
                  // handleChange(e); // This will be handled by handleDistrictChange
                  handleDistrictChange(e);
                }}
                name="district" // Name attribute is important for forms/handleChange if you consolidate
                className="select select-primary w-full max-w-xs"
                required
                disabled={!edit}
              >
                <option value="" disabled>Select District</option>
                {dist.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Upazila</span>
                <span className="label-text-alt">Required</span> {/* If it's always required */}
              </div>
              <select
                value={selectedUpazila} // Use selectedUpazila directly
                onChange={(e) => {
                  // handleChange(e); // This will be handled by handleUpazilaChange
                  handleUpazilaChange(e);
                }}
                name="upazilla" // Name attribute
                className="select select-primary w-full max-w-xs"
                required
                disabled={!filteredUpazilas.length || !edit}
              >
                <option value="" disabled>
                  {filteredUpazilas.length ? "Select Upazila" : (selectedDistrict ? "No Upazilas found" : "Select District First")}
                </option>
                {filteredUpazilas.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="form-control mt-6">
              {edit && (
                <button type="submit" className="btn btn-primary btn-outline">
                  Update Profile
                </button>
              )}
            </div>
            <div className="form-control mt-6">
              <button
                type="button"
                className={`btn ${edit ? "btn-error" : "btn-accent"} btn-outline`}
                onClick={() => {
                  setEdit(!edit);
                  if (edit) { // If was editing and now cancelling
                    refetch(); // Refetch to revert changes not submitted
                  }
                }}
              >
                {edit ? "Cancel Edit" : "Edit Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Profile;