// app/dashboard/user/profile/page.tsx
"use client";
import { apiRequest } from "@/lib/api";
import { useEffect, useState } from "react";
import { User, Phone, MapPin, Calendar, HeartPulse } from "lucide-react";

export default function UserProfile() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Fixed: Wrapped the call properly and removed the "cite" marker
    const fetchProfile = async () => {
      try {
        const data = await apiRequest("/users/me");
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <div className="ml-64 p-8">Loading Profile...</div>;

  return (
    <div className="p-8 ml-64 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-red-500 to-red-600"></div>
          <div className="px-8 pb-8">
            <div className="relative -mt-12 mb-6">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-md border-4 border-white flex items-center justify-center text-red-600">
                <User size={48} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {profile.full_name}
            </h1>{" "}
            [cite: 421]
            <p className="text-gray-500 font-medium mb-8">
              Blood Donor Community Member
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <HeartPulse className="text-red-500" />
                  <span className="font-semibold text-gray-900">
                    Blood Group: {profile.blood_group}
                  </span>{" "}
                  [cite: 422]
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone size={18} /> {profile.phone} [cite: 423]
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin size={18} /> {profile.address} [cite: 424]
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar size={18} /> Age: {profile.age} [cite: 425]
                </div>
                <div
                  className={`p-4 rounded-2xl border ${profile.health_status === "Healthy" ? "bg-green-50 border-green-100 text-green-700" : "bg-blue-50 border-blue-100 text-blue-700"}`}
                >
                  <p className="text-xs font-bold uppercase mb-1">
                    Health Status
                  </p>
                  <p className="font-medium">{profile.health_status}</p> [cite:
                  427]
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
