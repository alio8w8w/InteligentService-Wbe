import { cookies } from "next/headers"
import AdminLogin from "@/components/admin/admin-login"
import AdminDashboard from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin_session")?.value

  if (session !== "true") {
    return <AdminLogin />
  }

  return <AdminDashboard /> // Randăm direct Dashboard-ul
}