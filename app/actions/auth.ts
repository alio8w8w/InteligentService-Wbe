"use server"

import { cookies } from "next/headers"

export async function loginAdminAction(login: string, pass: string, remember: boolean) {
  // Preluăm credențialele sigure din variabilele de mediu
  const correctUser = process.env.ADMIN_USERNAME;
  const correctPass = process.env.ADMIN_PASSWORD;

  // Securitate: întârziem răspunsul ca să nu poți ataca rapid parola
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (login === correctUser && pass === correctPass) {
    // Setam cookie pentru sesiunea de admin
    const cookieStore = await cookies();
    const maxAge = remember ? 30 * 24 * 60 * 60 : 60 * 60; // 30 zile sau 1 oră

    // IMPORTANT: setează "admin_session" la valoarea "true"!
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: maxAge,
    });

    return { success: true };
  }

  return { success: false };
}