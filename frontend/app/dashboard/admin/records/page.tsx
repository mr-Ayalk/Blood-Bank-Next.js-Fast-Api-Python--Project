"use client";
import { apiRequest } from "@/lib/api";
import { useEffect, useState } from "react";
import { Plus, MoreVertical, X } from "lucide-react";

export default function Records() {
  const [records, setRecords] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    blood_group: "A+",
    quantity: 0,
    expiry_date: "",
  });

  const fetchRecords = async () => {
    try {
      const data = await apiRequest("/admin/blood");
      // The backend uses .order_by(BloodUnit.expiry_date.asc())
      // which aligns with our DSA sorting requirement
      setRecords(data);
    } catch (error) {
      console.error("Failed to fetch records", error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // frontend/app/dashboard/admin/records/page.tsx

  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ensure numeric types for the backend
      const payload = {
        ...formData,
        quantity: Number(formData.quantity),
      };

      await apiRequest("/admin/blood", "POST", payload);

      alert("Unit added to Priority Queue successfully!");
      setIsModalOpen(false);
      setFormData({ blood_group: "A+", quantity: 0, expiry_date: "" });
      fetchRecords(); // Refresh table to see the Heap sorting in action
    } catch (error: any) {
      alert(`Error: ${error.message}`); // Will now show the specific error from backend
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-8 ml-64 bg-gray-50 min-h-screen text-black">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blood Inventory</h1>
          <p className="text-gray-500">
            Manage available blood units and expiry dates.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-all"
        >
          <Plus size={18} /> Add Unit
        </button>
      </div>

      {/* --- MODAL POPUP --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Register New Blood Unit</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddUnit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Group
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={formData.blood_group}
                  onChange={(e) =>
                    setFormData({ ...formData, blood_group: e.target.value })
                  }
                  required
                >
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                    (bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity (Units/ml)
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="e.g. 450"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={formData.expiry_date}
                  onChange={(e) =>
                    setFormData({ ...formData, expiry_date: e.target.value })
                  }
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-400"
              >
                {loading ? "Processing..." : "Confirm & Save Unit"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- TABLE --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-black">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">
                Blood Group
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">
                Quantity
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">
                Expiry Date
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">
                Priority Status
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-black">
            {records.length > 0 ? (
              records.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-600 font-bold">
                      {r.blood_group}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {r.quantity} ml
                  </td>
                  <td className="px-6 py-4 text-gray-600">{r.expiry_date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        new Date(r.expiry_date) <
                        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                          ? "bg-red-100 text-red-700" // Urgent: expires within 7 days
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {new Date(r.expiry_date) < new Date()
                        ? "EXPIRED"
                        : "SAFE"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-gray-500 italic"
                >
                  No blood units found in inventory.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
