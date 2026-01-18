// app/dashboard/admin/requests/page.tsx
"use client";
import { apiRequest } from "@/lib/api";
import { useEffect, useState } from "react";
import { CheckCircle, Clock, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function AdminRequests() {
  const [data, setData] = useState<any>({ donations: [], receives: [] });

  useEffect(() => {
    apiRequest("/requests/").then(setData);
  }, []);

  async function handleApprove(id: number, type: "donate" | "receive") {
    await apiRequest(`/requests/${type}/${id}/approve`, "POST");
    window.location.reload();
  }

  const RequestRow = ({ item, type }: any) => (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {type === "donate" ? (
            <ArrowUpRight className="text-green-500" />
          ) : (
            <ArrowDownLeft className="text-blue-500" />
          )}
          <span className="font-medium text-gray-900">
            User #{item.user_id}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 font-bold text-red-600">{item.blood_group}</td>
      <td className="px-6 py-4 text-gray-600">{item.units || 1} Unit(s)</td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock size={12} /> {item.status}
        </span>
      </td>
      <td className="px-6 py-4">
        {item.status === "PENDING" && (
          <button
            onClick={() => handleApprove(item.id, type)}
            className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors"
          >
            <CheckCircle size={20} />
          </button>
        )}
      </td>
    </tr>
  );

  return (
    <div className="p-8 ml-64 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Pending Approvals
      </h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm font-semibold uppercase">
            <tr>
              <th className="px-6 py-4">Requester</th>
              <th className="px-6 py-4">Group</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.donations.map((r: any) => (
              <RequestRow key={r.id} item={r} type="donate" />
            ))}
            {data.receives.map((r: any) => (
              <RequestRow key={r.id} item={r} type="receive" />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
