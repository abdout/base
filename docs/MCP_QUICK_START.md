# MCP Quick Start Guide

## ⚡ 5-Minute Setup

### Windows (PowerShell)
```powershell
# 1. Copy environment template
cp .env.mcp.example .env.mcp

# 2. Edit .env.mcp with your credentials
notepad .env.mcp

# 3. Run setup script
.\scripts\mcp-setup.ps1

# 4. Start Claude Code
claude

# 5. Authenticate OAuth services
# In Claude Code, type:
> /mcp
# Follow prompts to authenticate
```

### macOS/Linux (Bash)
```bash
# 1. Copy environment template
cp .env.mcp.example .env.mcp

# 2. Edit .env.mcp with your credentials
nano .env.mcp

# 3. Run setup script
chmod +x scripts/mcp-setup.sh
./scripts/mcp-setup.sh

# 4. Start Claude Code
claude

# 5. Authenticate OAuth services
> /mcp
```

## 🎯 Essential Commands

### Most Common MCP Tasks

```markdown
# 1. Check my tasks
> @claude Show my Linear issues and their status

# 2. Debug an error
> @claude Check Sentry for recent errors and analyze with bug-detective

# 3. Review deployment
> @claude Check latest Vercel deployment status and any errors

# 4. Query database
> @claude Query postgres to show user statistics for this week

# 5. Implement from design
> @claude Get the latest Figma designs and implement with ShadCN UI
```

## 🔥 Power User Combinations

### Feature Development Sprint
```markdown
> @claude Get Linear issue ENG-123, review Figma designs, implement with
  shadcn-ui-specialist and typescript-pro, create tests, deploy to Vercel,
  and update Notion docs.
```

### Production Issue Response
```markdown
> @claude Check Sentry for critical errors, use bug-detective to analyze,
  query postgres for affected users, create Linear issue with findings,
  and implement hotfix.
```

### Daily Standup Prep
```markdown
> @claude Show my yesterday's Linear completions, today's tasks, PR status,
  any Sentry errors assigned to me, and blockers.
```

## 📱 Available MCP Servers

### Instant Access (OAuth)
- **Vercel**: `@vercel:deployment://latest`
- **Sentry**: `@sentry:errors://recent`
- **Linear**: `@linear:issue://ENG-123`
- **Notion**: `@notion:doc://specs`
- **Stripe**: `@stripe:customer://cus_xxx`

### Database Access
- **Dev DB**: `@postgres-dev:table://users`
- **Prod DB**: `@postgres-prod:table://users` (read-only)

### Design & Content
- **Figma**: `@figma:design://component-name`
- **Airtable**: `@airtable:table://content`

## 🎓 Learning Path

### Day 1: Basic Integration
```markdown
> @claude List my Linear issues
> @claude Check recent Sentry errors
> @claude Show latest Vercel deployment
```

### Day 2: Cross-Service Workflows
```markdown
> @claude Check Linear issue, implement fix, deploy to Vercel
> @claude Find Sentry error, debug with postgres logs, create Linear issue
```

### Day 3: Advanced Automation
```markdown
> @claude Implement complete feature from Linear to production with tests
> @claude Generate weekly metrics from all services
```

## 🚨 Troubleshooting

### MCP Not Working?

1. **Check server status**
   ```
   > /mcp
   ```

2. **List configured servers**
   ```bash
   claude mcp list
   ```

3. **Re-authenticate OAuth**
   ```
   > /mcp
   # Select "Clear authentication" then re-authenticate
   ```

4. **Remove and re-add server**
   ```bash
   claude mcp remove servername
   claude mcp add servername -- command
   ```

## 🎯 Project-Specific Quick Wins

### For Next.js Development
```markdown
> @claude Check Vercel build logs, optimize with nextjs-expert,
  monitor bundle size impact
```

### For TypeScript
```markdown
> @claude Audit types with typescript-pro, ensure zero any usage,
  check Prisma type generation
```

### For UI/UX
```markdown
> @claude Get Figma designs, implement with shadcn-ui-specialist,
  ensure RTL support for Arabic
```

### For Testing
```markdown
> @claude Generate tests with unit-test-writer for changed files,
  check coverage, run in CI
```

## 📊 Daily Routines

### Morning Checkin
```markdown
> @claude Show overnight Sentry errors, failed Vercel deployments,
  and urgent Linear issues
```

### Before PR Merge
```markdown
> @claude Check preview deployment, Sentry errors, bundle size,
  and Linear issue requirements
```

### End of Day
```markdown
> @claude Update Linear issues, check tomorrow's tasks,
  note any blockers in Notion
```

## 🎨 MCP + Subagents = Magic

### Best Combinations

1. **Linear + architecture-advisor**
   ```markdown
   > @claude Get requirements from Linear and plan with architecture-advisor
   ```

2. **Sentry + bug-detective**
   ```markdown
   > @claude Analyze Sentry error with bug-detective subagent
   ```

3. **Figma + shadcn-ui-specialist**
   ```markdown
   > @claude Implement Figma design using shadcn-ui-specialist
   ```

4. **Postgres + typescript-pro**
   ```markdown
   > @claude Generate types from postgres schema with typescript-pro
   ```

## 📈 Success Metrics

Track your productivity gains:
- ⬇️ 50% less context switching
- ⬇️ 75% faster issue resolution
- ⬆️ 3x more automated workflows
- ⬆️ 90% reduction in manual checks

## 🔗 Resources

- [Full MCP Setup Guide](./MCP_SETUP_GUIDE.md)
- [MCP Workflows](./MCP_WORKFLOWS.md)
- [Subagent Docs](./.claude/agents/)
- [GitHub Actions Setup](./.github/CLAUDE_ACTIONS_SETUP.md)

---

**Pro Tip**: Combine MCP + Subagents + GitHub Actions for ultimate automation! 🚀

**Need help?** Ask: `@claude explain how to use MCP for [your task]`