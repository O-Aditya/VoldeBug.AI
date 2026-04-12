import { redirect } from "next/navigation";

// Smart redirect: goes to student dashboard by default.
// Middleware handles role-based routing for teacher/admin.
export default function DashboardPage() {
  redirect("/dashboard/student");
}