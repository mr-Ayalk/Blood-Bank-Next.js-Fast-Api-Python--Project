// const API = "http://127.0.0.1:8000";

// export async function apiRequest(url: string, method = "GET", data?: any) {
// const token = localStorage.getItem("token");

// const res = await fetch(API + url, {
// method,
// headers: {
// "Content-Type": "application/json",
// Authorization: token ? `Bearer ${token}` : "",
// },
// body: data ? JSON.stringify(data) : undefined,
// });

// if (!res.ok) throw new Error("API Error");
// return res.json();
// }

// frontend/lib/api.ts
import Cookies from "js-cookie";

export async function apiRequest(endpoint: string, method = "GET", body?: any) {
  // 1. Get the token from the cookie we set during login
  const token = Cookies.get("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // 2. Attach the Authorization header if the token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    // This will now catch the "Admin only" error specifically
    throw new Error(errorData.detail || "Request failed");
  }

  return response.json();
}
