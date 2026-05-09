const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function parseResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export async function fetchDashboardData() {
  const [healthResponse, statsResponse, submissionsResponse] = await Promise.all([
    fetch(`${API_BASE_URL}/health`),
    fetch(`${API_BASE_URL}/submissions/stats`),
    fetch(`${API_BASE_URL}/submissions`),
  ]);

  const [health, stats, submissions] = await Promise.all([
    parseResponse(healthResponse),
    parseResponse(statsResponse),
    parseResponse(submissionsResponse),
  ]);

  return { health, stats, submissions };
}

export async function createSubmission(payload) {
  const response = await fetch(`${API_BASE_URL}/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}
