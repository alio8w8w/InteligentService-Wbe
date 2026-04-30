import type { ReactNode } from "react"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { notFound } from "next/navigation"
import ViewTracker from "@/components/ViewTracker" // Importăm tracker-ul de vizite

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      {/* Tracker-ul este plasat aici pentru a monitoriza toate paginile din acest layout */}
      <ViewTracker />
      {children}
    </NextIntlClientProvider>
  )
}