# MCP (Model Context Protocol) Setup Guide for Databayt

## 🚀 Overview

This guide helps you connect Claude Code to your development tools, databases, and services using MCP. With these integrations, Claude can directly access your project management tools, databases, monitoring services, and more.

## 📋 Quick Setup Commands

### Essential Development Tools

```bash
# 1. Vercel - Deployment management
claude mcp add --transport http vercel https://mcp.vercel.com/

# 2. Sentry - Error monitoring
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

# 3. Linear - Issue tracking
claude mcp add --transport sse linear https://mcp.linear.app/sse

# 4. Notion - Documentation
claude mcp add --transport http notion https://mcp.notion.com/mcp

# 5. Figma - Design assets (requires Figma Desktop)
claude mcp add --transport http figma http://127.0.0.1:3845/mcp
```

### Database Access

```bash
# PostgreSQL (using your existing DATABASE_URL)
claude mcp add postgres --env DATABASE_URL=$DATABASE_URL \
  -- npx -y @bytebase/dbhub

# For read-only production access (recommended)
claude mcp add postgres-prod --env DATABASE_URL=$PROD_DATABASE_URL_READONLY \
  -- npx -y @bytebase/dbhub
```

### Payment & Commerce

```bash
# Stripe integration
claude mcp add --transport http stripe https://mcp.stripe.com
```

### Content Management

```bash
# Airtable for content tables
claude mcp add airtable --env AIRTABLE_API_KEY=$AIRTABLE_API_KEY \
  -- npx -y airtable-mcp-server
```

## 🔐 Authentication Setup

### Step 1: Add Required Environment Variables

Create a `.env.mcp` file (add to .gitignore):

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/codebase_underway
PROD_DATABASE_URL_READONLY=postgresql://readonly:pass@prod.db.com:5432/codebase_underway

# Content Management
AIRTABLE_API_KEY=your_airtable_key

# Project Management
CLICKUP_API_KEY=your_clickup_key
CLICKUP_TEAM_ID=your_team_id

# Monitoring
SENTRY_AUTH_TOKEN=your_sentry_token
```

### Step 2: Authenticate OAuth Services

Run in Claude Code:

```
> /mcp
```

Then authenticate with:
- Vercel
- Sentry
- Linear
- Notion
- Stripe

## 💡 Practical Use Cases for Your Codebase

### 1. Feature Development Workflow

```markdown
# Complete feature implementation from issue to deployment

> @claude Check Linear issue ENG-123 and implement the feature described.
  Use our existing components from src/components/ui/ and follow our
  atomic design pattern. Create the necessary routes in src/app/[lang]/
  and ensure both English and Arabic support.

> @claude After implementation, check Vercel for the preview deployment
  and verify there are no errors in Sentry for this feature.
```

### 2. Database Schema Updates

```markdown
# Update Prisma schema based on requirements

> @claude Query our postgres database to understand the current user schema.
  Then update prisma/schema.prisma to add the fields described in
  Notion doc "User Profile Enhancement". Run the migration and update
  the affected TypeScript types.
```

### 3. Design Implementation

```markdown
# Implement UI from Figma designs

> @claude Access the Figma design for the new dashboard component.
  Implement it using our ShadCN UI components, ensuring it follows
  our OKLCH color system and supports RTL for Arabic. Place it in
  the appropriate atomic design folder.
```

### 4. Error Investigation

```markdown
# Debug production issues

> @claude Check Sentry for the most common errors in the last 24 hours
  related to authentication. Cross-reference with our NextAuth setup
  in src/auth.ts and suggest fixes. Check if these errors correlate
  with any recent Vercel deployments.
```

### 5. Payment Integration

```markdown
# Implement payment features

> @claude Using Stripe, create a subscription management page at
  src/app/[lang]/(expose)/(protected)/subscription/. Include plan
  selection, payment method management, and billing history. Ensure
  it uses our existing auth with useCurrentUser() hook.
```

### 6. Content Management

```markdown
# Sync content from Airtable

> @claude Query the Airtable "Blog Posts" table and generate MDX files
  for our documentation at src/app/[lang]/docs/blog/. Include proper
  frontmatter and ensure i18n support for both English and Arabic.
```

## 🎯 MCP + Subagents Power Combos

### Bug Investigation Workflow

```markdown
> @claude Check Sentry for TypeError errors in the dashboard component.
  Use the bug-detective subagent to analyze the root cause. Then check
  our postgres logs to see if there are related database errors.
  Create a Linear issue with your findings.
```

### Architecture Planning

```markdown
> @claude Review the feature requirements in Notion doc "Q1 Roadmap".
  Use the architecture-advisor subagent to plan the implementation.
  Check our current Vercel bundle size and suggest how to implement
  without significantly increasing it.
