const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
export const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN || "admin_session_token_xyz123";

const defaultHeaders = {
  "Authorization": `Bearer ${ADMIN_TOKEN}`
};

export async function fetchJobs() {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs`, { 
      cache: 'no-store',
      headers: defaultHeaders
    });
    if (!res.ok) throw new Error("Failed to fetch jobs");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchJobById(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}`, { 
      cache: 'no-store',
      headers: defaultHeaders
    });
    if (!res.ok) throw new Error("Job not found");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateJob(id: string, updates: { status?: string, deliver?: string, payment?: string }) {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        ...defaultHeaders
      },
      body: JSON.stringify(updates),
    });
    return res.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function fetchAnalytics() {
  try {
    const res = await fetch(`${API_BASE_URL}/analytics/revenue`, { 
      cache: 'no-store',
      headers: defaultHeaders
    });
    if (!res.ok) throw new Error("Failed to fetch analytics");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
