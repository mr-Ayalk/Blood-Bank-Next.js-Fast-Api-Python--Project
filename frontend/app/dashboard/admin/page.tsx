// app/dashboard/admin/page.tsx
"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { Activity, Droplet, Clock, PieChart } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    apiRequest("/admin/dashboard/stats").then(setStats);
  }, []);

  const statCards = [
    {
      label: "Total Units",
      value: stats?.total_units || 0,
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Available",
      value: stats?.available_units || 0,
      icon: Droplet,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Expired",
      value: stats?.expired_units || 0,
      icon: Clock,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="p-8 ml-64 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Administrative Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((s, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
          >
            <div className={`p-4 rounded-xl ${s.bg} ${s.color}`}>
              <s.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold text-lg">
          <PieChart size={20} className="text-red-600" /> Stock by Blood Group
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats?.stock_by_group &&
            Object.entries(stats.stock_by_group).map(([group, qty]: any) => (
              <div
                key={group}
                className="border border-gray-100 rounded-xl p-4 text-center"
              >
                <span className="text-red-600 font-bold text-xl">{group}</span>
                <p className="text-gray-500 text-sm mt-1">{qty} Units</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
