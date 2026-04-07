"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { loginAdminAction } from "@/app/actions/auth"

export default function AdminLogin() {
  const [login, setLogin] = useState("")
  const [pass, setPass] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"login" | "forgot">("login")

  // --- LOGICA DE SECURITATE: BLOCARE ---
  const [isBlocked, setIsBlocked] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  // Verificăm starea blocării la încărcarea paginii
  useEffect(() => {
    const checkBlockStatus = () => {
      const blockUntil = localStorage.getItem("admin_block_until")
      if (blockUntil) {
        const now = Date.now()
        const targetTime = parseInt(blockUntil)

        if (now < targetTime) {
          setIsBlocked(true)
          setTimeLeft(Math.ceil((targetTime - now) / 1000 / 60))
        } else {
          // Timpul a expirat, curățăm datele
          localStorage.removeItem("admin_block_until")
          localStorage.removeItem("login_attempts")
          setIsBlocked(false)
        }
      }
    }

    checkBlockStatus()
    const interval = setInterval(checkBlockStatus, 30000) // Verifică la fiecare 30 secunde
    return () => clearInterval(interval)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isBlocked) return

    setError("")

    try {
      // 1. Apelăm Server Action-ul pentru autentificare
      const result = await loginAdminAction(login, pass, rememberMe)
      
      if (result && result.success) {
        // Succes: Resetăm orice contor de erori
        localStorage.removeItem("login_attempts")
        localStorage.removeItem("admin_block_until")
        
        const locale = window.location.pathname.split("/")[1] || "ro"
        const targetUrl = `/${locale}/vbadmin224334beauty@12/admin`
        
        window.location.replace(targetUrl)
      } else {
        // Eșec: Incrementăm numărul de încercări
        const currentAttempts = parseInt(localStorage.getItem("login_attempts") || "0") + 1
        localStorage.setItem("login_attempts", currentAttempts.toString())

        if (currentAttempts >= 3) {
          // Blocăm accesul pentru 1 oră (60 minute * 60 secunde * 1000 ms)
          const oneHour = 60 * 60 * 1000
          const blockTime = Date.now() + oneHour
          localStorage.setItem("admin_block_until", blockTime.toString())
          
          setIsBlocked(true)
          setTimeLeft(60)
          setError("Acces blocat pentru 1 oră din cauza tentativelor eșuate.")
        } else {
          setError(`Acces refuzat. Încercări rămase: ${3 - currentAttempts}`)
        }
      }
    } catch (err) {
      console.error("Login fetch error:", err)
      setError("A apărut o eroare de conexiune. Reîncercați.")
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/background-admin.jpg" 
          alt="Background" 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Logo */}
      <div className="absolute top-8 left-8 z-10">
        <Image src="/images/logo.png" alt="Logo" width={120} height={50} className="object-contain" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-8 text-[#EED5B9]">
            Panoul de Administrare
          </h1>

          {step === "login" ? (
            <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
              <input
                type="text"
                placeholder="Login admin"
                className={`w-full bg-white/90 border-none rounded-lg px-4 py-3 text-[#706760] outline-none focus:ring-2 focus:ring-[#BFC08E] transition-all ${isBlocked ? 'opacity-50 pointer-events-none' : ''}`}
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                disabled={isBlocked}
                required
              />
              <input
                type="password"
                placeholder="Parolă"
                className={`w-full bg-white/90 border-none rounded-lg px-4 py-3 text-[#706760] outline-none focus:ring-2 focus:ring-[#EAA093] transition-all ${isBlocked ? 'opacity-50 pointer-events-none' : ''}`}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                disabled={isBlocked}
                required
              />

              {error && (
                <p className={`text-white font-bold text-sm p-2 rounded text-center ${isBlocked ? 'bg-red-600' : 'bg-red-500/60'}`}>
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between text-[#EED5B9]">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-[#BFC08E] cursor-pointer"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isBlocked}
                  />
                  <span className="text-sm group-hover:text-white transition-colors">Ține-mă minte</span>
                </label>
                <button 
                  type="button" 
                  onClick={() => setStep("forgot")} 
                  className="text-xs hover:text-white underline decoration-[#EAA093]"
                >
                  Am uitat parola
                </button>
              </div>

              <button
                type="submit"
                disabled={isBlocked}
                className={`w-full font-bold py-3 rounded-lg transition-all shadow-lg shadow-black/20 ${
                  isBlocked 
                  ? "bg-gray-600 cursor-not-allowed text-gray-400" 
                  : "bg-[#706760] hover:bg-[#BFC08E] text-[#EED5B9] active:scale-95"
                }`}
              >
                {isBlocked ? `BLOCAT (${timeLeft} min)` : "AUTENTIFICARE"}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4 text-[#EED5B9]">
              <p className="text-sm">Pentru recuperarea accesului, contactați echipa tehnică.</p>
              <button 
                onClick={() => setStep("login")} 
                className="block w-full text-sm underline hover:text-white"
              >
                Înapoi la Log In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}