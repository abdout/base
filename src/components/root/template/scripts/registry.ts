import { z } from "zod"

export interface Registry {
  name: string
  homepage: string
  items: RegistryItem[]
}

export interface RegistryItem {
  name: string
  description?: string
  dependencies?: string[]
  registryDependencies?: string[]
  files?: (string | { path: string; type?: string; target?: string })[]
  type: z.infer<typeof registryItemTypeSchema>
  categories?: string[]
  meta?: Record<string, any>
  tailwind?: {
    config?: {
      theme?: Record<string, any>
      plugins?: string[]
    }
  }
  cssVars?: Record<string, Record<string, string>>
}

export const registryItemTypeSchema = z.enum([
  "registry:ui",
  "registry:lib",
  "registry:hook",
  "registry:theme",
  "registry:template",
  "registry:example",
  "registry:internal",
])

export const registryItemSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  dependencies: z.array(z.string()).default([]),
  registryDependencies: z.array(z.string()).default([]),
  files: z
    .array(
      z.object({
        path: z.string(),
        type: z.string().optional(),
        content: z.string().optional(),
        target: z.string().optional(),
      })
    )
    .optional(),
  type: registryItemTypeSchema,
  categories: z.array(z.string()).optional(),
  meta: z.record(z.any()).optional(),
  style: z
    .object({
      boxShadow: z.string().optional(),
      border: z.string().optional(),
      borderRadius: z.string().optional(),
    })
    .optional(),
  tailwind: z
    .object({
      config: z
        .object({
          theme: z.record(z.any()).optional(),
          plugins: z.array(z.string()).optional(),
        })
        .optional(),
    })
    .optional(),
  cssVars: z.record(z.record(z.string())).optional(),
})

export const registrySchema = z.object({
  name: z.string(),
  homepage: z.string(),
  items: z.array(registryItemSchema),
})
