"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getRole } from "@/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<"admin" | "user" | null>(null);

  useEffect(() => {
    // Get role from cookies/localStorage via your lib/auth
    const currentRole = getRole() as "admin" | "user";
    setRole(currentRole || "user");
  }, []);

  // Prevent rendering until role is loaded to avoid prop mismatch
  if (!role) return <div className="p-8">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - Positioned on the left */}
      <Sidebar type={role} />

      <div className="flex-1 flex flex-col">
        {/* Navbar - Positioned at the top of the content area */}
        <Navbar type={role} />

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
