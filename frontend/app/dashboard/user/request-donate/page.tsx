'use client'
import { apiRequest } from "@/lib/api";


export default function DonateRequest() {
async function submit() {
await apiRequest("/requests/donate", "POST", { blood_group: "A+", units: 1 });
alert("Request sent");
}


return <button onClick={submit}>Request to Donate</button>;
}