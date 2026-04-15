#!/bin/bash
set -e

# Publishes a clean version of the project to GitHub (only public MCP files).
# Internal files (CLAUDE.md, .claude/, .github/) are excluded.

REMOTE="github"
BRANCH="main"

# Files/dirs to exclude from GitHub
EXCLUDE=(
  "CLAUDE.md"
  ".claude"
  ".github"
  "scripts"
)

echo "Publishing to $REMOTE/$BRANCH..."

# Save current branch
CURRENT_BRANCH=$(git branch --show-current)

# Create a temporary orphan branch
TEMP_BRANCH="__publish_github_temp__"
git checkout --orphan "$TEMP_BRANCH" >/dev/null 2>&1

# Remove excluded files from index
for item in "${EXCLUDE[@]}"; do
  git rm -rf --cached "$item" >/dev/null 2>&1 || true
done

# Commit
git commit -m "$(git log -1 --format=%s "$CURRENT_BRANCH")" >/dev/null 2>&1

# Force push to GitHub
git push "$REMOTE" "$TEMP_BRANCH:$BRANCH" --force

# Switch back and clean up
git checkout "$CURRENT_BRANCH" >/dev/null 2>&1
git branch -D "$TEMP_BRANCH" >/dev/null 2>&1

echo "Done. Pushed to $REMOTE/$BRANCH (excluding: ${EXCLUDE[*]})"