import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  // Extrage locale din URL: /ro/auth/callback → "ro"
  const pathname = new URL(request.url).pathname
  const locale = pathname.split("/")[1] ?? "ro"

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch (error) {
              // Ignoră eroarea în Server Components
            }
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Verifică dacă profilul există
        const { data: profile } = await supabase
          .from("profiles")
          .select("profil_complet, telefon")
          .eq("id", user.id)
          .single()

        // Dacă nu are telefon → completează profilul
        if (!profile?.telefon) {
          return NextResponse.redirect(
            `${origin}/${locale}/auth/completeaza-profil`
          )
        }

        // Profilul complet → mergi la cont
        return NextResponse.redirect(`${origin}/${locale}/cont`)
      }
    }

    // Eroare la exchange → înapoi la login cu eroare
    return NextResponse.redirect(
      `${origin}/${locale}/auth/login?error=auth_callback_error`
    )
  }

  return NextResponse.redirect(`${origin}/${locale}/auth/login`)
}