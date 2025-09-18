/**
 * Arabic Typography and Localization Utilities
 *
 * This utility provides comprehensive Arabic language support including:
 * - Arabic numeral conversion
 * - Currency formatting
 * - Date/time formatting
 * - Text direction handling
 * - Typography optimizations
 */

// Arabic-Indic numerals mapping
const ARABIC_NUMERALS: Record<string, string> = {
  '0': '٠',
  '1': '١',
  '2': '٢',
  '3': '٣',
  '4': '٤',
  '5': '٥',
  '6': '٦',
  '7': '٧',
  '8': '٨',
  '9': '٩'
}

/**
 * Convert English numerals to Arabic-Indic numerals
 */
export function toArabicNumerals(text: string): string {
  return text.replace(/[0-9]/g, (digit) => ARABIC_NUMERALS[digit] || digit)
}

/**
 * Convert Arabic-Indic numerals to English numerals
 */
export function toEnglishNumerals(text: string): string {
  const reverseMap = Object.fromEntries(
    Object.entries(ARABIC_NUMERALS).map(([eng, ar]) => [ar, eng])
  )
  return text.replace(/[٠-٩]/g, (digit) => reverseMap[digit] || digit)
}

/**
 * Format currency for Arabic locale
 */
export function formatArabicCurrency(amount: number): string {
  const formattedAmount = new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 2
  }).format(amount)

  return toArabicNumerals(formattedAmount)
}

/**
 * Format numbers for Arabic locale with thousands separators
 */
export function formatArabicNumber(num: number): string {
  const formatted = new Intl.NumberFormat('ar-SA').format(num)
  return toArabicNumerals(formatted)
}

/**
 * Format percentage for Arabic locale
 */
export function formatArabicPercentage(value: number, decimals: number = 1): string {
  const formatted = new Intl.NumberFormat('ar-SA', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100)

  return toArabicNumerals(formatted)
}

/**
 * Format date for Arabic locale
 */
export function formatArabicDate(date: Date): string {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

/**
 * Format relative time for Arabic locale (e.g., "منذ يومين")
 */
export function formatArabicRelativeTime(date: Date): string {
  const rtf = new Intl.RelativeTimeFormat('ar-SA', { numeric: 'auto' })
  const diffInSeconds = (date.getTime() - Date.now()) / 1000

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2628000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ] as const

  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds)
    if (count >= 1) {
      return rtf.format(diffInSeconds < 0 ? -count : count, interval.label)
    }
  }

  return rtf.format(0, 'second')
}

/**
 * Get text direction based on content
 */
export function getTextDirection(text: string): 'ltr' | 'rtl' {
  // Arabic Unicode range: U+0600 to U+06FF
  const arabicRegex = /[\u0600-\u06FF]/
  return arabicRegex.test(text) ? 'rtl' : 'ltr'
}

/**
 * Get CSS classes for RTL support
 */
export function getRTLClasses(isRTL: boolean): string {
  if (!isRTL) return ''

  return [
    'rtl:text-right',
    'rtl:space-x-reverse',
    'rtl:ml-auto',
    'rtl:mr-0'
  ].join(' ')
}

/**
 * Arabic typography CSS custom properties
 */
export const ARABIC_TYPOGRAPHY_VARS = {
  '--font-arabic': '"Noto Sans Arabic", "Amiri", "Scheherazade New", sans-serif',
  '--font-arabic-display': '"Amiri", "Scheherazade New", serif',
  '--line-height-arabic': '1.8',
  '--letter-spacing-arabic': '0.02em'
} as const

/**
 * Apply Arabic typography to an element
 */
export function applyArabicTypography(element: HTMLElement): void {
  Object.entries(ARABIC_TYPOGRAPHY_VARS).forEach(([property, value]) => {
    element.style.setProperty(property, value)
  })

  element.style.fontFamily = 'var(--font-arabic)'
  element.style.lineHeight = 'var(--line-height-arabic)'
  element.style.letterSpacing = 'var(--letter-spacing-arabic)'
  element.dir = 'rtl'
}

/**
 * Utility for pluralization in Arabic
 */
export function arabicPlural(count: number, singular: string, dual: string, plural: string): string {
  if (count === 1) return singular
  if (count === 2) return dual
  return plural
}

/**
 * Format Arabic file sizes
 */
export function formatArabicFileSize(bytes: number): string {
  const units = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت', 'تيرابايت']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  const formattedSize = unitIndex === 0
    ? formatArabicNumber(size)
    : toArabicNumerals(size.toFixed(1))

  return `${formattedSize} ${units[unitIndex]}`
}

/**
 * Escape Arabic text for safe HTML rendering
 */
export function escapeArabicHTML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Helper to check if locale is Arabic
 */
export function isArabicLocale(locale: string): boolean {
  return locale.startsWith('ar')
}

/**
 * Get locale-aware formatting functions
 */
export function getLocaleFormatters(locale: string) {
  const isArabic = isArabicLocale(locale)

  return {
    formatNumber: isArabic ? formatArabicNumber : (num: number) => num.toLocaleString('en-US'),
    formatCurrency: isArabic ? formatArabicCurrency : (amount: number) => `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    formatPercentage: isArabic ? formatArabicPercentage : (value: number) => `${value.toFixed(1)}%`,
    formatDate: isArabic ? formatArabicDate : (date: Date) => date.toLocaleDateString('en-US'),
    formatRelativeTime: isArabic ? formatArabicRelativeTime : (date: Date) => new Intl.RelativeTimeFormat('en-US').format(Math.floor((date.getTime() - Date.now()) / 86400000), 'day'),
    isRTL: isArabic,
    textDirection: isArabic ? 'rtl' as const : 'ltr' as const
  }
}