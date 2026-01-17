'use client'
import { apiRequest } from "@/lib/api";


export default function ReceiveRequest() {
async function submit() {
await apiRequest("/requests/receive", "POST", { blood_group: "A+", units: 1 });
alert("Receive request sent");
}


return <button onClick={submit}>Request Blood</button>;
}