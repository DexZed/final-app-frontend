import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import { FirebaseError } from "firebase/app";
import Swal from "sweetalert2";
import { useAuthContext } from "../../contexts/context";
import { showSuccessAlert, validateEmail, validatePass } from "../../utils/utilities";

type Props = {};

function SignUp({}: Props) {
  const { signUpAndUpdate, googleAuth } = useAuthContext();

  const [fields, setFields] = useState({
    name: "",
    picture: "",
    email: "",
    password: "",
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const fromPath = location.state?.from?.pathname || "/";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { name, picture, email, password } = fields;

    // Validate the email
    if (!validateEmail(email)) {
      //
       showSuccessAlert("Success", "Successfully signed up");
      return;
    }

    // Validate password
    const error = validatePass(password);
    if (error) {
      setPasswordError(error);
      //console.log("Password validation failed: ", error);
      return;
    }

    setPasswordError(null); // Clear any previous errors

    try {
      // Firebase sign up process
      await signUpAndUpdate(email, password, {
        displayName: name,
        photoURL: picture,
      });
      Swal.fire({
        title: "Congratulations!",
        text: "You have succesfully signed up!",
        icon: "success",
      });
      navigate(fromPath, { replace: true });
    } catch (err) {
      console.error("Error signing up:", (err as FirebaseError).code);
      if ((err as FirebaseError).code === "auth/invalid-email") {
        console.error("Firebase Error: Invalid email format");
      }
    }
  }

  async function handleGoogleAuth() {
    try {
      await googleAuth();
      navigate(fromPath, { replace: true });
    } catch (err) {
      if (err) {
        console.error(err);
      } else {
        console.error("An unknown error occurred");
      }
    }
  }

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold md:w-52 text-center">Sign Up!</h1>
          <p className="py-6 text-center">
            Sign up with email <br /> or with{" "}
            <span
              className="btn btn-outline btn-sm font-bold hover:bg-stone-200 active:bg-stone-200 focus:outline-none focus:ring focus:ring-white"
              onClick={handleGoogleAuth}
            >
              Google
            </span>
          </p>
        </div>
        <div className="card bg-base-100 w-96 md:w-full md:max-w-sm shrink-0 shadow-2xl">
          <form onSubmit={handleSubmit} className="card-body">
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
            <div className="form-control">
              <label className="label">
                <span className="label-text">Photo</span>
              </label>
              <input
                type="text"
                name="picture"
                placeholder="www.example.com/Image.jpg"
                className="input input-bordered"
                onChange={handleChange}
                required
              />
            </div>
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
              <label className="label">
                <p className="label-text-alt">Already a member?</p>
                <Link to={"/signIn"} className="label-text-alt link link-hover">
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
    </div>
  );
}

export default SignUp;
