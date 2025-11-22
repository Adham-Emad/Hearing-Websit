"use client"

// In production, use proper authentication like NextAuth.js with secure session management

export function checkAdminAuth(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("admin_authenticated") === "true"
}

export function setAdminAuth(authenticated: boolean) {
  if (typeof window === "undefined") return
  if (authenticated) {
    localStorage.setItem("admin_authenticated", "true")
  } else {
    localStorage.removeItem("admin_authenticated")
  }
}

export function validateAdminPassword(password: string): boolean {
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"

  if (!adminPassword) {
    console.warn("[v0] Admin password not configured")
    return false
  }

  return password === adminPassword
}
