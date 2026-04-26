// lib/utils.ts

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- Guest Session Helper ---
export function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem("guest_session_id")
  if (!sessionId) {
    sessionId = `${crypto.randomUUID()}-${Date.now()}`
    localStorage.setItem("guest_session_id", sessionId)
  }
  return sessionId
}