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
          localStorage.removeItem("admin_block_until")
          localStorage.removeItem("login_attempts")
          setIsBlocked(false)
        }
      }
    }

    checkBlockStatus()
    const interval = setInterval(checkBlockStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isBlocked) return

    setError("")

    try {
      const result = await loginAdminAction(login, pass, rememberMe)
      
      if (result && result.success) {
        localStorage.removeItem("login_attempts")
        localStorage.removeItem("admin_block_until")
        
        const locale = window.location.pathname.split("/")[1] || "ro"
        const targetUrl = `/${locale}/admin`
        
        window.location.replace(targetUrl)
      } else {
        if (result?.error === "CONFIG_MISSING") {
          setError("Configurație server invalidă. Repornește aplicația și verifică variabilele ADMIN_USERNAME / ADMIN_PASSWORD.")
          return
        }

        const currentAttempts = parseInt(localStorage.getItem("login_attempts") || "0") + 1
        localStorage.setItem("login_attempts", currentAttempts.toString())

        if (currentAttempts >= 3) {
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
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Poți păstra imaginea ta de fundal, eu i-am adăugat un overlay bazat pe culorile noi */}
        <Image 
          src="/images/background-admin.jpg" 
          alt="Background" 
          fill 
          className="object-cover"
          priority
        />
        {/* Overlay Dark Moss Green semi-transparent */}
        <div className="absolute inset-0 bg-[#283618]/70 backdrop-blur-sm" />
      </div>

      {/* Logo */}
      <div className="absolute top-8 left-8 z-10">
        <Image src="/images/logo-lizard.png" alt="Logo Lizard" width={120} height={50} className="object-contain" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Card Panel */}
        <div className="bg-[#FEFAE0]/95 backdrop-blur-xl border-t-4 border-[#BC6C25] rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-extrabold text-center mb-8 text-[#283618]">
            Panou Administrare
          </h1>

          {step === "login" ? (
            <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
              {/* Câmp Login */}
              <div>
                 <label className="text-xs font-bold text-[#606C38] uppercase tracking-wider mb-1 block">Utilizator</label>
                 <input
                   type="text"
                   className={`w-full bg-white border border-[#DDA15E]/40 rounded-xl px-4 py-3.5 text-[#283618] font-medium outline-none focus:ring-2 focus:ring-[#BC6C25] focus:border-transparent transition-all ${isBlocked ? 'opacity-50 pointer-events-none' : ''}`}
                   value={login}
                   onChange={(e) => setLogin(e.target.value)}
                   disabled={isBlocked}
                   required
                 />
              </div>

              {/* Câmp Parolă */}
              <div>
                 <label className="text-xs font-bold text-[#606C38] uppercase tracking-wider mb-1 block">Parolă secretă</label>
                 <input
                   type="password"
                   className={`w-full bg-white border border-[#DDA15E]/40 rounded-xl px-4 py-3.5 text-[#283618] font-medium outline-none focus:ring-2 focus:ring-[#BC6C25] focus:border-transparent transition-all ${isBlocked ? 'opacity-50 pointer-events-none' : ''}`}
                   value={pass}
                   onChange={(e) => setPass(e.target.value)}
                   disabled={isBlocked}
                   required
                 />
              </div>

              {/* Mesaj Eroare */}
              {error && (
                <div className={`p-3 rounded-xl border ${isBlocked ? 'bg-red-50 border-red-200 text-red-700' : 'bg-[#DDA15E]/20 border-[#BC6C25]/30 text-[#BC6C25]'} text-sm font-bold text-center`}>
                  {error}
                </div>
              )}

              {/* Opțiuni Extra */}
              <div className="flex items-center justify-between text-[#606C38]">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-[#BC6C25] focus:ring-[#BC6C25] cursor-pointer"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isBlocked}
                  />
                  <span className="text-sm font-medium group-hover:text-[#283618] transition-colors">Ține-mă minte</span>
                </label>
                <button 
                  type="button" 
                  onClick={() => setStep("forgot")} 
                  className="text-xs font-bold hover:text-[#BC6C25] transition-colors"
                >
                  Am uitat parola
                </button>
              </div>

              {/* Buton Submit */}
              <button
                type="submit"
                disabled={isBlocked}
                className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg ${
                  isBlocked 
                  ? "bg-[#606C38]/50 cursor-not-allowed text-[#FEFAE0]/70" 
                  : "bg-[#BC6C25] hover:bg-[#DDA15E] text-[#FEFAE0] hover:-translate-y-0.5 active:scale-95 shadow-[#BC6C25]/30"
                }`}
              >
                {isBlocked ? `BLOCAT (${timeLeft} min)` : "ACCES SECURIZAT"}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4 text-[#283618]">
              <div className="p-4 bg-[#DDA15E]/10 rounded-xl border border-[#DDA15E]/30">
                <p className="text-sm font-medium">Pentru recuperarea accesului privilegiat, vă rugăm să verificați protocoalele de securitate interne sau să contactați dezvoltatorul.</p>
              </div>
              <button 
                onClick={() => setStep("login")} 
                className="block w-full text-sm font-bold text-[#BC6C25] hover:text-[#283618] transition-colors"
              >
                ← Înapoi la Autentificare
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}