"use client"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-[#1a1613] border border-[#c9a96e]/20 p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#f5f0eb]/50 hover:text-[#f5f0eb]"
        >
          ✕
        </button>
        <h2 className="text-xl font-medium tracking-wider text-[#f5f0eb]">
          Programează o vizită
        </h2>
        <p className="mt-2 text-sm text-[#f5f0eb]/60">
          Te vom contacta în cel mai scurt timp.
        </p>
        {/* Formular — adaugă câmpuri aici */}
      </div>
    </div>
  )
}