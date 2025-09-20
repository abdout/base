"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Monitor, Smartphone, Tablet, Code2, Eye, Copy, Check, Download, ExternalLink } from "lucide-react";
import { getTemplateConfig, type TemplateKey } from "./registry";
import { cn } from "@/lib/utils";
import type { getDictionary } from "@/components/local/dictionaries";
import type { Locale } from "@/components/local/config";

interface TemplatePreviewProps {
  template: TemplateKey;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: Locale;
}

type ViewMode = "preview" | "code";
type DeviceMode = "desktop" | "tablet" | "mobile";

export default function TemplatePreview({ template, dictionary, lang }: TemplatePreviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const config = getTemplateConfig(template);
  if (!config) return null;

  const TemplateComponent = config.component;

  const deviceSizes = {
    desktop: "w-full",
    tablet: "max-w-3xl",
    mobile: "max-w-sm",
  };

  const handleCopy = async () => {
    // In real implementation, this would copy the template code
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    // In real implementation, this would download the template files
    console.log("Downloading template:", template);
  };

  return (
    <div className="layout-container min-h-screen space-y-6 py-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{config.name}</h1>
        <p className="text-muted-foreground">{config.description}</p>
      </div>

      {/* Control Bar */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* View Mode Tabs */}
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
            <TabsList>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="gap-2">
                <Code2 className="h-4 w-4" />
                Code
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap items-center gap-2">
            {/* Device Mode (Preview only) */}
            {viewMode === "preview" && (
              <div className="flex gap-1 rounded-md border p-1">
                <Button
                  variant={deviceMode === "desktop" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setDeviceMode("desktop")}
                  aria-label="Desktop view"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={deviceMode === "tablet" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setDeviceMode("tablet")}
                  aria-label="Tablet view"
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={deviceMode === "mobile" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setDeviceMode("mobile")}
                  aria-label="Mobile view"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Theme Selector */}
            <Select value={theme} onValueChange={(v) => setTheme(v as "light" | "dark")}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>

            {/* Action Buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Use Template
            </Button>
          </div>
        </div>
      </Card>

      {/* Preview/Code Area */}
      <div className="relative">
        {viewMode === "preview" ? (
          <div className="rounded-lg border bg-background">
            <div
              className={cn(
                "mx-auto transition-all duration-300",
                deviceSizes[deviceMode]
              )}
            >
              <div className={cn("min-h-[600px]", theme === "dark" && "dark")}>
                <Suspense
                  fallback={
                    <div className="flex h-[600px] items-center justify-center">
                      <div className="text-center">
                        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        <p className="text-sm text-muted-foreground">Loading template...</p>
                      </div>
                    </div>
                  }
                >
                  <TemplateComponent dictionary={dictionary} lang={lang} />
                </Suspense>
              </div>
            </div>
          </div>
        ) : (
          <Card className="p-6">
            <pre className="overflow-x-auto">
              <code className="text-sm">
                {`// Template: ${config.name}
// Runtime: ${config.runtime || "edge"}
// Category: ${config.category}

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ${config.name.replace(/\s+/g, "")}() {
  return (
    <div className="container mx-auto p-6">
      {/* Template implementation */}
    </div>
  )
}`}
              </code>
            </pre>
          </Card>
        )}
      </div>

      {/* Dependencies Info */}
      {config.dependencies && config.dependencies.length > 0 && (
        <Card className="p-4">
          <h3 className="mb-2 font-semibold">Dependencies</h3>
          <div className="flex flex-wrap gap-2">
            {config.dependencies.map((dep) => (
              <code
                key={dep}
                className="rounded bg-muted px-2 py-1 text-xs"
              >
                {dep}
              </code>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}