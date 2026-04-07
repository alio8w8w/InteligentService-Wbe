"use server"

import { cookies } from "next/headers"
import { SignJWT } from "jose" // Instalează cu: npm install jose

export async function loginAdmin(formData: FormData) {
  const login = formData.get("login")
  const pass = formData.get("pass")

  if (login === process.env.ADMIN_LOGIN && pass === process.env.ADMIN_PASS) {
    // Generăm un token securizat
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2h") // Sesiunea expiră în 2 ore
      .sign(secret)

    // Salvăm token-ul într-un Cookie HttpOnly (invizibil pentru JS)
    ;(await
          // Salvăm token-ul într-un Cookie HttpOnly (invizibil pentru JS)
          cookies()).set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    return { success: true }
  }

  return { success: false, error: "Date incorecte!" }
}