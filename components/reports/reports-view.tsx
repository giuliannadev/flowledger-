"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReportPDFExport } from "@/components/pdf/report-pdf-export"
import { ProfitLossReport } from "./profit-loss-report"
import { ExpenseBreakdown } from "./expense-breakdown"
import { RevenueChart } from "./revenue-chart"
import { CashFlowChart } from "./cash-flow-chart"
import { useReports } from "@/hooks/use-reports"

type ReportType = "overview" | "profit-loss" | "expenses" | "revenue" | "cash-flow"

export function ReportsView() {
  const [activeReport, setActiveReport] = useState<ReportType>("overview")
  const [dateRange, setDateRange] = useState("last-30-days")
  const { reportData, loading } = useReports(dateRange)

  const reportTypes = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "profit-loss", label: "Profit & Loss", icon: "📈" },
    { id: "expenses", label: "Expense Breakdown", icon: "💰" },
    { id: "revenue", label: "Revenue Trends", icon: "📉" },
    { id: "cash-flow", label: "Cash Flow", icon: "💸" },
  ]

  const renderActiveReport = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    switch (activeReport) {
      case "profit-loss":
        return <ProfitLossReport data={reportData} />
      case "expenses":
        return <ExpenseBreakdown data={reportData} />
      case "revenue":
        return <RevenueChart data={reportData} />
      case "cash-flow":
        return <CashFlowChart data={reportData} />
      default:
        return <ReportsOverview data={reportData} />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-600 mt-1">Analyze your business performance</p>
        </div>
        <div className="flex space-x-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-90-days">Last 90 Days</SelectItem>
              <SelectItem value="last-12-months">Last 12 Months</SelectItem>
              <SelectItem value="year-to-date">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <ReportPDFExport filename={`${activeReport}-report-${dateRange}.pdf`} />
        </div>
      </div>

      {/* Report Navigation */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {reportTypes.map((report) => (
              <Button
                key={report.id}
                variant={activeReport === report.id ? "default" : "ghost"}
                onClick={() => setActiveReport(report.id as ReportType)}
                className={
                  activeReport === report.id
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }
              >
                <span className="mr-2">{report.icon}</span>
                {report.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      {renderActiveReport()}
    </div>
  )
}

function ReportsOverview({ data }: { data: any }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700">Total Revenue</CardTitle>
            <div className="text-2xl font-bold text-green-900">{formatCurrency(data.totalRevenue)}</div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              <span className={`font-medium ${data.revenueChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatPercentage(data.revenueChange)}
              </span>
              <span className="text-green-700 ml-2">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-700">Total Expenses</CardTitle>
            <div className="text-2xl font-bold text-red-900">{formatCurrency(data.totalExpenses)}</div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              <span className={`font-medium ${data.expenseChange <= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatPercentage(data.expenseChange)}
              </span>
              <span className="text-red-700 ml-2">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700">Net Profit</CardTitle>
            <div className="text-2xl font-bold text-blue-900">{formatCurrency(data.netProfit)}</div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              <span className={`font-medium ${data.profitChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatPercentage(data.profitChange)}
              </span>
              <span className="text-blue-700 ml-2">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-700">Profit Margin</CardTitle>
            <div className="text-2xl font-bold text-purple-900">{data.profitMargin.toFixed(1)}%</div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              <span className={`font-medium ${data.marginChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatPercentage(data.marginChange)}
              </span>
              <span className="text-purple-700 ml-2">vs previous period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={data} />
        <ExpenseBreakdown data={data} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <CashFlowChart data={data} />
      </div>
    </div>
  )
}
