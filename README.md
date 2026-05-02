Leave Management Portal
A full-stack Leave Management System built for the Nrolled IT Team Selection Assignment. It allows employees to apply for leave and manage their leave balances while providing administrators with a dashboard to review, approve, or reject requests.

🔗 Live Demo
Production URL: https://eesha-pai-p.vercel.app/

🚀 Features
Employee Dashboard
Submit Leave Requests: Submit a request by specifying the leave type, dates, and reason.

Leave Balance Tracking: View real-time updates on remaining leave days.

Request Status: Track pending, approved, and rejected leave applications.

Admin Dashboard
Leave Management: View all submitted leave requests across the organization.

Approve/Reject Actions: Instantly update request statuses with real-time feedback.

🛠️ Tech Stack & Architecture
Tech Stack
Framework: Next.js 16 (App Router)

Language: TypeScript

Styling: Tailwind CSS

Database: PostgreSQL via NeonDB

ORM/Query Builder: Direct queries via pg (node-postgres)

Deployment: Vercel

Architecture Overview
The application uses a serverless Next.js architecture. Dynamic server endpoints interact directly with NeonDB (PostgreSQL).

src/
├── app/
│   ├── page.tsx                 # Portal Landing / Navigation
│   ├── globals.css              # Global styling & Tailwind directives
│   ├── admin/
│   │   └── page.tsx             # Admin Review & Approval Dashboard
│   ├── employee/
│   │   └── page.tsx             # Employee Request Submission & Balance View
│   └── api/
│       └── leave/
│           ├── route.ts         # GET (fetch all) & POST (apply)
│           └── [id]/
│               └── route.ts     # PATCH (approve/reject status updates)
└── lib/
    └── db.ts                    # PostgreSQL Neon connection pool setup
    
🤖 AI Usage Disclosure
In compliance with the mandatory AI integration requirements, AI tools were strategically used to streamline development:

Code Generation & Boilerplate: Used to quickly scaffold the Next.js API routes and generate clean Tailwind CSS UI components.

Problem Solving & Debugging: Resolved Next.js 16 asynchronous dynamic API updates (e.g., unwrapping params as a Promise in dynamic routes using await before accessing properties).

Database Schema Planning: Used to design the relational table layout for requests and status tracking.

📋 Assumptions & Core Logic
Leave Balance: Every employee starts with a fixed annual leave balance of 20 days. When a leave request is approved, the requested days are deducted from the employee's balance.

Authentication/Identity: Since this is a simplified assignment, user identity is managed via text input on the form.

Workflow Progression: Leave requests follow a strict state machine: PENDING → APPROVED or REJECTED. Once a request transitions out of PENDING, its status is finalized.

⚙️ Local Development & Setup
Follow these steps to run the project locally:

1. Clone the repository
Bash
git clone https://github.com/EeshaPaiP/EeshaPaiP.git
cd EeshaPaiP
2. Install dependencies
Bash
npm install
3. Configure environment variables
Create a .env.local file in the root directory and add your PostgreSQL connection string:

Code snippet
DATABASE_URL=your_neondb_postgresql_connection_string
4. Run the development server
Bash
npm run dev
Open http://localhost:3000 in your browser to view the application.
