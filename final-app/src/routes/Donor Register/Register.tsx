import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import { useAuthContext } from "../../contexts/context";
import { Upazila } from "../../assets/upazilas";
import { dist } from "../../assets/districts";

type Props = {};

function Register({}: Props) {
  const { getAuthToken, signUpAndUpdate, currentUser } = useAuthContext();

  const [fields, setFields] = useState({
    uuid: "",
    name: "",
    picture: "",
    email: "",
    password: "",
    confirmPassword: "",
    bloodGroup: "",
    district: "",
    upazilla: "",
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const fromPath = location.state?.from?.pathname || "/";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    // If the field is for the avatar image (file input), handle it differently

    if (name === "picture" && files) {
      const file = files[0]; // Get the selected file
      console.log(file);

      // Upload the image to ImgBB
      const formData = new FormData();
      formData.append("image", file);
      console.log(formData);
      const response = await fetch(
        `https://api.imgbb.com/1/upload?expiration=300&key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        // Set the image URL in the state
        const imageUrl = data.data.url;

        setFields((prev: any) => ({ ...prev, [name]: imageUrl }));
        console.log(`Image URL: ${imageUrl}`);
      } else {
        console.error("Image upload failed:", data);
      }
    } else {
      // Handle other form fields (text inputs, selects, etc.)
      setFields((prev: any) => {
        const updatedFields = { ...prev, [name]: value };
        // Password validation logic (same as in the previous code)
        if (name === "confirmPassword" || name === "password") {
          if (updatedFields.password !== updatedFields.confirmPassword) {
            setPasswordError("Passwords do not match");
          } else {
            setPasswordError(""); // Clear error when they match
          }
        }

        return updatedFields;
      });
    }
  };
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { name, picture, email, password, bloodGroup, district, upazilla } =
      fields;

    try {
      // Dynamically import validation utilities
      const { validateEmail, validatePass, showErrorAlert, showSuccessAlert } =
        await import("../../utils/utilities");

      // Validate email
      if (!validateEmail(email)) {
        showErrorAlert("Email Invalid", email);
        return;
      }

      // Validate password
      const error = validatePass(password);
      if (error) {
        setPasswordError(error);
        return;
      }

      setPasswordError(null);

      // Retry mechanism to wait for currentUser
      const retryLimit = 5; // Limit the number of retries to avoid infinite loop
      let retries = 0;

      const userReady = () => currentUser !== null;

      // Retry logic: keep checking until currentUser is available
      const retryDelay = 1000; // Delay in ms (1 second)
      while (!userReady() && retries < retryLimit) {
        console.log("Waiting for currentUser...");
        await new Promise((resolve) => setTimeout(resolve, retryDelay)); // Wait before retrying
        retries++;
      }

      // If after retryLimit retries, currentUser is still not available, throw an error
      if (!userReady()) {
        showErrorAlert("Error", "User not authenticated after signup.");
        throw new Error("User not authenticated after signup.");
      }
      const token = await getAuthToken();
      const userId = currentUser?.uid;
      
      // Prepare user fields
      const userFields = {
        userId: userId,
        name,
        picture,
        email,
        password,
        bloodGroup,
        district,
        upazilla,
        role: "donor",
        status: "active",
      };

      // Dynamically import API module
      const { api } = await import("../../services/api");

      await api.post("/api/createUsers", userFields, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showSuccessAlert("Success", "Successfully Registered up");
      navigate(fromPath, { replace: true });
    } catch (error) {
      const { errMsg, showErrorAlert } = await import("../../utils/utilities"); // Import inline if needed
      showErrorAlert("Error", error as string); // Use inline if needed); // Use inline if needed
      console.error("Error during form submission:", errMsg(error));
    }
  }

  // IIFE declaration

  const [selectedDistrict, setSelectedDistrict] = useState<string>(""); // Store selected district name
  const [filteredUpazilas, setFilteredUpazilas] = useState<typeof Upazila>([]); // Store filtered upazilas
  const [selectedUpazila, setSelectedUpazila] = useState<string>(""); // Store selected upazila

  // Handle district change
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtName = e.target.value;
    console.log(districtName);
    setSelectedDistrict(districtName);

    // Filter upazilas based on the selected district
    const filtered = Upazila.filter(
      (upazila) =>
        upazila.district_id === dist.find((d) => d.name === districtName)?.id // Match district name to id
    );
    console.log(filtered);
    setFilteredUpazilas(filtered);
    setSelectedUpazila(""); // Reset selected upazila when district changes
  };

  // Handle upazila change
  const handleUpazilaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUpazila(e.target.value);
  };

  return (
    <>
      <h1 className="hero bg-base-200 text-5xl font-bold  translate-y-10 rounded-5xl my-5">
        Register
      </h1>
      <div className="hero bg-base-200 min-h-screen">
        <div className="card bg-base-100 shadow-2xl rounded-5xl">
          <form
            onSubmit={handleSubmit}
            className="card-body grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                className="input input-bordered"
                onChange={handleChange}
                required
              />
            </div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Avatar Image</span>
              </div>
              <input
                onChange={handleChange}
                type="file"
                name="picture"
                className="file-input file-input-bordered w-full max-w-xs"
              />
            </label>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="email@email.com"
                className="input input-bordered"
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
                <span className="label-text-alt">Required</span>
              </div>
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  handleChange(e);
                  handleDistrictChange(e);
                }}
                name="district"
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
                name="upazilla"
                className="select select-primary w-full max-w-xs"
                required
                disabled={!filteredUpazilas.length}
              >
                <option disabled>Select Upazila</option>
                {filteredUpazilas.map((item) => {
                  return (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </label>

            <div className="form-control relative">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                name="password"
                placeholder="password"
                className="input input-bordered"
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
                required
              />
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
              <span
                className="absolute top-11 right-5 text-lg cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "( ͡° ͜ʖ ͡°)" : "(͠≖ ͜ʖ͠≖)"}
              </span>
            </div>
            <div className="form-control relative">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                name="confirmPassword"
                placeholder="Confirm Password"
                className="input input-bordered"
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
                required
              />
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
              <span
                className="absolute top-11 right-5 text-lg cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "( ͡° ͜ʖ ͡°)" : "(͠≖ ͜ʖ͠≖)"}
              </span>
              <label className="label">
                <p className="label-text-alt">New here?</p>
                <Link to={"/signUp"} className="label-text-alt link link-hover">
                  Click here
                </Link>
              </label>
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary btn-outline">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
