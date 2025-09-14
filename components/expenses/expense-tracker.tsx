"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExpenseForm } from "./expense-form"
import { ExpenseDetail } from "./expense-detail"
import { useExpenses } from "@/hooks/use-expenses"

export function ExpenseTracker() {
  const [showForm, setShowForm] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")

  const { expenses, loading, categories } = useExpenses()

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.vendor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter

    let matchesDate = true
    if (dateFilter !== "all") {
      const expenseDate = new Date(expense.date)
      const now = new Date()

      switch (dateFilter) {
        case "today":
          matchesDate = expenseDate.toDateString() === now.toDateString()
          break
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = expenseDate >= weekAgo
          break
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesDate = expenseDate >= monthAgo
          break
      }
    }

    return matchesSearch && matchesCategory && matchesDate
  })

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Office: "bg-blue-100 text-blue-800",
      Travel: "bg-green-100 text-green-800",
      Meals: "bg-orange-100 text-orange-800",
      Software: "bg-purple-100 text-purple-800",
      Marketing: "bg-pink-100 text-pink-800",
      Utilities: "bg-yellow-100 text-yellow-800",
      Other: "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors["Other"]
  }

  if (selectedExpense) {
    return <ExpenseDetail expenseId={selectedExpense} onBack={() => setSelectedExpense(null)} />
  }

  if (showForm) {
    return <ExpenseForm onCancel={() => setShowForm(false)} onSave={() => setShowForm(false)} />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-1">Track and categorize your business expenses</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          Add Expense
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Total Expenses</h3>
              <p className="text-3xl font-bold text-green-600 mt-1">{formatCurrency(totalExpenses)}</p>
              <p className="text-sm text-gray-600 mt-1">{filteredExpenses.length} expenses found</p>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
              <p className="text-gray-600 mb-4">Start tracking your business expenses</p>
              <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                Add Expense
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredExpenses.map((expense) => (
            <Card key={expense.id} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6" onClick={() => setSelectedExpense(expense.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{expense.description}</h3>
                      <Badge className={getCategoryColor(expense.category)}>{expense.category}</Badge>
                      {expense.receiptUrl && (
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                          Receipt
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Vendor:</span>
                        <div className="font-medium text-gray-900">{expense.vendor}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Date:</span>
                        <div className="font-medium text-gray-900">{expense.date}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Payment Method:</span>
                        <div className="font-medium text-gray-900">{expense.paymentMethod}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 ml-4">
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-900">{formatCurrency(expense.amount)}</div>
                      {expense.taxDeductible && (
                        <div className="text-xs text-green-600 font-medium">Tax Deductible</div>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
