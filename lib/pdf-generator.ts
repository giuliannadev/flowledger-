"use client"

import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import type { Invoice } from "@/hooks/use-invoices"

export class PDFGenerator {
  static async generateInvoicePDF(invoice: Invoice): Promise<void> {
    const pdf = new jsPDF("p", "mm", "a4")
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    // Company header
    pdf.setFontSize(24)
    pdf.setFont("helvetica", "bold")
    pdf.text("INVOICE", pageWidth - 20, 30, { align: "right" })

    // Company info
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "normal")
    pdf.text("Your Company Name", 20, 30)
    pdf.text("123 Business Street", 20, 38)
    pdf.text("City, State 12345", 20, 46)
    pdf.text("contact@company.com", 20, 54)
    pdf.text("(555) 123-4567", 20, 62)

    // Invoice details
    pdf.setFont("helvetica", "bold")
    pdf.text(`Invoice #: ${invoice.invoiceNumber}`, pageWidth - 20, 50, { align: "right" })
    pdf.setFont("helvetica", "normal")
    pdf.text(`Date: ${invoice.invoiceDate}`, pageWidth - 20, 58, { align: "right" })
    pdf.text(`Due: ${invoice.dueDate}`, pageWidth - 20, 66, { align: "right" })

    // Bill to section
    pdf.setFont("helvetica", "bold")
    pdf.text("Bill To:", 20, 85)
    pdf.setFont("helvetica", "normal")
    pdf.text(invoice.clientName, 20, 95)
    if (invoice.clientAddress) {
      const addressLines = invoice.clientAddress.split("\n")
      addressLines.forEach((line, index) => {
        pdf.text(line, 20, 103 + index * 8)
      })
    }

    // Table header
    const tableTop = 140
    pdf.setFont("helvetica", "bold")
    pdf.text("Description", 20, tableTop)
    pdf.text("Qty", 120, tableTop, { align: "center" })
    pdf.text("Rate", 140, tableTop, { align: "center" })
    pdf.text("Amount", pageWidth - 20, tableTop, { align: "right" })

    // Draw line under header
    pdf.line(20, tableTop + 3, pageWidth - 20, tableTop + 3)

    // Table rows
    let currentY = tableTop + 15
    pdf.setFont("helvetica", "normal")

    invoice.items.forEach((item) => {
      pdf.text(item.description, 20, currentY)
      pdf.text(item.quantity.toString(), 120, currentY, { align: "center" })
      pdf.text(`$${item.rate.toFixed(2)}`, 140, currentY, { align: "center" })
      pdf.text(`$${item.amount.toFixed(2)}`, pageWidth - 20, currentY, { align: "right" })
      currentY += 10
    })

    // Totals section
    const totalsY = currentY + 20
    pdf.line(120, totalsY - 5, pageWidth - 20, totalsY - 5)

    pdf.text("Subtotal:", 120, totalsY)
    pdf.text(`$${invoice.subtotal.toFixed(2)}`, pageWidth - 20, totalsY, { align: "right" })

    pdf.text("Tax:", 120, totalsY + 10)
    pdf.text(`$${invoice.tax.toFixed(2)}`, pageWidth - 20, totalsY + 10, { align: "right" })

    pdf.setFont("helvetica", "bold")
    pdf.text("Total:", 120, totalsY + 25)
    pdf.text(`$${invoice.total.toFixed(2)}`, pageWidth - 20, totalsY + 25, { align: "right" })

    // Notes
    if (invoice.notes) {
      pdf.setFont("helvetica", "normal")
      pdf.text("Notes:", 20, totalsY + 50)
      const noteLines = pdf.splitTextToSize(invoice.notes, pageWidth - 40)
      pdf.text(noteLines, 20, totalsY + 60)
    }

    // Payment terms
    pdf.setFontSize(10)
    pdf.text(`Payment Terms: ${invoice.terms}`, 20, pageHeight - 30)

    // Save the PDF
    pdf.save(`invoice-${invoice.invoiceNumber}.pdf`)
  }

  static async generateReportPDF(reportElement: HTMLElement, filename: string): Promise<void> {
    try {
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      const imgWidth = pageWidth - 20 // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 10 // 10mm top margin

      // Add first page
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight)
      heightLeft -= pageHeight - 20 // Account for margins

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight)
        heightLeft -= pageHeight - 20
      }

      pdf.save(filename)
    } catch (error) {
      console.error("Error generating PDF:", error)
      throw new Error("Failed to generate PDF")
    }
  }

  static async generateExpenseReportPDF(expenses: any[], dateRange: string): Promise<void> {
    const pdf = new jsPDF("p", "mm", "a4")
    const pageWidth = pdf.internal.pageSize.getWidth()

    // Header
    pdf.setFontSize(20)
    pdf.setFont("helvetica", "bold")
    pdf.text("Expense Report", pageWidth / 2, 30, { align: "center" })

    pdf.setFontSize(12)
    pdf.setFont("helvetica", "normal")
    pdf.text(`Period: ${dateRange}`, pageWidth / 2, 40, { align: "center" })
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 48, { align: "center" })

    // Summary
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    pdf.setFont("helvetica", "bold")
    pdf.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, 20, 65)

    // Table header
    const tableTop = 85
    pdf.setFont("helvetica", "bold")
    pdf.text("Date", 20, tableTop)
    pdf.text("Description", 45, tableTop)
    pdf.text("Category", 120, tableTop)
    pdf.text("Amount", pageWidth - 20, tableTop, { align: "right" })

    // Draw line under header
    pdf.line(20, tableTop + 3, pageWidth - 20, tableTop + 3)

    // Table rows
    let currentY = tableTop + 15
    pdf.setFont("helvetica", "normal")

    expenses.forEach((expense) => {
      if (currentY > 270) {
        // Add new page if needed
        pdf.addPage()
        currentY = 30
      }

      pdf.text(expense.date, 20, currentY)
      const description = pdf.splitTextToSize(expense.description, 70)
      pdf.text(description[0], 45, currentY)
      pdf.text(expense.category, 120, currentY)
      pdf.text(`$${expense.amount.toFixed(2)}`, pageWidth - 20, currentY, { align: "right" })
      currentY += 10
    })

    pdf.save(`expense-report-${dateRange}.pdf`)
  }
}
