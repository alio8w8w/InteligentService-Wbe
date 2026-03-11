"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Chrome, Facebook, Mail, Phone, User, Lock, Eye, EyeOff, LogIn } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [tab, setTab]           = useState<"login" | "signup">("login")
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [nume, setNume]         = useState("")
  const [prenume, setPrenume]   = useState("")
  const [telefon, setTelefon]   = useState("")
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState("")

  const supabase = createClient()
  const router   = useRouter()
  const locale   = useLocale()
  const t        = useTranslations("auth")

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (tab === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { given_name: nume, family_name: prenume, phone: telefon },
          emailRedirectTo: `${location.origin}/${locale}/auth/callback`,
        },
      })
      if (error) setError(error.message)
      else setSuccess(t("verifica_email"))
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(t("eroare_login"))
      else router.push(`/${locale}/cont`)
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/${locale}/auth/callback` },
    })
  }

  const handleFacebook = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: `${location.origin}/${locale}/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen bg-[#06141B] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center justify-center mb-8">
          <span className="font-mono text-2xl font-bold tracking-tight">
            <span className="text-[#CCD0CF]">Inteligent </span>
            <span className="text-[#FF4B04]">Service</span>
          </span>
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-[#253745] bg-[#11212D] p-8 shadow-2xl">

          {/* Titlu */}
          <h1 className="text-2xl font-bold text-[#CCD0CF] mb-1">
            {tab === "login" ? t("titlu_login") : t("titlu_signup")}
          </h1>
          <p className="text-sm text-[#4A5C6A] mb-6">
            {tab === "login" ? t("subtitlu_login") : t("subtitlu_signup")}
          </p>

          {/* Tabs */}
          <div className="flex rounded-xl border border-[#253745] p-1 mb-6">
            {(["login", "signup"] as const).map((tabKey) => (
              <button
                key={tabKey}
                onClick={() => { setTab(tabKey); setError(""); setSuccess("") }}
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

          {/* Social buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={handleGoogle}
              className="flex items-center justify-center gap-3 w-full rounded-xl border border-[#253745] bg-[#06141B]/60 py-3 text-sm text-[#9BABAB] hover:border-[#4A5C6A] hover:text-[#CCD0CF] transition-all duration-200"
            >
              <Chrome className="h-4 w-4" />
              {t("google")}
            </button>
            <button
              onClick={handleFacebook}
              className="flex items-center justify-center gap-3 w-full rounded-xl border border-[#253745] bg-[#06141B]/60 py-3 text-sm text-[#9BABAB] hover:border-[#4A5C6A] hover:text-[#CCD0CF] transition-all duration-200"
            >
              <Facebook className="h-4 w-4" />
              {t("facebook")}
            </button>
          </div>

          {/* Separator */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#253745]" />
            <span className="text-xs text-[#4A5C6A]">{t("sau")}</span>
            <div className="flex-1 h-px bg-[#253745]" />
          </div>

          {/* Form */}
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

            {/* Email */}
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

            {/* Parolă */}
            <div>
              <label className="text-xs uppercase tracking-wider text-[#4A5C6A] mb-1 block">
                {t("parola")}
              </label>
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

          {/* Link înapoi */}
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