import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/leave -> Fetch all leave requests
export async function GET() {
  try {
    const result = await query(
      "SELECT id, employee_name AS \"employeeName\", TO_CHAR(start_date, 'YYYY-MM-DD') AS \"startDate\", TO_CHAR(end_date, 'YYYY-MM-DD') AS \"endDate\", reason, status FROM leave_requests ORDER BY created_at DESC"
    );
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error("Error fetching leaves:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/leave -> Create a new leave request
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { employeeName, startDate, endDate, reason } = body;

    if (!employeeName || !startDate || !endDate || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await query(
      "INSERT INTO leave_requests (employee_name, start_date, end_date, reason, status) VALUES ($1, $2, $3, $4, 'PENDING') RETURNING id, employee_name AS \"employeeName\", TO_CHAR(start_date, 'YYYY-MM-DD') AS \"startDate\", TO_CHAR(end_date, 'YYYY-MM-DD') AS \"endDate\", reason, status",
      [employeeName, startDate, endDate, reason]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error("Error creating leave:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}