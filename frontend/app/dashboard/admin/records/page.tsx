'use client'
import { apiRequest } from "@/lib/api";
import { useEffect, useState } from "react";


export default function Records() {
const [records, setRecords] = useState([]);


useEffect(() => {
apiRequest("/admin/blood").then(setRecords);
}, []);


return <pre>{JSON.stringify(records, null, 2)}</pre>;
}