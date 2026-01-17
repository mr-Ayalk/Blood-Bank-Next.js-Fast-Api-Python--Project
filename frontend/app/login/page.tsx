"use client";
import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin() {
    const res = await apiRequest("/auth/login", "POST", { email, password });

    if (res && res.token) {
      // 1. Save credentials (this sets the cookie)
      saveAuth(res.token, res.role);

      // 2. Give the browser a tiny moment to commit the cookie to memory
      // and then use window.location for a "hard" redirect.
      // This is more reliable than router.push for auth-heavy redirects.
      setTimeout(() => {
        if (res.role === "admin") {
          window.location.href = "/dashboard/admin";
        } else {
          window.location.href = "/dashboard/user";
        }
      }, 100);
    }
  }
  return (
    <div className="p-10">
      <h2>Login</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
