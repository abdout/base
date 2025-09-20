"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/atom/page-header"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { LeadsContent } from "@/components/leads/clients/content"
import { PasteImport } from "@/components/leads/paste-import"
// Remove server-only dictionary import - will be passed as prop
import { toast } from "sonner"
import { createLead } from "@/components/leads/clients/actions"
import { extractLeadFromText } from "@/lib/text-extraction"
import {
  ChevronDown,
  ChevronUp,
  Upload,
  Sparkles,
  Table,
  Send,
  Loader2,
  ClipboardPaste,
  Globe
} from "lucide-react"
import { useRouter } from "next/navigation"

// Suggestions for quick actions
const SUGGESTIONS = [
  "Import leads from LinkedIn profiles",
  "Scrape contacts from company website",
  "Generate leads from industry directory",
]

interface LeadsClientProps {
  lang: string
  dictionary: any
}

export default function LeadsClient({ lang, dictionary }: LeadsClientProps) {
  const [showTable, setShowTable] = useState(false)
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const router = useRouter()

  const handleImport = async () => {
    if (!input.trim()) {
      toast.error("Please enter some data to import")
      return
    }

    setIsImporting(true)
    try {
      // Split input by double line breaks for multiple leads
      const entries = input.split(/\n\n+/).filter(e => e.trim())
      let successCount = 0
      let failedCount = 0

      for (const entry of entries) {
        try {
          // Extract lead data
          const extractedData = extractLeadFromText(entry)

          if (!extractedData.name && !extractedData.email && !extractedData.company) {
            failedCount++
            continue
          }

          // Create lead
          const result = await createLead({
            name: extractedData.name || "Unknown",
            email: extractedData.email || undefined,
            phone: extractedData.phone || undefined,
            company: extractedData.company || undefined,
            website: extractedData.website || undefined,
            description: extractedData.description || undefined,
            notes: `Imported via Leads Agent\n${entry}`,
            status: "NEW",
            source: "IMPORT",
            priority: "MEDIUM",
            tags: ["agent-import"],
            rawInput: entry,
          })

          if (result.success) {
            successCount++
          } else {
            failedCount++
          }
        } catch (error) {
          failedCount++
        }
      }

      // Show results
      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} lead(s)`)
        setInput("")
        router.refresh()
      }

      if (failedCount > 0) {
        toast.warning(`Failed to import ${failedCount} lead(s)`)
      }
    } catch (error) {
      toast.error("Import failed. Please try again.")
    } finally {
      setIsImporting(false)
    }
  }

  const handleScrape = async () => {
    // TODO: Implement web scraping
    toast.info("Web scraping feature coming soon!")
  }

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleImport()
    }
  }

  return (
    <section className="relative flex flex-col items-center justify-center py-12 md:py-16">
      {/* Header */}
      <PageHeader title="Leads Agent" />
      <p className="text-muted-foreground text-center max-w-2xl mt-2">
        Import, generate, and manage your leads with AI assistance. Paste contact information,
        scrape websites, or connect to data sources.
      </p>

      {/* Main Interface */}
      <div className="w-full max-w-4xl mt-8 space-y-4">
        {/* Input Area */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste lead information here... (Names, emails, companies, LinkedIn profiles, etc.)"
                className="min-h-[120px] pr-20 resize-none"
                disabled={isImporting}
              />
              {input && (
                <Button
                  onClick={() => setInput("")}
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleImport}
                disabled={!input.trim() || isImporting}
                className="flex-1 sm:flex-initial"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Leads
                  </>
                )}
              </Button>

              <Button
                onClick={handleScrape}
                variant="outline"
                className="flex-1 sm:flex-initial"
              >
                <Globe className="mr-2 h-4 w-4" />
                Scrape Website
              </Button>

              <Button
                onClick={() => navigator.clipboard.readText().then(setInput)}
                variant="outline"
                size="icon"
              >
                <ClipboardPaste className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Suggestions */}
            {!input && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Try these:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <Button
                      key={suggestion}
                      onClick={() => handleSuggestion(suggestion)}
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7"
                    >
                      <Sparkles className="mr-1 h-3 w-3" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Advanced Import Section */}
        <Card className="p-4">
          <PasteImportInterface dictionary={dictionary} />
        </Card>

        {/* Toggle Table Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => setShowTable(!showTable)}
            variant="outline"
            className="group"
          >
            <Table className="mr-2 h-4 w-4" />
            {showTable ? "Hide" : "Show"} Leads Table
            {showTable ? (
              <ChevronUp className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            )}
          </Button>
        </div>

        {/* Leads Table */}
        {showTable && (
          <Card className="p-6">
            <LeadsContent
              searchParams={{}}
              defaultFilters={{}}
              dictionary={dictionary}
            />
          </Card>
        )}
      </div>
    </section>
  )
}

// Wrapper component for paste import with proper error handling
function PasteImportInterface({ dictionary }: { dictionary: any }) {
  const router = useRouter()

  const handleImport = async (parsedData: any[]) => {
    try {
      let successCount = 0
      let failedCount = 0

      for (const item of parsedData) {
        try {
          const leadData = {
            name: item.extractedData?.name || item.fields?.[0] || "Unknown",
            email: item.extractedData?.email || item.fields?.[1] || undefined,
            phone: item.extractedData?.phone || item.fields?.[2] || undefined,
            company: item.extractedData?.company || item.fields?.[3] || undefined,
            website: item.extractedData?.website || undefined,
            description: item.extractedData?.description || undefined,
            notes: `Raw: ${item.raw}`,
            status: "NEW" as const,
            source: "IMPORT" as const,
            priority: "MEDIUM" as const,
            tags: ["bulk-import"],
            rawInput: item.raw,
          }

          const result = await createLead(leadData)

          if (result.success) {
            successCount++
          } else {
            failedCount++
          }
        } catch (error) {
          failedCount++
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} lead(s)`)
        router.refresh()
      }

      if (failedCount > 0) {
        toast.warning(`Failed to import ${failedCount} lead(s)`)
      }
    } catch (error) {
      toast.error("Import failed")
    }
  }

  return (
    <details className="group">
      <summary className="flex items-center justify-between cursor-pointer list-none">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          <span className="font-medium">Advanced Import with AI</span>
        </div>
        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-4">
        <PasteImport onImport={handleImport} dictionary={dictionary} />
      </div>
    </details>
  )
}