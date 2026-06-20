---
description: "Use when implementing or modifying the Space Haven Analysis Terminal Dashboard website, XML parser, data mappings, route exposure, analytics consent behavior, or Firebase deployment to the RTS Labs subdomain."
name: "Space Haven Dashboard Implementation Standards"
applyTo: "**"
---

# Space Haven Dashboard Agent Instructions

## Why This Exists
This project is a production-facing RTS Technology & Solutions LLC product. These instructions keep agent work aligned with the implemented dashboard architecture, parser contracts, and deployment model so that changes remain safe, consistent, and deployable.

## Product Identity and Ownership
- Treat this codebase as an RTS Technology & Solutions LLC product, not an experimental throwaway app.
- Preserve brand and product naming consistency: Space Haven Analysis Terminal Dashboard and S.H.A.T. Command Center.
- Keep the public deployment posture aligned with RTS Labs hosting and Firebase target configuration.

## Source of Truth Configuration
- Treat existing deployment configuration files as authoritative unless a task explicitly requires an approved change:
  - firebase.json
  - .firebaserc
  - package.json scripts
  - deployment workflow files under .github/workflows/
- Preserve the current Firebase relationship as source of truth:
  - Firebase project ID: rts-labs-f3981
  - Hosting target name: space-haven-analysis-terminal
  - Custom subdomain DNS points to the hosting site; web.app URL remains a valid secondary endpoint
- When docs and config conflict, resolve toward current checked-in configuration values.

## Route and Environment Rules
- Preserve route intent in src/App.tsx:
  - / is home
  - /dash is coming soon
  - /beta-dash is public beta wireframe
  - /data is public data dictionary
  - /dev-dash is dev-only and must remain gated by VITE_ENABLE_DEV_ROUTES or Vite DEV mode
- Do not expose dev-only pages in production builds.
- When route behavior changes, update related deployment docs in README.md and DEPLOYMENT-GUIDE.md.

## Parser and Data Contract Rules
- Prefer parser creation through createParserWithMappings() and mappingsLoader utilities instead of bypassing id mappings.
- Keep id_mappings.xml as the source of truth for mapping-driven labels and max values.
- Maintain defensive XML parsing behavior:
  - detect parsererror and fail with actionable error messages
  - preserve safe defaults for missing fields
  - avoid assumptions about optional XML nodes
- Keep derived metrics and raw values semantically distinct. Do not silently convert raw XML values into percentages without preserving source values.
- If GameSession or parser output shape changes, update affected types and dashboards together.

## UI and UX Consistency
- Maintain the terminal-style design language (tokenized colors, monospace-first typography, retro panel patterns).
- For dashboard metrics, preserve explainability patterns (tooltips, data source context, and clear labels).
- Reuse existing component patterns in src/components and src/components/ui before introducing new abstractions.

## Analytics and Privacy Rules
- Keep analytics consent-gated through cookie consent workflow.
- Do not enable analytics by default before explicit acceptance.
- Use environment variables for measurement IDs when available; avoid adding new hardcoded secrets.

## Deployment and Hosting Rules
- Keep Firebase deployment configuration consistent with existing project mapping:
  - Firebase project: rts-labs-f3981
  - Hosting target: space-haven-analysis-terminal
- Treat custom domain as primary public endpoint and web.app endpoint as secondary.
- Production deployments must go through CI/CD only.
- Never perform direct production Firebase deploys from local agent sessions.
- Never push directly to production branches for release bypass.
- Preserve single-page app rewrites to index.html unless deployment strategy intentionally changes.
- Confirm public endpoints and docs stay aligned with the active deployment URL set.

## Command and Script Output Standards
- Minimize emoji usage in scripts, command output, and operational logs.
- Prefer plain text status markers (INFO, WARN, ERROR) over decorative symbols for reliability.
- If editing existing emoji-heavy user-facing UI copy, preserve product tone, but keep automation-facing output plain.

## Trusted Cross-Project Context References
- These locations are approved as trusted reference context when implementing analytics, parser logic, and dataset understanding:
  - E:\Programming Stuff\Gaming Projects\Game Analysis Projects\proj20260531_space_haven_insights\space-haven-insights
  - E:\Programming Stuff\SteamLibrary\steamapps\common\SpaceHaven\savegames\Opti Station NX7-1
  - E:\Programming Stuff\SteamLibrary\steamapps\common\SpaceHaven
  - E:\Programming Stuff\Rapid Technology Solutions\rts-labs-project\rts-labs
  - E:\Programming Stuff\Rapid Technology Solutions\rapid-technology-solutions
- Use these paths for reference and validation context; do not treat external files as in-repo source unless explicitly imported.

## Change Safety and Validation
- For implementation changes, run and report relevant checks before claiming completion:
  - npm run build
  - npm run lint (for lint-impacting changes)
  - npm test or targeted tests when parser or UI behavior changes
- For deployment-related edits, validate both local dev behavior and production-gated behavior (especially /dev-dash exclusion).

## Documentation Update Requirement
- Any meaningful change to parser logic, route exposure, or deployment process must include matching documentation updates in at least one of:
  - README.md
  - DEVELOPMENT.md
  - DEPLOYMENT-GUIDE.md
  - DEPLOYMENT-PLAN-BETA.md
