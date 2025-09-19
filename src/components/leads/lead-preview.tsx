"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowUpDown,
  Database,
  FileSpreadsheet,
  Hash,
  AtSign,
  Phone,
  User,
  Building,
  MapPin,
  Calendar,
  Tag,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldMapping {
  sourceField: string;
  targetField: string;
  fieldType: "text" | "email" | "phone" | "date" | "number" | "boolean";
  isRequired: boolean;
  validation: "valid" | "warning" | "error";
  validationMessage?: string;
}

interface ExtractedData {
  headers?: string[];
  rows: any[][];
  detectedType: "csv" | "tsv" | "json" | "custom";
  totalRows: number;
  validRows: number;
  invalidRows: number;
  fieldMappings: FieldMapping[];
}

interface LeadExtractionPreviewProps {
  data: ExtractedData;
  onMappingChange?: (mappings: FieldMapping[]) => void;
  onConfirm?: () => void;
  className?: string;
}

const fieldIcons = {
  text: Hash,
  email: AtSign,
  phone: Phone,
  name: User,
  company: Building,
  address: MapPin,
  date: Calendar,
  tag: Tag
};

const fieldTypeOptions = [
  { value: "text", label: "Text", icon: Hash },
  { value: "email", label: "Email", icon: AtSign },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "date", label: "Date", icon: Calendar },
  { value: "number", label: "Number", icon: Hash }
];

const targetFieldOptions = [
  { value: "firstName", label: "First Name", required: false },
  { value: "lastName", label: "Last Name", required: false },
  { value: "fullName", label: "Full Name", required: true },
  { value: "email", label: "Email", required: true },
  { value: "phone", label: "Phone", required: false },
  { value: "company", label: "Company", required: false },
  { value: "jobTitle", label: "Job Title", required: false },
  { value: "address", label: "Address", required: false },
  { value: "city", label: "City", required: false },
  { value: "state", label: "State", required: false },
  { value: "country", label: "Country", required: false },
  { value: "postalCode", label: "Postal Code", required: false },
  { value: "source", label: "Lead Source", required: false },
  { value: "status", label: "Status", required: false },
  { value: "notes", label: "Notes", required: false },
  { value: "skip", label: "Skip Field", required: false }
];

export function LeadExtractionPreview({
  data,
  onMappingChange,
  onConfirm,
  className
}: LeadExtractionPreviewProps) {
  const getValidationIcon = (validation: string) => {
    switch (validation) {
      case "valid":
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return null;
    }
  };

  const getValidationBadgeVariant = (validation: string) => {
    switch (validation) {
      case "valid":
        return "default" as const;
      case "warning":
        return "secondary" as const;
      case "error":
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  };

  const stats = [
    {
      label: "Total Rows",
      value: data.totalRows,
      icon: Database,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      label: "Valid",
      value: data.validRows,
      icon: CheckCircle2,
      color: "text-green-600 dark:text-green-400"
    },
    {
      label: "Invalid",
      value: data.invalidRows,
      icon: XCircle,
      color: "text-red-600 dark:text-red-400"
    },
    {
      label: "Success Rate",
      value: `${Math.round((data.validRows / data.totalRows) * 100)}%`,
      icon: ArrowUpDown,
      color: "text-primary"
    }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Statistics Overview */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center p-4">
                <Icon className={cn("mr-3 h-8 w-8", stat.color)} />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Field Mapping and Preview Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Data Preview & Mapping</CardTitle>
              <CardDescription>
                Review detected fields and configure mapping to your lead database
              </CardDescription>
            </div>
            <Badge variant="outline">
              <FileSpreadsheet className="mr-1 h-3 w-3" />
              {data.detectedType.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="mapping" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
              <TabsTrigger value="preview">Data Preview</TabsTrigger>
            </TabsList>

            {/* Field Mapping Tab */}
            <TabsContent value="mapping" className="space-y-4">
              <ScrollArea className="h-[400px] w-full">
                <div className="space-y-3 pr-4">
                  {data.fieldMappings.map((mapping, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {/* Source Field */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Source Field</label>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="gap-1">
                              <Database className="h-3 w-3" />
                              {mapping.sourceField}
                            </Badge>
                            {getValidationIcon(mapping.validation)}
                          </div>
                          {mapping.validationMessage && (
                            <p className="text-xs text-muted-foreground">
                              {mapping.validationMessage}
                            </p>
                          )}
                        </div>

                        {/* Target Field */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Map To
                            {mapping.isRequired && (
                              <span className="ml-1 text-red-500">*</span>
                            )}
                          </label>
                          <Select defaultValue={mapping.targetField}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {targetFieldOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex items-center gap-2">
                                    {option.label}
                                    {option.required && (
                                      <Badge variant="outline" className="ml-auto text-xs">
                                        Required
                                      </Badge>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Field Type */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Field Type</label>
                          <Select defaultValue={mapping.fieldType}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fieldTypeOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div className="flex items-center gap-2">
                                      <Icon className="h-4 w-4" />
                                      {option.label}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>

              {/* Mapping Summary */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center gap-4 text-sm">
                    <span>{data.fieldMappings.length} fields detected</span>
                    <span className="text-muted-foreground">•</span>
                    <span>
                      {data.fieldMappings.filter(m => m.validation === "valid").length} valid
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span>
                      {data.fieldMappings.filter(m => m.isRequired).length} required
                    </span>
                  </div>
                </AlertDescription>
              </Alert>
            </TabsContent>

            {/* Data Preview Tab */}
            <TabsContent value="preview">
              <ScrollArea className="h-[400px] w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      {data.headers?.map((header, index) => (
                        <TableHead key={index}>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1">
                                  <span>{header}</span>
                                  <Badge
                                    variant={getValidationBadgeVariant(
                                      data.fieldMappings[index]?.validation || "outline"
                                    )}
                                    className="ml-1 h-4 px-1 text-xs"
                                  >
                                    {data.fieldMappings[index]?.fieldType || "text"}
                                  </Badge>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Maps to: {data.fieldMappings[index]?.targetField || "Unmapped"}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableHead>
                      )) ||
                      // If no headers, generate column headers
                      data.rows[0]?.map((_, index) => (
                        <TableHead key={index}>Column {index + 1}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.rows.slice(0, 10).map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        <TableCell className="font-medium">{rowIndex + 1}</TableCell>
                        {row.map((cell, cellIndex) => (
                          <TableCell key={cellIndex}>
                            <span className="max-w-[200px] truncate font-mono text-sm">
                              {cell || <span className="text-muted-foreground">—</span>}
                            </span>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {data.rows.length > 10 && (
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Showing 10 of {data.rows.length} rows
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button onClick={onConfirm} disabled={data.validRows === 0}>
          Confirm & Import {data.validRows} Leads
        </Button>
      </div>
    </div>
  );
}