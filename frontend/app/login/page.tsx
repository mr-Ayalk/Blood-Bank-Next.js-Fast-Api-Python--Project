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
        await apiRequest("/auth/register", "POST", {
          name,
          email,
          password,
          role,
        });

        alert("Registration successful! Please login.");
        setIsLogin(true);
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
    <div className="min-h-screen flex">
      {/* LEFT SIDE – AUTH FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transition-all">
          {/* HEADER */}
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

          {/* FORM */}
          <div className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Type
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none"
                  >
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
                type="email"
                placeholder="name@example.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
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

      {/* RIGHT SIDE – IMAGE */}
      <div className="hidden md:block w-1/2 h-screen">
        <img
          src="/banner.png"
          alt="Blood Donation Banner"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
