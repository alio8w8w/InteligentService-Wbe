"use server"

import { cookies } from "next/headers"

export async function loginAdminAction(login: string, pass: string, remember: boolean) {
  const ADMIN_LOGIN = "xypbe4-kuqsUh-sygxor"
  const ADMIN_PASS = "kaxwub-noDzag-6hofze"

  if (login === ADMIN_LOGIN && pass === ADMIN_PASS) {
    const cookieStore = await cookies()
    
    // IMPORTANT: Setăm cookie-ul cu setările de bază
    cookieStore.set("admin_session", "true", {
      httpOnly: false, // Permite accesul la cookie din client pentru verificare
      secure: process.env.NODE_ENV === "production",
      maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 2,
      path: "/", // Trebuie să fie disponibil pe tot site-ul
      sameSite: "lax",
    })

    return { success: true }
  }

  return { success: false }
}