import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

export default createMiddleware(routing)

export const config = {
  // Aplică middleware pe toate rutele EXCEPT fișiere statice și api
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}