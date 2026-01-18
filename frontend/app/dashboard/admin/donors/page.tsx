// app/dashboard/admin/donors/page.tsx
'use client'
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { User, Phone, MapPin, Search } from "lucide-react";

export default function AdminDonors() {
  const [donors, setDonors] = useState<any[]>([]);

  useEffect(() => {
    apiRequest("/admin/donors").then(setDonors);
  }, []);

  return (
    <div className="p-8 ml-64 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Donor Registry</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input className="pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-red-500" placeholder="Search donors..." />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {donors.map((donor) => (
          <div key={donor.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 font-bold">
              {donor.blood_group}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{donor.full_name}</h3>
              <div className="flex gap-4 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Phone size={14}/> {donor.phone}</span>
                <span className="flex items-center gap-1"><MapPin size={14}/> {donor.address}</span>
              </div>
            </div>
            <button className="text-xs font-semibold bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200">View History</button>
          </div>
        ))}
      </div>
    </div>
  );
}