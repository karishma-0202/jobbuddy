import { useEffect, useState } from "react";
import Select from "react-select";
import Creatable from "react-select/creatable";
import { useSelector } from "react-redux";
import { skillOptions, qualificationOptions } from "../../data/constants";
import api from "../../api/axiosConfig";

const JobApplication = ({ isOpen, onClose, job }) => {
  const userData = useSelector((state) => state.auth.userData);
  const token = useSelector((state) => state.auth.token);

  const [applicationForm, setApplicationForm] = useState({
    name: "",
    qualification: "",
    skills: [],
    email: "",
    phone: "",
    resumeLink: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setApplicationForm((prev) => ({
      ...prev,
      name: userData?.name || "",
      email: userData?.email || "",
      skills:
        userData?.skills?.map((s) => ({ value: s, label: s })) || [],
    }));
  }, [userData]);

  // ✅ Updated Experience Display Logic
  const displayExperience = (min, max) => {
    if (min == null || max == null) return "Not specified";

    if (min === 0 && max === 0) return "0";

    // Your backend rule: max 25 means "+"
    if (max === 25) return `${min}+`;

    return `${min}-${max}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!job?.id) return alert("Job ID missing.");

    const body = {
      name: applicationForm.name,
      email: applicationForm.email,
      phone: applicationForm.phone,
      qualification: applicationForm.qualification?.value,
      skills: applicationForm.skills.map((s) => s.value),
      resumeLink: applicationForm.resumeLink,
      status: "Pending",
    };

    setIsLoading(true);
    try {
      const response = await api.post(
        `/api/v1/applications/job/${job.id}`,
        body,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Application submitted successfully!");
        onClose();
        setApplicationForm((prev) => ({
          ...prev,
          phone: "",
          resumeLink: "",
          qualification: "",
        }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to apply. Please ensure you are logged in as a candidate.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#1e293b",
      borderColor: state.isFocused ? "#3b82f6" : "#334155",
      boxShadow: "none",
      borderRadius: 10,
      minHeight: 44,
      "&:hover": { borderColor: "#3b82f6" },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#0f172a",
      borderRadius: 10,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#f1f5f9",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#334155",
      borderRadius: 6,
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#e2e8f0",
    }),
    input: (provided) => ({
      ...provided,
      color: "#f1f5f9",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#1e293b" : "#0f172a",
      color: "#f1f5f9",
      cursor: "pointer",
    }),
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-8">

        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-700 pb-5 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {job?.position || "Job Position"}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Experience Required:{" "}
              {displayExperience(job?.minExperience, job?.maxExperience)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Job Skills */}
        {job?.skills && (
          <div className="flex flex-wrap gap-2 mb-6">
            {job.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs font-medium rounded-full bg-slate-800 border border-slate-600 text-slate-300"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {job?.description && (
          <div className="mb-6 p-4 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm max-h-32 overflow-y-auto">
            {job.description}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <h3 className="text-lg font-semibold text-white">
            Submit Application
          </h3>

          <input
            type="text"
            value={applicationForm.name}
            readOnly
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300"
          />

          <input
            type="email"
            value={applicationForm.email}
            readOnly
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={applicationForm.phone}
            onChange={(e) =>
              setApplicationForm({
                ...applicationForm,
                phone: e.target.value,
              })
            }
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Creatable
            isMulti
            options={skillOptions}
            value={applicationForm.skills}
            onChange={(selected) =>
              setApplicationForm({
                ...applicationForm,
                skills: selected,
              })
            }
            styles={selectStyles}
          />

          <Select
            options={qualificationOptions}
            value={applicationForm.qualification}
            onChange={(selected) =>
              setApplicationForm({
                ...applicationForm,
                qualification: selected,
              })
            }
            styles={selectStyles}
          />

          <input
            type="url"
            placeholder="Resume Link"
            value={applicationForm.resumeLink}
            onChange={(e) =>
              setApplicationForm({
                ...applicationForm,
                resumeLink: e.target.value,
              })
            }
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              isLoading
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isLoading ? "Submitting..." : "Apply Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobApplication;
