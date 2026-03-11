import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  // Extrage locale din URL (ex: /ru/auth/callback → "ru")
  const pathname = new URL(request.url).pathname
  const locale = pathname.split("/")[1] ?? "ro"

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Verifică dacă profilul e complet
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("profil_complet, telefon")
          .eq("id", user.id)
          .single()

        if (!profile?.profil_complet || !profile?.telefon) {
          return NextResponse.redirect(
            `${origin}/${locale}/auth/completeaza-profil`
          )
        }
      }

      return NextResponse.redirect(`${origin}/${locale}/cont`)
    }
  }

  return NextResponse.redirect(`${origin}/${locale}/auth/login?error=callback`)
}