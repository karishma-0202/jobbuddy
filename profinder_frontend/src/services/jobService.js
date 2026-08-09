import api from "../api/axiosConfig"; // ✅ reuses your axios instance

export const applyForJob = async (applicationData, jobId) => {
  try {
    const token = localStorage.getItem("jwt"); // JWT from login
    const response = await api.post(
      `/api/v1/applications/job/${jobId}`,
      applicationData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Application submission failed:", error.response);
    return { success: false, error: error.response };
  }
};


export const updateApplicationStatus = async (applicationId, status) => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await api.patch(
      `/api/v1/applications/${applicationId}/status?status=${status}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Updating application status failed:", error.response);
    return { success: false, error: error.response };
  }
};