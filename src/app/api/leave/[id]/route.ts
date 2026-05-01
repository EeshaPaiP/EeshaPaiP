import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// PATCH /api/leave/[id] -> Update leave status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Treat params as a Promise
) {
  try {
    // 1. Unwrap params before accessing properties
    const resolvedParams = await params;
    const leaveId = parseInt(resolvedParams.id, 10);

    if (isNaN(leaveId)) {
      return NextResponse.json(
        { error: "Invalid leave ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status update" },
        { status: 400 }
      );
    }

    // 2. Pass the parsed integer leaveId to the query
    const result = await query(
      `UPDATE leave_requests 
       SET status = $1 
       WHERE id = $2 
       RETURNING id, employee_name AS "employeeName", TO_CHAR(start_date, 'YYYY-MM-DD') AS "startDate", TO_CHAR(end_date, 'YYYY-MM-DD') AS "endDate", reason, status`,
      [status, leaveId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Leave request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error("Error updating status:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}