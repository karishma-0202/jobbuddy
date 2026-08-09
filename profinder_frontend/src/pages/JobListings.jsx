

// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";

// import api from "../api/axiosConfig";
// import JobsList from "../components/JobsList";
// import JobApplication from "../components/modals/JobApplication";
// import Confirmation from "../components/modals/Confirmation";

// // Static Jobs
// const STATIC_JOBS = [
//   { id: "static-1", company: "TechCorp", position: "Frontend Developer", location: "Remote", experience: "2+", skills: ["React", "JavaScript", "CSS"], description: "Build amazing UI components." },
//   { id: "static-2", company: "DataWorks", position: "Data Analyst", location: "New York", experience: "3+", skills: ["SQL", "Python", "Excel"], description: "Analyze and visualize data." },
//   { id: "static-3", company: "Cloudify", position: "DevOps Engineer", location: "San Francisco", experience: "4+", skills: ["AWS", "Docker", "Kubernetes"], description: "Maintain cloud infrastructure." },
//   { id: "static-4", company: "AI Labs", position: "Machine Learning Intern", location: "Remote", experience: "0-1", skills: ["Python", "TensorFlow", "Pandas"], description: "Assist with ML model development." },
// ];

// const JobListings = () => {
//   const userData = useSelector((state) => state.auth.userData);
//   const isRecruiter = useSelector((state) => state.auth.isRecruiter);

//   const [isLoading, setIsLoading] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [isJobApplicationModalOpen, setIsJobApplicationModalOpen] = useState(false);
//   const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
//   const [confirmationMessage, setConfirmationMessage] = useState("");
//   const [jobs, setJobs] = useState([]);
//   const [selectedJob, setSelectedJob] = useState(null);

//   useEffect(() => {
//     const fetchJobs = async () => {
//       setIsLoading(true);
//       try {
//         const jobsResponse = await api.get("/api/v1/jobs");
//         setJobs([...jobsResponse.data, ...STATIC_JOBS]);
//       } catch (error) {
//         console.error("Error fetching jobs:", error);
//         setJobs([...STATIC_JOBS]);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchJobs();
//   }, []);

//   const openApplicationModal = (job) => {
//     setSelectedJob(job);
//     setIsJobApplicationModalOpen(true);
//   };

//   const closeApplicationModal = () => setIsJobApplicationModalOpen(false);
//   const openConfirmationModal = () => setIsConfirmationModalOpen(true);
//   const closeConfirmationModal = () => setIsConfirmationModalOpen(false);

//   const applyForJob = async (formData) => {
//     if (!selectedJob || selectedJob.id.startsWith("static")) {
//       closeApplicationModal();
//       setConfirmationMessage(`Successfully applied to the static job: ${selectedJob?.position} at ${selectedJob?.company}`);
//       openConfirmationModal();
//       return { success: true };
//     }

//     try {
//       const endpoint = `/api/v1/applications/job/${selectedJob.id}`;
//       const applyResponse = await api.post(endpoint, formData);
//       if (applyResponse.status === 201) {
//         closeApplicationModal();
//         setConfirmationMessage(`Successfully applied to the job: ${selectedJob?.position} at ${selectedJob?.company}`);
//         openConfirmationModal();
//         return { success: true };
//       }
//     } catch (error) {
//       console.error(error.response || error);
//       closeApplicationModal();
//       setConfirmationMessage(error.response?.data?.message || "Error applying for the job.");
//       openConfirmationModal();
//       return { success: false };
//     }
//   };

