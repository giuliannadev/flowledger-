"use client"

import { useState, useEffect } from "react"
import { useInvoices } from "./use-invoices"
import { useExpenses } from "./use-expenses"

export function useReports(dateRange: string) {
  const [reportData, setReportData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const { invoices } = useInvoices()
  const { expenses } = useExpenses()

  useEffect(() => {
    const generateReportData = () => {
      setLoading(true)

      // Calculate date range
      const now = new Date()
      let startDate = new Date()

      switch (dateRange) {
        case "last-7-days":
          startDate.setDate(now.getDate() - 7)
          break
        case "last-30-days":
          startDate.setDate(now.getDate() - 30)
          break
        case "last-90-days":
          startDate.setDate(now.getDate() - 90)
          break
        case "last-12-months":
          startDate.setFullYear(now.getFullYear() - 1)
          break
        case "year-to-date":
          startDate = new Date(now.getFullYear(), 0, 1)
          break
        default:
          startDate.setDate(now.getDate() - 30)
      }

      // Filter data by date range - for demo purposes, include all data
      const filteredInvoices = invoices // Include all invoices for demo
      const filteredExpenses = expenses // Include all expenses for demo
      
      // Debug: Log the filtering results
      console.log('Date filtering:', {
        startDate: startDate.toISOString(),
        now: now.toISOString(),
        totalInvoices: invoices.length,
        filteredInvoices: filteredInvoices.length,
        totalExpenses: expenses.length,
        filteredExpenses: filteredExpenses.length
      })

      // Calculate totals from actual data
      const paidInvoices = filteredInvoices.filter((inv) => inv.status === "paid")
      const actualRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0)
      const actualExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)

      // Use actual data (now we have comprehensive mock data that matches dashboard)
      const totalRevenue = actualRevenue
      const totalExpenses = actualExpenses
      const netProfit = totalRevenue - totalExpenses
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

      // Debug logging to see what data we're getting
      console.log('Reports Data:', {
        paidInvoices: paidInvoices.length,
        paidInvoiceTotals: paidInvoices.map(inv => ({ id: inv.id, total: inv.total, status: inv.status })),
        actualRevenue,
        actualExpenses,
        totalRevenue,
        totalExpenses,
        netProfit,
        profitMargin,
        invoiceCount: filteredInvoices.length,
        expenseCount: filteredExpenses.length
      })

      // Calculate expense breakdown from actual data
      const expensesByCategory = filteredExpenses.reduce(
        (acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount
          return acc
        },
        {} as Record<string, number>,
      )

      // Generate realistic chart data
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
      const revenueChart = months.map((month, index) => ({
        month,
        revenue: Math.floor(Math.random() * 15000) + 15000,
      }))

      const cashFlowChart = months.map((month, index) => {
        const revenue = Math.floor(Math.random() * 15000) + 15000
        const expenses = Math.floor(Math.random() * 8000) + 5000
        return {
          month,
          revenue,
          expenses: -expenses, // Negative for chart display
        }
      })

      const data = {
        totalRevenue,
        totalExpenses,
        netProfit,
        profitMargin,
        revenueChange: 12.5, // Mock percentage change
        expenseChange: -3.2,
        profitChange: 8.2,
        marginChange: 2.1,

        // Detailed breakdown
        serviceRevenue: totalRevenue * 0.7,
        productRevenue: totalRevenue * 0.2,
        otherIncome: totalRevenue * 0.1,

        // Expenses by category
        officeExpenses: expensesByCategory["Office"] || 0,
        marketingExpenses: expensesByCategory["Marketing"] || 0,
        softwareExpenses: expensesByCategory["Software"] || 0,
        travelExpenses: expensesByCategory["Travel"] || 0,
        utilityExpenses: expensesByCategory["Utilities"] || 0,
        mealsExpenses: expensesByCategory["Meals"] || 0,
        otherExpenses: expensesByCategory["Other"] || 0,

        // Operating expenses total
        operatingExpenses: totalExpenses,

        // Chart data
        revenueChart,
        cashFlowChart,
      }

      setReportData(data)
      setLoading(false)
    }

    generateReportData()
  }, [dateRange, invoices, expenses])

  return { reportData, loading }
}
