'use client'
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";


export default function UserDashboard() {
return (
<ProtectedRoute role="user">
<Sidebar type="user" />
<div>Welcome User Dashboard</div>
</ProtectedRoute>
);
}