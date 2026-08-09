// // RecruiterRegisterForm.js
// import { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { login as storeLogin } from "../../store/authSlice";
// import api from "../../api/axiosConfig";

// const RecruiterRegisterForm = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [company, setCompany] = useState("");
//   const [location, setLocation] = useState("");

//   useEffect(() => {
//     if (isAuthenticated) navigate("/");
//   }, [isAuthenticated, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     const jobIds = [];
//     const formData = { name, email, password, company, location, jobIds };

//     setIsLoading(true);
//     try {
//       const response = await api.post("/api/recruiters/signup", formData);
//       if (response.status === 201) {
//         alert("Registration successful! Please login to continue.");
//         navigate("/login/recruiter");
//       }
//     } catch (err) {
//       console.log(err);
//       setError("Something went wrong!");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="p-14 mb-24 bg-gray-800 w-full max-w-md 2xl:max-w-xl rounded-lg flex flex-col gap-4 2xl:gap-10 mx-auto"
//     >
//       <h1 className="text-3xl 2xl:text-5xl font-bold text-gray-100 text-center mb-8 2xl:mb-12">
//         Recruiter Signup
//       </h1>

//       <input
//         type="text"
//         placeholder="Name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         className="w-full py-2 px-4 text-lg rounded-lg text-gray-100 bg-gray-700 font-semibold"
//         required
//       />

//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         className="w-full py-2 px-4 text-lg rounded-lg text-gray-100 bg-gray-700 font-semibold"
//         required
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         className="w-full py-2 px-4 text-lg rounded-lg text-gray-100 bg-gray-700 font-semibold"
//         required
//       />

//       <input
//         type="password"
//         placeholder="Confirm Password"
//         value={confirmPassword}
//         onChange={(e) => setConfirmPassword(e.target.value)}
//         className={`w-full py-2 px-4 text-lg rounded-lg text-gray-100 bg-gray-700 font-semibold ${
//           password === confirmPassword
//             ? "border-green-400 outline-green-400"
//             : confirmPassword && "border-red-400 outline-red-400"
//         }`}
//         required
//       />

//       <input
//         type="text"
//         placeholder="Company"
//         value={company}
//         onChange={(e) => setCompany(e.target.value)}
//         className="w-full py-2 px-4 text-lg rounded-lg text-gray-100 bg-gray-700 font-semibold"
//         required
//       />

//       <input
//         type="text"
//         placeholder="Location"
//         value={location}
//         onChange={(e) => setLocation(e.target.value)}
//         className="w-full py-2 px-4 text-lg rounded-lg text-gray-100 bg-gray-700 font-semibold"
//         required
//       />

//       <button
//         type="submit"
//         disabled={
//           isLoading ||
//           !name ||
//           !email ||
//           !password ||
//           !confirmPassword ||
//           password !== confirmPassword
//         }
//         className={`py-2 px-4 my-10 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-lg font-semibold transition-opacity ${
//           (isLoading ||
//             !name ||
//             !email ||
//             !password ||
//             !confirmPassword ||
//             password !== confirmPassword) &&
//           "opacity-30 hover:opacity-40"
//         }`}
//       >
//         Register
//       </button>

//       {error && <p className="text-red-400 text-center text-lg font-black">{error}</p>}

//       <p className="text-gray-300 text-center">
//         <Link
//           to="/login/recruiter"
//           className="hover:text-blue-400 text-lg font-semibold"
//         >
//           Already Registered? Login here
//         </Link>
//       </p>
//     </form>
//   );
// };

// export default RecruiterRegisterForm;
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axiosConfig";

const RecruiterRegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const jobIds = [];
    const formData = { name, email, password, company, location, jobIds };
    setIsLoading(true);
    try {
      const response = await api.post("/api/recruiters/signup", formData);
      if (response.status === 201) {
        alert("Registration successful! Please login to continue.");
        navigate("/login/recruiter");
      }
    } catch {
      setError("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-14 mb-24 bg-gray-800 w-full max-w-md 2xl:max-w-xl rounded-lg flex flex-col gap-4 2xl:gap-10 mx-auto"
    >
      <h1 className="text-3xl 2xl:text-5xl font-bold text-gray-100 text-center mb-8 2xl:mb-12">
        Recruiter Signup
      </h1>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full py-2 px-4 text-lg rounded-lg text-gray-100 bg-gray-700 font-semibold"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full py-2 px-4 text-lg rounded-lg text-gray-100 bg-gray-700 font-semibold"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full py-2 px-4 text-lg rounded-lg text-gray-100 bg-gray-700 font-semibold"
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className={`w-full py-2 px-4 text-lg rounded-lg text-gray-100 bg-gray-700 font-semibold ${
          password === confirmPassword
            ? "border-green-400 outline-green-400"
            : confirmPassword && "border-red-400 outline-red-400"
        }`}
        required
      />
      <input
        type="text"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="w-full py-2 px-4 text-lg rounded-lg text-gray-100 bg-gray-700 font-semibold"
        required
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full py-2 px-4 text-lg rounded-lg text-gray-100 bg-gray-700 font-semibold"
        required
      />

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
        Register
      </button>

      {error && <p className="text-red-400 text-center text-lg font-black">{error}</p>}

      <p className="text-gray-300 text-center">
        <Link to="/login/recruiter" className="hover:text-blue-400 text-lg font-semibold">
          Already Registered? Login here
        </Link>
      </p>
    </form>
  );
};

export default RecruiterRegisterForm;
