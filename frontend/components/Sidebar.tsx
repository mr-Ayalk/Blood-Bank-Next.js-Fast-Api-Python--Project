// components/Sidebar.tsx
"use client";
import { logout } from "@/lib/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Droplet,
  ClipboardList,
  Users,
  UserCircle,
  HeartHandshake,
  LogOut,
} from "lucide-react";

export default function Sidebar({ type }: { type: "user" | "admin" }) {
  const pathname = usePathname();

  const adminLinks = [
    { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Blood Records", href: "/dashboard/admin/records", icon: Droplet },
    {
      name: "Requests",
      href: "/dashboard/admin/requests",
      icon: ClipboardList,
    },
    { name: "Donors", href: "/dashboard/admin/donors", icon: Users },
  ];

  const userLinks = [
    { name: "Home", href: "/dashboard/user", icon: LayoutDashboard },
    { name: "My Profile", href: "/dashboard/user/profile", icon: UserCircle },
    {
      name: "Donate Blood",
      href: "/dashboard/user/request-donate",
      icon: HeartHandshake,
    },
    {
      name: "Receive Blood",
      href: "/dashboard/user/request-receive",
      icon: Droplet,
    },
  ];

  const links = type === "admin" ? adminLinks : userLinks;

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col p-4 fixed left-0 top-0">
      <div className="flex items-center gap-2 px-2 mb-8 text-red-600">
        <Droplet size={32} fill="currentColor" />
        <span className="text-xl font-bold tracking-tight text-gray-900">
          LifeStream
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-red-50 text-red-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon size={20} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-3 py-2 mt-auto text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
      >
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}
