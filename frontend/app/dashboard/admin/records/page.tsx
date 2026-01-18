// app/dashboard/admin/records/page.tsx
'use client'
import { apiRequest } from "@/lib/api";
import { useEffect, useState } from "react";
import { Droplet, Plus, MoreVertical } from "lucide-react";

export default function Records() {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    apiRequest("/admin/blood").then(setRecords);
  }, []);

  return (
    <div className="p-8 ml-64 bg-gray-50 min-h-screen text-black">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blood Inventory</h1>
          <p className="text-gray-500">Manage available blood units and expiry dates.</p>
        </div>
        <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-all">
          <Plus size={18} /> Add Unit
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-black">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-bottom border-gray-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Blood Group</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Quantity (Units)</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Expiry Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-black">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-600 font-bold">
                    {r.blood_group}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{r.quantity} ml</td>
                <td className="px-6 py-4 text-gray-600">{r.expiry_date}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    r.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={20}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}