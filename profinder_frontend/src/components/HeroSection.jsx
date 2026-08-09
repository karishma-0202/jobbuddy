import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center py-20 bg-gray-900">
      <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
        JobBuddy
      </h1>
      <h2 className="mt-6 text-xl sm:text-2xl md:text-3xl font-semibold text-gray-300 text-center max-w-2xl">
        Unlocking Opportunities, Empowering Careers
      </h2>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => navigate("/register/recruiter")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition"
        >
          Hiring
        </button>
        <button
          onClick={() => navigate("/register/candidate")}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition"
        >
          Looking for a Job
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
