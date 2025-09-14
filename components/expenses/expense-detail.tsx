"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useExpenses } from "@/hooks/use-expenses"

interface ExpenseDetailProps {
  expenseId: string
  onBack: () => void
}

export function ExpenseDetail({ expenseId, onBack }: ExpenseDetailProps) {
  const { expenses } = useExpenses()
  const expense = expenses.find((exp) => exp.id === expenseId)

  if (!expense) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Expense not found</h2>
          <Button onClick={onBack} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="text-blue-600">
          ← Back to Expenses
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline">Edit</Button>
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent">
            Delete
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{expense.description}</CardTitle>
              <p className="text-gray-600 mt-1">Expense Details</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{formatCurrency(expense.amount)}</div>
              {expense.taxDeductible && <Badge className="bg-green-100 text-green-800 mt-2">Tax Deductible</Badge>}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Expense Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 text-sm">Vendor:</span>
                  <div className="font-medium">{expense.vendor}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Category:</span>
                  <div className="mt-1">
                    <Badge className={getCategoryColor(expense.category)}>{expense.category}</Badge>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Date:</span>
                  <div className="font-medium">{expense.date}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 text-sm">Amount:</span>
                  <div className="font-bold text-lg">{formatCurrency(expense.amount)}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Payment Method:</span>
                  <div className="font-medium">{expense.paymentMethod || "Not specified"}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Tax Status:</span>
                  <div className="font-medium">{expense.taxDeductible ? "Tax Deductible" : "Not Tax Deductible"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {expense.notes && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-600 whitespace-pre-line bg-gray-50 p-4 rounded-lg">{expense.notes}</p>
            </div>
          )}

          {/* Receipt */}
          {expense.receiptUrl && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Receipt</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{expense.receiptUrl}</div>
                    <div className="text-sm text-gray-500">Receipt attached</div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Record Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Created:</span>
                <div className="font-medium">{expense.createdAt}</div>
              </div>
              <div>
                <span className="text-gray-500">Last Modified:</span>
                <div className="font-medium">{expense.createdAt}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
