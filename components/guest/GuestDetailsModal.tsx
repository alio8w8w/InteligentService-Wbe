// components/guest/GuestDetailsModal.tsx
import { useState } from "react"

interface GuestDetailsProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (details: GuestForm) => void
}

export interface GuestForm {
  firstName: string
  lastName: string
  phone: string
  email: string
  consent: boolean
}

export default function GuestDetailsModal({ isOpen, onClose, onSubmit }: GuestDetailsProps) {
  const [form, setForm] = useState<GuestForm>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    consent: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.firstName) e.firstName = "Prenumele este obligatoriu"
    if (!form.lastName) e.lastName = "Numele este obligatoriu"
    if (!form.phone) e.phone = "Telefonul este obligatoriu"
    if (!form.email) e.email = "Emailul este obligatoriu"
    if (!form.consent) e.consent = "Trebuie să bifați acordul"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    localStorage.setItem("guest_details", JSON.stringify(form))
    onSubmit(form)
  }

  if (!isOpen) return null
  return (
    <div className="modal-overlay">
      <div className="modal">
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <input name="firstName" placeholder="Prenume" value={form.firstName} onChange={handleChange} />
          {errors.firstName && <span>{errors.firstName}</span>}
          <input name="lastName" placeholder="Nume de familie" value={form.lastName} onChange={handleChange} />
          {errors.lastName && <span>{errors.lastName}</span>}
          <input name="phone" placeholder="Telefon" value={form.phone} onChange={handleChange} />
          {errors.phone && <span>{errors.phone}</span>}
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
          {errors.email && <span>{errors.email}</span>}
          <label>
            <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} />
            Accept termenii și condițiile
          </label>
          {errors.consent && <span>{errors.consent}</span>}
          <button type="submit" className="btn">Continuă</button>
          <button type="button" onClick={onClose}>Renunță</button>
        </form>
      </div>
    </div>
  )
}