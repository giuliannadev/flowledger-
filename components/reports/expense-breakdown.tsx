"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface ExpenseBreakdownProps {
  data: any
}

export function ExpenseBreakdown({ data }: ExpenseBreakdownProps) {
  const expenseData = [
    { name: "Office", value: data.officeExpenses || 0, color: "#3B82F6" },
    { name: "Marketing", value: data.marketingExpenses || 0, color: "#EF4444" },
    { name: "Software", value: data.softwareExpenses || 0, color: "#10B981" },
    { name: "Travel", value: data.travelExpenses || 0, color: "#F59E0B" },
    { name: "Utilities", value: data.utilityExpenses || 0, color: "#8B5CF6" },
    { name: "Other", value: data.otherExpenses || 0, color: "#6B7280" },
  ].filter((item) => item.value > 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-blue-600">{formatCurrency(data.value)}</p>
          <p className="text-sm text-gray-500">
            {((data.value / expenseData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Expense Breakdown</CardTitle>
        <p className="text-gray-600 text-sm">Distribution of expenses by category</p>
      </CardHeader>
      <CardContent>
        {expenseData.length > 0 ? (
          <div className="space-y-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {expenseData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{formatCurrency(item.value)}</div>
                    <div className="text-sm text-gray-500">
                      {((item.value / expenseData.reduce((sum, exp) => sum + exp.value, 0)) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No expense data available for the selected period</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
