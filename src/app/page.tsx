import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-sm border border-slate-200 text-center">
        {/* Header Section */}
        <div className="mb-8">
          <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
            IT Team Assignment
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            Leave Portal
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Apply for time off or manage team requests seamlessly.
          </p>
        </div>

        {/* Quick Mock Dashboard Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-left">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Default Balance
            </p>
            <p className="text-2xl font-bold text-slate-800">15 Days</p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-left">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Status Flow
            </p>
            <p className="text-sm font-semibold text-amber-600 mt-1">
              Pending → Approved
            </p>
          </div>
        </div>

        {/* Call to Actions / Navigation */}
        <div className="flex flex-col gap-3">
          <Link
            href="/employee"
            className="flex h-12 w-full items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            Employee Dashboard
          </Link>
          <Link
            href="/admin"
            className="flex h-12 w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-300"
          >
            Admin Dashboard
          </Link>
        </div>

        {/* Footer info */}
        <div className="mt-8 border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-400">
            Fully responsive. Optimized for both desktop and mobile views.
          </p>
        </div>
      </div>
    </main>
  );
}