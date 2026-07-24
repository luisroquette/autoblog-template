# Graph Report - autoblog-template (2026-07-24)

## Corpus Check
- 32 files · ~193,141 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 153 nodes · 202 edges · 20 communities (16 shown, 4 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- TypeScript compilation
- Runtime dependencies
- Blog listing and pagination
- Lint toolchain
- Package metadata and overrides
- Generation API orchestration
- Editorial profile and providers
- TypeScript build artifacts
- Article rendering and schema
- Documentation and contributions
- Vercel scheduled execution
- Showcase visual flow
- Execution and integration concepts
- Security boundaries
- Root application shell
- Supabase persistence and RLS
- Next.js configuration
- Published content access

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `GET()` - 8 edges
3. `getClient()` - 8 edges
4. `Article` - 8 edges
5. `AUTOBLOG_PROFILE` - 7 edges
6. `include` - 6 edges
7. `scripts` - 5 edges
8. `generateArticle()` - 5 edges
9. `fetchTopKeyword()` - 5 edges
10. `claimBlogRunToday()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Isolated Installation` --semantically_similar_to--> `Secret and Customer Data Handling`  [INFERRED] [semantically similar]
  SETUP.md → SECURITY.md
- `Server-only Credentials` --semantically_similar_to--> `Secret and Customer Data Handling`  [INFERRED] [semantically similar]
  SETUP.md → SECURITY.md
- `Daily Execution Claim` --conceptually_related_to--> `Manual Pipeline Test`  [INFERRED]
  README.md → SETUP.md
- `Explicit Optional Integrations` --conceptually_related_to--> `Manual Pipeline Test`  [INFERRED]
  README.md → SETUP.md
- `Auto-blog Template Overview` --references--> `Contribution Guide`  [EXTRACTED]
  README.md → CONTRIBUTING.md

## Import Cycles
- None detected.

## Communities (20 total, 4 thin omitted)

### Community 0 - "TypeScript compilation"
Cohesion: 0.10
Nodes (21): dom, dom.iterable, esnext, ./src/*, compilerOptions, allowJs, esModuleInterop, incremental (+13 more)

### Community 1 - "Runtime dependencies"
Cohesion: 0.12
Nodes (17): googleapis, next, openai, dependencies, googleapis, next, openai, react (+9 more)

### Community 2 - "Blog listing and pagination"
Cohesion: 0.25
Nodes (9): BlogPage(), metadata, ArticleCard(), ArticleCardProps, BlogPagination(), BlogPaginationProps, HomeBlogSectionProps, Article (+1 more)

### Community 3 - "Lint toolchain"
Cohesion: 0.15
Nodes (13): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, @types/node, @types/react, @types/react-dom (+5 more)

### Community 4 - "Package metadata and overrides"
Cohesion: 0.15
Nodes (12): license, name, overrides, postcss, sharp, private, scripts, build (+4 more)

### Community 5 - "Generation API orchestration"
Cohesion: 0.41
Nodes (10): GET(), generateAndUploadCover(), claimBlogRunToday(), getClient(), getPublishedKeywords(), getRunDate(), insertArticle(), InsertArticleInput (+2 more)

### Community 6 - "Editorial profile and providers"
Cohesion: 0.30
Nodes (8): AUTOBLOG_PROFILE, ArticleContent, buildUserPrompt(), generateArticle(), parseResponse(), fetchTopKeyword(), getDayOfYear(), getNextSeedKeyword()

### Community 7 - "TypeScript build artifacts"
Cohesion: 0.22
Nodes (8): .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude, include

### Community 8 - "Article rendering and schema"
Cohesion: 0.36
Nodes (6): ArticlePage(), generateMetadata(), Props, ArticleBody(), ArticleBodyProps, getArticleBySlug()

### Community 9 - "Documentation and contributions"
Cohesion: 0.47
Nodes (6): Contribution Guide, Build Verification, CI Workflow, Auto-blog Template Overview, Security Policy, Deployment Setup Guide

### Community 10 - "Vercel scheduled execution"
Cohesion: 0.33
Nodes (5): crons, functions, src/app/api/blog/generate/route.ts, maxDuration, memory

### Community 11 - "Showcase visual flow"
Cohesion: 0.67
Nodes (3): Editorial Automation Hero Flow, Article Content Pipeline Map, Article Content Pipeline Walkthrough

### Community 12 - "Execution and integration concepts"
Cohesion: 0.67
Nodes (3): Daily Execution Claim, Explicit Optional Integrations, Manual Pipeline Test

### Community 13 - "Security boundaries"
Cohesion: 0.67
Nodes (3): Secret and Customer Data Handling, Isolated Installation, Server-only Credentials

## Knowledge Gaps
- **61 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `license` (+56 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Runtime dependencies` to `Package metadata and overrides`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Lint toolchain` to `Package metadata and overrides`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `TypeScript compilation` to `TypeScript build artifacts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _67 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript compilation` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `Runtime dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
