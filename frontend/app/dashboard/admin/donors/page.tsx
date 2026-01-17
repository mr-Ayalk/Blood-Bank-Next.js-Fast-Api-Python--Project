'use client'
import { apiRequest } from "@/lib/api";
import { useEffect, useState } from "react";


export default function Donors() {
const [donors, setDonors] = useState<any[]>([]);


useEffect(() => {
apiRequest("/admin/donors").then(setDonors);
}, []);


return <pre>{JSON.stringify(donors, null, 2)}</pre>;
}