// LoginForm.js
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login as storeLogin } from "../../store/authSlice";
import api from "../../api/axiosConfig";
import EyeIcon from "../Icons/EyeIcon";
import EyeCloseIcon from "../Icons/EyeCloseIcon";

const LoginForm = ({ userType }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const apiEndpoint =
      userType === "recruiter"
        ? "/api/recruiters/login"
        : "/api/candidates/login";

    try {
      const response = await api.post(apiEndpoint, { email, password });
      const userData =
        userType === "recruiter"
          ? {
              id: response.data.recruiter.id,
              name: response.data.recruiter.name,
              email: response.data.recruiter.email,
              company: response.data.recruiter.company,
              location: response.data.recruiter.location,
              jobIds: response.data.recruiter.jobIds,
            }
          : {
              id: response.data.candidate.id,
              name: response.data.candidate.name,
              email: response.data.candidate.email,
            };

      dispatch(
        storeLogin({
          isRecruiter: userType === "recruiter",
          userData,
          token: response.data.token,
        })
      );

      navigate("/");
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) setError("This email is not registered");
        else if (err.response.status === 401) setError("Wrong password");
        else setError("Something went wrong!");
      } else setError("Network error!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-14 mb-24 w-full max-w-md 2xl:max-w-xl rounded-lg flex flex-col gap-4 2xl:gap-10 mx-auto ${
        userType === "recruiter" ? "bg-gray-800" : "bg-gray-900"
      }`}
    >
      <h1 className="text-3xl 2xl:text-5xl font-bold text-gray-100 text-center mb-8 2xl:mb-12">
        {userType === "recruiter" ? "Recruiter Login" : "Candidate Login"}
      </h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full py-2 px-4 text-lg rounded-lg text-gray-100 bg-gray-800"
        required
      />

      <div className="flex justify-between gap-1 items-center">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full py-2 px-4 text-lg rounded-lg text-gray-100 bg-gray-800"
          required
        />
        <EyeIcon
          className={`cursor-pointer ${showPassword && "hidden"}`}
          height="1.7em"
          width="1.7em"
          onClick={() => setShowPassword(true)}
        />
        <EyeCloseIcon
          className={`cursor-pointer ${!showPassword && "hidden"}`}
          height="1.7em"
          width="1.7em"
          onClick={() => setShowPassword(false)}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`py-2 px-4 my-10 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-lg font-semibold transition-opacity ${
          isLoading && "opacity-30 hover:opacity-40"
        }`}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>

      {error && <p className="text-red-400 text-center text-lg font-black">{error}</p>}

      <p className="text-gray-300 text-center">
        <Link
          to={`/register/${userType}`}
          className="hover:text-blue-400 text-lg font-semibold"
        >
          Are you new here? Create a New Account
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
