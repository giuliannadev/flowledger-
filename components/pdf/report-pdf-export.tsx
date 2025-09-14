"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { PDFGenerator } from "@/lib/pdf-generator"
import { useToast } from "@/hooks/use-toast"

interface ReportPDFExportProps {
  reportElement?: HTMLElement
  filename?: string
  children?: React.ReactNode
}

export function ReportPDFExport({ reportElement, filename = "financial-report.pdf", children }: ReportPDFExportProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()
  const reportRef = useRef<HTMLDivElement>(null)

  const handleExportPDF = async () => {
    setIsGenerating(true)
    try {
      const element = reportElement || reportRef.current
      if (!element) {
        throw new Error("No report element found")
      }

      await PDFGenerator.generateReportPDF(element, filename)
      toast({
        title: "PDF Exported",
        description: "Report has been exported successfully.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  if (children) {
    return (
      <div>
        <Button onClick={handleExportPDF} disabled={isGenerating} variant="outline">
          {isGenerating ? "Exporting..." : "Export PDF"}
        </Button>
        <div ref={reportRef} className="hidden">
          {children}
        </div>
      </div>
    )
  }

  return (
    <Button onClick={handleExportPDF} disabled={isGenerating} variant="outline">
      {isGenerating ? "Exporting..." : "Export PDF"}
    </Button>
  )
}
