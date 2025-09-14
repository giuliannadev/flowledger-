"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth.tsx"
import { useInvoices } from "@/hooks/use-invoices"
import { useExpenses } from "@/hooks/use-expenses"
import { useMemo } from "react"

interface DashboardOverviewProps {
  onNavigate?: (view: "dashboard" | "invoices" | "expenses" | "reports" | "users") => void
}

export function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const { user } = useAuth()
  const { invoices } = useInvoices()
  const { expenses } = useExpenses()

  const dashboardData = useMemo(() => {
    const paidInvoices = invoices.filter(inv => inv.status === "paid")
    const pendingInvoices = invoices.filter(inv => inv.status === "pending" || inv.status === "overdue")
    
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0)
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const outstandingInvoices = pendingInvoices.reduce((sum, inv) => sum + inv.total, 0)
    
    return {
      totalRevenue,
      totalExpenses,
      outstandingInvoices,
      paidInvoices: totalRevenue,
      recentInvoices: invoices.slice(0, 3).map(inv => ({
        id: inv.invoiceNumber,
        client: inv.clientName,
        amount: inv.total,
        status: inv.status,
        date: inv.invoiceDate
      })),
      recentExpenses: expenses.slice(0, 3).map(exp => ({
        id: exp.id,
        description: exp.description,
        amount: exp.amount,
        category: exp.category,
        date: exp.date
      }))
    }
  }, [invoices, expenses])

  const profitLoss = useMemo(() => {
    return dashboardData.totalRevenue - dashboardData.totalExpenses
  }, [dashboardData])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-50"
      case "pending":
        return "text-yellow-600 bg-yellow-50"
      case "overdue":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="text-gray-700 border-gray-300 bg-transparent">
            Export Report
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onNavigate?.("invoices")}>
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-3">
            <CardDescription className="text-blue-700 font-medium">Total Revenue</CardDescription>
            <CardTitle className="text-2xl font-bold text-blue-900">{formatCurrency(dashboardData.totalRevenue)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">+12.5%</span>
              <span className="text-blue-700 ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-3">
            <CardDescription className="text-green-700 font-medium">Net Profit</CardDescription>
            <CardTitle className="text-2xl font-bold text-green-900">{formatCurrency(profitLoss)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">+8.2%</span>
              <span className="text-green-700 ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="pb-3">
            <CardDescription className="text-orange-700 font-medium">Outstanding</CardDescription>
            <CardTitle className="text-2xl font-bold text-orange-900">
              {formatCurrency(dashboardData.outstandingInvoices)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              <span className="text-red-600 font-medium">+5.1%</span>
              <span className="text-orange-700 ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-3">
            <CardDescription className="text-purple-700 font-medium">Total Expenses</CardDescription>
            <CardTitle className="text-2xl font-bold text-purple-900">
              {formatCurrency(dashboardData.totalExpenses)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">-3.2%</span>
              <span className="text-purple-700 ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Recent Invoices</CardTitle>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="font-medium text-gray-900">{invoice.id}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{invoice.client}</div>
                    <div className="text-xs text-gray-500">{invoice.date}</div>
                  </div>
                  <div className="font-semibold text-gray-900">{formatCurrency(invoice.amount)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Recent Expenses</CardTitle>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{expense.description}</div>
                    <div className="text-sm text-gray-600 mt-1">{expense.category}</div>
                    <div className="text-xs text-gray-500">{expense.date}</div>
                  </div>
                  <div className="font-semibold text-gray-900">-{formatCurrency(expense.amount)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
          <CardDescription>Common tasks to help you manage your business</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 border-blue-200 hover:bg-blue-50 bg-transparent"
              onClick={() => onNavigate?.("invoices")}
            >
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-sm font-medium">Create Invoice</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 border-green-200 hover:bg-green-50 bg-transparent"
              onClick={() => onNavigate?.("expenses")}
            >
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm font-medium">Add Expense</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 border-purple-200 hover:bg-purple-50 bg-transparent"
              onClick={() => onNavigate?.("reports")}
            >
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span className="text-sm font-medium">View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
