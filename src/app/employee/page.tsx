"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function EmployeeDashboard() {
  const [balance, setBalance] = useState(15);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [todayString, setTodayString] = useState("");

  useEffect(() => {
    const today = new Date();
    setTodayString(today.toISOString().split("T")[0]);
    fetchUserLeaves();
  }, []);

  const fetchUserLeaves = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leave");
      if (res.ok) {
        const data = await res.json();
        setRequests(data);

        // Compute real-time remaining balance based on approved days
        let approvedDays = 0;
        data.forEach((req: any) => {
          if (req.status === "APPROVED") {
            const start = new Date(req.startDate);
            const end = new Date(req.endDate);
            const timeDiff = end.getTime() - start.getTime();
            approvedDays += Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
          }
        });
        setBalance(Math.max(0, 15 - approvedDays));
      }
    } catch (err) {
      console.error("Failed to load requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate || !reason) {
      alert("Please fill in all fields.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysRequested = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    if (daysRequested <= 0) {
      alert("End date must be after the start date.");
      return;
    }

    if (daysRequested > balance) {
      alert("Requested days exceed your available leave balance.");
      return;
    }

    try {
      const response = await fetch("/api/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeName: "Eesha Pai P", // Context-specific user defaults
          startDate,
          endDate,
          reason,
        }),
      });

      if (response.ok) {
        const newReq = await response.json();
        setRequests((prev) => [newReq, ...prev]);
        setBalance((prev) => prev - daysRequested);
        setStartDate("");
        setEndDate("");
        setReason("");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Submission failed");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">
              ← Back to Portal
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">Employee Portal</h1>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm text-right">
            <span className="text-xs font-medium text-slate-400 tracking-wide uppercase block">
              Available Balance
            </span>
            <span className="text-xl font-bold text-slate-800">{balance} Days</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Apply for Leave Form */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Request Leave</h2>
            <form onSubmit={handleApplyLeave} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  min={todayString}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (endDate && e.target.value > endDate) {
                      setEndDate("");
                    }
                  }}
                  className="w-full text-sm p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || todayString}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-sm p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  disabled={!startDate}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Reason for Time Off
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="E.g., Personal / Health"
                  className="w-full text-sm p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm py-2.5 rounded-lg transition-colors mt-2"
              >
                Submit Request
              </button>
            </form>
          </div>

          {/* Past/Current History */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Leave Status History</h2>
            <div className="overflow-hidden border border-slate-100 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-3 text-xs font-semibold text-slate-600">Duration</th>
                    <th className="p-3 text-xs font-semibold text-slate-600">Reason</th>
                    <th className="p-3 text-xs font-semibold text-slate-600 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-slate-400">
                        Loading leave records...
                      </td>
                    </tr>
                  ) : requests.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-slate-400">
                        No leave history found.
                      </td>
                    </tr>
                  ) : (
                    requests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50">
                        <td className="p-3 text-slate-700">
                          {req.startDate} to {req.endDate}
                        </td>
                        <td className="p-3 text-slate-500">{req.reason}</td>
                        <td className="p-3 text-right">
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
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}