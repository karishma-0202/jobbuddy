import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Creatable from "react-select/creatable";
import api from "../../api/axiosConfig";
import { skillOptions } from "../../data/constants";

const CandidateRegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    const skillsArray = skills.map((item) => item.value);
    const formData = { name, email, password, skills: skillsArray };
    setIsLoading(true);
    try {
      const response = await api.post("/api/candidates/signup", formData);
      if (response.status === 201) {
        alert("Registration successful! Please login to continue.");
        navigate("/login/candidate");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-14 mb-24 bg-gray-900 w-full max-w-md 2xl:max-w-xl rounded-lg flex flex-col gap-4 2xl:gap-10 mx-auto"
    >
      <h1 className="text-3xl 2xl:text-5xl font-bold text-gray-100 text-center mb-8 2xl:mb-12">
        Candidate Signup
      </h1>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full py-2 px-4 text-lg rounded-lg text-gray-100 font-semibold bg-gray-800"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full py-2 px-4 text-lg rounded-lg text-gray-100 font-semibold bg-gray-800"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full py-2 px-4 text-lg rounded-lg text-gray-100 font-semibold bg-gray-800"
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className={`w-full py-2 px-4 text-lg rounded-lg text-gray-100 font-semibold bg-gray-800 ${
          password === confirmPassword
            ? "border-green-400 outline-green-400"
            : confirmPassword && "border-red-400 outline-red-400"
        }`}
        required
      />

      <div className="mt-6">
        <h3 className="text-lg text-gray-100 mb-1 font-medium">Skills</h3>
        <Creatable
          options={skillOptions}
          isMulti
          value={skills}
          onChange={(selectedOptions) => setSkills(selectedOptions)}
        />
      </div>

      <button
        type="submit"
        disabled={
          isLoading ||
          !name ||
          !email ||
          !password ||
          !confirmPassword ||
          password !== confirmPassword
        }
        className={`py-2 px-4 my-10 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-lg font-semibold transition-opacity ${
          (isLoading ||
            !name ||
            !email ||
            !password ||
            !confirmPassword ||
            password !== confirmPassword) &&
          "opacity-30 hover:opacity-40"
        }`}
      >
        {isLoading ? "Registering..." : "Register"}
      </button>

      {error && <p className="text-red-400 text-center text-lg font-black">{error}</p>}

      <p className="text-gray-300 text-center">
        <Link to="/login/candidate" className="hover:text-blue-400 text-lg font-semibold">
          Already Registered? Login here
        </Link>
      </p>
    </form>
  );
};

export default CandidateRegisterForm;
