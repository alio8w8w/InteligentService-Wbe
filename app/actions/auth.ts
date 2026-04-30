"use server"

import { cookies } from "next/headers"

function normalizeCredential(value: string | undefined) {
  if (!value) return ""
  return value.trim().replace(/^['\"]|['\"]$/g, "")
}

export async function loginAdminAction(login: string, pass: string, remember: boolean) {
  // Preluăm credențialele sigure din variabilele de mediu
  const correctUser = normalizeCredential(process.env.ADMIN_USERNAME)
  const correctPass = normalizeCredential(process.env.ADMIN_PASSWORD)
  const providedUser = normalizeCredential(login)
  const providedPass = normalizeCredential(pass)

  const normalizedCorrectUser = correctUser.toLowerCase()
  const normalizedProvidedUser = providedUser.toLowerCase()

  if (!correctUser || !correctPass) {
    console.error("[AUTH] ADMIN_USERNAME sau ADMIN_PASSWORD lipseste din env")
    return { success: false, error: "CONFIG_MISSING" as const }
  }

  // Securitate: întârziem răspunsul ca să nu poți ataca rapid parola
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (normalizedProvidedUser === normalizedCorrectUser && providedPass === correctPass) {
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

    return { success: true as const };
  }

  console.warn("[AUTH] Credentiale invalide", {
    userMatch: normalizedProvidedUser === normalizedCorrectUser,
    passLengthMatch: providedPass.length === correctPass.length,
    providedUserLength: providedUser.length,
    expectedUserLength: correctUser.length,
    providedPassLength: providedPass.length,
    expectedPassLength: correctPass.length,
  })

  return { success: false as const, error: "INVALID_CREDENTIALS" as const };
}