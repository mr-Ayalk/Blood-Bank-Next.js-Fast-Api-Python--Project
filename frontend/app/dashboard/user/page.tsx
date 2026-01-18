// app/dashboard/user/page.tsx
'use client'
import Link from "next/link";
import { Heart, Activity, Droplet, Info } from "lucide-react";

export default function UserDashboard() {
  return (
    <div className="p-8 ml-64 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hello, Life-Saver! 👋</h1>
        <p className="text-gray-500 mt-2">Your contribution helps keep the community safe.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6">
            <Heart size={30} fill="currentColor" />
          </div>
          <h2 className="text-xl font-bold mb-2">Want to Donate?</h2>
          <p className="text-gray-500 mb-6 text-sm">Every drop counts. Schedule a donation and we'll notify you when to visit the center.</p>
          <Link href="/dashboard/user/request-donate" className="inline-block bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-100 transition-transform active:scale-95">
            Request Donation
          </Link>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <Droplet size={30} fill="currentColor" />
          </div>
          <h2 className="text-xl font-bold mb-2">Need Blood?</h2>
          <p className="text-gray-500 mb-6 text-sm">Request specific blood groups for emergencies. Our team will verify and process it quickly.</p>
          <Link href="/dashboard/user/request-receive" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 transition-transform active:scale-95">
            Request Units
          </Link>
        </div>
      </div>
    </div>
  );
}