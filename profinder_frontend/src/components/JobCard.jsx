import { useNavigate } from "react-router-dom";

const JobCard = ({ job, isRecruiter, onApply, onDelete, setSelectedJob }) => {

  const navigate = useNavigate();

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-4">

      <h3 className="text-xl font-bold text-blue-500">{job.position}</h3>
      <p className="text-gray-300">{job.company}</p>
      <p className="text-gray-400">{job.location}</p>

      {/* Skills */}
      <div className="flex gap-2 mt-2 flex-wrap">
        {job.skills?.map((skill, i) => (
          <span key={i} className="bg-blue-500 text-white px-2 py-1 text-sm rounded">
            {skill}
          </span>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="mt-4 flex gap-2">

        {/* Candidate */}
        {!isRecruiter && (
          <button
            onClick={() => onApply(job)}
            className="bg-green-500 px-3 py-1 text-white rounded"
          >
            Apply
          </button>
        )}

        {/* Recruiter */}
        {isRecruiter && (
          <>
            <button
              onClick={() => navigate("/post-job", { state: { jobToEdit: job } })}
              className="bg-yellow-500 px-3 py-1 text-white rounded"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(job)}
              className="bg-red-500 px-3 py-1 text-white rounded"
            >
              Delete
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default JobCard;