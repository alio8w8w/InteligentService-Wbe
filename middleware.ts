import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import createIntlMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  // Supabase SSR — refresh session la fiecare request
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session si extrage user-ul curent.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Aplică i18n middleware
  const intlResponse = intlMiddleware(request)

  // Copiaza cookie-urile Supabase in raspunsul intl
  response.cookies.getAll().forEach(cookie => {
    intlResponse.cookies.set(cookie.name, cookie.value, cookie)
  })

  const pathname = request.nextUrl.pathname
  const locale = pathname.split("/")[1]
  const isLocaleRoute = routing.locales.includes(locale as (typeof routing.locales)[number])
  const isProtectedAccountRoute = isLocaleRoute && pathname.startsWith(`/${locale}/cont`)

  if (isProtectedAccountRoute && !user) {
    const loginUrl = new URL(`/${locale}/auth/login`, request.url)
    const returnTo = `${pathname}${request.nextUrl.search}`
    loginUrl.searchParams.set("returnTo", returnTo)

    const redirectResponse = NextResponse.redirect(loginUrl)
    response.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
    })
    return redirectResponse
  }

  return intlResponse
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}