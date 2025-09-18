"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { getDictionary } from "@/components/internationalization/dictionaries"
import {
  formatArabicCurrency,
  formatArabicNumber,
  formatArabicPercentage,
  formatArabicDate,
  formatArabicRelativeTime,
  toArabicNumerals,
  getLocaleFormatters,
  isArabicLocale
} from "@/lib/arabic-utils"

interface InternationalDemoProps {
  dictionary?: Awaited<ReturnType<typeof getDictionary>>
  locale?: string
}

export function InternationalDemo({ dictionary, locale = 'en' }: InternationalDemoProps) {
  const isArabic = isArabicLocale(locale)
  const formatters = getLocaleFormatters(locale)
  const currentDate = new Date()
  const pastDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago

  // Sample data for demonstration
  const sampleData = {
    revenue: 15231.89,
    growth: 20.1,
    users: 2350,
    conversion: 3.2,
    items: 127
  }

  return (
    <div className={`space-y-6 ${isArabic ? 'text-right font-arabic' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {isArabic ? 'عرض الدولية والترجمة' : 'Internationalization Demo'}
            </span>
            <Badge variant={isArabic ? 'default' : 'secondary'}>
              {locale.toUpperCase()}
            </Badge>
          </CardTitle>
          <CardDescription>
            {isArabic
              ? 'عرض شامل لميزات الترجمة ودعم اللغة العربية'
              : 'Comprehensive showcase of translation and Arabic language support'
            }
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Number Formatting */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isArabic ? 'تنسيق الأرقام' : 'Number Formatting'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {isArabic ? 'رقم عادي:' : 'Regular Number:'}
              </p>
              <p className="font-mono text-lg">
                {formatters.formatNumber(sampleData.items)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {isArabic ? 'رقم كبير:' : 'Large Number:'}
              </p>
              <p className="font-mono text-lg">
                {formatters.formatNumber(sampleData.users)}
              </p>
            </div>
            {isArabic && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">الأرقام العربية:</p>
                <p className="font-mono text-lg arabic-numerals">
                  {toArabicNumerals(sampleData.items.toString())}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Currency Formatting */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isArabic ? 'تنسيق العملة' : 'Currency Formatting'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {isArabic ? 'إجمالي الإيرادات:' : 'Total Revenue:'}
              </p>
              <p className="font-mono text-xl font-bold text-green-600">
                {formatters.formatCurrency(sampleData.revenue)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {isArabic ? 'النمو:' : 'Growth:'}
              </p>
              <p className="font-mono text-lg text-blue-600">
                +{formatters.formatPercentage(sampleData.growth)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Date Formatting */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isArabic ? 'تنسيق التاريخ' : 'Date Formatting'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {isArabic ? 'اليوم:' : 'Today:'}
              </p>
              <p className="text-sm">
                {formatters.formatDate(currentDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {isArabic ? 'منذ يومين:' : 'Two days ago:'}
              </p>
              <p className="text-sm">
                {formatters.formatRelativeTime(pastDate)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Typography Showcase */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>
              {isArabic ? 'عرض الخطوط والتيبوغرافي' : 'Typography Showcase'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h1 className="mb-2">
                  {isArabic ? 'عنوان رئيسي' : 'Main Heading'}
                </h1>
                <h2 className="mb-2">
                  {isArabic ? 'عنوان فرعي' : 'Sub Heading'}
                </h2>
                <h3 className="mb-2">
                  {isArabic ? 'عنوان صغير' : 'Small Heading'}
                </h3>
                <p className="mb-2">
                  {isArabic
                    ? 'هذا نص عادي يُظهر كيف تبدو الفقرات باللغة العربية مع الدعم الكامل للاتجاه من اليمين إلى اليسار.'
                    : 'This is regular paragraph text showing how content appears with proper typography and spacing.'
                  }
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-md">
                  <code className="text-sm">
                    {isArabic ? 'كود مع أرقام: ' : 'Code with numbers: '}
                    {isArabic ? toArabicNumerals('123456') : '123456'}
                  </code>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="default">
                    {isArabic ? 'شارة' : 'Badge'}
                  </Badge>
                  <Badge variant="secondary">
                    {isArabic ? 'ثانوية' : 'Secondary'}
                  </Badge>
                  <Badge variant="outline">
                    {isArabic ? 'حدود' : 'Outline'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RTL Layout Demo */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>
              {isArabic ? 'عرض التخطيط RTL' : 'RTL Layout Demo'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {/* Flex Direction Demo */}
              <div className="space-y-2">
                <h4 className="font-medium">
                  {isArabic ? 'ترتيب العناصر' : 'Element Order'}
                </h4>
                <div className={`flex gap-2 ${isArabic ? 'rtl:flex-row-reverse' : ''}`}>
                  <Button size="sm" variant="outline">1</Button>
                  <Button size="sm" variant="outline">2</Button>
                  <Button size="sm" variant="outline">3</Button>
                </div>
              </div>

              {/* Spacing Demo */}
              <div className="space-y-2">
                <h4 className="font-medium">
                  {isArabic ? 'المسافات' : 'Spacing'}
                </h4>
                <div className={`flex gap-2 ${isArabic ? 'rtl:space-x-reverse' : ''}`}>
                  <div className="w-8 h-8 bg-primary rounded"></div>
                  <div className="w-8 h-8 bg-secondary rounded"></div>
                  <div className="w-8 h-8 bg-accent rounded"></div>
                </div>
              </div>

              {/* Alignment Demo */}
              <div className="space-y-2">
                <h4 className="font-medium">
                  {isArabic ? 'المحاذاة' : 'Alignment'}
                </h4>
                <div className="space-y-1">
                  <div className={`p-2 bg-muted rounded text-sm ${isArabic ? 'text-right' : 'text-left'}`}>
                    {isArabic ? 'نص محاذاة طبيعية' : 'Natural alignment'}
                  </div>
                  <div className="p-2 bg-muted rounded text-sm text-center">
                    {isArabic ? 'نص وسط' : 'Center text'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Demo */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>
              {isArabic ? 'عرض تفاعلي' : 'Interactive Demo'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-medium">
                  {isArabic ? 'أزرار وعناصر تحكم' : 'Buttons & Controls'}
                </h4>
                <div className={`flex gap-2 flex-wrap ${isArabic ? 'rtl:space-x-reverse' : ''}`}>
                  <Button>
                    {isArabic ? 'حفظ' : 'Save'}
                  </Button>
                  <Button variant="outline">
                    {isArabic ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button variant="ghost">
                    {isArabic ? 'مساعدة' : 'Help'}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">
                  {isArabic ? 'حالة التطبيق' : 'Application Status'}
                </h4>
                <div className="space-y-2">
                  <div className={`flex items-center justify-between p-2 bg-muted rounded ${isArabic ? 'rtl:flex-row-reverse' : ''}`}>
                    <span className="text-sm">
                      {isArabic ? 'اللغة:' : 'Language:'}
                    </span>
                    <Badge>{locale}</Badge>
                  </div>
                  <div className={`flex items-center justify-between p-2 bg-muted rounded ${isArabic ? 'rtl:flex-row-reverse' : ''}`}>
                    <span className="text-sm">
                      {isArabic ? 'الاتجاه:' : 'Direction:'}
                    </span>
                    <Badge variant="outline">{formatters.textDirection.toUpperCase()}</Badge>
                  </div>
                  <div className={`flex items-center justify-between p-2 bg-muted rounded ${isArabic ? 'rtl:flex-row-reverse' : ''}`}>
                    <span className="text-sm">
                      {isArabic ? 'الخط:' : 'Font:'}
                    </span>
                    <Badge variant="secondary">
                      {isArabic ? 'نوتو العربية' : 'Geist Sans'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        {isArabic
          ? '🌍 مثال شامل على دعم العربية والدولية'
          : '🌍 Comprehensive Arabic & Internationalization Support Demo'
        }
      </div>
    </div>
  )
}