```

### Type Safety Audit

```markdown
> @claude Use the typescript-pro subagent to audit our API routes.
  Check Stripe webhook types against our implementations. Query postgres
  to ensure our Prisma types match the actual schema. Report any
  discrepancies in a Linear issue.
```

## 📊 Project-Specific MCP Commands

### Daily Standup Helper

```markdown
> @claude Generate my standup report: Check Linear for my completed
  issues yesterday, my assigned issues for today, and any blockers.
  Check Sentry for any critical errors assigned to me. Include PR
  status from yesterday.
```

### Weekly Performance Report

```markdown
> @claude Create a performance report: Check Vercel for Core Web Vitals
  trends, Sentry for error rates, and our postgres for slow queries.
  Compare with last week and highlight any regressions.
```

### Feature Impact Analysis

```markdown
> @claude For feature ENG-456: Check Linear for requirements, Figma
  for designs, estimate Vercel bundle size impact, identify required
  Stripe API changes, and list affected postgres tables. Create a
  comprehensive impact analysis.
```

## 🔧 Advanced Configuration

### Scope Management

```bash
# Project-wide (shared via .mcp.json)
claude mcp add --scope project shared-tool -- command

# User-specific (across all projects)
claude mcp add --scope user personal-tool -- command

# Local only (current project, private)
claude mcp add --scope local secret-tool -- command
```

### Custom Database Connections

```bash
# Development database with full access
claude mcp add db-dev --env DATABASE_URL=$DEV_DB \
  -- npx -y @bytebase/dbhub

# Staging with limited access
claude mcp add db-staging --env DATABASE_URL=$STAGING_DB \
  -- npx -y @bytebase/dbhub --readonly

# Analytics database
claude mcp add db-analytics --env DATABASE_URL=$ANALYTICS_DB \
  -- npx -y @bytebase/dbhub
```

### MCP with CI/CD

Add to your GitHub Actions:

```yaml
- name: Claude Analysis with MCP
  uses: anthropics/claude-code-action@v1
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    prompt: |
      Check Vercel for the preview deployment of this PR.
      Query Sentry to ensure no new errors were introduced.
      Verify database migrations if schema.prisma changed.
    settings: |
      {
        "mcpServers": {
          "vercel": {
            "type": "http",
            "url": "https://mcp.vercel.com/"
          },
          "sentry": {
            "type": "http",
            "url": "https://mcp.sentry.dev/mcp"
          }
        }
      }
```

## 🛡️ Security Best Practices

1. **Never commit API keys** - Use environment variables
2. **Use read-only database connections** for production
3. **Limit MCP scope** - Use project scope only for safe, shared tools
4. **Rotate credentials regularly**
5. **Audit MCP access logs** in your tools

## 🚦 Quick Reference

### Check MCP Status
```
> /mcp
```

### List All Servers
```bash
claude mcp list
```

### Remove a Server
```bash
claude mcp remove servername
```

### Available @ Resources
```
@vercel:deployment://latest
@sentry:errors://recent
@linear:issue://ENG-123
@notion:doc://project-specs
@postgres:table://users
@stripe:customer://cus_xxx
```

### Available / Commands
```
/mcp__vercel__check_deployment
/mcp__sentry__recent_errors
/mcp__linear__my_issues
/mcp__notion__search_docs
```

## 🎓 Training Your Team

### For Developers

1. Start with read-only access to production services
2. Practice with development databases first
3. Use MCP for investigation before making changes
4. Combine MCP with subagents for powerful workflows

### For Project Managers

```markdown
# Non-technical MCP usage

> @claude Check Linear for sprint progress and create a summary in Notion.
  Include any blockers and their impact on timeline.

> @claude Review Sentry for user-reported issues and prioritize them
  in Linear based on frequency and severity.
```

### For Designers

```markdown
# Design-development bridge

> @claude Check which Figma components have been implemented in
  src/components/ui/. Create a Notion doc listing what's missing.

> @claude Verify our implemented components match the Figma designs
  for proper spacing, colors, and responsive behavior.
```

## 📈 Monitoring MCP Usage

Track effectiveness:
- Reduced context switching
- Faster issue resolution
- Improved code quality
- Better cross-team collaboration

## 🔗 Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [MCP GitHub Servers](https://github.com/modelcontextprotocol/servers)
- [Claude Code Docs](https://docs.anthropic.com/en/docs/claude-code)
- [Your .mcp.json](./.mcp.json)

---

Need help? Ask: "@claude explain how to use MCP with our codebase"