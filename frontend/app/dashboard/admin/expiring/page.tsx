'use client';

import { apiRequest } from "@/lib/api";
import { useEffect, useState } from "react";

export default function ExpiringSoon() {
  const [blood, setBlood] = useState<any[]>([]);

  useEffect(() => {
    apiRequest("/admin/blood/expiring-soon").then(setBlood);
  }, []);

  return (
    <div>
      <h2>Blood Units Expiring Soon (Sorted)</h2>

      {blood.map((b) => (
        <div key={b.id} style={{
          border: "1px solid red",
          margin: 10,
          padding: 10
        }}>
          <p><b>Blood Group:</b> {b.blood_group}</p>
          <p><b>Quantity:</b> {b.quantity}</p>
          <p><b>Expiry Date:</b> {b.expiry_date}</p>
        </div>
      ))}
    </div>
  );
}
