'use client'
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";


export default function AdminDashboard() {
return (
<ProtectedRoute role="admin">
<Sidebar type="admin" />
<div>Admin Dashboard</div>
</ProtectedRoute>
);
}