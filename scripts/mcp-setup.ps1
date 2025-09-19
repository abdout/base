# MCP Setup Script for Databayt Codebase (Windows PowerShell)
# This script sets up all MCP integrations for the project

Write-Host "🚀 Setting up MCP integrations for Databayt..." -ForegroundColor Cyan

# Check if claude is installed
if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Claude Code CLI not found. Please install it first." -ForegroundColor Red
    exit 1
}

# Load environment variables if .env.mcp exists
$envFile = ".env.mcp"
if (Test-Path $envFile) {
    Write-Host "✅ Loading environment variables from .env.mcp" -ForegroundColor Green
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.+)$') {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
} else {
    Write-Host "⚠️  No .env.mcp file found. Some integrations may require manual setup." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Installing Development Tools..." -ForegroundColor White

# Vercel
Write-Host "→ Adding Vercel integration..."
try {
    claude mcp add --transport http vercel https://mcp.vercel.com/ 2>$null
} catch {
    Write-Host "  Already configured" -ForegroundColor Gray
}

# Sentry
Write-Host "→ Adding Sentry integration..."
try {
    claude mcp add --transport http sentry https://mcp.sentry.dev/mcp 2>$null
} catch {
    Write-Host "  Already configured" -ForegroundColor Gray
}

# Figma (if running)
Write-Host "→ Checking for Figma Desktop..."
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:3845/mcp" -UseBasicParsing -TimeoutSec 2
    Write-Host "  Figma Desktop detected, adding integration..."
    claude mcp add --transport http figma http://127.0.0.1:3845/mcp 2>$null
} catch {
    Write-Host "  Figma Desktop not running. Start Figma with Dev Mode to enable." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Installing Project Management Tools..." -ForegroundColor White

# Linear
Write-Host "→ Adding Linear integration..."
try {
    claude mcp add --transport sse linear https://mcp.linear.app/sse 2>$null
} catch {
    Write-Host "  Already configured" -ForegroundColor Gray
}

# Notion
Write-Host "→ Adding Notion integration..."
try {
    claude mcp add --transport http notion https://mcp.notion.com/mcp 2>$null
} catch {
    Write-Host "  Already configured" -ForegroundColor Gray
}

# ClickUp (if configured)
$clickupKey = [Environment]::GetEnvironmentVariable("CLICKUP_API_KEY", "Process")
$clickupTeam = [Environment]::GetEnvironmentVariable("CLICKUP_TEAM_ID", "Process")
if ($clickupKey -and $clickupTeam) {
    Write-Host "→ Adding ClickUp integration..."
    try {
        # For Windows, we need cmd /c wrapper for npx
        claude mcp add clickup --env CLICKUP_API_KEY=$clickupKey --env CLICKUP_TEAM_ID=$clickupTeam `
            -- cmd /c npx -y @hauptsache.net/clickup-mcp 2>$null
    } catch {
        Write-Host "  Already configured" -ForegroundColor Gray
    }
} else {
    Write-Host "→ Skipping ClickUp (CLICKUP_API_KEY or CLICKUP_TEAM_ID not set)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "💾 Installing Database Tools..." -ForegroundColor White

# PostgreSQL Development
$dbUrl = [Environment]::GetEnvironmentVariable("DATABASE_URL", "Process")
if ($dbUrl) {
    Write-Host "→ Adding PostgreSQL development database..."
    try {
        # For Windows, we need cmd /c wrapper for npx
        claude mcp add postgres-dev --env DATABASE_URL=$dbUrl `
            -- cmd /c npx -y @bytebase/dbhub 2>$null
    } catch {
        Write-Host "  Already configured" -ForegroundColor Gray
    }
} else {
    Write-Host "→ Skipping PostgreSQL dev (DATABASE_URL not set)" -ForegroundColor Yellow
}

# PostgreSQL Production (read-only)
$prodDbUrl = [Environment]::GetEnvironmentVariable("PROD_DATABASE_URL_READONLY", "Process")
if ($prodDbUrl) {
    Write-Host "→ Adding PostgreSQL production database (read-only)..."
    try {
        # For Windows, we need cmd /c wrapper for npx
        claude mcp add postgres-prod --env DATABASE_URL=$prodDbUrl `
            -- cmd /c npx -y @bytebase/dbhub 2>$null
    } catch {
        Write-Host "  Already configured" -ForegroundColor Gray
    }
} else {
    Write-Host "→ Skipping PostgreSQL prod (PROD_DATABASE_URL_READONLY not set)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "💳 Installing Payment Tools..." -ForegroundColor White

# Stripe
Write-Host "→ Adding Stripe integration..."
try {
    claude mcp add --transport http stripe https://mcp.stripe.com 2>$null
} catch {
    Write-Host "  Already configured" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📊 Installing Content Management..." -ForegroundColor White

# Airtable
$airtableKey = [Environment]::GetEnvironmentVariable("AIRTABLE_API_KEY", "Process")
if ($airtableKey) {
    Write-Host "→ Adding Airtable integration..."
    try {
        # For Windows, we need cmd /c wrapper for npx
        claude mcp add airtable --env AIRTABLE_API_KEY=$airtableKey `
            -- cmd /c npx -y airtable-mcp-server 2>$null
    } catch {
        Write-Host "  Already configured" -ForegroundColor Gray
    }
} else {
    Write-Host "→ Skipping Airtable (AIRTABLE_API_KEY not set)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✨ MCP Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run 'claude' to start Claude Code"
Write-Host "2. Use '/mcp' command to authenticate with OAuth services"
Write-Host "3. Test with: '@claude list my Linear issues'"
Write-Host ""
Write-Host "For more information, see docs/MCP_SETUP_GUIDE.md"