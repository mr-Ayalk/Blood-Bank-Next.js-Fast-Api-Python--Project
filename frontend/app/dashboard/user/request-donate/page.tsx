// app/dashboard/user/request-donate/page.tsx
'use client'
import { apiRequest } from "@/lib/api";
import { Heart, ShieldCheck } from "lucide-react";

export default function DonateRequest() {
async function submit() {
    // REMOVED from the line below
    await apiRequest("/requests/donate", "POST", { blood_group: "A+", units: 1 });
    alert("Donation request submitted successfully!");
  }

  return (
    <div className="p-8 ml-64 flex justify-center items-center min-h-[80vh]">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart size={40} fill="currentColor" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Save a Life?</h2>
        <p className="text-gray-500 mb-8">By requesting a donation, our admin will verify your health status and schedule a slot for you.</p>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-left p-4 bg-gray-50 rounded-2xl">
            <ShieldCheck className="text-green-500" />
            <span className="text-sm text-gray-600 font-medium">Verified Health Guidelines</span>
          </div>
        </div>

        <button 
          onClick={submit}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-red-100 active:scale-95"
        >
          Confirm Donation Request
        </button>
      </div>
    </div>
  );
}