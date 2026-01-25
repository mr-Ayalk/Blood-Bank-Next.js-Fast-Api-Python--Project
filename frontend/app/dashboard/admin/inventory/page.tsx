'use client'
import { apiRequest } from "@/lib/api";
import { useEffect, useState } from "react";

export default function Inventory() {
  const [expired, setExpired] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchExpired = () => apiRequest("/admin/inventory/expired").then(setExpired);

  useEffect(() => { fetchExpired(); }, []);

  async function runExpiryCheck() {
    setLoading(true);
    await apiRequest("/admin/inventory/check-expiry", "POST");
    await fetchExpired();
    setLoading(false);
    alert("Expiry check complete!");
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Blood Inventory Management</h2>
      <button 
        onClick={runExpiryCheck}
        className="bg-red-500 text-white px-4 py-2 rounded mb-4"
        disabled={loading}
      >
        {loading ? "Checking..." : "Run Expiry Check"}
      </button>

      <h3 className="font-semibold mt-4">Expired Blood Units (Wastage)</h3>
      <table className="w-full border-collapse border mt-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Group</th>
            <th className="border p-2">Expiry Date</th>
            <th className="border p-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {expired.map((u: any) => (
            <tr key={u.id}>
              <td className="border p-2 text-center">{u.blood_group}</td>
              <td className="border p-2 text-center">{u.expiry_date}</td>
              <td className="border p-2 text-center">{u.quantity} units</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}