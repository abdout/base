# Claude GitHub Actions Setup Guide

## 🚀 Quick Setup

### Prerequisites
- Repository admin access
- Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

### Automated Installation (Recommended)

1. Open Claude Code in your terminal
2. Run the following command:
```bash
/install-github-app
```
3. Follow the prompts to complete setup

### Manual Installation

1. **Install Claude GitHub App**
   - Visit: [github.com/apps/claude](https://github.com/apps/claude)
   - Click "Install" and select your repository

2. **Add API Key to Repository Secrets**
   - Go to: Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your API key from Anthropic console

3. **Workflow Files Are Ready**
   - All workflow files in `.github/workflows/` are pre-configured
   - No additional setup needed!

## 📋 Available Workflows

### 1. Main Assistant (`claude-main.yml`)
**Trigger**: `@claude` mentions in issues/PRs
**Features**:
- Responds to questions and requests
- Auto-reviews PRs when opened
- Uses all specialized subagents

### 2. Code Review (`claude-code-review.yml`)
**Trigger**: Automatic on PR changes
**Jobs**:
- **TypeScript Review**: Type safety, Prisma types, NextAuth patterns
- **React Review**: Component architecture, hooks, performance
- **Architecture Review**: File structure, runtime decisions
- **Security Review**: Auth patterns, API security

### 3. Issue Automation (`claude-issue-automation.yml`)
**Trigger**: Issue labels
**Features**:
- **Bug label**: Automatic bug investigation with bug-detective
- **Enhancement label**: Architecture planning
- **UI/UX labels**: ShadCN implementation planning
- **Quick-fix label**: Auto-implementation with `@claude implement`

### 4. PR Automation (`claude-pr-automation.yml`)
**Trigger**: PR events
**Jobs**:
- **Multi-agent review**: Uses all relevant subagents
- **Auto-fix linting**: Fixes formatting and imports
- **Test generation**: Creates missing tests
- **Documentation updates**: Updates docs for new features
- **Performance analysis**: Bundle size and optimization checks

### 5. Specialized Tasks (`claude-specialized-tasks.yml`)
**Trigger**: Manual or scheduled
**Tasks**:
- `refactor-typography`: Convert hardcoded styles to theme
- `optimize-performance`: Full performance audit
- `update-dependencies`: Smart dependency updates
- `generate-api-types`: TypeScript type generation
- `create-component`: New component with atomic design
- `setup-feature`: Complete feature scaffolding
- `fix-accessibility`: Accessibility audit and fixes
- `add-i18n-support`: Add translations

## 🎯 Usage Examples

### In PR/Issue Comments

```markdown
@claude Can you review this component for React best practices?

@claude implement Fix the TypeError in the dashboard

@claude Use the typescript-pro agent to improve type safety

@claude Check if this follows our architecture patterns
```

### Manual Workflow Triggers

1. Go to Actions tab
2. Select "Specialized Development Tasks"
3. Click "Run workflow"
4. Choose task from dropdown
5. Click "Run workflow"

## 🤖 Subagent Integration

Your workflows automatically use specialized subagents:

- **architecture-advisor**: File structure, patterns
- **bug-detective**: Error analysis, debugging
- **nextjs-expert**: Next.js optimization
- **react-code-reviewer**: React best practices
- **typescript-pro**: Type safety, performance
- **shadcn-ui-specialist**: UI implementation
- **typography-refactor**: Style standardization
- **unit-test-writer**: Test generation

## 🔧 Customization

### Modify Subagent Usage

In any workflow, specify subagents explicitly:

```yaml
prompt: |
  Use the typescript-pro subagent to review types.
  Use the react-code-reviewer for component patterns.
```

### Adjust Claude Parameters

```yaml
claude_args: |
  --max-turns 20           # More iterations
  --model claude-opus-4-1-20250805  # Different model
  --debug                  # Debug output
```

### Add New Workflows

Create new workflows in `.github/workflows/`:

```yaml
name: Custom Task
on:
  workflow_dispatch:
jobs:
  custom:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "Your custom instructions"
```

## 📊 Cost Optimization

### Tips to Reduce Costs

1. **Use specific triggers**: Avoid running on every commit
2. **Set max-turns limits**: Default is 10, reduce if possible
3. **Use appropriate models**:
   - `claude-sonnet-4-20250514` for most tasks
   - `claude-opus-4-1-20250805` for complex analysis
4. **Label filtering**: Use labels to control when workflows run
5. **Concurrency limits**: Prevent parallel runs

### Add Concurrency Control

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

## 🛠️ Troubleshooting

### Claude Not Responding

1. Check if workflow ran in Actions tab
2. Verify `@claude` mention (not `/claude`)
3. Check API key is set correctly
4. Review workflow logs for errors

### Workflows Not Triggering

1. Ensure workflows are in `.github/workflows/`
2. Check workflow syntax with GitHub's validator
3. Verify branch protection rules allow workflows
4. Check if workflows are disabled in Settings

### API Errors

1. Verify API key has sufficient credits
2. Check rate limits aren't exceeded
3. Ensure model name is correct
4. Review error in workflow logs

## 🔒 Security Best Practices

1. **Never commit API keys** - Always use secrets
2. **Limit workflow permissions** - Use minimal required permissions
3. **Review Claude's suggestions** - Don't auto-merge without review
4. **Use branch protection** - Require reviews for main branch
5. **Audit workflow changes** - Review any workflow modifications

## 📈 Monitoring

### View Workflow History
- Go to Actions tab
- Filter by workflow name
- Click on runs to see details

### Check API Usage
- Monitor at [console.anthropic.com](https://console.anthropic.com)
- Set up usage alerts
- Track token consumption

## 🚦 Next Steps

1. Test with a simple `@claude` mention in an issue
2. Open a PR to see automatic reviews
3. Try manual workflow triggers
4. Customize workflows for your needs
5. Monitor costs and optimize

## 📚 Resources

- [Claude Code Action Repo](https://github.com/anthropics/claude-code-action)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Anthropic API Docs](https://docs.anthropic.com)
- [Your CLAUDE.md](./CLAUDE.md) - Project guidelines

---

For help, create an issue with the `claude-help` label and Claude will assist you!