"use client"

import { useMemo, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Mail, Phone, User, Lock, Eye, EyeOff, LogIn, ArrowLeft, AlertTriangle } from "lucide-react"
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
  
  // Stare pentru blocarea contului
  const [lockoutTime, setLockoutTime] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState<string>("")

  const supabase = createClient()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("auth")
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const returnTo = useMemo(() => {
    const v = searchParams.get("returnTo")
    if (!v || !v.startsWith("/")) return `/${locale}/cont/completeaza-profil`
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

  // Verificare blocare la încărcarea componentei
  useEffect(() => {
    const checkLockout = () => {
      const storedLock = localStorage.getItem('auth_lockout')
      if (storedLock) {
        const lockUntil = parseInt(storedLock)
        if (lockUntil > Date.now()) {
          setLockoutTime(lockUntil)
          const minutes = Math.ceil((lockUntil - Date.now()) / 60000)
          setTimeLeft(`${minutes} min`)
        } else {
          localStorage.removeItem('auth_lockout')
          localStorage.removeItem('auth_attempts')
          setLockoutTime(null)
        }
      }
    }
    checkLockout()
    const interval = setInterval(checkLockout, 60000) // Actualizează la fiecare minut
    return () => clearInterval(interval)
  }, [])

  // Funcție pentru gestionarea încercărilor eșuate
  const handleFailedAttempt = () => {
    let attempts = parseInt(localStorage.getItem('auth_attempts') || '0') + 1
    if (attempts >= 3) {
      const lockUntil = Date.now() + 60 * 60 * 1000 // 60 minute din acest moment
      localStorage.setItem('auth_lockout', lockUntil.toString())
      setLockoutTime(lockUntil)
      setTimeLeft('60 min')
      setError(t("cont_blocat_60"))
    } else {
      localStorage.setItem('auth_attempts', attempts.toString())
      setError(t("parola_incorecta_incercari").replace('{n}', (3 - attempts).toString()))
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (lockoutTime) return // Previne trimiterea dacă e blocat

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

        // VERIFICARE DUPLICATE ÎN TABELUL PROFILES ÎNAINTE DE SIGNUP
        const { data: existingUser } = await supabase
          .from("profiles")
          .select("id, email, telefon")
          .or(`email.eq.${cleanEmail},telefon.eq.${phone.e164}`)
          .maybeSingle()

        if (existingUser) {
          if (existingUser.email === cleanEmail) {
            setError(t("email_exista"))
            return
          }
          if (existingUser.telefon === phone.e164) {
            setError(t("telefon_exista"))
            return
          }
        }

        // Creare cont în sistemul de Autentificare
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

        if (!data.session) {
          setSuccess(t("verifica_email"))
          return
        }

        // SOLUȚIE: Folosim UPSERT pentru a ne asigura că rândul se creează în tabelul profiles
        if (data.user?.id) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            email: cleanEmail,
            nume: nume.trim(),
            prenume: prenume.trim(),
            telefon: phone.e164,
          }, { onConflict: 'id' })
        }

        // Succes! Resetăm încercările
        localStorage.removeItem('auth_attempts')
        router.push(returnTo)
        return
      }

      // LOGICA DE LOGIN
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })

      if (error) {
        if (error.message === "Invalid login credentials") {
          handleFailedAttempt()
        } else {
          setError(error.message)
        }
        return
      }

      // Succes! Resetăm încercările
      localStorage.removeItem('auth_attempts')
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

  // ECRANUL DE RECUPERARE PAROLĂ
  if (view === "forgot") {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-16 bg-[#F5F2EC]">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-[#7A8CA5]/20 bg-white p-8 shadow-[0_20px_50px_-15px_rgba(15,42,74,0.1)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-extrabold text-[#0F2A4A] tracking-tight">{t("recuperare_titlu")}</h1>
                <p className="text-sm text-[#7A8CA5] mt-1 font-medium">{t("recuperare_subtitlu_link")}</p>
              </div>
              <button onClick={toggleLang} className="border border-[#7A8CA5]/30 bg-[#F5F2EC]/50 text-[#0F2A4A] px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider hover:border-[#F26A1B] hover:text-[#F26A1B] transition-all">
                {langLabel}
              </button>
            </div>

            <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-[#7A8CA5] font-bold mb-1.5 block">{t("email")}</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A8CA5]" />
                  <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="w-full rounded-xl border border-[#7A8CA5]/30 bg-[#F5F2EC]/50 pl-10 pr-4 py-3 text-sm text-[#0F2A4A] font-medium outline-none focus:border-[#F26A1B] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 font-medium">{error}</p>}
              {success && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 font-medium">{success}</p>}

              <button type="submit" disabled={loading}
                className="w-full bg-[#F26A1B] text-white rounded-xl py-3.5 text-sm font-bold shadow-lg hover:bg-[#C24C0F] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? t("incarcare") : t("trimite_link")}
              </button>

              <button type="button" onClick={() => { setView("auth"); setError(""); setSuccess("") }}
                className="flex items-center justify-center gap-2 text-sm font-bold text-[#7A8CA5] hover:text-[#0F2A4A] transition-colors mt-2"
              >
                <ArrowLeft className="h-4 w-4 stroke-[2.5px]" /> {t("inapoi_login")}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // ECRANUL PRINCIPAL AUTH (LOGIN / SIGNUP)
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-16 bg-[#F5F2EC]">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-[#7A8CA5]/20 bg-white p-8 shadow-[0_20px_50px_-15px_rgba(15,42,74,0.1)]">
          
          {/* Header Card */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-extrabold text-[#0F2A4A] tracking-tight">
                {tab === "login" ? t("titlu_login") : t("titlu_signup_signin")}
              </h1>
              <p className="text-sm text-[#7A8CA5] font-medium mt-1.5">
                {tab === "login" ? t("subtitlu_login") : t("subtitlu_signup")}
              </p>
            </div>
            <button onClick={toggleLang} className="border border-[#7A8CA5]/30 bg-[#F5F2EC]/50 text-[#0F2A4A] px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider hover:border-[#F26A1B] hover:text-[#F26A1B] transition-all">
              {langLabel}
            </button>
          </div>

          {/* Dacă contul este blocat, ascundem formularul și arătăm avertismentul */}
          {lockoutTime ? (
             <div className="flex flex-col items-center justify-center py-8 text-center bg-red-50 rounded-2xl border border-red-100">
               <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
               <h3 className="text-lg font-bold text-red-800 mb-2">{t("cont_blocat_titlu")}</h3>
               <p className="text-sm text-red-600 px-4 font-medium">
                 {t("cont_blocat_descriere").replace('{timp}', timeLeft)}
               </p>
             </div>
          ) : (
            <>
              {/* Selector Taburi */}
              <div className="flex rounded-xl bg-[#F5F2EC]/80 p-1 mb-8 border border-[#7A8CA5]/10">
                <button onClick={() => { setTab("login"); setError(""); setSuccess("") }}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 shadow-sm ${
                    tab === "login" ? "bg-[#0F2A4A] text-white" : "text-[#7A8CA5] hover:text-[#0F2A4A]"
                  }`}
                >
                  {t("tab_login")}
                </button>
                <button onClick={() => { setTab("signup"); setError(""); setSuccess("") }}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 shadow-sm ${
                    tab === "signup" ? "bg-[#0F2A4A] text-white" : "text-[#7A8CA5] hover:text-[#0F2A4A]"
                  }`}
                >
                  {t("tab_signin")}
                </button>
              </div>

              {/* Formular */}
              <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
                {tab === "signup" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs uppercase tracking-wider text-[#7A8CA5] font-bold mb-1.5 block">{t("nume")}</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A8CA5]" />
                          <input type="text" autoComplete="family-name" value={nume} onChange={(e) => setNume(e.target.value)} required
                            className="w-full rounded-xl border border-[#7A8CA5]/30 bg-[#F5F2EC]/50 pl-10 pr-3 py-3 text-sm text-[#0F2A4A] font-medium outline-none focus:border-[#F26A1B] focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-wider text-[#7A8CA5] font-bold mb-1.5 block">{t("prenume")}</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A8CA5]" />
                          <input type="text" autoComplete="given-name" value={prenume} onChange={(e) => setPrenume(e.target.value)} required
                            className="w-full rounded-xl border border-[#7A8CA5]/30 bg-[#F5F2EC]/50 pl-10 pr-3 py-3 text-sm text-[#0F2A4A] font-medium outline-none focus:border-[#F26A1B] focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#7A8CA5] font-bold mb-1.5 block">{t("telefon")}</label>
                      <div className="flex gap-2">
                        <div className="w-20 flex items-center justify-center rounded-xl border border-[#7A8CA5]/30 bg-[#F5F2EC]/80 text-[#0F2A4A] text-sm font-bold shadow-sm">
                          +373
                        </div>
                        <div className="relative flex-1">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A8CA5]" />
                          <input inputMode="numeric" value={telefonLocal} onChange={(e) => {
                              const digits = e.target.value.replace(/\D/g, "")
                              setTelefonLocal(digits.slice(0, 9))
                            }} required placeholder="68 123 456"
                            className="w-full rounded-xl border border-[#7A8CA5]/30 bg-[#F5F2EC]/50 pl-10 pr-3 py-3 text-sm text-[#0F2A4A] font-medium outline-none focus:border-[#F26A1B] focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#7A8CA5] font-bold mb-1.5 block">{t("email")}</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A8CA5]" />
                    <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                      className="w-full rounded-xl border border-[#7A8CA5]/30 bg-[#F5F2EC]/50 pl-10 pr-3 py-3 text-sm text-[#0F2A4A] font-medium outline-none focus:border-[#F26A1B] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs uppercase tracking-wider text-[#7A8CA5] font-bold">{t("parola")}</label>
                    {tab === "login" && (
                      <button type="button" onClick={() => { setView("forgot"); setError(""); setSuccess("") }}
                        className="text-xs font-bold text-[#7A8CA5] hover:text-[#F26A1B] transition-colors"
                      >
                        {t("ai_uitat_parola")}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A8CA5]" />
                    <input type={showPass ? "text" : "password"} autoComplete={tab === "login" ? "current-password" : "new-password"} minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required
                      className="w-full rounded-xl border border-[#7A8CA5]/30 bg-[#F5F2EC]/50 pl-10 pr-10 py-3 text-sm text-[#0F2A4A] font-medium outline-none focus:border-[#F26A1B] focus:bg-white transition-all"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A8CA5] hover:text-[#0F2A4A]">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 font-medium mt-2">{error}</p>}
                {success && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 font-medium mt-2">{success}</p>}

                <button type="submit" disabled={loading}
                  className="w-full bg-[#F26A1B] text-white rounded-xl py-3.5 text-sm font-bold shadow-lg hover:bg-[#C24C0F] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 mt-4 flex items-center justify-center gap-2"
                >
                  <LogIn className="h-4 w-4 stroke-[2.5px]" />
                  {loading ? t("incarcare") : tab === "login" ? t("btn_login") : t("btn_signin")}
                </button>
              </form>
            </>
          )}

          <p className="mt-6 text-center text-sm">
            <Link href={`/${locale}`} className="text-[#7A8CA5] hover:text-[#0F2A4A] font-bold transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="h-4 w-4 stroke-[2.5px]" /> {t("inapoi")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}