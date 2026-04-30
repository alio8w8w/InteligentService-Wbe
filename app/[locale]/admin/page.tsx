import { cookies } from "next/headers"
import AdminLogin from "@/components/admin/admin-login"
import AdminShell from "@/components/admin/admin-shell"

export default async function AdminPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin_session")?.value

  if (session !== "true") {
    return <AdminLogin />
  }

  return <AdminShell />
}