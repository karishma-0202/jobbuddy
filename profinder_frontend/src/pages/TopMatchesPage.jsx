// import React, { useState } from "react";
// import api from "../api/axiosConfig";
// import JobsList from "../components/JobsList";
// import JobApplication from "../components/modals/JobApplication";

// const TopMatchesPage = () => {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [mode, setMode] = useState("resume");

//   const [resumeFile, setResumeFile] = useState(null);
//   const [skillsText, setSkillsText] = useState("");
//   const [experienceText, setExperienceText] = useState("");
//   const [location, setLocation] = useState("");

//   const [selectedJob, setSelectedJob] = useState(null);
//   const [showApplyModal, setShowApplyModal] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setJobs([]);

//     try {
//       if (mode === "resume") {
//         const formData = new FormData();
//         formData.append("resume", resumeFile);
//         formData.append("location", location);

//         const res = await api.post("/api/v1/recommendations/resume", formData);

//         console.log("RESUME FINAL:", res.data);

//         // ✅ FIX HERE
//         setJobs(res.data || []);
//       } else {
//         const payload = {
//           skills: skillsText.split(",").map((s) => s.trim()),
//           experience: parseInt(experienceText) || 0,
//           location,
//         };

//         const res = await api.post("/api/v1/recommendations/skills", payload);

//         console.log("MANUAL FINAL:", res.data);

//         // ✅ FIX HERE
//         setJobs(res.data || []);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApply = (job) => {
//     setSelectedJob(job);
//     setShowApplyModal(true);
//   };

//   return (
//     <div className="p-8 bg-gray-900 min-h-screen text-white">
//       <h1 className="text-3xl text-center mb-6">Find Your Top Matches</h1>

//       <div className="flex justify-center gap-4 mb-6">
//         <button onClick={() => setMode("resume")} className={`px-4 py-2 rounded ${mode === "resume" ? "bg-green-600" : "bg-gray-700"}`}>
//           Resume
//         </button>
//         <button onClick={() => setMode("text")} className={`px-4 py-2 rounded ${mode === "text" ? "bg-green-600" : "bg-gray-700"}`}>
//           Manual
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded max-w-xl mx-auto">
//         {mode === "resume" && (
//           <input type="file" onChange={(e) => setResumeFile(e.target.files[0])} />
//         )}

//         {mode === "text" && (
//           <>
//             <input
//               placeholder="Skills"
//               value={skillsText}
//               onChange={(e) => setSkillsText(e.target.value)}
//               className="block w-full mb-3 p-2 bg-gray-700"
//             />
//             <input
//               placeholder="Experience"
//               value={experienceText}
//               onChange={(e) => setExperienceText(e.target.value)}
//               className="block w-full mb-3 p-2 bg-gray-700"
//             />
//           </>
//         )}

//         <button className="bg-blue-600 w-full py-2">
//           {loading ? "Loading..." : "Find Matches"}
//         </button>
//       </form>

//       <JobsList jobs={jobs} loading={loading} onApply={handleApply} />

//       <JobApplication
//         isOpen={showApplyModal}
//         onClose={() => setShowApplyModal(false)}
//         job={selectedJob}
//       />
//     </div>
//   );
// };

// export default TopMatchesPage;
import React, { useState } from "react";
import api from "../api/axiosConfig";
import JobsList from "../components/JobsList";
import JobApplication from "../components/modals/JobApplication";

const TopMatchesPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("resume");
  const [hasSearched, setHasSearched] = useState(false);

  const [resumeFile, setResumeFile] = useState(null);
  const [skillsText, setSkillsText] = useState("");
  const [experienceText, setExperienceText] = useState("");
  const [location, setLocation] = useState("");

  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setJobs([]);
    setHasSearched(true);

    try {
      // 🔥 STEP 1: get ALL jobs
      const jobsRes = await api.get("/api/v1/jobs");
      const allJobs = jobsRes.data;

      let recommendedIds = [];

      if (mode === "resume") {
        const formData = new FormData();
        formData.append("resume", resumeFile);
        formData.append("jobs", JSON.stringify(allJobs)); // ✅ IMPORTANT
        formData.append("location", location);

        const res = await api.post(
          "/api/v1/recommendations/resume",
          formData
        );
        setJobs(res.data);
        
        //recommendedIds = res.data.recommendedJobs || [];
      } else {
        const payload = {
          skills: skillsText.split(",").map((s) => s.trim()),
          experience: parseInt(experienceText) || 0,
          location,
          //jobs: allJobs, // ✅ IMPORTANT
        };

        const res = await api.post(
          "/api/v1/recommendations/skills",
          payload
        );
        setJobs(res.data);

        //recommendedIds = res.data.recommendedJobs || [];
      }

      // 🔥 STEP 2: map IDs → full job objects
      // const finalJobs = recommendedIds
      //   .map((rec) =>
      //     allJobs.find((job) => job.id === rec.jobId)
      //   )
      //   .filter(Boolean);

      // setJobs(finalJobs);

    } catch (err) {
      console.error(err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl text-center mb-6">
        Find Your Top Matches
      </h1>

      {/* MODE SWITCH */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setMode("resume")}
          className={`px-5 py-2 rounded-full ${
            mode === "resume" ? "bg-green-600" : "bg-gray-700"
          }`}
        >
          📄 Resume
        </button>

        <button
          onClick={() => setMode("text")}
          className={`px-5 py-2 rounded-full ${
            mode === "text" ? "bg-green-600" : "bg-gray-700"
          }`}
        >
          ✍️ Manual
        </button>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-xl max-w-xl mx-auto flex flex-col gap-4"
      >
        {mode === "resume" && (
          <input
            type="file"
            onChange={(e) => setResumeFile(e.target.files[0])}
          />
        )}

        {mode === "text" && (
          <>
            <input
              placeholder="Skills (Java, Python...)"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              className="p-2 bg-gray-700 rounded"
              required
            />

            <input
              placeholder="Experience"
              value={experienceText}
              onChange={(e) => setExperienceText(e.target.value)}
              className="p-2 bg-gray-700 rounded"
            />
          </>
        )}

        <input
          placeholder="Preferred Location (optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-2 bg-gray-700 rounded"
        />

        <button className="bg-blue-600 py-2 rounded">
          {loading ? "Finding..." : "Find Matches"}
        </button>
      </form>

      <JobsList
        jobs={jobs}
        loading={loading}
        hasSearched={hasSearched}
        showTopMatch={true}
        onApply={handleApply}
      />

      <JobApplication
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        job={selectedJob}
      />
    </div>
  );
};

export default TopMatchesPage;