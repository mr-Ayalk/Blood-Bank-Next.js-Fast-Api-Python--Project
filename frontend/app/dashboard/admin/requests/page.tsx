'use client'
import { apiRequest } from "@/lib/api";
import { useEffect, useState } from "react";


export default function AdminRequests() {
const [requests, setRequests] = useState<any[]>([]);


useEffect(() => {
apiRequest("/admin/requests").then(setRequests);
}, []);


async function approve(id: number) {
await apiRequest(`/admin/requests/${id}/approve`, "POST");
alert("Approved");
}


return (
<div>
<h3>Requests</h3>
{requests.map(r => (
<div key={r.id}>
{r.blood_group} - {r.units}
<button onClick={() => approve(r.id)}>Approve</button>
</div>
))}
</div>
);
}