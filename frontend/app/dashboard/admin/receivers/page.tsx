'use client'
import { apiRequest } from "@/lib/api";
import { useEffect, useState } from "react";


export default function Receivers() {
const [receivers, setReceivers] = useState<any[]>([]);


useEffect(() => {
apiRequest("/admin/receivers").then(setReceivers);
}, []);


return <pre>{JSON.stringify(receivers, null, 2)}</pre>;
}