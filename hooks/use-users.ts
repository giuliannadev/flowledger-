"use client"

import { useState, useEffect } from "react"

export interface User {
  id: string
  name: string
  email: string
  role: "owner" | "accountant" | "employee"
  status: "active" | "inactive" | "pending"
  lastActive: string
  createdAt: string
  loginCount?: number
}

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "owner@company.com",
    role: "owner",
    status: "active",
    lastActive: "2 hours ago",
    createdAt: "2024-01-01",
    loginCount: 45,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "accountant@company.com",
    role: "accountant",
    status: "active",
    lastActive: "1 day ago",
    createdAt: "2024-01-05",
    loginCount: 23,
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike@company.com",
    role: "employee",
    status: "active",
    lastActive: "3 days ago",
    createdAt: "2024-01-10",
    loginCount: 12,
  },
  {
    id: "4",
    name: "Lisa Brown",
    email: "lisa@company.com",
    role: "employee",
    status: "pending",
    lastActive: "Never",
    createdAt: "2024-01-15",
    loginCount: 0,
  },
]

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading from storage
    const stored = localStorage.getItem("accounting_users")
    if (stored) {
      setUsers(JSON.parse(stored))
    } else {
      setUsers(mockUsers)
      localStorage.setItem("accounting_users", JSON.stringify(mockUsers))
    }
    setLoading(false)
  }, [])

  const addUser = (userData: Omit<User, "id" | "createdAt" | "lastActive" | "loginCount">) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toLocaleDateString(),
      lastActive: "Never",
      loginCount: 0,
    }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    localStorage.setItem("accounting_users", JSON.stringify(updatedUsers))
  }

  const updateUserStatus = (id: string, status: User["status"]) => {
    const updatedUsers = users.map((user) => (user.id === id ? { ...user, status } : user))
    setUsers(updatedUsers)
    localStorage.setItem("accounting_users", JSON.stringify(updatedUsers))
  }

  const updateUser = (id: string, updates: Partial<User>) => {
    const updatedUsers = users.map((user) => (user.id === id ? { ...user, ...updates } : user))
    setUsers(updatedUsers)
    localStorage.setItem("accounting_users", JSON.stringify(updatedUsers))
  }

  const deleteUser = (id: string) => {
    const updatedUsers = users.filter((user) => user.id !== id)
    setUsers(updatedUsers)
    localStorage.setItem("accounting_users", JSON.stringify(updatedUsers))
  }

  return {
    users,
    loading,
    addUser,
    updateUserStatus,
    updateUser,
    deleteUser,
  }
}
