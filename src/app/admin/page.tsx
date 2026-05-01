"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface LeaveRequest {
  id: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leave");
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/leave/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updatedReq = await res.json();
        setRequests((prev) =>
          prev.map((req) => (req.id === id ? { ...req, status: updatedReq.status } : req))
        );
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      console.error("Error processing update:", err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">
              ← Back to Portal
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">Admin Dashboard</h1>
          </div>
          <div className="flex gap-4">
            <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm text-center min-w-[100px]">
              <span className="text-xs font-medium text-slate-400 tracking-wide uppercase block">
                Pending
              </span>
              <span className="text-xl font-bold text-amber-600">
                {requests.filter((r) => r.status === "PENDING").length}
              </span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm text-center min-w-[100px]">
              <span className="text-xs font-medium text-slate-400 tracking-wide uppercase block">
                Total
              </span>
              <span className="text-xl font-bold text-slate-800">{requests.length}</span>
            </div>
          </div>
        </div>

        {/* Requests Management System */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Employee Leave Requests</h2>
          <div className="overflow-hidden border border-slate-100 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-3 text-xs font-semibold text-slate-600">Employee</th>
                  <th className="p-3 text-xs font-semibold text-slate-600">Dates</th>
                  <th className="p-3 text-xs font-semibold text-slate-600">Reason</th>
                  <th className="p-3 text-xs font-semibold text-slate-600">Status</th>
                  <th className="p-3 text-xs font-semibold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-400">
                      Loading management table...
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-400">
                      No active requests found.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-medium text-slate-800">{req.employeeName}</td>
                      <td className="p-3 text-slate-600">
                        {req.startDate} to {req.endDate}
                      </td>
                      <td className="p-3 text-slate-500">{req.reason}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                            req.status === "APPROVED"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : req.status === "REJECTED"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {req.status === "PENDING" ? (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleUpdateStatus(req.id, "APPROVED")}
                              className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-md transition-colors shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(req.id, "REJECTED")}
                              className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-md transition-colors shadow-sm"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No action needed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}