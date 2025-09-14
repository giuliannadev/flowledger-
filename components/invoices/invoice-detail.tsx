"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PDFPreview } from "@/components/pdf/pdf-preview"
import { useInvoices } from "@/hooks/use-invoices"

interface InvoiceDetailProps {
  invoiceId: string
  onBack: () => void
}

export function InvoiceDetail({ invoiceId, onBack }: InvoiceDetailProps) {
  const { invoices, updateInvoiceStatus } = useInvoices()
  const invoice = invoices.find((inv) => inv.id === invoiceId)

  if (!invoice) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Invoice not found</h2>
          <Button onClick={onBack} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="text-blue-600">
          ← Back to Invoices
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline">Edit</Button>
          <PDFPreview invoice={invoice}>
            <Button variant="outline">Download PDF</Button>
          </PDFPreview>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Send Invoice</Button>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{invoice.invoiceNumber}</CardTitle>
              <p className="text-gray-600 mt-1">Invoice Date: {invoice.invoiceDate}</p>
            </div>
            <Badge className={getStatusColor(invoice.status)}>{invoice.status.toUpperCase()}</Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Company & Client Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">From:</h3>
              <div className="text-gray-600">
                <div className="font-medium">Your Company Name</div>
                <div>123 Business Street</div>
                <div>City, State 12345</div>
                <div>contact@company.com</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
              <div className="text-gray-600">
                <div className="font-medium">{invoice.clientName}</div>
                {invoice.clientAddress && <div className="whitespace-pre-line">{invoice.clientAddress}</div>}
                {invoice.clientEmail && <div>{invoice.clientEmail}</div>}
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
            <div>
              <span className="text-gray-500 text-sm">Invoice Date:</span>
              <div className="font-medium">{invoice.invoiceDate}</div>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Due Date:</span>
              <div className="font-medium">{invoice.dueDate}</div>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Payment Terms:</span>
              <div className="font-medium">{invoice.terms}</div>
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-gray-600">Description</th>
                    <th className="text-right py-2 text-gray-600">Qty</th>
                    <th className="text-right py-2 text-gray-600">Rate</th>
                    <th className="text-right py-2 text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3">{item.description}</td>
                      <td className="text-right py-3">{item.quantity}</td>
                      <td className="text-right py-3">${item.rate.toFixed(2)}</td>
                      <td className="text-right py-3">${item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span>Subtotal:</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Tax:</span>
                <span>${invoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t font-bold text-lg">
                <span>Total:</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-600 whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}

          {/* Status Actions */}
          {invoice.status !== "paid" && (
            <div className="flex justify-center space-x-4 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => updateInvoiceStatus(invoice.id, "pending")}
                disabled={invoice.status === "pending"}
              >
                Mark as Sent
              </Button>
              <Button
                onClick={() => updateInvoiceStatus(invoice.id, "paid")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Mark as Paid
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
