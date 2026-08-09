


import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { updateApplicationStatus } from "../services/jobService";
import api from "../api/axiosConfig";
import CheckIcon from "./Icons/CheckIcon";
import CrossIcon from "./Icons/CrossIcon";

const ApplicationsSection = () => {
  const isRecruiter = useSelector((state) => state.auth.isRecruiter);
  const userData = useSelector((state) => state.auth.userData);

  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [applications, setApplications] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [acceptedApplications, setAcceptedApplications] = useState([]);
  const [rejectedApplications, setRejectedApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const applicationsResponse = await api.get("/api/v1/applications");
        const jobsResponse = await api.get("/api/v1/jobs");
        const applicationsData = applicationsResponse.data;
        const jobsData = jobsResponse.data;

        let formattedApplications = [];

        if (isRecruiter) {
          const recruiterApplications = applicationsData.filter((a) =>
            userData?.jobIds?.includes(a.jobId)
          );
          formattedApplications = recruiterApplications.map((a) => ({
            ...a,
            position: jobsData.find((j) => j.id === a.jobId)?.position || null,
          }));
          setPendingApplications(formattedApplications.filter((a) => a.status === "Pending"));
          setAcceptedApplications(formattedApplications.filter((a) => a.status === "Accepted"));
          setRejectedApplications(formattedApplications.filter((a) => a.status === "Rejected"));
        } else {
          const candidateApplications = applicationsData.filter((a) => a.email === userData?.email);
          formattedApplications = candidateApplications.map((a) => {
            const job = jobsData.find((j) => j.id === a.jobId);
            return { ...a, position: job?.position, company: job?.company, location: job?.location };
          });
        }

        setApplications(formattedApplications);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, [isRecruiter, userData]);

  const handleStatusUpdate = async (item, status) => {
    setActionLoading(true);
    try {
      const result = await updateApplicationStatus(item.id, status);
      if (result.success) {
        setPendingApplications(pendingApplications.filter((a) => a.id !== item.id));
        if (status === "Accepted") setAcceptedApplications([...acceptedApplications, { ...item, status }]);
        if (status === "Rejected") setRejectedApplications([...rejectedApplications, { ...item, status }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const renderCandidateDetails = (item) => (
    <div className="p-4 w-4/5">
      <p className="font-semibold">{item.name} <span className="ml-4 text-sm text-gray-400">{item.qualification}</span></p>
      <p className="text-gray-300">{item.position}</p>
      <p className="text-gray-400">{item.email}</p>
      <p className="text-gray-400">{item.phone}</p>
      <div className="my-2 flex flex-wrap gap-2">
        {item.skills.map((s, i) => (
          <span key={i} className="px-2 py-1 bg-gray-300 text-gray-800 text-xs rounded">{s}</span>
        ))}
      </div>
      <a href={item.resumeLink} target="_blank" rel="noreferrer" className="text-blue-600 underline">Resume</a>
    </div>
  );

  const renderApplicationCard = (item, isPending = false) => (
    <div key={item.id} className="flex justify-between divide-x border border-gray-300 rounded-lg bg-gray-800 text-white">
      {renderCandidateDetails(item)}
      {isPending && (
        <div className="px-4 w-1/5 flex flex-col gap-2 justify-center items-center">
          <button
            onClick={() => handleStatusUpdate(item, "Accepted")}
            disabled={actionLoading}
            className="py-2 px-4 flex flex-col items-center bg-green-600 hover:bg-green-700 rounded-lg transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Accept <CheckIcon width="1.2em" height="1.2em" />
          </button>
          <button
            onClick={() => handleStatusUpdate(item, "Rejected")}
            disabled={actionLoading}
            className="py-2 px-4 flex flex-col items-center bg-red-600 hover:bg-red-700 rounded-lg transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reject <CrossIcon width="1.2em" height="1.2em" />
          </button>
        </div>
      )}
      {!isPending && (
        <div className="px-4 w-1/5 flex justify-center items-center">
          <span className={`font-bold ${item.status === "Accepted" ? "text-green-500" : item.status === "Rejected" ? "text-red-500" : "text-gray-400"}`}>
            {item.status}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="my-8">
      {isRecruiter && (
        <>
          <h2 className="text-2xl font-bold text-white mb-4">Pending Applications</h2>
          <div className="flex flex-col gap-4">
            {pendingApplications.length ? pendingApplications.map((a) => renderApplicationCard(a, true)) : <p className="text-gray-300">No pending applications</p>}
          </div>

          {acceptedApplications.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-green-400 mt-6 mb-2">Accepted Applications</h2>
              <div className="flex flex-col gap-4">
                {acceptedApplications.map((a) => renderApplicationCard(a))}
              </div>
            </>
          )}

          {rejectedApplications.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-red-400 mt-6 mb-2">Rejected Applications</h2>
              <div className="flex flex-col gap-4">
                {rejectedApplications.map((a) => renderApplicationCard(a))}
              </div>
            </>
          )}
        </>
      )}

      {!isRecruiter && (
        <>
          <h2 className="text-2xl font-bold text-white mb-4">Your Applications</h2>
          <div className="flex flex-col gap-2">
            {applications.length ? applications.map((a) => renderApplicationCard(a)) : <p className="text-gray-300">You have not applied to any jobs!</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default ApplicationsSection;

