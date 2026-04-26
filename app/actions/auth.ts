"use server"

import { cookies } from "next/headers"

export async function loginAdminAction(login: string, pass: string, remember: boolean) {
  // Preluăm credențialele sigure din variabilele de mediu
  const correctUser = process.env.ADMIN_USERNAME;
  const correctPass = process.env.ADMIN_PASSWORD;

  // Întârziem intenționat răspunsul (măsură de securitate contra atacurilor Brute Force)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (login === correctUser && pass === correctPass) {
    // Succes! Setăm un cookie securizat (HttpOnly) pentru a recunoaște adminul
    const cookieStore = await cookies()
    const maxAge = remember ? 30 * 24 * 60 * 60 : 60 * 60; // 30 zile sau 1 oră
    
    cookieStore.set("admin_session", "un_token_secret_sau_jwt_aici", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: maxAge,
    })
    
    return { success: true }
  }
  
  return { success: false }
}