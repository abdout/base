# CLAUDE.md - Codebase Guide for Claude Code

This document serves as a guide for Claude Code instances working with this Next.js 15 application codebase.

## Project Overview
A Next.js 15 application with authentication, internationalization, and a comprehensive documentation system. The project uses the App Router, Edge Runtime compatibility, and modern React patterns.

## Tech Stack
- **Framework**: Next.js 15.5.3 with App Router and Turbopack
- **Runtime**: React 19.1.0, supports both Edge and Node.js runtime
- **Database**: PostgreSQL with Prisma ORM 6.16.2
- **Authentication**: NextAuth v5 (beta) with Prisma adapter
- **Styling**: Tailwind CSS v4 with custom design system
- **UI Components**: Radix UI primitives + custom shadcn/ui components
- **Internationalization**: Custom i18n with Arabic (RTL) support
- **Documentation**: MDX with custom components
- **AI Integration**: Vercel AI SDK with Groq provider

## Available Commands
```bash
pnpm dev          # Development server with Turbopack
pnpm build        # Production build (--no-lint flag set)
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## Project Structure
```
src/
├── app/[lang]/                 # Internationalized routes
│   ├── (root)/                 # Public landing pages
│   ├── (auth)/                 # Authentication pages
│   ├── (expose)/               # Mixed access pages
│   │   ├── (protected)/        # Auth-required pages
│   │   └── (public)/           # Public pages
│   ├── docs/                   # Documentation system
│   └── globals.css             # Global styles + Tailwind
├── components/
│   ├── atom/                   # Atomic design components
│   ├── auth/                   # Authentication components
│   ├── chatbot/                # AI chatbot system
│   ├── docs/                   # Documentation components
│   ├── internationalization/  # i18n dictionaries & config
│   ├── root/                   # Landing page components
│   ├── table/                  # Data table components
│   ├── template/               # Layout templates
│   │   ├── header-01/          # Main navigation header
│   │   └── sidebar-01/         # Documentation sidebar
│   └── ui/                     # shadcn/ui components
├── hooks/                      # Custom React hooks
├── lib/                        # Utility functions
├── styles/                     # Additional CSS modules
│   ├── container.css           # Responsive container system
│   ├── typography.css          # Typography styles
│   └── scrollbar.css           # Custom scrollbar
├── auth.ts                     # NextAuth configuration
├── auth.config.ts              # Auth providers config
├── middleware.ts               # Auth & i18n middleware
└── routes.ts                   # Route definitions
```

## Key Architectural Decisions

### 1. Runtime Strategy
- Pages use `export const runtime = "nodejs"` when requiring Prisma/bcrypt
- Edge-compatible pages can use Edge runtime for better performance
- Middleware forced to Node.js runtime for auth operations

### 2. Internationalization
- Supported locales: English (en), Arabic (ar)
- RTL support for Arabic
- URL structure: `/[lang]/path`
- Dictionaries in `src/components/internationalization/`

### 3. Authentication Flow
- Email/password with verification
- OAuth providers (Google, GitHub)
- Two-factor authentication support
- Role-based access (USER, ADMIN)
- Protected routes via middleware

### 4. Styling System
- Tailwind CSS v4 with CSS variables
- OKLCH color format for better color manipulation
- Custom container system with responsive padding
- Theme switching (light/dark) via next-themes
- Custom design tokens in globals.css

### 5. Component Architecture
- Atomic design pattern (atom/molecule/organism)
- Radix UI for accessible primitives
- Custom shadcn/ui component library
- Consistent variant system via CVA

## Critical Files

### Configuration
- `src/auth.ts` - NextAuth main configuration
- `src/middleware.ts` - Auth & i18n routing logic
- `src/routes.ts` - Public/private route definitions
- `prisma/schema.prisma` - Database schema

### Styling
- `src/app/globals.css` - Theme variables & Tailwind imports
- `src/styles/container.css` - Responsive container system
- CSS Variables use OKLCH format for colors

### Components
- `src/components/ui/` - Core UI component library
- `src/components/template/sidebar-01/` - Docs sidebar
- `src/components/auth/` - Authentication system

## Development Guidelines

### 1. Adding New Pages
- Place in appropriate `app/[lang]/` directory
- Add runtime export if using Prisma: `export const runtime = "nodejs"`
- Update `src/routes.ts` for auth requirements
- Support both en/ar locales

### 2. Database Changes
1. Update `prisma/schema.prisma`
2. Run `pnpm prisma generate`
3. Run `pnpm prisma db push` for development
4. Create migration for production: `pnpm prisma migrate dev`

### 3. Component Development
- Use existing UI components from `src/components/ui/`
- Follow atomic design principles
- Implement with TypeScript
- Support theme variables
- Ensure RTL compatibility

### 4. Styling Conventions
- Use Tailwind utility classes
- Leverage CSS variables for theming
- Container classes: `layout-container` for responsive padding
- Text colors: `text-muted-foreground` → `text-foreground` for hover
- No hardcoded colors - use theme variables

### 5. Authentication
- Use `useCurrentUser()` hook for client components
- Use `currentUser()` from `@/lib/auth` for server components
- Protect routes in `middleware.ts`
- Handle OAuth and credential providers

## Common Patterns

### Protected Page
```tsx
export const runtime = "nodejs";
import { currentUser } from "@/lib/auth";

export default async function ProtectedPage() {
  const user = await currentUser();
  if (!user) redirect("/login");
  // Page content
}
```

### Client Component with Auth
```tsx
"use client";
import { useCurrentUser } from "@/components/auth/use-current-user";

export default function Component() {
  const user = useCurrentUser();
  // Component logic
}
```

### Internationalized Route
```tsx
import { getDictionary } from "@/components/local/dictionaries";

export default async function Page({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang);
  // Use translations
}
```

## Environment Variables
Required environment variables:
```env
DATABASE_URL=           # PostgreSQL connection string
AUTH_SECRET=           # NextAuth secret (generate with: openssl rand -hex 32)
NEXTAUTH_URL=          # Application URL
```

## Known Issues & Workarounds
1. TypeScript build errors ignored via `ignoreBuildErrors: true` in next.config
2. Prisma requires Node.js runtime (not Edge compatible)
3. Middleware must use Node.js runtime for auth operations

## Testing & Quality
- ESLint configured for Next.js best practices
- Prettier for consistent formatting
- No test framework currently configured

## Deployment Considerations
1. Set all required environment variables
2. Run database migrations: `pnpm prisma migrate deploy`
3. Build with `pnpm build`
4. Supports Vercel deployment out-of-the-box

## Quick Tips for Claude Code
- When editing sidebar styles, check `src/components/ui/sidebar.tsx` and `src/components/template/sidebar-01/`
- Container padding is managed via `layout-container` class from `container.css`
- Always import globals.css in layout files to ensure styles apply
- Use `text-muted-foreground` for dimmed text, transition to `text-foreground` on hover
- Documentation lives in MDX files under `src/app/[lang]/docs/`
- Authentication state available via hooks and server utilities
- Support both English and Arabic in all user-facing features