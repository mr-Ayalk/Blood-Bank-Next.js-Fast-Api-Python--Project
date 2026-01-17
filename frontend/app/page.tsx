"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [blood, setBlood] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/blood")
      .then((res) => res.json())
      .then((data) => setBlood(data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Blood Bank Management</h1>
      <table border={1}>
        <thead>
          <tr>
            <th>Group</th>
            <th>Quantity</th>
            <th>Expiry</th>
          </tr>
        </thead>
        <tbody>
          {blood.map((b: any) => (
            <tr key={b.id}>
              <td>{b.blood_group}</td>
              <td>{b.quantity}</td>
              <td>{b.expiry_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
