/**
 * Translation Completion Validator
 *
 * This utility helps ensure all text in the application is properly internationalized
 * and provides tools for validating translation completeness.
 */

import { getDictionary } from '@/components/local/dictionaries'
import type { Locale } from '@/components/local/config'

// Common English words that might indicate untranslated content
const ENGLISH_INDICATORS = [
  'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'from', 'about', 'into', 'through', 'during', 'before', 'after', 'above',
  'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further',
  'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all',
  'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  'can', 'will', 'just', 'should', 'now'
]

// Common UI text patterns that should be translated
const UI_TEXT_PATTERNS = [
  /^[A-Z][a-z]+\s[A-Z][a-z]+$/, // "Save Changes"
  /^[A-Z][a-z]+$/, // "Save"
  /^[A-Z][a-z]+\s[a-z]+$/, // "Create account"
  /^\d+\s[a-z]+\s[a-z]+$/, // "2 items selected"
  /^[A-Z][a-z]+\s\d+$/, // "Page 1"
  /^[A-Z][a-z]+:$/, // "Email:"
  /^\w+@\w+\.\w+$/, // Email format - skip
  /^\d+$/, // Numbers only - skip
  /^https?:\/\//, // URLs - skip
]

interface TranslationIssue {
  type: 'missing_key' | 'untranslated_text' | 'inconsistent_fallback' | 'hardcoded_text'
  path: string
  text: string
  line?: number
  column?: number
  suggestion?: string
}

interface ValidationResult {
  issues: TranslationIssue[]
  score: number
  totalKeys: number
  translatedKeys: number
  coverage: number
}

/**
 * Validate translation completeness for a given locale
 */
export async function validateTranslations(locale: Locale): Promise<ValidationResult> {
  const dictionary = await getDictionary(locale)
  const issues: TranslationIssue[] = []

  // Count all translation keys recursively
  const { totalKeys, translatedKeys } = countTranslationKeys(dictionary)

  // Check for missing or incomplete translations
  checkMissingTranslations(dictionary, '', issues)

  // Calculate coverage and score
  const coverage = (translatedKeys / totalKeys) * 100
  const score = Math.max(0, 100 - (issues.length * 2) - (100 - coverage))

  return {
    issues,
    score,
    totalKeys,
    translatedKeys,
    coverage
  }
}

/**
 * Count translation keys recursively
 */
function countTranslationKeys(obj: any, path: string = ''): { totalKeys: number; translatedKeys: number } {
  let totalKeys = 0
  let translatedKeys = 0

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key

    if (typeof value === 'string') {
      totalKeys++
      if (value.trim() && !isPlaceholderText(value)) {
        translatedKeys++
      }
    } else if (typeof value === 'object' && value !== null) {
      const nested = countTranslationKeys(value, currentPath)
      totalKeys += nested.totalKeys
      translatedKeys += nested.translatedKeys
    }
  }

  return { totalKeys, translatedKeys }
}

/**
 * Check for missing or incomplete translations
 */
function checkMissingTranslations(obj: any, path: string, issues: TranslationIssue[]): void {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key

    if (typeof value === 'string') {
      if (!value.trim()) {
        issues.push({
          type: 'missing_key',
          path: currentPath,
          text: value,
          suggestion: 'Provide translation for this key'
        })
      } else if (isPlaceholderText(value)) {
        issues.push({
          type: 'untranslated_text',
          path: currentPath,
          text: value,
          suggestion: 'Replace placeholder with actual translation'
        })
      } else if (isLikelyUntranslated(value)) {
        issues.push({
          type: 'untranslated_text',
          path: currentPath,
          text: value,
          suggestion: 'This text appears to be in English, please translate'
        })
      }
    } else if (typeof value === 'object' && value !== null) {
      checkMissingTranslations(value, currentPath, issues)
    }
  }
}

/**
 * Check if text is likely a placeholder
 */
function isPlaceholderText(text: string): boolean {
  const lowerText = text.toLowerCase()
  return (
    lowerText.includes('todo') ||
    lowerText.includes('placeholder') ||
    lowerText.includes('lorem ipsum') ||
    lowerText === 'text here' ||
    lowerText === 'coming soon' ||
    lowerText === 'tbd' ||
    lowerText === 'n/a'
  )
}

/**
 * Check if text is likely untranslated English
 */
function isLikelyUntranslated(text: string): boolean {
  const words = text.toLowerCase().split(/\s+/)
  const englishWordCount = words.filter(word =>
    ENGLISH_INDICATORS.includes(word) ||
    /^[a-z]+ing$/.test(word) || // -ing endings
    /^[a-z]+ed$/.test(word) ||  // -ed endings
    /^[a-z]+er$/.test(word) ||  // -er endings
    /^[a-z]+est$/.test(word)    // -est endings
  ).length

  // If more than 30% of words are common English words, likely untranslated
  return words.length > 2 && (englishWordCount / words.length) > 0.3
}

