"use client";
import { useEffect, useState } from "react";
import axios from "axios"; // 1. Import axios

export default function Home() {
  const [blood, setBlood] = useState([]);
  const [loading, setLoading] = useState(true); // Added for better UX

  useEffect(() => {
    // 2. Use axios.get
    axios.get("http://127.0.0.1:8000/blood")
      .then((response) => {
        // Axios stores the data in a .data property automatically
        setBlood(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the blood data!", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading blood inventory...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Blood Bank Management</h1>
      <table border={1} style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>Group</th>
            <th>Quantity (Units)</th>
            <th>Expiry Date</th>
          </tr>
        </thead>
        <tbody>
          {blood.map((b: any) => (
            <tr key={b.id}>
              <td>{b.blood_group}</td>
              <td>{b.quantity}</td>
              <td>{new Date(b.expiry_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}