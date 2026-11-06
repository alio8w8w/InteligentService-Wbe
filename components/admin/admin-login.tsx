"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { loginAdminAction } from "@/app/actions/auth"

export default function AdminLogin() {
  const [formData, setFormData] = useState({ login: "", pass: "", rememberMe: false })
  const [error, setError] = useState("")
  const [step, setStep] = useState<"login" | "forgot">("login")
  const [isBlocked, setIsBlocked] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  const checkBlockStatus = useCallback(() => {
    const blockUntil = localStorage.getItem("admin_block_until")
    if (blockUntil) {
      const now = Date.now()
      const targetTime = parseInt(blockUntil)

      if (now < targetTime) {
        setIsBlocked(true)
        setTimeLeft(Math.ceil((targetTime - now) / 1000 / 60))
      } else {
        setIsBlocked(false)
        localStorage.removeItem("admin_block_until")
        localStorage.removeItem("login_attempts")
      }
    }
  }, [])

  useEffect(() => {
    checkBlockStatus()
    const interval = setInterval(checkBlockStatus, 30000)
    return () => clearInterval(interval)
  }, [checkBlockStatus])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isBlocked) return
    setError("")

    try {
      const result = await loginAdminAction(formData.login, formData.pass, formData.rememberMe)
      
      if (result?.success) {
        localStorage.removeItem("login_attempts")
        localStorage.removeItem("admin_block_until")
        // Redirecționare sigură
        const locale = window.location.pathname.split("/")[1] || "ro"
        window.location.replace(`/${locale}/admin`)
      } else {
        // Logica de blocare (doar orientativă, serverul trebuie să valideze și el!)
        const attempts = parseInt(localStorage.getItem("login_attempts") || "0") + 1
        localStorage.setItem("login_attempts", attempts.toString())

        if (attempts >= 3) {
          localStorage.setItem("admin_block_until", (Date.now() + 3600000).toString())
          setIsBlocked(true)
          setError("Acces blocat pentru 1 oră. Prea multe încercări.")
        } else {
          setError(`Date incorecte. Încercări rămase: ${3 - attempts}`)
        }
      }
    } catch {
      setError("A apărut o eroare de conexiune.")
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <Image src="/images/background-admin.jpg" alt="Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-[#283618]/70 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-[#FEFAE0]/95 border-t-4 border-[#BC6C25] rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-extrabold text-center mb-8 text-[#283618]">Panou Administrare</h1>

          {step === "login" ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-[#606C38] uppercase block mb-1">Utilizator</label>
                <input
                  type="text"
                  required
                  disabled={isBlocked}
                  className="w-full bg-white border border-[#DDA15E]/40 rounded-xl px-4 py-3 text-[#283618] outline-none focus:ring-2 focus:ring-[#BC6C25]"
                  value={formData.login}
                  onChange={(e) => setFormData({...formData, login: e.target.value})}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#606C38] uppercase block mb-1">Parolă</label>
                <input
                  type="password"
                  required
                  disabled={isBlocked}
                  className="w-full bg-white border border-[#DDA15E]/40 rounded-xl px-4 py-3 text-[#283618] outline-none focus:ring-2 focus:ring-[#BC6C25]"
                  value={formData.pass}
                  onChange={(e) => setFormData({...formData, pass: e.target.value})}
                />
              </div>

              {error && <div className="p-3 bg-red-50 text-red-700 text-sm font-bold text-center rounded-xl">{error}</div>}

              <button
                type="submit"
                disabled={isBlocked}
                className="w-full font-bold py-4 rounded-xl bg-[#BC6C25] text-[#FEFAE0] hover:bg-[#DDA15E] transition-all disabled:opacity-50"
              >
                {isBlocked ? `BLOCAT (${timeLeft} min)` : "ACCES SECURIZAT"}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-[#283618]">Contactați dezvoltatorul pentru recuperare.</p>
              <button onClick={() => setStep("login")} className="text-sm font-bold text-[#BC6C25]">← Înapoi</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}