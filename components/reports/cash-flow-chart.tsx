"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

interface CashFlowChartProps {
  data: any
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-green-600">Revenue: {formatCurrency(payload[0].value)}</p>
          <p className="text-red-600">Expenses: {formatCurrency(Math.abs(payload[1].value))}</p>
          <p className="text-blue-600 font-semibold">Net: {formatCurrency(payload[0].value + payload[1].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Cash Flow Analysis</CardTitle>
        <p className="text-gray-600 text-sm">Monthly revenue vs expenses</p>
      </CardHeader>
      <CardContent>
        {data.cashFlowChart && data.cashFlowChart.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.cashFlowChart} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={formatCurrency} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="2 2" />
                <Bar dataKey="revenue" fill="#10B981" name="Revenue" radius={[2, 2, 0, 0]} />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No cash flow data available for the selected period</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
