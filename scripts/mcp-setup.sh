#!/bin/bash

# MCP Setup Script for Databayt Codebase
# This script sets up all MCP integrations for the project

echo "🚀 Setting up MCP integrations for Databayt..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if claude is installed
if ! command -v claude &> /dev/null; then
    echo -e "${RED}❌ Claude Code CLI not found. Please install it first.${NC}"
    exit 1
fi

# Load environment variables if .env.mcp exists
if [ -f .env.mcp ]; then
    echo -e "${GREEN}✅ Loading environment variables from .env.mcp${NC}"
    export $(cat .env.mcp | grep -v '^#' | xargs)
else
    echo -e "${YELLOW}⚠️  No .env.mcp file found. Some integrations may require manual setup.${NC}"
fi

echo ""
echo "📦 Installing Development Tools..."

# Vercel
echo "→ Adding Vercel integration..."
claude mcp add --transport http vercel https://mcp.vercel.com/ 2>/dev/null || echo "  Already configured"

# Sentry
echo "→ Adding Sentry integration..."
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp 2>/dev/null || echo "  Already configured"

# Figma (if running)
echo "→ Checking for Figma Desktop..."
if curl -s http://127.0.0.1:3845/mcp > /dev/null 2>&1; then
    echo "  Figma Desktop detected, adding integration..."
    claude mcp add --transport http figma http://127.0.0.1:3845/mcp 2>/dev/null || echo "  Already configured"
else
    echo -e "${YELLOW}  Figma Desktop not running. Start Figma with Dev Mode to enable.${NC}"
fi

echo ""
echo "📋 Installing Project Management Tools..."

# Linear
echo "→ Adding Linear integration..."
claude mcp add --transport sse linear https://mcp.linear.app/sse 2>/dev/null || echo "  Already configured"

# Notion
echo "→ Adding Notion integration..."
claude mcp add --transport http notion https://mcp.notion.com/mcp 2>/dev/null || echo "  Already configured"

# ClickUp (if configured)
if [ ! -z "$CLICKUP_API_KEY" ] && [ ! -z "$CLICKUP_TEAM_ID" ]; then
    echo "→ Adding ClickUp integration..."
    claude mcp add clickup --env CLICKUP_API_KEY=$CLICKUP_API_KEY --env CLICKUP_TEAM_ID=$CLICKUP_TEAM_ID \
        -- npx -y @hauptsache.net/clickup-mcp 2>/dev/null || echo "  Already configured"
else
    echo -e "${YELLOW}→ Skipping ClickUp (CLICKUP_API_KEY or CLICKUP_TEAM_ID not set)${NC}"
fi

echo ""
echo "💾 Installing Database Tools..."

# PostgreSQL Development
if [ ! -z "$DATABASE_URL" ]; then
    echo "→ Adding PostgreSQL development database..."
    claude mcp add postgres-dev --env DATABASE_URL=$DATABASE_URL \
        -- npx -y @bytebase/dbhub 2>/dev/null || echo "  Already configured"
else
    echo -e "${YELLOW}→ Skipping PostgreSQL dev (DATABASE_URL not set)${NC}"
fi

# PostgreSQL Production (read-only)
if [ ! -z "$PROD_DATABASE_URL_READONLY" ]; then
    echo "→ Adding PostgreSQL production database (read-only)..."
    claude mcp add postgres-prod --env DATABASE_URL=$PROD_DATABASE_URL_READONLY \
        -- npx -y @bytebase/dbhub 2>/dev/null || echo "  Already configured"
else
    echo -e "${YELLOW}→ Skipping PostgreSQL prod (PROD_DATABASE_URL_READONLY not set)${NC}"
fi

echo ""
echo "💳 Installing Payment Tools..."

# Stripe
echo "→ Adding Stripe integration..."
claude mcp add --transport http stripe https://mcp.stripe.com 2>/dev/null || echo "  Already configured"

echo ""
echo "📊 Installing Content Management..."

# Airtable
if [ ! -z "$AIRTABLE_API_KEY" ]; then
    echo "→ Adding Airtable integration..."
    claude mcp add airtable --env AIRTABLE_API_KEY=$AIRTABLE_API_KEY \
        -- npx -y airtable-mcp-server 2>/dev/null || echo "  Already configured"
else
    echo -e "${YELLOW}→ Skipping Airtable (AIRTABLE_API_KEY not set)${NC}"
fi

echo ""
echo -e "${GREEN}✨ MCP Setup Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Run 'claude' to start Claude Code"
echo "2. Use '/mcp' command to authenticate with OAuth services"
echo "3. Test with: '@claude list my Linear issues'"
echo ""
echo "For more information, see docs/MCP_SETUP_GUIDE.md"