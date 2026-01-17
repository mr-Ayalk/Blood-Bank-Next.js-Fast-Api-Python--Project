'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function ProtectedRoute({ children, role }: any) {
const router = useRouter();


useEffect(() => {
const token = localStorage.getItem("token");
const userRole = localStorage.getItem("role");


if (!token) router.push("/login");
if (role && userRole !== role) router.push("/login");
}, []);


return children;
}