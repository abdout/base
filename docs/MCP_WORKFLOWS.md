# MCP-Powered Workflows for Databayt

## 🚀 Automated Development Workflows

### 1. Feature Implementation Pipeline

```markdown
# Complete feature from issue to production

Step 1: Gather Requirements
> @claude Check Linear issue ENG-456 and the linked Notion specs.
  Also review the Figma designs referenced in the issue.

Step 2: Implementation with Subagents
> @claude Based on the requirements, use the architecture-advisor to plan
  the file structure. Then implement using shadcn-ui-specialist for UI
  and typescript-pro for type safety. Ensure all components follow our
  atomic design pattern.

Step 3: Database Updates
> @claude Check our postgres schema and update Prisma models as needed
  for this feature. Generate and run migrations safely.

Step 4: Testing & Validation
> @claude Use unit-test-writer to create tests for the new feature.
  Deploy to Vercel preview and check Sentry for any errors.

Step 5: Documentation & Deployment
> @claude Update the relevant MDX docs, create a Linear comment with
  implementation details, and prepare for production deployment.
```

### 2. Bug Investigation & Resolution

```markdown
# Systematic bug fixing with MCP

Step 1: Error Discovery
> @claude Check Sentry for the TypeError in production. Get the full
  stack trace and affected users count.

Step 2: Root Cause Analysis
> @claude Use bug-detective to analyze the error. Check our postgres
  logs at the time of the error. Look for related Linear issues.

Step 3: Fix Implementation
> @claude Implement the fix following our TypeScript strict mode.
  Add defensive coding and proper error boundaries.

Step 4: Verification
> @claude Deploy fix to Vercel preview, monitor Sentry for recurrence,
  and update the Linear issue with resolution details.
```

### 3. Performance Optimization Cycle

```markdown
# Monthly performance audit and optimization

> @claude Perform comprehensive performance analysis:
  1. Check Vercel Analytics for Core Web Vitals
  2. Query Sentry for performance-related issues
  3. Analyze postgres slow query logs
  4. Review bundle size trends in Vercel
  5. Use nextjs-expert to optimize based on findings
  6. Create Linear issues for items requiring attention
  7. Document improvements in Notion
```

### 4. Design-to-Code Pipeline

```markdown
# Implement designs efficiently

> @claude Access the new component designs in Figma.
  Use shadcn-ui-specialist to:
  1. Map Figma components to our existing UI library
  2. Identify missing components
  3. Implement with proper OKLCH colors and theme variables
  4. Ensure RTL support for Arabic
  5. Create responsive variants
  6. Update Notion design system docs
```

## 📊 Business Intelligence Workflows

### Daily Metrics Dashboard

```markdown
# Generate daily business metrics

> @claude Create today's metrics report:
  - Query postgres for active users and conversion rates
  - Check Stripe for revenue and MRR changes
  - Pull error rates from Sentry
  - Get deployment frequency from Vercel
  - Compile into Notion daily report page
  - Flag anomalies in Linear if found
```

### Customer Success Workflow

```markdown
# Handle customer issues efficiently

> @claude For customer ticket #789:
  1. Check Sentry for errors from this user
  2. Query postgres for their account details and activity
  3. Review Stripe subscription status
  4. Check Linear for related bugs
  5. Draft response with findings
  6. Create Linear issue if bug found
```

### Sprint Planning Automation

```markdown
# Prepare for sprint planning

> @claude Prepare sprint planning data:
  1. List all completed Linear issues from last sprint
  2. Check Vercel deployment success rate
  3. Calculate velocity from Linear
  4. Get top errors from Sentry
  5. Review unfinished items
  6. Create Notion sprint retrospective
  7. Suggest priority items for next sprint
```

## 🔄 Continuous Integration Workflows

### PR Review Enhancement

```markdown
# Comprehensive PR review with MCP

> @claude Review PR #234:
  1. Use react-code-reviewer for component analysis
  2. Check if Figma designs are properly implemented
  3. Verify no Sentry errors in preview deployment
  4. Analyze Vercel bundle size impact
  5. Check postgres migration safety
  6. Ensure Linear issue requirements are met
  7. Post comprehensive review comment
```

### Release Preparation

```markdown
# Automated release checklist

> @claude Prepare release v2.1.0:
  1. Compile completed Linear issues
  2. Check Sentry error trends
  3. Verify all Figma designs implemented
  4. Test Stripe webhooks
  5. Validate postgres migrations
  6. Update changelog in Notion
  7. Create release notes
  8. Tag in git with notes
```

## 🤖 AI-Enhanced Workflows

### Intelligent Code Generation

```markdown
# Generate code with full context

> @claude Create a payment flow:
  1. Check Stripe API documentation
  2. Review our existing payment components
  3. Query postgres for our subscription schema
  4. Use typescript-pro to ensure type safety
  5. Implement with proper error handling from Sentry patterns
  6. Create Linear subtasks for testing
```

### Automated Documentation

```markdown
# Keep docs in sync with code

> @claude Update documentation:
  1. Scan recent commits for API changes
  2. Check Linear for completed features
  3. Review Notion for outdated content
  4. Generate MDX documentation
  5. Include code examples from implementation
  6. Add to changelog
```

### Smart Refactoring

```markdown
# Context-aware refactoring

> @claude Refactor authentication:
  1. Analyze current implementation
  2. Check Sentry for auth-related errors
  3. Review Linear for auth improvement requests
  4. Use architecture-advisor for structure
  5. Implement with NextAuth v5 best practices
  6. Ensure postgres user schema compatibility
  7. Test with Stripe customer linking
```

## 💡 MCP Pro Tips

### Batch Operations

```markdown
# Process multiple items efficiently

> @claude For all P0 Linear issues:
  1. Check implementation feasibility
  2. Estimate Vercel build impact
  3. Identify required Figma designs
  4. Check for postgres schema changes
  5. Create implementation plans in Notion
```

### Cross-Service Validation

```markdown
# Ensure consistency across services

> @claude Validate user data consistency:
  1. Check postgres user records
  2. Verify Stripe customer records match
  3. Ensure Linear reporter emails exist
  4. Validate Notion access permissions
  5. Report discrepancies
```

### Predictive Monitoring

```markdown
# Proactive issue detection

> @claude Analyze trends:
  1. Check Sentry error rate trajectory
  2. Monitor Vercel build time trends
  3. Analyze postgres query performance degradation
  4. Review Stripe failed payment patterns
  5. Predict issues and create preventive Linear tasks
```

## 📈 Metrics & Reporting

### Weekly Team Report

```markdown
> @claude Generate weekly team report:
  - Pull completed Linear issues per developer
  - Calculate code review turnaround from PRs
  - Get error introduction rate from Sentry
  - Measure deployment frequency from Vercel
  - Track test coverage changes
  - Create visual report in Notion
```

### Customer Health Score

```markdown
> @claude Calculate customer health scores:
  - Query postgres for engagement metrics
  - Check Stripe for payment history
  - Review Sentry for user-specific errors
  - Analyze feature usage patterns
  - Generate risk scores and recommendations
```

## 🔧 Troubleshooting MCP

### Debug MCP Connections

```markdown
> /mcp
# Check status of all MCP servers

> @claude List all available MCP resources and their status

> claude mcp list
# From terminal to see all configured servers
```

### Reset Problematic Servers

```bash
# Remove and re-add a server
claude mcp remove servername
claude mcp add servername -- command
```

### OAuth Re-authentication

```markdown
> /mcp
# Select "Clear authentication" then re-authenticate
```

---

Remember: MCP + Subagents + GitHub Actions = Maximum Productivity! 🚀