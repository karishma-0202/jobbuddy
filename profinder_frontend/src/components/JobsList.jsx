// import React from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const JobsList = ({ jobs = [], loading = false, onApply, onDelete, setSelectedJob }) => {
//   const isRecruiter = useSelector((state) => state.auth.isRecruiter);
//   const userData = useSelector((state) => state.auth.userData);

//   const navigate = useNavigate();

//   return (
//     <div className="my-10">
//       <h2 className="text-gray-100 text-2xl font-bold mb-4">
//         Available Jobs ({jobs.length})
//       </h2>

//       {loading ? (
//         <p className="text-gray-400 text-center mt-6">
//          🔍 Finding best matches for you...
//         </p>
//       ) : jobs.length ===0 ? (
//         <div className="text-center mt-10">
//           <h2 className="text-xl font-semibold text-grey-300">
//             No matching jobs found
//           </h2>
//           <p className="text-gray-500 mt-2">
//             Try adding more relevant skills or experience.
//           </p>
//         </div>  
//       ): (
//         <div className="flex flex-col gap-6">
//           {jobs.map((job) => {

//             // ✅ CORRECT OWNERSHIP CHECK
//             const isOwner =
//               isRecruiter &&
//               userData?.jobIds?.includes(job.id);

//             return (
//               <div
//                 key={job.id}
//                 className="p-6 border rounded-lg flex justify-between bg-gray-900 text-white"
//               >
//                 {/* Job Info */}
//                 <div>
//                   <p className="font-semibold text-lg">{job.position}</p>
//                   <p className="text-gray-300">{job.company}</p>
//                   <p className="text-gray-400 text-sm">{job.location}</p>

//                   <div className="flex flex-wrap gap-2 mt-2">
//                     {(job.skills || []).map((skill, i) => (
//                       <span
//                         key={i}
//                         className="bg-blue-600 px-2 py-1 text-xs rounded"
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Candidate */}
//                 {!isRecruiter && (
//                   <button
//                     onClick={() => onApply(job)}
//                     className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
//                   >
//                     Apply
//                   </button>
//                 )}

//                 {/* Recruiter Controls */}
//                 {isRecruiter && isOwner && (
//                   <div className="flex gap-3">
//                     <button
//                       onClick={() =>
//                         navigate("/post-job", { state: { jobToEdit: job } })
//                       }
//                       className="bg-yellow-500 px-3 py-1 rounded"
//                     >
//                       Edit
//                     </button>

//                     <button
//                       onClick={() => onDelete(job)}
//                       className="bg-red-600 px-3 py-1 rounded"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default JobsList;
// import React from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const JobsList = ({ jobs = [], loading = false, onApply, onDelete }) => {
//   const isRecruiter = useSelector((state) => state.auth.isRecruiter);
//   const userData = useSelector((state) => state.auth.userData);

//   const navigate = useNavigate();

//   return (
//     <div className="my-10">
//       <h2 className="text-gray-100 text-2xl font-bold mb-4 text-center">
//         Available Jobs ({jobs.length})
//       </h2>

//       {/* 🔥 LOADING UI */}
//       {loading ? (
//         <div className="flex flex-col items-center mt-10">
//           <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
//           <p className="mt-3 text-gray-400">
//             Analyzing your profile & matching jobs...
//           </p>
//         </div>
//       ) : jobs.length === 0 ? (
//         /* 🔥 EMPTY STATE */
//         <div className="text-center mt-10">
//           <h2 className="text-xl font-semibold text-gray-300">
//             No matching jobs found 😕
//           </h2>

//           <p className="text-gray-500 mt-2">Try:</p>

//           <ul className="text-gray-400 mt-2 space-y-1">
//             <li>• Adding more relevant skills</li>
//             <li>• Checking spelling</li>
//             <li>• Changing location</li>
//           </ul>
//         </div>
//       ) : (
//         <div className="flex flex-col gap-6">
//           {jobs.map((job, index) => {
//             const isOwner =
//               isRecruiter && userData?.jobIds?.includes(job.id);

//             return (
//               <div
//                 key={job.id}
//                 className="p-6 border border-gray-700 rounded-xl flex justify-between bg-gray-900 hover:bg-gray-800 transition"
//               >
//                 {/* Job Info */}
//                 <div>
//                   {/* 🔥 TOP MATCH BADGE */}
//                   {index === 0 && (
//                     <span className="bg-green-600 text-xs px-2 py-1 rounded mb-2 inline-block">
//                       ⭐ Top Match
//                     </span>
//                   )}

//                   <p className="font-semibold text-lg text-white">
//                     {job.position}
//                   </p>
//                   <p className="text-blue-400">{job.company}</p>
//                   <p className="text-gray-400 text-sm">{job.location}</p>

//                   <div className="flex flex-wrap gap-2 mt-2">
//                     {(job.skills || []).map((skill, i) => (
//                       <span
//                         key={i}
//                         className="bg-blue-600 px-2 py-1 text-xs rounded"
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Candidate */}
//                 {!isRecruiter && (
//                   <button
//                     onClick={() => onApply(job)}
//                     className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition"
//                   >
//                     Apply
//                   </button>
//                 )}

//                 {/* Recruiter Controls */}
//                 {isRecruiter && isOwner && (
//                   <div className="flex gap-3">
//                     <button
//                       onClick={() =>
//                         navigate("/post-job", { state: { jobToEdit: job } })
//                       }
//                       className="bg-yellow-500 px-3 py-1 rounded"
//                     >
//                       Edit
//                     </button>

//                     <button
//                       onClick={() => onDelete(job)}
//                       className="bg-red-600 px-3 py-1 rounded"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default JobsList;
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const JobsList = ({
  jobs = [],
  loading = false,
  hasSearched = false,
  showTopMatch = false,
  onApply,
  onDelete
}) => {
  const isRecruiter = useSelector((state) => state.auth.isRecruiter);
  const userData = useSelector((state) => state.auth.userData);

  const navigate = useNavigate();

  return (
    <div className="my-10">
      <h2 className="text-gray-100 text-2xl font-bold mb-4 text-center">
        Available Jobs ({jobs.length})
      </h2>

      {loading ? (
        <div className="text-center mt-10 text-gray-400">
          Finding best matches...
        </div>
      ) : !hasSearched ? (
        <div className="text-center mt-10 text-gray-400">
          Upload resume or enter skills to get started 🚀
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center mt-10 text-gray-400">
          No matching jobs found 😕
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {jobs.map((job, index) => {
            const isOwner =
              isRecruiter && userData?.jobIds?.includes(job.id);

            return (
              <div
                key={job.id}
                className="p-6 border border-gray-700 rounded-xl flex justify-between bg-gray-900"
              >
                <div>
                  {showTopMatch && index === 0 && (
                    <span className="bg-green-600 text-xs px-2 py-1 rounded mb-2 inline-block">
                      ⭐ Top Match
                    </span>
                  )}

                  <p className="text-lg font-semibold">{job.position}</p>
                  <p className="text-blue-400">{job.company}</p>
                  <p className="text-gray-400 text-sm">{job.location}</p>

                  <div className="flex gap-2 mt-2 flex-wrap">
                    {(job.skills || []).map((skill, i) => (
                      <span key={i} className="bg-blue-600 px-2 py-1 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {!isRecruiter && (
                  <button
                    onClick={() => onApply(job)}
                    className="bg-blue-600 px-4 py-2 rounded"
                  >
                    Apply
                  </button>
                )}

                {isRecruiter && isOwner && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate("/post-job", { state: { jobToEdit: job } })
                      }
                      className="bg-yellow-500 px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(job)}
                      className="bg-red-600 px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobsList;