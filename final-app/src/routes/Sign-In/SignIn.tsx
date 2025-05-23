import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import Swal from "sweetalert2";
import { useAuthContext } from "../../contexts/context";
import { errMsg } from "../../utils/utilities";

type Props = {};

function SignIn({}: Props) {
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });

  const { signIn, googleAuth } = useAuthContext();

  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const fromPath = location.state?.from?.pathname || "/";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { email, password } = fields;

    try {
      await signIn(email, password);
      Swal.fire({
        title: "Congratulations!",
        text: "You have successfully signed in",
        icon: "success",
      });
      navigate(fromPath, { replace: true });
    } catch (err) {
      if (errMsg(err)) {
        console.error(err.message);
        
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Email or password no not match 😤`,
          footer: '<a href="#">Why do I have this issue?</a>',
        });
      } else {
        console.error("An unknown error occurred");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "An unknown error in auth has occured 😤",
          footer: '<a href="#">Why do I have this issue?</a>',
        });
        
      }
    }
  }
  async function handleGoogleAuth() {
    try {
      await googleAuth();
      Swal.fire({
        title: "Success",
        text: "You have successfully signed in",
        icon: "success",
      });
      navigate(fromPath, { replace: true });
    } catch (err) {
      if (errMsg(err)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "An error in google auth has occured 😤",
          footer: '<a href="#">Why do I have this issue?</a>',
        });
      console.error(err.message);
       
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "An unkown error in google auth has occured 😤",
          footer: '<a href="#">Why do I have this issue?</a>',
        });
        console.error("An unknown  error occurred");
       
      }
    }
  }
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left md:ml-5">
          <h1 className="text-5xl font-bold text-center md:w-40">Sign In</h1>
          <p className="py-6 text-center md:w-">
            Sign in with email
            <br /> or with{" "}
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
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="email"
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
                type={showPassword ? "text" : "password"}
                placeholder="password"
                className="input input-bordered"
                name="password"
                onChange={handleChange}
                autoComplete="on"
                required
              />
              <span
                className="absolute top-11 right-5 text-lg cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "( ͡° ͜ʖ ͡°)" : "(͠≖ ͜ʖ͠≖)"}
              </span>
              <label className="label flex">
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
                <Link
                  className="label-text-alt link link-hover "
                  to={"/signUp"}
                >
                  New Here?
                </Link>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-secondary btn-outline">Sign In</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
