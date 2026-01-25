"use client";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  HeartPulse,
  Save,
  Edit3,
  Activity,
} from "lucide-react";

export default function UserProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    full_name: "",
    blood_group: "",
    phone: "",
    address: "",
    age: 0,
    gender: "Other",
    health_status: "Healthy",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await apiRequest("/users/profile/me");
      setProfile(data);
      if (data) setFormData(data); // Pre-fill form with existing data
    } catch (err) {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/users/profile", "POST", formData);
      alert("Profile Saved Successfully!");
      setIsEditing(false);
      fetchProfile(); // Refresh data
    } catch (err) {
      alert("Failed to save profile.");
    }
  };

  if (loading)
    return (
      <div className="ml-64 p-10 font-bold text-gray-400">
        Loading User Data...
      </div>
    );

  return (
    // ml-64 ensures the content is not hidden behind your sidebar
    <div className="p-8 ml-64 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="h-40 bg-gradient-to-r from-red-600 to-rose-500 relative">
            <Activity
              className="absolute right-10 top-10 text-white/20"
              size={100}
            />
          </div>

          <div className="px-10 pb-10">
            <div className="relative -mt-16 mb-6 flex justify-between items-end">
              <div className="w-32 h-32 bg-white rounded-3xl shadow-lg border-8 border-white flex items-center justify-center text-red-600">
                <User size={60} />
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mb-2 flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95"
              >
                {isEditing ? (
                  "Cancel"
                ) : (
                  <>
                    <Edit3 size={18} /> Edit Profile
                  </>
                )}
              </button>
            </div>

            {!isEditing && profile ? (
              /* VIEW MODE */
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-4xl font-black text-slate-900">
                  {profile.full_name}
                </h1>
                <p className="text-slate-500 font-medium mb-8">
                  Verified Blood Donor
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-red-50 rounded-2xl border border-red-100">
                      <div className="p-3 bg-red-600 rounded-xl text-white">
                        <HeartPulse />
                      </div>
                      <div>
                        <p className="text-xs font-black text-red-400 uppercase">
                          Blood Group
                        </p>
                        <p className="text-xl font-bold text-slate-900">
                          {profile.blood_group}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-slate-600 px-2">
                      <Phone className="text-slate-400" size={20} />
                      <span className="font-semibold">
                        {profile.phone || "No phone added"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-slate-600 px-2">
                      <MapPin className="text-slate-400" size={20} />
                      <span className="font-semibold">
                        {profile.address || "No address added"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-slate-600 px-2">
                      <Calendar className="text-slate-400" size={20} />
                      <span className="font-semibold">
                        Age: {profile.age} years
                      </span>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <p className="text-xs font-black text-slate-400 uppercase mb-2">
                        Current Health Status
                      </p>
                      <div className="flex items-center gap-2 text-green-600 font-bold">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                        {profile.health_status}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* EDIT MODE / INITIAL SETUP */
              <form
                onSubmit={handleSubmit}
                className="space-y-6 animate-in zoom-in-95 duration-300"
              >
                <h2 className="text-2xl font-black text-slate-800">
                  Update Your Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-2">
                      Full Name
                    </label>
                    <input
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-red-500 outline-none transition-all"
                      placeholder="John Doe"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-2">
                      Blood Group
                    </label>
                    <select
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-red-500 outline-none transition-all"
                      value={formData.blood_group}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          blood_group: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Type</option>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                        (g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-2">
                      Phone Number
                    </label>
                    <input
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-red-500 outline-none transition-all"
                      placeholder="+251..."
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-2">
                      Age
                    </label>
                    <input
                      type="number"
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-red-500 outline-none transition-all"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          age: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 text-white font-black py-5 rounded-2xl shadow-lg shadow-red-200 hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} /> Save My Profile
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
