// PostJobForm.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axiosConfig";

// InputField Component
const InputField = ({ label, readOnly = false, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-gray-300 font-medium text-lg">{label}</label>
    <input
      {...props}
      readOnly={readOnly}
      className={`p-3 rounded-md border border-gray-700 focus:outline-none ${
        readOnly
          ? "bg-gray-800 text-gray-500 cursor-not-allowed"
          : "bg-gray-800 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
      }`}
    />
  </div>
);

// TextareaField Component
const TextareaField = ({ label, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-gray-300 font-medium text-lg">{label}</label>
    <textarea
      {...props}
      rows="5"
      className="p-3 bg-gray-800 text-gray-100 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 resize-none"
    />
  </div>
);

const PostJobForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobToEdit = location.state?.jobToEdit;
  const [jobId, setJobId] = useState(jobToEdit?.id || null);

  const [companyCode, setCompanyCode] = useState("");
  const [position, setPosition] = useState("");
  const [locationState, setLocationState] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userData = useSelector((state) => state.auth.userData);
  const token = useSelector((state) => state.auth.token);
  const company = userData?.company || "";
  const recruiterEmail = userData?.email || "";

  useEffect(() => {
    if (jobToEdit) {
      setJobId(jobToEdit.id);
      setCompanyCode(jobToEdit.companyCode || "");
      setPosition(jobToEdit.position || "");
      setLocationState(jobToEdit.location || "");

      const initialExperience =
        jobToEdit.experience ||
        (jobToEdit.minExperience === jobToEdit.maxExperience
          ? `${jobToEdit.minExperience}+`
          : `${jobToEdit.minExperience}-${jobToEdit.maxExperience}`);

      setExperience(initialExperience || "");
      setDescription(jobToEdit.description || "");

      const skillsString = Array.isArray(jobToEdit.skills)
        ? jobToEdit.skills.join(", ")
        : "";

      setSkills(skillsString);
      setMessage(`Editing Job ID: ${jobToEdit.id}`);
    }
  }, [jobToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    let minExp = 0,
      maxExp = 25;

    const expParts = experience.split("-");
    if (expParts.length === 2) {
      minExp = parseInt(expParts[0].trim());
      maxExp = parseInt(expParts[1].trim());
    } else if (experience.includes("+")) {
      minExp = parseInt(experience.replace("+", "").trim());
      maxExp = 25;
    } else {
      minExp = parseInt(experience.trim());
      maxExp = minExp;
    }

    if (isNaN(minExp) || minExp < 0) {
      setMessage("Error: Invalid experience format.");
      setIsLoading(false);
      return;
    }

    const skillsArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const jobData = {
      companyCode,
      company,
      position,
      location: locationState,
      minExperience: minExp,
      maxExperience: maxExp,
      description,
      skills: skillsArray,
      recruiterEmail,
      experience,
    };

    try {
      let endpoint = "";
      let method = "";
      let successMessage = "";

      if (jobId) {
        endpoint = `/api/v1/jobs/edit-with-recruiter/${jobId}`;
        method = "PUT";
        successMessage = "Job updated successfully!";
      } else {
        endpoint = "/api/v1/jobs/create-with-recruiter";
        method = "POST";
        successMessage = "Job created successfully!";
      }

      const response = await api.request({
        url: endpoint,
        method: method,
        data: jobData,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 201) {
        const responseData = response.data;

        setMessage(
          `${successMessage} Job ID: ${responseData.id || jobId || "N/A"}`
        );

        if (!jobId) {
          setCompanyCode("");
          setPosition("");
          setLocationState("");
          setExperience("");
          setDescription("");
          setSkills("");
        }

        setTimeout(() => navigate("/jobs"), 1500);
      } else {
        const errorText = response.data?.message || response.statusText;
        setMessage(
          `Error ${response.status}: ${errorText.substring(0, 100)}...`
        );
      }
    } catch (err) {
      console.error("API Error:", err);
      setMessage(
        "Network Error: Failed to connect or received unexpected response."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-950 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl p-10 bg-gray-900 rounded-xl shadow-xl space-y-6 border border-gray-800"
      >
        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          {jobId ? "Edit Existing Job" : "Post New Job"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Company Code"
            type="text"
            placeholder="e.g., PICCC"
            value={companyCode}
            onChange={(e) => setCompanyCode(e.target.value)}
            required
          />

          <InputField
            label="Company Name"
            type="text"
            value={company}
            readOnly
          />

          <InputField
            label="Position"
            type="text"
            placeholder="e.g., Software Engineer"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />

          <InputField
            label="Location"
            type="text"
            placeholder="e.g., Remote or San Francisco"
            value={locationState}
            onChange={(e) => setLocationState(e.target.value)}
            required
          />
        </div>

        <InputField
          label="Experience Required"
          type="text"
          placeholder="e.g., 3+ or 5-8"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          required
        />

        <TextareaField
          label="Job Description"
          placeholder="Outline responsibilities, requirements, and benefits..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <InputField
          label="Skills (comma separated)"
          type="text"
          placeholder="e.g., Java, SpringBoot, AWS, REST API"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          required
        />

        <InputField
          label="Recruiter Email"
          type="email"
          value={recruiterEmail}
          readOnly
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-700 hover:bg-blue-600 text-white text-lg font-medium rounded-md transition duration-200 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : jobId ? "Save Changes" : "Create Job"}
        </button>

        {message && (
          <p
            className={`text-center font-medium ${
              message.includes("Error")
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default PostJobForm;
