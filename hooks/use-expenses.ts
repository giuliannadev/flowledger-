"use client"

import { useState, useEffect } from "react"

export interface Expense {
  id: string
  description: string
  vendor: string
  amount: number
  category: string
  date: string
  paymentMethod: string
  notes: string
  taxDeductible: boolean
  receiptUrl?: string
  createdAt: string
}

const expenseCategories = ["Office", "Travel", "Meals", "Software", "Marketing", "Utilities", "Other"]

// Mock data - Updated to match dashboard totals ($45,230)
const mockExpenses: Expense[] = [
  {
    id: "1",
    description: "Office Supplies",
    vendor: "Staples",
    amount: 245.5,
    category: "Office",
    date: "2024-01-15",
    paymentMethod: "Credit Card",
    notes: "Pens, paper, and folders for the office",
    taxDeductible: true,
    receiptUrl: "receipt_001.pdf",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    description: "Software License",
    vendor: "Adobe",
    amount: 99.0,
    category: "Software",
    date: "2024-01-14",
    paymentMethod: "Credit Card",
    notes: "Monthly Creative Cloud subscription",
    taxDeductible: true,
    createdAt: "2024-01-14T09:15:00Z",
  },
  {
    id: "3",
    description: "Client Lunch",
    vendor: "The Bistro",
    amount: 85.75,
    category: "Meals",
    date: "2024-01-13",
    paymentMethod: "Credit Card",
    notes: "Business lunch with potential client",
    taxDeductible: true,
    receiptUrl: "receipt_002.jpg",
    createdAt: "2024-01-13T14:45:00Z",
  },
  {
    id: "4",
    description: "Office Rent",
    vendor: "Downtown Properties",
    amount: 3500.0,
    category: "Office",
    date: "2024-01-01",
    paymentMethod: "Bank Transfer",
    notes: "Monthly office rent",
    taxDeductible: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    description: "Marketing Campaign",
    vendor: "Google Ads",
    amount: 2500.0,
    category: "Marketing",
    date: "2024-01-10",
    paymentMethod: "Credit Card",
    notes: "Q1 digital marketing campaign",
    taxDeductible: true,
    createdAt: "2024-01-10T12:00:00Z",
  },
  {
    id: "6",
    description: "Professional Development",
    vendor: "Coursera",
    amount: 450.0,
    category: "Software",
    date: "2024-01-08",
    paymentMethod: "Credit Card",
    notes: "Team training courses",
    taxDeductible: true,
    createdAt: "2024-01-08T14:30:00Z",
  },
  {
    id: "7",
    description: "Business Travel",
    vendor: "Delta Airlines",
    amount: 1200.0,
    category: "Travel",
    date: "2024-01-12",
    paymentMethod: "Credit Card",
    notes: "Client meeting in New York",
    taxDeductible: true,
    receiptUrl: "receipt_003.pdf",
    createdAt: "2024-01-12T08:00:00Z",
  },
  {
    id: "8",
    description: "Equipment Purchase",
    vendor: "Apple Store",
    amount: 3200.0,
    category: "Office",
    date: "2024-01-05",
    paymentMethod: "Credit Card",
    notes: "New MacBook Pro for development team",
    taxDeductible: true,
    receiptUrl: "receipt_004.pdf",
    createdAt: "2024-01-05T16:20:00Z",
  },
  {
    id: "9",
    description: "Utilities",
    vendor: "Electric Company",
    amount: 450.0,
    category: "Utilities",
    date: "2024-01-15",
    paymentMethod: "Bank Transfer",
    notes: "Monthly electricity bill",
    taxDeductible: true,
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "10",
    description: "Internet Service",
    vendor: "Comcast Business",
    amount: 150.0,
    category: "Utilities",
    date: "2024-01-01",
    paymentMethod: "Bank Transfer",
    notes: "Monthly internet service",
    taxDeductible: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "11",
    description: "Legal Services",
    vendor: "Law Firm LLC",
    amount: 2500.0,
    category: "Other",
    date: "2024-01-18",
    paymentMethod: "Check",
    notes: "Contract review and legal consultation",
    taxDeductible: true,
    receiptUrl: "receipt_005.pdf",
    createdAt: "2024-01-18T11:15:00Z",
  },
  {
    id: "12",
    description: "Insurance Premium",
    vendor: "Business Insurance Co",
    amount: 800.0,
    category: "Other",
    date: "2024-01-01",
    paymentMethod: "Bank Transfer",
    notes: "Quarterly business insurance",
    taxDeductible: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "13",
    description: "Conference Registration",
    vendor: "Tech Conference Inc",
    amount: 1200.0,
    category: "Travel",
    date: "2024-01-20",
    paymentMethod: "Credit Card",
    notes: "Annual tech conference registration",
    taxDeductible: true,
    receiptUrl: "receipt_006.pdf",
    createdAt: "2024-01-20T13:45:00Z",
  },
  {
    id: "14",
    description: "Cloud Services",
    vendor: "AWS",
    amount: 650.0,
    category: "Software",
    date: "2024-01-15",
    paymentMethod: "Credit Card",
    notes: "Monthly cloud hosting and services",
    taxDeductible: true,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "15",
    description: "Office Cleaning",
    vendor: "CleanPro Services",
    amount: 300.0,
    category: "Office",
    date: "2024-01-25",
    paymentMethod: "Check",
    notes: "Monthly office cleaning service",
    taxDeductible: true,
    createdAt: "2024-01-25T16:00:00Z",
  },
  {
    id: "16",
    description: "Client Entertainment",
    vendor: "Fine Dining Restaurant",
    amount: 280.0,
    category: "Meals",
    date: "2024-01-22",
    paymentMethod: "Credit Card",
    notes: "Client dinner meeting",
    taxDeductible: true,
    receiptUrl: "receipt_007.pdf",
    createdAt: "2024-01-22T19:30:00Z",
  },
  {
    id: "17",
    description: "Marketing Materials",
    vendor: "Print Shop Pro",
    amount: 450.0,
    category: "Marketing",
    date: "2024-01-14",
    paymentMethod: "Credit Card",
    notes: "Business cards and brochures",
    taxDeductible: true,
    receiptUrl: "receipt_008.pdf",
    createdAt: "2024-01-14T15:20:00Z",
  },
  {
    id: "18",
    description: "Phone Service",
    vendor: "Verizon Business",
    amount: 200.0,
    category: "Utilities",
    date: "2024-01-01",
    paymentMethod: "Bank Transfer",
    notes: "Monthly business phone service",
    taxDeductible: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "19",
    description: "Professional Memberships",
    vendor: "Industry Association",
    amount: 350.0,
    category: "Other",
    date: "2024-01-10",
    paymentMethod: "Credit Card",
    notes: "Annual professional membership fees",
    taxDeductible: true,
    createdAt: "2024-01-10T10:30:00Z",
  },
  {
    id: "20",
    description: "Office Furniture",
    vendor: "Furniture Store",
    amount: 1800.0,
    category: "Office",
    date: "2024-01-03",
    paymentMethod: "Credit Card",
    notes: "New office chairs and desk",
    taxDeductible: true,
    receiptUrl: "receipt_009.pdf",
    createdAt: "2024-01-03T14:15:00Z",
  },
  {
    id: "21",
    description: "Software Subscriptions",
    vendor: "Microsoft",
    amount: 120.0,
    category: "Software",
    date: "2024-01-01",
    paymentMethod: "Credit Card",
    notes: "Monthly Office 365 subscription",
    taxDeductible: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "22",
    description: "Business Meals",
    vendor: "Various Restaurants",
    amount: 650.0,
    category: "Meals",
    date: "2024-01-28",
    paymentMethod: "Credit Card",
    notes: "Team lunch meetings",
    taxDeductible: true,
    createdAt: "2024-01-28T12:00:00Z",
  },
  {
    id: "23",
    description: "Marketing Tools",
    vendor: "HubSpot",
    amount: 400.0,
    category: "Marketing",
    date: "2024-01-01",
    paymentMethod: "Credit Card",
    notes: "Monthly marketing automation platform",
    taxDeductible: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "24",
    description: "Banking Fees",
    vendor: "Business Bank",
    amount: 150.0,
    category: "Other",
    date: "2024-01-31",
    paymentMethod: "Bank Transfer",
    notes: "Monthly banking and transaction fees",
    taxDeductible: true,
    createdAt: "2024-01-31T23:59:00Z",
  },
  {
    id: "25",
    description: "Office Supplies (Bulk)",
    vendor: "Office Depot",
    amount: 850.0,
    category: "Office",
    date: "2024-01-20",
    paymentMethod: "Credit Card",
    notes: "Quarterly office supplies order",
    taxDeductible: true,
    receiptUrl: "receipt_010.pdf",
    createdAt: "2024-01-20T11:30:00Z",
  },
  {
    id: "26",
    description: "Website Hosting",
    vendor: "Hosting Provider",
    amount: 75.0,
    category: "Software",
    date: "2024-01-01",
    paymentMethod: "Credit Card",
    notes: "Monthly website hosting",
    taxDeductible: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "27",
    description: "Client Gifts",
    vendor: "Gift Shop",
    amount: 300.0,
    category: "Marketing",
    date: "2024-01-25",
    paymentMethod: "Credit Card",
    notes: "Holiday client appreciation gifts",
    taxDeductible: true,
    receiptUrl: "receipt_011.pdf",
    createdAt: "2024-01-25T16:45:00Z",
  },
  {
    id: "28",
    description: "Equipment Maintenance",
    vendor: "Tech Repair Co",
    amount: 200.0,
    category: "Office",
    date: "2024-01-18",
    paymentMethod: "Credit Card",
    notes: "Computer maintenance and repairs",
    taxDeductible: true,
    receiptUrl: "receipt_012.pdf",
    createdAt: "2024-01-18T14:20:00Z",
  },
  {
    id: "29",
    description: "Business Travel (Local)",
    vendor: "Uber Business",
    amount: 180.0,
    category: "Travel",
    date: "2024-01-30",
    paymentMethod: "Credit Card",
    notes: "Client meeting transportation",
    taxDeductible: true,
    createdAt: "2024-01-30T09:00:00Z",
  },
  {
    id: "30",
    description: "Miscellaneous Expenses",
    vendor: "Various",
    amount: 250.0,
    category: "Other",
    date: "2024-01-31",
    paymentMethod: "Credit Card",
    notes: "Various small business expenses",
    taxDeductible: true,
    createdAt: "2024-01-31T17:30:00Z",
  },
]

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Always use the updated mock data
    console.log('Loading expenses:', mockExpenses.length, 'expenses')
    setExpenses(mockExpenses)
    localStorage.setItem("accounting_expenses", JSON.stringify(mockExpenses))
    setLoading(false)
  }, [])

  const addExpense = (expenseData: Omit<Expense, "id" | "createdAt">) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    const updatedExpenses = [...expenses, newExpense]
    setExpenses(updatedExpenses)
    localStorage.setItem("accounting_expenses", JSON.stringify(updatedExpenses))
  }

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    const updatedExpenses = expenses.map((expense) => (expense.id === id ? { ...expense, ...updates } : expense))
    setExpenses(updatedExpenses)
    localStorage.setItem("accounting_expenses", JSON.stringify(updatedExpenses))
  }

  const deleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id)
    setExpenses(updatedExpenses)
    localStorage.setItem("accounting_expenses", JSON.stringify(updatedExpenses))
  }

  return {
    expenses,
    loading,
    categories: expenseCategories,
    addExpense,
    updateExpense,
    deleteExpense,
  }
}
