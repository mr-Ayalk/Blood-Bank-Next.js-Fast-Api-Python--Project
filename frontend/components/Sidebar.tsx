"use client";
import { logout } from "@/lib/auth";
import Link from "next/link";

export default function Sidebar({ type }: any) {
  return (
    <div>
      {type === "user" && (
        <>
          <Link href="/dashboard/user">Dashboard</Link>
          <Link href="/dashboard/user/profile">Profile</Link>
          <Link href="/dashboard/user/request-donate">Donate</Link>
          <Link href="/dashboard/user/request-receive">Receive</Link>
        </>
      )}

      {type === "admin" && (
        <>
          <Link href="/dashboard/admin">Dashboard</Link>
          <Link href="/dashboard/admin/records">Records</Link>
          <Link href="/dashboard/admin/requests">Requests</Link>
          <Link href="/dashboard/admin/donors">Donors</Link>
          <Link href="/dashboard/admin/receivers">Receivers</Link>
        </>
      )}

      <button onClick={logout}>Logout</button>
    </div>
  );
}
