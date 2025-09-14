"use client"

import { useState, useEffect } from "react"

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  clientEmail: string
  clientAddress: string
  invoiceDate: string
  dueDate: string
  terms: string
  notes: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  status: "draft" | "pending" | "paid" | "overdue"
  createdAt: string
}

// Mock data - Updated to match dashboard totals
const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    clientName: "Acme Corporation",
    clientEmail: "billing@acme.com",
    clientAddress: "123 Business Ave\nNew York, NY 10001",
    invoiceDate: "2024-01-15",
    dueDate: "2024-02-14",
    terms: "Net 30",
    notes: "Thank you for your business!",
    items: [
      { id: "1", description: "Web Development Services", quantity: 40, rate: 75, amount: 3000 },
      { id: "2", description: "Design Consultation", quantity: 8, rate: 100, amount: 800 },
    ],
    subtotal: 3800,
    tax: 380,
    total: 4180,
    status: "pending",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    invoiceNumber: "INV-002",
    clientName: "Tech Solutions Inc",
    clientEmail: "accounts@techsolutions.com",
    clientAddress: "456 Innovation Dr\nSan Francisco, CA 94105",
    invoiceDate: "2024-01-10",
    dueDate: "2024-02-09",
    terms: "Net 30",
    notes: "",
    items: [{ id: "1", description: "Monthly Retainer", quantity: 1, rate: 2500, amount: 2500 }],
    subtotal: 2500,
    tax: 250,
    total: 2750,
    status: "paid",
    createdAt: "2024-01-10T14:30:00Z",
  },
  {
    id: "3",
    invoiceNumber: "INV-003",
    clientName: "Design Studio LLC",
    clientEmail: "billing@designstudio.com",
    clientAddress: "789 Creative Blvd\nLos Angeles, CA 90210",
    invoiceDate: "2024-01-08",
    dueDate: "2024-02-07",
    terms: "Net 30",
    notes: "Brand identity package",
    items: [
      { id: "1", description: "Logo Design", quantity: 1, rate: 2500, amount: 2500 },
      { id: "2", description: "Brand Guidelines", quantity: 1, rate: 1500, amount: 1500 },
    ],
    subtotal: 4000,
    tax: 400,
    total: 4400,
    status: "overdue",
    createdAt: "2024-01-08T09:15:00Z",
  },
  {
    id: "4",
    invoiceNumber: "INV-004",
    clientName: "Global Enterprises",
    clientEmail: "ap@globalent.com",
    clientAddress: "100 Corporate Plaza\nChicago, IL 60601",
    invoiceDate: "2024-01-05",
    dueDate: "2024-02-04",
    terms: "Net 30",
    notes: "Q1 consulting services",
    items: [
      { id: "1", description: "Strategic Consulting", quantity: 80, rate: 150, amount: 12000 },
      { id: "2", description: "Project Management", quantity: 40, rate: 100, amount: 4000 },
    ],
    subtotal: 16000,
    tax: 1600,
    total: 17600,
    status: "paid",
    createdAt: "2024-01-05T14:20:00Z",
  },
  {
    id: "5",
    invoiceNumber: "INV-005",
    clientName: "StartupXYZ",
    clientEmail: "finance@startupxyz.com",
    clientAddress: "555 Innovation St\nAustin, TX 78701",
    invoiceDate: "2024-01-12",
    dueDate: "2024-02-11",
    terms: "Net 30",
    notes: "MVP development",
    items: [
      { id: "1", description: "Frontend Development", quantity: 120, rate: 80, amount: 9600 },
      { id: "2", description: "Backend Development", quantity: 100, rate: 90, amount: 9000 },
      { id: "3", description: "Database Setup", quantity: 20, rate: 120, amount: 2400 },
    ],
    subtotal: 21000,
    tax: 2100,
    total: 23100,
    status: "paid",
    createdAt: "2024-01-12T11:30:00Z",
  },
  {
    id: "8",
    invoiceNumber: "INV-008",
    clientName: "Enterprise Corp",
    clientEmail: "billing@enterprise.com",
    clientAddress: "500 Business Blvd\nSeattle, WA 98101",
    invoiceDate: "2024-01-03",
    dueDate: "2024-02-02",
    terms: "Net 30",
    notes: "Enterprise software development",
    items: [
      { id: "1", description: "Custom Software Development", quantity: 150, rate: 100, amount: 15000 },
      { id: "2", description: "System Integration", quantity: 30, rate: 120, amount: 3600 },
    ],
    subtotal: 18600,
    tax: 1860,
    total: 20460,
    status: "paid",
    createdAt: "2024-01-03T09:00:00Z",
  },
  {
    id: "6",
    invoiceNumber: "INV-006",
    clientName: "Retail Chain Corp",
    clientEmail: "billing@retailchain.com",
    clientAddress: "200 Commerce Ave\nMiami, FL 33101",
    invoiceDate: "2024-01-18",
    dueDate: "2024-02-17",
    terms: "Net 30",
    notes: "E-commerce platform",
    items: [
      { id: "1", description: "E-commerce Development", quantity: 200, rate: 70, amount: 14000 },
      { id: "2", description: "Payment Integration", quantity: 30, rate: 100, amount: 3000 },
    ],
    subtotal: 17000,
    tax: 1700,
    total: 18700,
    status: "pending",
    createdAt: "2024-01-18T16:45:00Z",
  },
  {
    id: "7",
    invoiceNumber: "INV-007",
    clientName: "Healthcare Systems",
    clientEmail: "ap@healthcaresys.com",
    clientAddress: "300 Medical Dr\nBoston, MA 02101",
    invoiceDate: "2024-01-20",
    dueDate: "2024-02-19",
    terms: "Net 30",
    notes: "Patient management system",
    items: [
      { id: "1", description: "System Architecture", quantity: 60, rate: 120, amount: 7200 },
      { id: "2", description: "Database Design", quantity: 40, rate: 100, amount: 4000 },
      { id: "3", description: "Security Implementation", quantity: 30, rate: 150, amount: 4500 },
    ],
    subtotal: 15700,
    tax: 1570,
    total: 17270,
    status: "paid",
    createdAt: "2024-01-20T10:15:00Z",
  },
  {
    id: "9",
    invoiceNumber: "INV-009",
    clientName: "Financial Services Inc",
    clientEmail: "billing@financial.com",
    clientAddress: "400 Wall Street\nNew York, NY 10005",
    invoiceDate: "2024-01-25",
    dueDate: "2024-02-24",
    terms: "Net 30",
    notes: "Financial software integration",
    items: [
      { id: "1", description: "API Development", quantity: 80, rate: 150, amount: 12000 },
      { id: "2", description: "Security Audit", quantity: 15, rate: 200, amount: 3000 },
    ],
    subtotal: 15000,
    tax: 1500,
    total: 16500,
    status: "pending",
    createdAt: "2024-01-25T14:30:00Z",
  },
  {
    id: "10",
    invoiceNumber: "INV-010",
    clientName: "Small Business LLC",
    clientEmail: "billing@smallbiz.com",
    clientAddress: "100 Main St\nPortland, OR 97201",
    invoiceDate: "2024-01-30",
    dueDate: "2024-02-29",
    terms: "Net 30",
    notes: "Website maintenance",
    items: [
      { id: "1", description: "Monthly Maintenance", quantity: 1, rate: 470, amount: 470 },
    ],
    subtotal: 470,
    tax: 47,
    total: 517,
    status: "paid",
    createdAt: "2024-01-30T10:00:00Z",
  },
]

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Always use the updated mock data
    console.log('Loading invoices:', mockInvoices.length, 'invoices')
    setInvoices(mockInvoices)
    localStorage.setItem("accounting_invoices", JSON.stringify(mockInvoices))
    setLoading(false)
  }, [])

  const addInvoice = (invoiceData: Omit<Invoice, "id" | "invoiceNumber" | "createdAt">) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: Date.now().toString(),
      invoiceNumber: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
    }

    const updatedInvoices = [...invoices, newInvoice]
    setInvoices(updatedInvoices)
    localStorage.setItem("accounting_invoices", JSON.stringify(updatedInvoices))
  }

  const updateInvoiceStatus = (id: string, status: Invoice["status"]) => {
    const updatedInvoices = invoices.map((invoice) => (invoice.id === id ? { ...invoice, status } : invoice))
    setInvoices(updatedInvoices)
    localStorage.setItem("accounting_invoices", JSON.stringify(updatedInvoices))
  }

  return {
    invoices,
    loading,
    addInvoice,
    updateInvoiceStatus,
  }
}