/**
 * Scan source code for hardcoded strings that should be translated
 */
export function scanForHardcodedStrings(sourceCode: string, filePath: string): TranslationIssue[] {
  const issues: TranslationIssue[] = []
  const lines = sourceCode.split('\n')

  lines.forEach((line, lineIndex) => {
    // Look for hardcoded strings in JSX/TSX
    const jsxStringMatches = line.matchAll(/(?:>|\s+)([A-Z][a-zA-Z\s]{3,})(?:<|$)/g)
    for (const match of jsxStringMatches) {
      const text = match[1].trim()
      if (shouldBeTranslated(text)) {
        issues.push({
          type: 'hardcoded_text',
          path: filePath,
          text,
          line: lineIndex + 1,
          column: match.index,
          suggestion: `Replace "${text}" with translation key`
        })
      }
    }

    // Look for hardcoded strings in attributes
    const attrStringMatches = line.matchAll(/(?:placeholder|title|aria-label)=["']([A-Z][a-zA-Z\s]{3,})["']/g)
    for (const match of attrStringMatches) {
      const text = match[1].trim()
      if (shouldBeTranslated(text)) {
        issues.push({
          type: 'hardcoded_text',
          path: filePath,
          text,
          line: lineIndex + 1,
          column: match.index,
          suggestion: `Replace "${text}" with translation key`
        })
      }
    }
  })

  return issues
}

/**
 * Check if text should be translated
 */
function shouldBeTranslated(text: string): boolean {
  // Skip if it's too short
  if (text.length < 3) return false

  // Skip if it's all numbers or symbols
  if (!/[a-zA-Z]/.test(text)) return false

  // Skip if it's a URL or email
  if (/^https?:\/\//.test(text) || /\w+@\w+\.\w+/.test(text)) return false

  // Skip if it's a file path
  if (/[/\\]/.test(text)) return false

  // Skip if it's code-like
  if (/[{}()\[\]<>]/.test(text)) return false

  // Check against UI text patterns
  return UI_TEXT_PATTERNS.some(pattern => pattern.test(text))
}

/**
 * Generate translation report
 */
export function generateTranslationReport(results: Record<Locale, ValidationResult>): string {
  let report = '# Translation Report\n\n'

  for (const [locale, result] of Object.entries(results)) {
    report += `## ${locale.toUpperCase()} Translation Status\n\n`
    report += `- **Coverage**: ${result.coverage.toFixed(1)}%\n`
    report += `- **Score**: ${result.score.toFixed(1)}/100\n`
    report += `- **Total Keys**: ${result.totalKeys}\n`
    report += `- **Translated Keys**: ${result.translatedKeys}\n`
    report += `- **Issues Found**: ${result.issues.length}\n\n`

    if (result.issues.length > 0) {
      report += `### Issues\n\n`

      const groupedIssues = result.issues.reduce((acc, issue) => {
        if (!acc[issue.type]) acc[issue.type] = []
        acc[issue.type].push(issue)
        return acc
      }, {} as Record<string, TranslationIssue[]>)

      for (const [type, issues] of Object.entries(groupedIssues)) {
        report += `#### ${type.replace(/_/g, ' ').toUpperCase()}\n\n`
        issues.forEach(issue => {
          report += `- **${issue.path}**: ${issue.text}\n`
          if (issue.suggestion) {
            report += `  - *Suggestion: ${issue.suggestion}*\n`
          }
          if (issue.line) {
            report += `  - *Line: ${issue.line}*\n`
          }
        })
        report += '\n'
      }
    }

    report += '---\n\n'
  }

  return report
}

/**
 * Get translation completeness for all locales
 */
export async function getTranslationCompleteness(): Promise<Record<Locale, ValidationResult>> {
  const locales: Locale[] = ['en', 'ar']
  const results: Record<Locale, ValidationResult> = {} as any

  for (const locale of locales) {
    results[locale] = await validateTranslations(locale)
  }

  return results
}

/**
 * Utility to check if a component is properly internationalized
 */
export function validateComponentInternationalization(componentCode: string, componentName: string): TranslationIssue[] {
  const issues: TranslationIssue[] = []

  // Check if component accepts dictionary props
  if (!componentCode.includes('dictionary')) {
    issues.push({
      type: 'missing_key',
      path: componentName,
      text: 'Component missing dictionary props',
      suggestion: 'Add dictionary props to component interface'
    })
  }

  // Check for hardcoded strings
  const hardcodedIssues = scanForHardcodedStrings(componentCode, componentName)
  issues.push(...hardcodedIssues)

  // Check for RTL support
  if (!componentCode.includes('rtl:') && !componentCode.includes('dir=')) {
    issues.push({
      type: 'missing_key',
      path: componentName,
      text: 'Component missing RTL support',
      suggestion: 'Add RTL classes or dir attribute'
    })
  }

  return issues
}

/**
 * Export types for external use
 */
export type { TranslationIssue, ValidationResult }