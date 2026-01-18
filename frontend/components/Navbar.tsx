"use client";
import { logout } from "@/lib/auth";
import { LogOut, Droplets, User } from "lucide-react";

interface NavbarProps {
  type: "admin" | "user";
}

export default function Navbar({ type }: NavbarProps) {
  return (
    <nav className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-2 text-red-600 font-bold text-xl">
        <Droplets fill="currentColor" />
        <span>BloodLink <span className="text-gray-400 font-normal text-sm">| {type.toUpperCase()}</span></span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
          <User size={18} />
          <span className="text-sm font-medium">{type === "admin" ? "Administrator" : "Donor"}</span>
        </div>
        
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors text-sm font-semibold"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </nav>
  );
}