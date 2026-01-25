"use client";

import { apiRequest } from "@/lib/api";
import { useEffect, useState } from "react";

export default function StockOverview() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    apiRequest("/admin/dashboard/stats").then(setStats);
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h2>Blood Stock (HashMap View)</h2>

      {Object.entries(stats.stock_by_group).map(([group, qty]: any) => (
        <div
          key={group}
          style={{ border: "1px solid #333", padding: 10, margin: 10 }}
        >
          <p>
            <b>Blood Group:</b> {group}
          </p>
          <p>
            <b>Total Units:</b> {qty}
          </p>
        </div>
      ))}
    </div>
  );
}
