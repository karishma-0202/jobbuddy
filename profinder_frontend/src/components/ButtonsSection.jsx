import { useNavigate } from "react-router-dom";

const ButtonsSection = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-12 flex justify-center gap-8">
      <button
        onClick={() => navigate("/register/recruiter")}
        className="py-4 px-10 bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors"
      >
        Hiring
      </button>
      <button
        onClick={() => navigate("/register/candidate")}
        className="py-4 px-10 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors"
      >
        Looking for a Job
      </button>
    </div>
  );
};

export default ButtonsSection;