//   const deleteJob = async (job) => {
//     if (job.id.startsWith("static")) return alert("Static jobs cannot be deleted");
//     setActionLoading(true);
//     try {
//       const removeResponse = await api.post(`/api/recruiters/${userData.email}/remove-job`, { jobId: job.id });
//       if (removeResponse.status === 200) {
//         setJobs(jobs.filter((j) => j.id !== job.id));
//         setConfirmationMessage(`Successfully deleted the job: ${job.position} at ${job.company}`);
//         openConfirmationModal();
//       }
//     } catch (error) {
//       console.error(error);
//       setConfirmationMessage("Error deleting job. Try again!");
//       openConfirmationModal();
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   return (
//     <div className="pt-40 px-32">
//       {isLoading ? (
//         <p className="text-white text-lg font-bold">Loading...</p>
//       ) : jobs.length > 0 ? (
//         <JobsList
//           actionLoading={actionLoading}
//           jobs={jobs}
//           onApply={openApplicationModal}
//           onDelete={deleteJob}
//           setSelectedJob={setSelectedJob}
//         />
//       ) : (
//         <p className="text-white text-lg font-bold">No available jobs to show! Kindly check later</p>
//       )}

//       <JobApplication isOpen={isJobApplicationModalOpen} onClose={closeApplicationModal} job={selectedJob} applyForJob={applyForJob} />
//       <Confirmation isOpen={isConfirmationModalOpen} onClose={closeConfirmationModal} message={confirmationMessage} />
//     </div>
//   );
// };

// export default JobListings;
 
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import api from "../api/axiosConfig";
import JobsList from "../components/JobsList";
import JobApplication from "../components/modals/JobApplication";
import Confirmation from "../components/modals/Confirmation";

const JobListings = () => {
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);
  const isRecruiter = useSelector((state) => state.auth.isRecruiter);

  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const [isJobApplicationModalOpen, setIsJobApplicationModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/api/v1/jobs");
      setJobs(res.data); // ✅ ONLY backend jobs
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- APPLY ----------------
  const openApplicationModal = (job) => {
    setSelectedJob(job);
    setIsJobApplicationModalOpen(true);
  };

  const applyForJob = async (formData) => {
    try {
      const res = await api.post(`/api/v1/applications/job/${selectedJob.id}`, formData);

      if (res.status === 201) {
        setConfirmationMessage(`Applied to ${selectedJob.position}`);
        setIsConfirmationModalOpen(true);
      }
    } catch (error) {
      setConfirmationMessage("Error applying!");
      setIsConfirmationModalOpen(true);
    } finally {
      setIsJobApplicationModalOpen(false);
    }
  };

  // ---------------- DELETE ----------------
  const deleteJob = async (job) => {
    setActionLoading(true);
    try {
      await api.post(`/api/recruiters/${userData.email}/remove-job`, {
        jobId: job.id,
      });

      setJobs(jobs.filter((j) => j.id !== job.id));
      setConfirmationMessage(`Deleted ${job.position}`);
      setIsConfirmationModalOpen(true);
    } catch (error) {
      setConfirmationMessage("Delete failed!");
      setIsConfirmationModalOpen(true);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="pt-32 px-20">

      {/* ✅ RECRUITER BUTTON */}
      {isRecruiter && (
        <div className="mb-6">
          <button
            onClick={() => navigate("/post-job")}
            className="bg-orange-500 px-4 py-2 text-white rounded"
          >
            + Post a Job
          </button>
        </div>
      )}

      {/* JOB LIST */}
      {isLoading ? (
        <p className="text-white">Loading...</p>
      ) : jobs.length > 0 ? (
        <JobsList
          jobs={jobs}
          loading={isLoading}
          hasSearched={true}
          showTopMatch={false}
          //isRecruiter={isRecruiter}
          onApply={openApplicationModal}
          onDelete={deleteJob}
          //setSelectedJob={setSelectedJob}
        />
      ) : (
        <p className="text-white">No jobs available</p>
      )}

      {/* MODALS */}
      <JobApplication
        isOpen={isJobApplicationModalOpen}
        onClose={() => setIsJobApplicationModalOpen(false)}
        job={selectedJob}
        applyForJob={applyForJob}
      />

      <Confirmation
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        message={confirmationMessage}
      />
    </div>
  );
};

export default JobListings;