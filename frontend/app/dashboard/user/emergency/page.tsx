"use client";
import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  Activity, 
  Droplet, 
  History 
} from "lucide-react";

interface DispatchDetail {
  blood_group: string;
  id: number;
}

export default function EmergencyRequest() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [units, setUnits] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dispatchInfo, setDispatchInfo] = useState<{
    message: string;
    units: string[];
  } | null>(null);

  const handleEmergency = async () => {
    if (!bloodGroup) return alert("Please select a target blood group");
    setLoading(true);
    setDispatchInfo(null);

    try {
      // Use encodeURIComponent to ensure "+" signs in "A+" etc. aren't lost in the URL
      const encodedGroup = encodeURIComponent(bloodGroup);
      const res = await apiRequest(
        `/requests/receive/emergency?blood_group=${encodedGroup}&units=${units}`,
        "POST"
      );

      // Store the specific units returned by the compatibility logic
      setDispatchInfo({
        message: res.message,
        units: res.dispatched_units || []
      });
    } catch (err: any) {
      alert(err.message || "Emergency request failed. Inventory might be empty.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 ml-64 bg-slate-50 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl border border-red-100 overflow-hidden">
        
        {/* Urgent Header */}
        <div className="bg-red-600 p-8 text-white relative">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg animate-pulse">
                <AlertTriangle size={24} />
              </div>
              <span className="font-bold tracking-widest text-sm opacity-80 uppercase">Life-Critical Action</span>
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter">EMERGENCY DISPATCH</h1>
            <p className="mt-2 text-red-100 text-sm font-medium">
              Automated compatibility matching using Min-Heap priority queues.
            </p>
          </div>
          <Activity size={120} className="absolute -right-4 -bottom-4 text-white/10" />
        </div>

        <div className="p-10">
          {!dispatchInfo ? (
            <div className="space-y-8">
              {/* Selection Grid */}
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">
                  Patient Blood Group
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setBloodGroup(g)}
                      className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                        bloodGroup === g
                          ? "bg-red-50 border-red-600 text-red-600 shadow-md scale-105"
                          : "bg-white border-slate-100 text-slate-400 hover:border-red-200"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Unit Input */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  Required Quantity (Units)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="1"
                    className="w-full bg-transparent text-3xl font-black text-slate-800 outline-none"
                    value={units}
                    onChange={(e) => setUnits(parseInt(e.target.value))}
                  />
                  <Droplet className="text-red-500" size={32} />
                </div>
              </div>

              {/* The "One-Click" Trigger */}
              <button
                onClick={handleEmergency}
                disabled={loading || !bloodGroup}
                className="group w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-200 text-white font-black py-6 rounded-3xl shadow-xl shadow-red-200 transition-all flex items-center justify-center gap-3 overflow-hidden relative"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Activity className="animate-spin" /> SEARCHING HEAPS...
                  </span>
                ) : (
                  <>
                    <Send size={22} /> EXECUTE INSTANT MATCH
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Success State with Compatibility Details */
            <div className="text-center py-4 animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                MATCH SUCCESSFUL
              </h2>
              <p className="text-slate-500 mt-2 font-medium">{dispatchInfo.message}</p>

              {/* Displaying the actual compatible units found */}
              <div className="mt-8 bg-slate-50 rounded-3xl p-6 border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  <History size={14} /> Dispatched Units (Sorted by Expiry)
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {dispatchInfo.units.map((unit, idx) => (
                    <div key={idx} className="bg-white px-4 py-2 rounded-xl border border-green-200 text-green-700 font-bold text-sm shadow-sm">
                      {unit}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setDispatchInfo(null)}
                className="mt-10 text-slate-400 font-bold hover:text-red-600 transition-colors uppercase text-xs tracking-[0.2em]"
              >
                ← Prepare New Emergency Request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}