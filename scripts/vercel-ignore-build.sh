#!/usr/bin/env bash
# Vercel's "Ignored Build Step" (vercel.json ignoreCommand): exit 0 skips the build, exit 1 builds.
# Every build is billed in build CPU minutes, and every deployment it leaves is billed for storage,
# so Vercel builds only what reaches the live site. Pull requests are checked by GitHub CI instead.

# Prototype review (2026-11-11): the one-scroll branch builds its preview so the owner can
# try it from a link. Take this out before the branch is merged.
if [ "$VERCEL_GIT_COMMIT_REF" = "claude/project-thread-fnqmag" ]; then
  echo "Building the preview for the one-scroll prototype."
  exit 1
fi

if [ "$VERCEL_ENV" != "production" ]; then
  echo "Skipping: preview deployment ($VERCEL_GIT_COMMIT_REF). GitHub CI checks pull requests."
  exit 0
fi

# A change to notes, tests or marketing material alone leaves the site as it is
if git rev-parse --verify --quiet HEAD^ >/dev/null &&
  git diff --quiet HEAD^ HEAD -- . \
    ':(exclude)docs/**' ':(exclude)marketing/**' ':(exclude)e2e/**' \
    ':(exclude)**/*.md' ':(exclude)**/*.test.ts' ':(exclude)**/*.test.tsx' \
    ':(exclude).github/**'; then
  echo "Skipping: only docs, tests or marketing files changed."
  exit 0
fi

echo "Building the production deployment."
exit 1
