"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProfitLossReportProps {
  data: any
}

export function ProfitLossReport({ data }: ProfitLossReportProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Calculate Cost of Goods Sold (mock data)
  const cogs = data.totalRevenue * 0.15 // 15% of revenue
  const materials = cogs * 0.4
  const labor = cogs * 0.5
  const shipping = cogs * 0.1

  const profitLossData = [
    {
      category: "Revenue",
      items: [
        { name: "Service Revenue", amount: data.serviceRevenue || 0 },
        { name: "Product Sales", amount: data.productRevenue || 0 },
        { name: "Other Income", amount: data.otherIncome || 0 },
      ],
      total: data.totalRevenue,
      isRevenue: true,
    },
    {
      category: "Cost of Goods Sold",
      items: [
        { name: "Materials", amount: materials },
        { name: "Labor", amount: labor },
        { name: "Shipping", amount: shipping },
      ],
      total: cogs,
      isRevenue: false,
    },
    {
      category: "Operating Expenses",
      items: [
        { name: "Office Expenses", amount: data.officeExpenses || 0 },
        { name: "Marketing", amount: data.marketingExpenses || 0 },
        { name: "Software & Tools", amount: data.softwareExpenses || 0 },
        { name: "Travel", amount: data.travelExpenses || 0 },
        { name: "Utilities", amount: data.utilityExpenses || 0 },
        { name: "Meals & Entertainment", amount: data.mealsExpenses || 0 },
        { name: "Other Expenses", amount: data.otherExpenses || 0 },
      ],
      total: data.operatingExpenses || 0,
      isRevenue: false,
    },
  ]

  const grossProfit = data.totalRevenue - cogs
  const netProfit = grossProfit - (data.operatingExpenses || 0)

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Profit & Loss Statement</CardTitle>
          <p className="text-gray-600">Detailed breakdown of income and expenses</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {profitLossData.map((section) => (
              <div key={section.category}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.category}</h3>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <div key={item.name} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">{item.name}</span>
                      <span className={`font-medium ${section.isRevenue ? "text-green-600" : "text-red-600"}`}>
                        {section.isRevenue ? "" : "-"}
                        {formatCurrency(Math.abs(item.amount))}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-3 border-t-2 border-gray-300 font-semibold">
                    <span>Total {section.category}</span>
                    <span className={`text-lg ${section.isRevenue ? "text-green-600" : "text-red-600"}`}>
                      {section.isRevenue ? "" : "-"}
                      {formatCurrency(Math.abs(section.total))}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Summary Calculations */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Gross Profit</span>
                <span className={grossProfit >= 0 ? "text-green-600" : "text-red-600"}>
                  {formatCurrency(grossProfit)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold border-t-2 border-gray-300 pt-4">
                <span>Net Profit</span>
                <span className={netProfit >= 0 ? "text-green-600" : "text-red-600"}>{formatCurrency(netProfit)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Profit Margin</span>
                <span>{data.totalRevenue > 0 ? ((netProfit / data.totalRevenue) * 100).toFixed(1) : 0}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
