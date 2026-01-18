"use client";
import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import { Droplet, UserPlus, LogIn } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      if (isLogin) {
        // Login Logic
        const res = await apiRequest("/auth/login", "POST", {
          email,
          password,
        });
        if (res?.token) {
          saveAuth(res.token, res.role);
          window.location.href =
            res.role === "admin" ? "/dashboard/admin" : "/dashboard/user";
        }
      } else {
        // Registration Logic
        // Route: /auth/register as per typical backend specs
        await apiRequest("/auth/register", "POST", {
          name,
          email,
          password,
          role,
        });
        alert("Registration successful! Please login.");
        setIsLogin(true); // Switch to login view after successful registration
      }
    } catch (err) {
      alert(
        isLogin ? "Invalid credentials" : "Registration failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transition-all">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full text-red-600 mb-4">
            <Droplet size={32} fill="currentColor" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? "Welcome Back" : "Join BloodLink"}
          </h2>
          <p className="text-gray-500 mt-2">
            {isLogin
              ? "Sign in to manage blood donations"
              : "Register as a donor or administrator"}
          </p>
        </div>

        <div className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none"
                  type="text"
                  placeholder="John Doe"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none"
                  onChange={(e) => setRole(e.target.value)}
                  value={role}
                >
                  {/* Ensure these values match your database/backend logic */}
                  <option value="user">User / Donor</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none"
              type="email"
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none"
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              "Processing..."
            ) : isLogin ? (
              <>
                <LogIn size={20} /> Login
              </>
            ) : (
              <>
                <UserPlus size={20} /> Register
              </>
            )}
          </button>

          <div className="text-center pt-4 border-t border-gray-100">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-red-600 font-semibold hover:underline text-sm"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
