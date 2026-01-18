// 'use client'
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function ProtectedRoute({ children, role }: any) {
// const router = useRouter();

// useEffect(() => {
// const token = localStorage.getItem("token");
// const userRole = localStorage.getItem("role");

// if (!token) router.push("/login");
// if (role && userRole !== role) router.push("/login");
// }, []);

// return children;
// }
// components/ProtectedRoute.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: string;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    const userRole = Cookies.get("role");

    if (!token) {
      router.push("/login");
    } else if (role && userRole !== role) {
      router.push(
        userRole === "admin" ? "/dashboard/admin" : "/dashboard/user",
      );
    } else {
      setAuthorized(true);
    }
  }, [router, role]);

  if (!authorized) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <p className="mt-4 text-gray-500 font-medium tracking-wide">
          Securing Session...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
