import Cookies from "js-cookie";

export function saveAuth(token: string, role: string) {
  // 1. Save to cookies so Middleware (Server-side) can see it
  Cookies.set("token", token, { expires: 1, path: "/" });
  Cookies.set("role", role, { expires: 1, path: "/" });

  // 2. Keep in localStorage for client-side components
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
}

export function logout() {
  // 1. Clear Cookies
  Cookies.remove("token", { path: "/" });
  Cookies.remove("role", { path: "/" });

  // 2. Clear LocalStorage
  localStorage.clear();

  window.location.href = "/login";
}

export function getRole() {
  // Try to get from localStorage first, fallback to Cookie
  return localStorage.getItem("role") || Cookies.get("role");
}
