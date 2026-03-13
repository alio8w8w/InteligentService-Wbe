"use client"

import { useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Mail, Phone, User, Lock, Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react"
import Link from "next/link"

type View = "auth" | "forgot"
type Tab = "login" | "signup"

function normalizeMdPhone(raw: string) {
  let digits = (raw || "").replace(/\D/g, "")
  if (digits.startsWith("0")) digits = digits.slice(1)
  if (digits.length !== 8) return { ok: false, e164: "", national: digits }
  return { ok: true, e164: `+373${digits}`, national: digits }
}

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

export default function AuthCard() {
  const [view, setView] = useState<View>("auth")
  const [tab, setTab] = useState<Tab>("login")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nume, setNume] = useState("")
  const [prenume, setPrenume] = useState("")
  const [telefonLocal, setTelefonLocal] = useState("")

  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const supabase = createClient()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("auth")
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const returnTo = useMemo(() => {
    const v = searchParams.get("returnTo")
    if (!v || !v.startsWith("/")) return `/${locale}`
    return v
  }, [searchParams, locale])

  const toggleLang = () => {
    const locales = ["ro", "ru", "en"]
    const idx = locales.indexOf(locale)
    const newLocale = locales[(idx + 1) % locales.length]
    const segments = pathname.split("/")
    segments[1] = newLocale
    router.push(segments.join("/") || `/${newLocale}`, { scroll: false })
  }

  const langLabel = locale.toUpperCase()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    const cleanEmail = email.trim().toLowerCase()
      if (!isValidEmail(cleanEmail)) {
      setError(t("email_invalid"))
      setLoading(false)
      return
    }

    try {
      if (tab === "signup") {
        const phone = normalizeMdPhone(telefonLocal)
        if (!phone.ok) {
          setError(t("telefon_invalid_8"))
          return
        }

        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
              emailRedirectTo: `${location.origin}/${locale}/auth/callback?next=${encodeURIComponent(returnTo)}`,
            data: {
              given_name: nume.trim(),
              family_name: prenume.trim(),
              phone: phone.e164,
            },
          },
        })

        if (error) {
          setError(error.message)
          return
        }

        // Confirm email OFF -> session trebuie să existe
        if (!data.session) {
          setSuccess(t("verifica_email"))
          return
        }

        if (data.user?.id) {
          await supabase
            .from("profiles")
            .update({
              email: cleanEmail,
              nume: nume.trim(),
              prenume: prenume.trim(),
              telefon: phone.e164,
              profil_complet: true,
              updated_at: new Date().toISOString(),
            })
            .eq("id", data.user.id)
        }

        router.push(returnTo)
        return
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })

      if (error) {
        setError(
          error.message === "Invalid login credentials"
            ? t("invalid_login_credentials")
            : error.message
        )
        return
      }

      router.push(returnTo)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const cleanEmail = email.trim().toLowerCase()
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
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

  // UI identic cu ce ai avut (card-ul)
  if (view === "forgot") {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-[#253745] bg-[#11212D] p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[#CCD0CF]">{t("recuperare_titlu")}</h1>
                <p className="text-sm text-[#4A5C6A] mt-1">{t("recuperare_subtitlu_link")}</p>
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
                <label className="text-xs uppercase tracking-wider text-[#4A5C6A] mb-1 block">{t("email")}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5C6A]" />
                  <input
                    type="email"
                      autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#253745] bg-[#06141B] pl-9 pr-3 py-2.5 text-sm text-[#CCD0CF] outline-none focus:border-[#9BABAB]"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-2">{error}</p>}
              {success && <p className="text-sm text-green-400 bg-green-400/10 rounded-xl px-4 py-2">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF4B04] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#FF4B04]/85 transition-colors disabled:opacity-50"
              >
                {loading ? t("incarcare") : t("trimite_link")}
              </button>

              <button
                type="button"
                onClick={() => { setView("auth"); setError(""); setSuccess("") }}
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

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-[#253745] bg-[#11212D] p-8 shadow-2xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#CCD0CF]">
                {tab === "login" ? t("titlu_login") : t("titlu_signup_signin")}
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
            <button
              onClick={() => { setTab("login"); setError(""); setSuccess("") }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                tab === "login" ? "bg-[#253745] text-[#CCD0CF]" : "text-[#4A5C6A] hover:text-[#9BABAB]"
              }`}
            >
              {t("tab_login")}
            </button>

            <button
              onClick={() => { setTab("signup"); setError(""); setSuccess("") }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                tab === "signup" ? "bg-[#253745] text-[#CCD0CF]" : "text-[#4A5C6A] hover:text-[#9BABAB]"
              }`}
            >
              {t("tab_signin")}
            </button>
          </div>

          <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
            {tab === "signup" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#4A5C6A] mb-1 block">{t("nume")}</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5C6A]" />
                      <input
                        type="text"
                          autoComplete="family-name"
                        value={nume}
                        onChange={(e) => setNume(e.target.value)}
                        required
                        className="w-full rounded-xl border border-[#253745] bg-[#06141B] pl-9 pr-3 py-2.5 text-sm text-[#CCD0CF] outline-none focus:border-[#9BABAB]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#4A5C6A] mb-1 block">{t("prenume")}</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5C6A]" />
                      <input
                        type="text"
                          autoComplete="given-name"
                        value={prenume}
                        onChange={(e) => setPrenume(e.target.value)}
                        required
                        className="w-full rounded-xl border border-[#253745] bg-[#06141B] pl-9 pr-3 py-2.5 text-sm text-[#CCD0CF] outline-none focus:border-[#9BABAB]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#4A5C6A] mb-1 block">{t("telefon")}</label>
                  <div className="flex gap-2">
                    <div className="w-19.5 flex items-center justify-center rounded-xl border border-[#253745] bg-[#06141B]/60 text-[#9BABAB] text-sm font-semibold">
                      +373
                    </div>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5C6A]" />
                      <input
                        inputMode="numeric"
                        value={telefonLocal}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "")
                          setTelefonLocal(digits.slice(0, 9))
                        }}
                        required
                        placeholder="" // gol, intuitiv
                        className="w-full rounded-xl border border-[#253745] bg-[#06141B] pl-9 pr-3 py-2.5 text-sm text-[#CCD0CF] outline-none focus:border-[#9BABAB]"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-xs uppercase tracking-wider text-[#4A5C6A] mb-1 block">{t("email")}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5C6A]" />
                <input
                  type="email"
                    autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#253745] bg-[#06141B] pl-9 pr-3 py-2.5 text-sm text-[#CCD0CF] outline-none focus:border-[#9BABAB]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs uppercase tracking-wider text-[#4A5C6A]">{t("parola")}</label>
                {tab === "login" && (
                  <button
                    type="button"
                    onClick={() => { setView("forgot"); setError(""); setSuccess("") }}
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
                    autoComplete={tab === "login" ? "current-password" : "new-password"}
                    minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#253745] bg-[#06141B] pl-9 pr-10 py-2.5 text-sm text-[#CCD0CF] outline-none focus:border-[#9BABAB]"
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

            {error && <p className="text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-2">{error}</p>}
            {success && <p className="text-sm text-green-400 bg-green-400/10 rounded-xl px-4 py-2">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF4B04] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#FF4B04]/85 transition-colors disabled:opacity-50 mt-1 flex items-center justify-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              {loading ? t("incarcare") : tab === "login" ? t("btn_login") : t("btn_signin")}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-[#4A5C6A]">
            <Link href={`/${locale}`} className="text-[#9BABAB] hover:text-[#CCD0CF] transition-colors">
              ← {t("inapoi")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}