"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { DashboardOverview } from "./dashboard-overview"
import { InvoiceManager } from "../invoices/invoice-manager"
import { ExpenseTracker } from "../expenses/expense-tracker"
import { ReportsView } from "../reports/reports-view"
import { UserManagement } from "../users/user-management"
import { useAuth } from "@/hooks/use-auth.tsx"

type ActiveView = "dashboard" | "invoices" | "expenses" | "reports" | "users"

export function Dashboard() {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard")
  const { user } = useAuth()

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardOverview onNavigate={setActiveView} />
      case "invoices":
        return <InvoiceManager />
      case "expenses":
        return <ExpenseTracker />
      case "reports":
        return <ReportsView />
      case "users":
        return <UserManagement />
      default:
        return <DashboardOverview onNavigate={setActiveView} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={setActiveView} userRole={user?.role || "employee"} />
      <main className="flex-1 overflow-auto">{renderActiveView()}</main>
    </div>
  )
}
