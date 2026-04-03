import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import createIntlMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const locale = pathname.split("/")[1]
  const isLocaleRoute = routing.locales.includes(locale as (typeof routing.locales)[number])
  const isProtectedAccountRoute = isLocaleRoute && pathname.startsWith(`/${locale}/cont`)

  // Aplică mereu i18n; auth logic vine doar dacă Supabase este configurat corect.
  const intlResponse = intlMiddleware(request)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    if (isProtectedAccountRoute) {
      const loginUrl = new URL(`/${locale || routing.defaultLocale}/login`, request.url)
      return NextResponse.redirect(loginUrl)
    }
    return intlResponse
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  // Supabase SSR — refresh session la fiecare request
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
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
  let user = null
  try {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()
    user = currentUser
  } catch (error) {
    // Evită 500 în edge; rutele publice trebuie să rămână accesibile.
    if (isProtectedAccountRoute) {
      const loginUrl = new URL(`/${locale}/login`, request.url)
      return NextResponse.redirect(loginUrl)
    }
    return intlResponse
  }

  // Copiaza cookie-urile Supabase in raspunsul intl
  response.cookies.getAll().forEach(cookie => {
    intlResponse.cookies.set(cookie.name, cookie.value, cookie)
  })

  if (isProtectedAccountRoute && !user) {
    const loginUrl = new URL(`/${locale}/login`, request.url)
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