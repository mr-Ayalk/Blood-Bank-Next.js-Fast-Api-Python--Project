// // app/dashboard/admin/page.tsx
// "use client";
// import { useEffect, useState } from "react";
// import { apiRequest } from "@/lib/api";
// import { Activity, Droplet, Clock, PieChart } from "lucide-react";

// export default function AdminDashboard() {
//   const [stats, setStats] = useState<any>(null);

//   useEffect(() => {
//     apiRequest("/admin/dashboard/stats").then(setStats);
//   }, []);

//   const statCards = [
//     {
//       label: "Total Units",
//       value: stats?.total_units || 0,
//       icon: Activity,
//       color: "text-blue-600",
//       bg: "bg-blue-50",
//     },
//     {
//       label: "Available",
//       value: stats?.available_units || 0,
//       icon: Droplet,
//       color: "text-green-600",
//       bg: "bg-green-50",
//     },
//     {
//       label: "Expired",
//       value: stats?.expired_units || 0,
//       icon: Clock,
//       color: "text-red-600",
//       bg: "bg-red-50",
//     },
//   ];

//   return (
//     <div className="p-8 ml-64 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl font-bold text-gray-900 mb-8">
//         Administrative Overview
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         {statCards.map((s, i) => (
//           <div
//             key={i}
//             className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
//           >
//             <div className={`p-4 rounded-xl ${s.bg} ${s.color}`}>
//               <s.icon size={24} />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500 font-medium">{s.label}</p>
//               <p className="text-2xl font-bold text-gray-900">{s.value}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//         <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold text-lg">
//           <PieChart size={20} className="text-red-600" /> Stock by Blood Group
//         </div>
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//           {stats?.stock_by_group &&
//             Object.entries(stats.stock_by_group).map(([group, qty]: any) => (
//               <div
//                 key={group}
//                 className="border border-gray-100 rounded-xl p-4 text-center"
//               >
//                 <span className="text-red-600 font-bold text-xl">{group}</span>
//                 <p className="text-gray-500 text-sm mt-1">{qty} Units</p>
//               </div>
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import {
  Activity,
  Droplet,
  Clock,
  PieChart as PieIcon,
  LayoutGrid,
  Zap,
  AlertTriangle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiRequest("/admin/dashboard/stats");
        setStats(data);
      } catch (error: any) {
        console.error("Dashboard Error:", error);
        if (error.message.includes("401") || error.message.includes("403")) {
          // If unauthorized, kick back to login instead of hanging
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false); // This ensures "Processing" stops no matter what
      }
    };

    fetchStats();
  }, []);

  // Matching your Record Page logic:
  // Available = SAFE (Not expired)
  // Expired = Already passed expiry date
  const chartData = [
    {
      name: "Safe Stock",
      value: stats?.available_units || 0,
      color: "#10b981",
    },
    {
      name: "Dispatched",
      value: stats?.dispatched_units || 0,
      color: "#3b82f6",
    },
    { name: "Expired", value: stats?.expired_units || 0, color: "#ef4444" },
  ];

  const statCards = [
    {
      label: "Total Registered",
      value: stats?.total_units || 0,
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Usable Stock (Safe)",
      value: stats?.available_units || 0,
      icon: Droplet,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Wasted/Expired",
      value: stats?.expired_units || 0,
      icon: AlertTriangle,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  if (loading)
    return (
      <div className="ml-64 p-10 font-bold text-slate-400">
        Syncing Inventory Data...
      </div>
    );

  return (
    <div className="p-8 ml-64 bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            System Analytics
          </h1>
          <p className="text-slate-500 font-medium">
            Matching Record Page validation logic
          </p>
        </div>
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex gap-2">
          <span className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold uppercase tracking-wider">
            <Zap size={14} /> Database Synced
          </span>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {statCards.map((s, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 transition-all hover:-translate-y-1"
          >
            <div
              className={`w-14 h-14 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center mb-6`}
            >
              <s.icon size={28} />
            </div>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">
              {s.label}
            </p>
            <p className="text-4xl font-black text-slate-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PIE CHART */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-8 text-slate-800 font-black text-xl uppercase tracking-tight">
            <PieIcon size={24} className="text-red-500" /> Inventory Health
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend iconType="circle" verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BLOOD GROUP GRID */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-8 text-slate-800 font-black text-xl uppercase tracking-tight">
            <LayoutGrid size={24} className="text-red-500" /> Stock by Group
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats?.stock_by_group &&
              Object.entries(stats.stock_by_group).map(([group, qty]: any) => (
                <div
                  key={group}
                  className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-center hover:bg-red-50 transition-colors group"
                >
                  <span className="text-slate-400 group-hover:text-red-600 font-black text-2xl block transition-colors">
                    {group}
                  </span>
                  <p className="text-slate-900 font-bold text-lg mt-1">{qty}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">
                    Safe Units
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
