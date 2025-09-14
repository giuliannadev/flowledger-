"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"

export interface User {
  id: string
  email: string
  name: string
  role: "owner" | "accountant" | "employee"
  company: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  clearCache: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Debug logging for user state changes
  useEffect(() => {
    console.log('Auth state changed:', { user, loading })
  }, [user, loading])

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("accounting_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Login attempt:', { email, password })
    
    // Mock authentication - in real app, this would call your API
    const mockUsers: User[] = [
      {
        id: "1",
        email: "owner@company.com",
        name: "John Smith",
        role: "owner",
        company: "Dummy Corp",
      },
      {
        id: "2",
        email: "accountant@company.com",
        name: "Sarah Johnson",
        role: "accountant",
        company: "Dummy Corp",
      },
    ]

    const foundUser = mockUsers.find((u) => u.email === email)
    if (foundUser && password === "demo123") {
      console.log('Login successful, setting user:', foundUser)
      setUser(foundUser)
      localStorage.setItem("accounting_user", JSON.stringify(foundUser))
      return true
    }
    console.log('Login failed - invalid credentials')
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("accounting_user")
  }

  // Clear cached data to force refresh with new company name
  const clearCache = () => {
    localStorage.removeItem("accounting_user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, clearCache, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
