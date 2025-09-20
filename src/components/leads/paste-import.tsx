"use client";

import { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  CheckCircle2,
  Upload,
  FileText,
  Loader2,
  Sparkles,
  ArrowRight,
  Copy,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { extractMultipleLeads, extractLeadFromText } from "@/lib/text-extraction";

interface DetectedField {
  name: string;
  type: "email" | "phone" | "name" | "company" | "address" | "custom";
  confidence: number;
  sampleValues: string[];
}

interface ImportProgress {
  current: number;
  total: number;
  status: "idle" | "detecting" | "validating" | "importing" | "complete" | "error";
  message?: string;
}

interface PasteImportInterfaceProps {
  onImport: (data: any[]) => Promise<void>;
  className?: string;
  dictionary: any;
}

export function PasteImportInterface({ onImport, className, dictionary }: PasteImportInterfaceProps) {
  const [rawData, setRawData] = useState("");
  const [detectedFields, setDetectedFields] = useState<DetectedField[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [progress, setProgress] = useState<ImportProgress>({
    current: 0,
    total: 0,
    status: "idle"
  });

  // Detect fields from pasted data using advanced extraction
  const detectFields = useCallback((text: string) => {
    setProgress({ current: 0, total: 100, status: "detecting", message: dictionary.leads.import.analyzingData });

    if (!text.trim()) return [];

    const fields: DetectedField[] = [];

    // Try to extract a sample lead to see what fields are available
    const sampleLead = extractLeadFromText(text);

    // Build detected fields based on what was found
    if (sampleLead.email) {
      fields.push({
        name: "Email",
        type: "email",
        confidence: 0.95,
        sampleValues: [sampleLead.email]
      });
    }

    if (sampleLead.phone) {
      fields.push({
        name: "Phone",
        type: "phone",
        confidence: 0.85,
        sampleValues: [sampleLead.phone]
      });
    }

    if (sampleLead.name) {
      fields.push({
        name: "Full Name",
        type: "name",
        confidence: 0.85,
        sampleValues: [sampleLead.name]
      });
    }

    if (sampleLead.company) {
      fields.push({
        name: "Company",
        type: "company",
        confidence: 0.8,
        sampleValues: [sampleLead.company]
      });
    }

    // Check if we can extract multiple leads
    const multipleLeads = extractMultipleLeads(text);
    if (multipleLeads.length > 1) {
      fields.push({
        name: "Multiple Entries",
        type: "custom",
        confidence: 0.9,
        sampleValues: [`${multipleLeads.length} entries detected`]
      });
    }

    setProgress({ current: 100, total: 100, status: "idle" });
    return fields;
  }, [dictionary]);

  // Handle paste event
  const handlePaste = useCallback((text: string) => {
    setRawData(text);
    if (text.trim()) {
      const fields = detectFields(text);
      setDetectedFields(fields);

      // Basic validation
      const errors: string[] = [];
      if (fields.length === 0) {
        errors.push(dictionary.leads.import.noPatterns);
      }
      if (!fields.find(f => f.type === "email" || f.type === "phone")) {
        errors.push(dictionary.leads.import.noContact);
      }
      setValidationErrors(errors);
    }
  }, [detectFields]);

  // Process and import data
  const handleImport = useCallback(async () => {
    if (!rawData.trim() || validationErrors.length > 0) return;

    setIsProcessing(true);
    setProgress({ current: 0, total: 100, status: "validating", message: dictionary.leads.import.validating });

    try {
      // Simulate validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress({ current: 30, total: 100, status: "validating", message: dictionary.leads.import.checkingDuplicates });

      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress({ current: 60, total: 100, status: "importing", message: dictionary.leads.import.importing });

      // Parse and prepare data for import using intelligent extraction
      const extractedLeads = extractMultipleLeads(rawData);

      // Convert extracted leads to the format expected by the import function
      const parsedData = extractedLeads.map((lead, index) => ({
        id: `temp-${index}`,
        raw: lead.rawInput,
        extractedData: lead,
        // For backwards compatibility, also provide basic fields array
        fields: [
          lead.name || '',
          lead.company || '',
          lead.email || '',
          lead.phone || '',
          lead.website || '',
          lead.description || ''
        ].filter(Boolean)
      }));

      await onImport(parsedData);

      setProgress({ current: 100, total: 100, status: "complete", message: `${dictionary.leads.import.success} ${parsedData.length} ${dictionary.leads.import.leads}` });

      // Clear form after successful import
      setTimeout(() => {
        setRawData("");
        setDetectedFields([]);
        setProgress({ current: 0, total: 0, status: "idle" });
      }, 3000);
    } catch (error) {
      setProgress({
        current: 0,
        total: 0,
        status: "error",
        message: error instanceof Error ? error.message : dictionary.leads.import.failed
      });
    } finally {
      setIsProcessing(false);
    }
  }, [rawData, validationErrors, onImport]);

  // Calculate import readiness
  const isReady = useMemo(() => {
    return rawData.trim().length > 0 &&
           detectedFields.length > 0 &&
           validationErrors.length === 0 &&
           !isProcessing;
  }, [rawData, detectedFields, validationErrors, isProcessing]);

  const getFieldBadgeVariant = (confidence: number) => {
    if (confidence >= 0.9) return "default";
    if (confidence >= 0.7) return "secondary";
    return "outline";
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Import Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>{dictionary.leads.import.title}</CardTitle>
              <CardDescription>
                {dictionary.leads.import.description}
              </CardDescription>
            </div>
            <Badge variant="outline" className="gap-1">
              <FileText className="h-3 w-3" />
              {dictionary.leads.import.textImport}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder={dictionary.leads.import.placeholder}
              value={rawData}
              onChange={(e) => handlePaste(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
              disabled={isProcessing}
            />
            {rawData && (
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => {
                  setRawData("");
                  setDetectedFields([]);
                  setValidationErrors([]);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Sample Data Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePaste("John Doe, john@example.com, +1 555-0123, ABC Corp\nJane Smith, jane@example.com, +1 555-0124, XYZ Inc\nBob Johnson, bob@example.com, +1 555-0125, 123 Company")}
              disabled={isProcessing}
            >
              <Copy className="mr-2 h-3 w-3" />
              {dictionary.leads.import.useSample}
            </Button>
          </div>

          {/* Field Detection Preview */}
          {detectedFields.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm">{dictionary.leads.import.detectedFields}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {detectedFields.map((field, index) => (
                      <Badge
                        key={index}
                        variant={getFieldBadgeVariant(field.confidence)}
                        className="gap-1"
                      >
                        {field.name}
                        <span className="text-xs opacity-60">
                          {Math.round(field.confidence * 100)}%
                        </span>
                      </Badge>
                    ))}
                  </div>

                  {/* Sample Values */}
                  <ScrollArea className="h-[100px] w-full rounded-md border p-3">
                    <div className="space-y-2">
                      {detectedFields.map((field, index) => (
                        <div key={index} className="text-xs">
                          <span className="font-medium text-muted-foreground">
                            {field.name}:
                          </span>
                          <span className="ml-2 font-mono">
                            {field.sampleValues.slice(0, 2).join(", ")}
                            {field.sampleValues.length > 2 && "..."}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Validation Alerts */}
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{dictionary.leads.import.validationIssues}</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 list-inside list-disc text-sm">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Progress Indicator */}
          {progress.status !== "idle" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{progress.message}</span>
                <span className="font-medium">
                  {progress.current}/{progress.total}
                </span>
              </div>
              <Progress value={(progress.current / progress.total) * 100} />
              {progress.status === "complete" && (
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    {progress.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            {rawData.trim().split('\n').filter(l => l.trim()).length} {dictionary.leads.import.linesDetected}
          </p>
          <Button
            onClick={handleImport}
            disabled={!isReady}
            className="gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {dictionary.leads.import.processing}
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                {dictionary.leads.import.importButton}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Loading Skeleton */}
      {isProcessing && progress.status === "idle" && (
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export const PasteImport = PasteImportInterface;