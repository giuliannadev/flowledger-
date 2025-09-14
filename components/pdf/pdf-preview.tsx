"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PDFGenerator } from "@/lib/pdf-generator"
import { useToast } from "@/hooks/use-toast"
import type { Invoice } from "@/hooks/use-invoices"

interface PDFPreviewProps {
  invoice: Invoice
  children: React.ReactNode
}

export function PDFPreview({ invoice, children }: PDFPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    try {
      await PDFGenerator.generateInvoicePDF(invoice)
      toast({
        title: "PDF Generated",
        description: "Invoice PDF has been downloaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invoice Preview</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* PDF Preview */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{invoice.invoiceNumber}</CardTitle>
                  <p className="text-gray-600 mt-1">Invoice Preview</p>
                </div>
                <Button onClick={handleGeneratePDF} disabled={isGenerating} className="bg-blue-600 hover:bg-blue-700">
                  {isGenerating ? "Generating..." : "Download PDF"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8 bg-white">
              {/* Invoice Content for Preview */}
              <div className="space-y-8">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Your Company Name</h1>
                    <div className="text-gray-600 mt-2">
                      <p>123 Business Street</p>
                      <p>City, State 12345</p>
                      <p>contact@company.com</p>
                      <p>(555) 123-4567</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-bold text-blue-600">INVOICE</h2>
                    <div className="mt-2 text-gray-600">
                      <p>
                        <strong>Invoice #:</strong> {invoice.invoiceNumber}
                      </p>
                      <p>
                        <strong>Date:</strong> {invoice.invoiceDate}
                      </p>
                      <p>
                        <strong>Due:</strong> {invoice.dueDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bill To */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Bill To:</h3>
                  <div className="text-gray-700">
                    <p className="font-medium">{invoice.clientName}</p>
                    {invoice.clientAddress && <div className="whitespace-pre-line">{invoice.clientAddress}</div>}
                    {invoice.clientEmail && <p>{invoice.clientEmail}</p>}
                  </div>
                </div>

                {/* Items Table */}
                <div>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-3 font-semibold">Description</th>
                        <th className="text-center py-3 font-semibold w-20">Qty</th>
                        <th className="text-center py-3 font-semibold w-24">Rate</th>
                        <th className="text-right py-3 font-semibold w-24">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200">
                          <td className="py-3">{item.description}</td>
                          <td className="text-center py-3">{item.quantity}</td>
                          <td className="text-center py-3">${item.rate.toFixed(2)}</td>
                          <td className="text-right py-3">${item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-64">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Subtotal:</span>
                      <span>${invoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Tax:</span>
                      <span>${invoice.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-t-2 border-gray-300 font-bold text-lg">
                      <span>Total:</span>
                      <span>${invoice.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {invoice.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes:</h3>
                    <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
                  </div>
                )}

                {/* Payment Terms */}
                <div className="text-sm text-gray-600 border-t pt-4">
                  <p>
                    <strong>Payment Terms:</strong> {invoice.terms}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
