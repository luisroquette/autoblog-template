# Graph Report - .  (2026-08-08)

## Corpus Check
- 33 files · ~193,770 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 163 nodes · 229 edges · 18 communities (14 shown, 4 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- TypeScript Compiler Config
- Article Generation Pipeline
- Core Dependencies
- Contribution & Release Governance
- Package Manifest & Overrides
- Blog Listing UI
- Lint & Dev Tooling
- Editorial Prompt & Content Quality
- TypeScript Include/Exclude Rules
- Article Detail Page
- Editorial Profile & Keyword Sourcing
- Vercel Cron Config
- Root Layout
- Next.js Config
- Pipeline Walkthrough Asset
- Honest Limits Disclaimer

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `GET()` - 9 edges
3. `AUTOBLOG_PROFILE` - 8 edges
4. `getClient()` - 8 edges
5. `Article` - 8 edges
6. `Security Policy (secrets handling, private vulnerability reporting)` - 7 edges
7. `scripts` - 6 edges
8. `generateArticle()` - 6 edges
9. `claimBlogRunToday()` - 6 edges
10. `getArticleBySlug()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `The Article Cycle (Cron -> Editorial Profile -> Generation -> Supabase -> /blog)` --references--> `GET()`  [INFERRED]
  README.md → src/app/api/blog/generate/route.ts
- `What You Control (AUTOBLOG_PROFILE config)` --references--> `AUTOBLOG_PROFILE`  [INFERRED]
  README.md → src/lib/autoblog-profile.ts
- `Auto-blog Template README Overview` --references--> `Auto-blog Hero Illustration (pautas -> producao -> artigo -> metricas)`  [EXTRACTED]
  README.md → assets/autoblog-hero.png
- `Bug Report Issue Template` --conceptually_related_to--> `Security Policy (secrets handling, private vulnerability reporting)`  [INFERRED]
  .github/ISSUE_TEMPLATE/bug_report.yml → SECURITY.md
- `Feature Request Issue Template` --conceptually_related_to--> `Security Policy (secrets handling, private vulnerability reporting)`  [INFERRED]
  .github/ISSUE_TEMPLATE/feature_request.yml → SECURITY.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **GitHub Contribution & Governance Docs** — github_issue_template_bug_report_bugreportform, github_issue_template_feature_request_featurerequestform, github_pull_request_template_prtemplate, contributing_contributing_guidelines, security_security_policy [INFERRED 0.85]
- **Auto-blog Pipeline Visual Representation** — readme_o_ciclo_de_um_artigo, assets_autoblog_hero_heroimage, assets_pipeline_map_diagram [INFERRED 0.85]
- **Build/Lint/Audit Validation Gate Across Contribution Workflow** — contributing_contributing_guidelines, github_pull_request_template_prtemplate, setup_setup_guide, github_workflows_ci_ciworkflow [INFERRED 0.85]

## Communities (18 total, 4 thin omitted)

### Community 0 - "TypeScript Compiler Config"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 1 - "Article Generation Pipeline"
Cohesion: 0.25
Nodes (15): dynamic, GET(), maxDuration, generateAndUploadCover(), claimBlogRunToday(), getAllArticles(), getClient(), getPublishedKeywords() (+7 more)

### Community 2 - "Core Dependencies"
Cohesion: 0.12
Nodes (17): googleapis, next, openai, dependencies, googleapis, next, openai, react (+9 more)

### Community 3 - "Contribution & Release Governance"
Cohesion: 0.20
Nodes (15): Auto-blog Hero Illustration (pautas -> producao -> artigo -> metricas), Pipeline Map Diagram (Pauta -> Producao -> Controle -> Seu blog), Changelog Entry v0.1.0 (initial white-label template release), Contributing Guidelines, Bug Report Issue Template, Feature Request Issue Template, Pull Request Template Checklist, CI Workflow (checkout, setup-node, npm ci, audit:runtime, lint, build) (+7 more)

### Community 4 - "Package Manifest & Overrides"
Cohesion: 0.13
Nodes (14): license, name, overrides, gaxios, postcss, sharp, private, scripts (+6 more)

### Community 5 - "Blog Listing UI"
Cohesion: 0.24
Nodes (9): BlogPage(), metadata, revalidate, ArticleCard(), ArticleCardProps, BlogPagination(), BlogPaginationProps, HomeBlogSectionProps (+1 more)

### Community 6 - "Lint & Dev Tooling"
Cohesion: 0.15
Nodes (13): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, @types/node, @types/react, @types/react-dom (+5 more)

### Community 7 - "Editorial Prompt & Content Quality"
Cohesion: 0.33
Nodes (8): GHSA-2v37-7h3g-55p8 nanoid Vulnerability, SEO On-Page Checklist in Article Generation Prompt (deepseek.ts, Neil Patel-based), Changelog Entry v0.2.0 (SEO checklist + nanoid fix), Generated Content Quality (SEO on-page checklist), ArticleContent, buildUserPrompt(), generateArticle(), parseResponse()

### Community 8 - "TypeScript Include/Exclude Rules"
Cohesion: 0.22
Nodes (8): .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude, include

### Community 9 - "Article Detail Page"
Cohesion: 0.31
Nodes (7): ArticlePage(), generateMetadata(), Props, revalidate, ArticleBody(), ArticleBodyProps, getArticleBySlug()

### Community 10 - "Editorial Profile & Keyword Sourcing"
Cohesion: 0.46
Nodes (5): AUTOBLOG_PROFILE, fetchTopKeyword(), getDayOfYear(), getNextSeedKeyword(), SEED_KEYWORDS

### Community 11 - "Vercel Cron Config"
Cohesion: 0.33
Nodes (5): crons, functions, src/app/api/blog/generate/route.ts, maxDuration, memory

## Knowledge Gaps
- **69 isolated node(s):** `Article Content Pipeline Walkthrough`, `nextConfig`, `name`, `version`, `private` (+64 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AUTOBLOG_PROFILE` connect `Editorial Profile & Keyword Sourcing` to `Article Generation Pipeline`, `Contribution & Release Governance`, `Blog Listing UI`, `Editorial Prompt & Content Quality`, `Article Detail Page`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `What You Control (AUTOBLOG_PROFILE config)` connect `Contribution & Release Governance` to `Editorial Profile & Keyword Sourcing`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Core Dependencies` to `Package Manifest & Overrides`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `Article Content Pipeline Walkthrough`, `nextConfig`, `name` to the rest of the system?**
  _69 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Core Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `Package Manifest & Overrides` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._