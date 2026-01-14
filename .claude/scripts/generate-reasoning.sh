#!/bin/bash
# Generate reasoning file for a commit
# Usage: generate-reasoning.sh <commit-hash> "<commit-message>"

COMMIT_HASH="$1"
COMMIT_MSG="$2"
REASONING_DIR=".git/claude/commits/$COMMIT_HASH"

# Create directory
mkdir -p "$REASONING_DIR"

# Generate reasoning file
cat > "$REASONING_DIR/reasoning.md" << EOF
# Commit Reasoning

## Commit Message
$COMMIT_MSG

## Summary
Added PlateEditor with AI-powered editing capabilities to the Wati Astro project.

## Key Changes
- Integrated Plate.js rich text editor with 60+ plugins
- Converted Next.js API routes to Astro format
- Added AI command and copilot endpoints
- Created dedicated /editor page
- Added editor entry point on homepage
- Configured environment variables for AI gateway

## Technical Details
- Used Astro's APIRoute instead of Next.js NextRequest/NextResponse
- Changed process.env to import.meta.env for environment variables
- Added type declarations for AI_GATEWAY_API_KEY and OPENAI_API_KEY
- Used type assertions (as any) for AI SDK experimental APIs
EOF

echo "Reasoning file created at: $REASONING_DIR/reasoning.md"
