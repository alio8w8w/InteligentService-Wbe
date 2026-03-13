"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import {
  Mail,
  Phone,
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

type View = "auth" | "forgot"
type Tab = "login" | "signup"

export default function LoginPage() {
  const [view, setView] = useState<View>("auth")
  const [tab, setTab] = useState<Tab>("login")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nume, setNume] = useState("")
  const [prenume, setPrenume] = useState("")
  const [telefon, setTelefon] = useState("")

  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")

  const supabase = createClient()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("auth")
  const pathname = usePathname()

  // ── Schimbă limba ───────────────────────────────────────
  const toggleLang = () => {
    const locales = ["ro", "ru", "en"]
    const idx = locales.indexOf(locale)
    const newLocale = locales[(idx + 1) % locales.length]
    const segments = pathname.split("/")
    segments[1] = newLocale
    router.push(segments.join("/") || `/${newLocale}`)
  }

  const langLabel = locale.toUpperCase()

  // ── Signup / Login cu email ─────────────────────────────
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (tab === "signup") {
        // 1) Creează user
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            // metadata (Google nu mai există, dar poți păstra)
            data: {
              given_name: nume.trim(),
              family_name: prenume.trim(),
              phone: telefon.trim(),
            },
          },
        })

        if (error) {
          setError(error.message)
          setLoading(false)
          return
        }

        // 2) Dacă proiectul tău are Confirm email OFF, userul e logat imediat
        // Dacă Confirm email ON, data.session va fi null până confirmă.
        if (data.session) {
          // user e logat, putem actualiza profilul (dacă ai RLS ok)
          const userId = data.user?.id
          if (userId) {
            await supabase.from("profiles").update({
              nume: nume.trim(),
              prenume: prenume.trim(),
              telefon: telefon.trim(),
              profil_complet: Boolean(telefon.trim()),
              updated_at: new Date().toISOString(),
            }).eq("id", userId)
          }

          router.push(`/${locale}/cont`)
          return
        }

        // Dacă nu există session, înseamnă confirm email ON
        setSuccess(t("verifica_email"))
        setLoading(false)
        return
      }

      // LOGIN
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        // Mesaj mai clar pentru user
        setError(error.message)
        setLoading(false)
        return
      }

      if (data.session) {
        router.push(`/${locale}/cont`)
      } else {
        setError(t("eroare_login"))
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Recuperare parolă (email) ───────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${location.origin}/${locale}/auth/reset-password`,
      })

      if (error) {
        setError(error.message)
        return
      }

      setSuccess(t("email_recuperare_trimis"))
    } finally {
      setLoading(false)
    }
  }

  // ══════════════════════════════════════════════════════
  // VIEW: FORGOT PASSWORD
  // ══════════════════════════════════════════════════════
  if (view === "forgot") {
    return (
      <div className="min-h-screen bg-[#06141B] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <Link href={`/${locale}`} className="flex items-center justify-center mb-8">
            <span className="font-mono text-2xl font-bold tracking-tight">
              <span className="text-[#CCD0CF]">Inteligent </span>
              <span className="text-[#FF4B04]">Service</span>
            </span>
          </Link>

          <div className="rounded-2xl border border-[#253745] bg-[#11212D] p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[#CCD0CF]">
                  {t("recuperare_titlu")}
                </h1>
                <p className="text-sm text-[#4A5C6A] mt-1">
                  {t("recuperare_subtitlu")}
                </p>
              </div>

              <button
                onClick={toggleLang}
                className="border border-[#253745] bg-[#06141B]/60 text-[#9BABAB] px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider hover:border-[#4A5C6A] hover:text-[#CCD0CF] transition-all"
              >
                {langLabel}
              </button>
            </div>

            <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-[#4A5C6A] mb-1 block">
                  {t("email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5C6A]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="email@exemplu.com"
                    className="w-full rounded-xl border border-[#253745] bg-[#06141B] pl-9 pr-3 py-2.5 text-sm text-[#CCD0CF] placeholder-[#4A5C6A] outline-none focus:border-[#9BABAB] transition-colors"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-2">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-sm text-green-400 bg-green-400/10 rounded-xl px-4 py-2">
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF4B04] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#FF4B04]/85 transition-colors disabled:opacity-50"
              >
                {loading ? t("incarcare") : t("trimite_link")}
              </button>

              <button
                type="button"
                onClick={() => {
                  setView("auth")
                  setError("")
                  setSuccess("")
                }}
                className="flex items-center justify-center gap-2 text-sm text-[#4A5C6A] hover:text-[#9BABAB] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("inapoi_login")}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════
  // VIEW: LOGIN / SIGNUP
  // ══════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#06141B] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Link href={`/${locale}`} className="flex items-center justify-center mb-8">
          <span className="font-mono text-2xl font-bold tracking-tight">
            <span className="text-[#CCD0CF]">Inteligent </span>
            <span className="text-[#FF4B04]">Service</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-[#253745] bg-[#11212D] p-8 shadow-2xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#CCD0CF]">
                {tab === "login" ? t("titlu_login") : t("titlu_signup")}
              </h1>
              <p className="text-sm text-[#4A5C6A] mt-1">
                {tab === "login" ? t("subtitlu_login") : t("subtitlu_signup")}
              </p>
            </div>

            <button
              onClick={toggleLang}
              className="border border-[#253745] bg-[#06141B]/60 text-[#9BABAB] px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider hover:border-[#4A5C6A] hover:text-[#CCD0CF] transition-all"
            >
              {langLabel}
            </button>
          </div>

          <div className="flex rounded-xl border border-[#253745] p-1 mb-6">
            {(["login", "signup"] as const).map((tabKey) => (
              <button
                key={tabKey}
                onClick={() => {
                  setTab(tabKey)
                  setError("")
                  setSuccess("")
                }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  tab === tabKey
                    ? "bg-[#253745] text-[#CCD0CF]"
                    : "text-[#4A5C6A] hover:text-[#9BABAB]"
                }`}
              >
                {tabKey === "login" ? t("tab_login") : t("tab_signup")}
              </button>
            ))}
          </div>

          <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
            {tab === "signup" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#4A5C6A] mb-1 block">
                      {t("nume")}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5C6A]" />
                      <input
                        type="text"
                        value={nume}
                        onChange={(e) => setNume(e.target.value)}
                        required
                        placeholder="Popescu"
                        className="w-full rounded-xl border border-[#253745] bg-[#06141B] pl-9 pr-3 py-2.5 text-sm text-[#CCD0CF] placeholder-[#4A5C6A] outline-none focus:border-[#9BABAB] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#4A5C6A] mb-1 block">
                      {t("prenume")}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5C6A]" />
                      <input
                        type="text"
                        value={prenume}
                        onChange={(e) => setPrenume(e.target.value)}
                        required
                        placeholder="Ion"
                        className="w-full rounded-xl border border-[#253745] bg-[#06141B] pl-9 pr-3 py-2.5 text-sm text-[#CCD0CF] placeholder-[#4A5C6A] outline-none focus:border-[#9BABAB] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#4A5C6A] mb-1 block">
                    {t("telefon")}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5C6A]" />
                    <input
                      type="tel"
                      value={telefon}
                      onChange={(e) => setTelefon(e.target.value)}
                      required
                      placeholder="+373 68 123 456"
                      className="w-full rounded-xl border border-[#253745] bg-[#06141B] pl-9 pr-3 py-2.5 text-sm text-[#CCD0CF] placeholder-[#4A5C6A] outline-none focus:border-[#9BABAB] transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-xs uppercase tracking-wider text-[#4A5C6A] mb-1 block">
                {t("email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5C6A]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="email@exemplu.com"
                  className="w-full rounded-xl border border-[#253745] bg-[#06141B] pl-9 pr-3 py-2.5 text-sm text-[#CCD0CF] placeholder-[#4A5C6A] outline-none focus:border-[#9BABAB] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs uppercase tracking-wider text-[#4A5C6A]">
                  {t("parola")}
                </label>
                {tab === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setView("forgot")
                      setError("")
                      setSuccess("")
                    }}
                    className="text-xs text-[#4A5C6A] hover:text-[#9BABAB] transition-colors"
                  >
                    {t("ai_uitat_parola")}
                  </button>
                )}
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5C6A]" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#253745] bg-[#06141B] pl-9 pr-10 py-2.5 text-sm text-[#CCD0CF] placeholder-[#4A5C6A] outline-none focus:border-[#9BABAB] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A5C6A] hover:text-[#9BABAB]"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-2">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-green-400 bg-green-400/10 rounded-xl px-4 py-2">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF4B04] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#FF4B04]/85 transition-colors disabled:opacity-50 mt-1 flex items-center justify-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              {loading ? t("incarcare") : tab === "login" ? t("btn_login") : t("btn_signup")}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-[#4A5C6A]">
            <Link
              href={`/${locale}`}
              className="text-[#9BABAB] hover:text-[#CCD0CF] transition-colors"
            >
              ← {t("inapoi")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}