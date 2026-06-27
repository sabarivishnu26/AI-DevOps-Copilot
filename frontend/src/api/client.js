import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api"
});

// 1. Log upload API (POST /upload-log)
export const uploadLog = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/upload-log", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

// 2. Trigger Gemini Analysis API (GET /analyze/{filename})
export const analyzeLog = (filename, logType) => {
  return API.get(`/analyze/${filename}`, {
    params: {
      log_type: logType
    }
  });
};

// 3. List all incidents (GET /incidents)
export const getIncidents = () => {
  return API.get("/incidents");
};

// 4. Retrieve specific incident details (GET /incidents/{id})
export const getIncident = (id) => {
  return API.get(`/incidents/${id}`);
};

// 5. Delete an incident (DELETE /incidents/{id})
export const deleteIncident = (id) => {
  return API.delete(`/incidents/${id}`);
};

// 6. Get Knowledge Base Doc (GET /knowledge-base/{filename})
export const getKnowledgeBaseDoc = (filename) => {
  return API.get(`/knowledge-base/${filename}`);
};