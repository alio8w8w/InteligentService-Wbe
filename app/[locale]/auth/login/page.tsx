import { redirect } from "next/navigation"
import AuthCard from "@/components/auth/AuthCard"
import { createClient } from "@/lib/supabase/server"

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ returnTo?: string }>
}) {
  const { locale } = await params
  const { returnTo } = await searchParams
  const safeReturnTo = returnTo?.startsWith("/") ? returnTo : `/${locale}/cont`

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect(safeReturnTo)
  }

  return <AuthCard />
}