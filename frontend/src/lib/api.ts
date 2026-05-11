const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function fetchJobs() {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch jobs");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchJobById(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}`, { cache: 'no-store' });
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
      headers: { "Content-Type": "application/json" },
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
    const res = await fetch(`${API_BASE_URL}/analytics/revenue`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch analytics");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
