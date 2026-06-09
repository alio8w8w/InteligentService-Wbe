import { cookies } from "next/headers"

export async function assertAdminSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin_session")?.value

  if (session !== "true") {
    return false
  }

  return true
}
