"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Download,
  Loader2,
  FileText,
  Database,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Info,
  Settings,
  Map,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Lead } from "./leads-table";

// Bulk Import Dialog
interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: any[], mapping: FieldMapping[]) => Promise<void>;
}

interface FieldMapping {
  source: string;
  target: string;
  transform?: (value: any) => any;
}

interface ImportStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const importSteps: ImportStep[] = [
  {
    id: "upload",
    title: "Upload File",
    description: "Select CSV or Excel file",
    icon: Upload,
  },
  {
    id: "preview",
    title: "Preview Data",
    description: "Review imported data",
    icon: FileSpreadsheet,
  },
  {
    id: "mapping",
    title: "Map Fields",
    description: "Map columns to lead fields",
    icon: Map,
  },
  {
    id: "confirm",
    title: "Confirm Import",
    description: "Review and start import",
    icon: CheckCircle2,
  },
];

export function BulkImportDialog({ open, onOpenChange, onImport }: BulkImportDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<"idle" | "processing" | "complete" | "error">("idle");
  const [errors, setErrors] = useState<string[]>([]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      // Simulate file parsing
      setTimeout(() => {
        setHeaders(["Name", "Email", "Phone", "Company", "Title"]);
        setParsedData([
          ["John Doe", "john@example.com", "+1234567890", "ABC Corp", "CEO"],
          ["Jane Smith", "jane@example.com", "+0987654321", "XYZ Inc", "CTO"],
        ]);
        setCurrentStep(1);
      }, 1000);
    }
  }, []);

  const handleStartImport = async () => {
    setIsProcessing(true);
    setImportStatus("processing");
    setImportProgress(0);

    try {
      // Simulate import progress
      for (let i = 0; i <= 100; i += 10) {
        setImportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      await onImport(parsedData, fieldMappings);
      setImportStatus("complete");
    } catch (error) {
      setImportStatus("error");
      setErrors([error instanceof Error ? error.message : "Import failed"]);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Upload
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="mt-4">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-primary hover:underline">Choose file</span>
                  {" or drag and drop"}
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                CSV, XLS, or XLSX files up to 10MB
              </p>
            </div>

            {file && (
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      setParsedData([]);
                      setHeaders([]);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 1: // Preview
        return (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Found {parsedData.length} rows with {headers.length} columns
              </AlertDescription>
            </Alert>

            <ScrollArea className="h-[300px] w-full rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    {headers.map((header, index) => (
                      <th key={index} className="p-2 text-left text-sm font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedData.slice(0, 5).map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b">
                      {row.map((cell: any, cellIndex: number) => (
                        <td key={cellIndex} className="p-2 text-sm">
                          {cell || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>

            {parsedData.length > 5 && (
              <p className="text-center text-sm text-muted-foreground">
                Showing 5 of {parsedData.length} rows
              </p>
            )}
          </div>
        );

      case 2: // Mapping
        return (
          <div className="space-y-4">
            <Alert>
              <Settings className="h-4 w-4" />
              <AlertDescription>
                Map your CSV columns to lead fields
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {headers.map((header, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <Label>{header}</Label>
                  </div>
                  <Select
                    defaultValue={header.toLowerCase().replace(/\s+/g, "")}
                    onValueChange={(value) => {
                      const newMappings = [...fieldMappings];
                      newMappings[index] = { source: header, target: value };
                      setFieldMappings(newMappings);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="firstname">First Name</SelectItem>
                      <SelectItem value="lastname">Last Name</SelectItem>
                      <SelectItem value="name">Full Name</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                      <SelectItem value="title">Job Title</SelectItem>
                      <SelectItem value="skip">Skip Field</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        );

      case 3: // Confirm
        return (
          <div className="space-y-4">
            {importStatus === "idle" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Import Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Rows</span>
                      <span className="font-medium">{parsedData.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Mapped Fields</span>
                      <span className="font-medium">{fieldMappings.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">File Size</span>
                      <span className="font-medium">
                        {file ? `${(file.size / 1024).toFixed(2)} KB` : "—"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Ready to Import</AlertTitle>
                  <AlertDescription>
                    This will add {parsedData.length} new leads to your database.
                    Duplicate detection will be performed based on email addresses.
                  </AlertDescription>
                </Alert>
              </>
            )}

            {importStatus === "processing" && (
              <div className="space-y-4">
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Importing leads...</span>
                    <span>{importProgress}%</span>
                  </div>
                  <Progress value={importProgress} />
                </div>
              </div>
            )}

            {importStatus === "complete" && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle>Import Complete!</AlertTitle>
                <AlertDescription>
                  Successfully imported {parsedData.length} leads.
                </AlertDescription>
              </Alert>
            )}

            {importStatus === "error" && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Import Failed</AlertTitle>
                <AlertDescription>
                  {errors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </AlertDescription>
              </Alert>
            )}
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Bulk Import Leads</DialogTitle>
          <DialogDescription>
            Import multiple leads from a CSV or Excel file
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          {importSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isComplete = index < currentStep;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2",
                      isActive && "border-primary bg-primary text-primary-foreground",
                      isComplete && "border-primary bg-primary text-primary-foreground",
                      !isActive && !isComplete && "border-muted-foreground/25"
                    )}
                  >
                    {isComplete ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={cn(
                      "text-xs font-medium",
                      isActive && "text-primary",
                      !isActive && "text-muted-foreground"
                    )}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < importSteps.length - 1 && (
                  <div
                    className={cn(
                      "h-[2px] w-full mx-2",
                      index < currentStep ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="min-h-[400px]">{renderStepContent()}</div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0 || isProcessing}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          {currentStep < importSteps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep(Math.min(importSteps.length - 1, currentStep + 1))}
              disabled={
                (currentStep === 0 && !file) ||
                (currentStep === 1 && parsedData.length === 0)
              }
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleStartImport}
              disabled={isProcessing || importStatus === "complete"}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : importStatus === "complete" ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Complete
                </>
              ) : (
                <>
                  Start Import
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Bulk Actions Bar
interface BulkActionsBarProps {
  selectedCount: number;
  totalCount: number;
  onAction: (action: string) => void;
  className?: string;
}

export function BulkActionsBar({
  selectedCount,
  totalCount,
  onAction,
  className,
}: BulkActionsBarProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const handleAction = (action: string) => {
    if (action === "delete") {
      setPendingAction(action);
      setShowConfirmDialog(true);
    } else {
      onAction(action);
    }
  };

  const confirmAction = () => {
    if (pendingAction) {
      onAction(pendingAction);
    }
    setShowConfirmDialog(false);
    setPendingAction(null);
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <Card className={cn("animate-in slide-in-from-bottom-2", className)}>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="gap-1">
              <Check className="h-3 w-3" />
              {selectedCount} selected
            </Badge>
            <span className="text-sm text-muted-foreground">
              of {totalCount} total leads
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAction("export")}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAction("assign")}
            >
              Assign
            </Button>
            <Select onValueChange={(value) => handleAction(`status:${value}`)}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
            <Separator orientation="vertical" className="h-6" />
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleAction("delete")}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCount} lead{selectedCount > 1 ? "s" : ""}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmAction}>
              Delete {selectedCount} Lead{selectedCount > 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}