# Graph Report - .  (2026-08-08)

## Corpus Check
- 33 files · ~193,770 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 163 nodes · 219 edges · 17 communities (12 shown, 5 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.81)
- Token cost: 99,540 input · 0 output

## Community Hubs (Navigation)
- TypeScript Compiler Config
- SEO Checklist & Release Governance
- Core Dependencies
- Package Manifest & Overrides
- Article Generation Pipeline
- Blog Listing UI
- Lint & Dev Tooling
- Editorial Profile & Prompt Generation
- Article Detail Page
- Vercel Cron Config
- Root Layout
- Database Schema
- Next.js Config
- Pipeline Walkthrough Asset
- Honest Limits Disclaimer

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `GET()` - 8 edges
3. `getClient()` - 8 edges
4. `Article` - 8 edges
5. `AUTOBLOG_PROFILE` - 7 edges
6. `Security Policy (secrets handling, private vulnerability reporting)` - 7 edges
7. `scripts` - 6 edges
8. `include` - 6 edges
9. `generateArticle()` - 5 edges
10. `fetchTopKeyword()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Auto-blog Template README Overview` --references--> `Auto-blog Hero Illustration (pautas -> producao -> artigo -> metricas)`  [EXTRACTED]
  README.md → assets/autoblog-hero.png
- `Bug Report Issue Template` --conceptually_related_to--> `Security Policy (secrets handling, private vulnerability reporting)`  [INFERRED]
  .github/ISSUE_TEMPLATE/bug_report.yml → SECURITY.md
- `Feature Request Issue Template` --conceptually_related_to--> `Security Policy (secrets handling, private vulnerability reporting)`  [INFERRED]
  .github/ISSUE_TEMPLATE/feature_request.yml → SECURITY.md
- `Contributing Guidelines` --conceptually_related_to--> `Pull Request Template Checklist`  [INFERRED]
  CONTRIBUTING.md → .github/pull_request_template.md
- `Contributing Guidelines` --conceptually_related_to--> `Integrations and Costs (opt-in providers)`  [INFERRED]
  CONTRIBUTING.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **GitHub Contribution & Governance Docs** — github_issue_template_bug_report_bugreportform, github_issue_template_feature_request_featurerequestform, github_pull_request_template_prtemplate, contributing_contributing_guidelines, security_security_policy [INFERRED 0.85]
- **Auto-blog Pipeline Visual Representation** — readme_o_ciclo_de_um_artigo, assets_autoblog_hero_heroimage, assets_pipeline_map_diagram [INFERRED 0.85]
- **Build/Lint/Audit Validation Gate Across Contribution Workflow** — contributing_contributing_guidelines, github_pull_request_template_prtemplate, setup_setup_guide, github_workflows_ci_ciworkflow [INFERRED 0.85]

## Communities (17 total, 5 thin omitted)

### Community 0 - "TypeScript Compiler Config"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 1 - "SEO Checklist & Release Governance"
Cohesion: 0.15
Nodes (19): Auto-blog Hero Illustration (pautas -> producao -> artigo -> metricas), Pipeline Map Diagram (Pauta -> Producao -> Controle -> Seu blog), GHSA-2v37-7h3g-55p8 nanoid Vulnerability, SEO On-Page Checklist in Article Generation Prompt (deepseek.ts, Neil Patel-based), Changelog Entry v0.1.0 (initial white-label template release), Changelog Entry v0.2.0 (SEO checklist + nanoid fix), Contributing Guidelines, Bug Report Issue Template (+11 more)

### Community 2 - "Core Dependencies"
Cohesion: 0.12
Nodes (17): googleapis, next, openai, dependencies, googleapis, next, openai, react (+9 more)

### Community 3 - "Package Manifest & Overrides"
Cohesion: 0.13
Nodes (14): license, name, overrides, gaxios, postcss, sharp, private, scripts (+6 more)

### Community 4 - "Article Generation Pipeline"
Cohesion: 0.32
Nodes (12): dynamic, GET(), maxDuration, generateAndUploadCover(), claimBlogRunToday(), getClient(), getPublishedKeywords(), getRunDate() (+4 more)

### Community 5 - "Blog Listing UI"
Cohesion: 0.23
Nodes (10): BlogPage(), metadata, revalidate, ArticleCard(), ArticleCardProps, BlogPagination(), BlogPaginationProps, HomeBlogSectionProps (+2 more)

### Community 6 - "Lint & Dev Tooling"
Cohesion: 0.15
Nodes (13): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, @types/node, @types/react, @types/react-dom (+5 more)

### Community 7 - "Editorial Profile & Prompt Generation"
Cohesion: 0.27
Nodes (9): AUTOBLOG_PROFILE, ArticleContent, buildUserPrompt(), generateArticle(), parseResponse(), fetchTopKeyword(), getDayOfYear(), getNextSeedKeyword() (+1 more)

### Community 8 - "Article Detail Page"
Cohesion: 0.31
Nodes (7): ArticlePage(), generateMetadata(), Props, revalidate, ArticleBody(), ArticleBodyProps, getArticleBySlug()

### Community 9 - "Vercel Cron Config"
Cohesion: 0.33
Nodes (5): crons, functions, src/app/api/blog/generate/route.ts, maxDuration, memory

## Knowledge Gaps
- **75 isolated node(s):** `Article Content Pipeline Walkthrough`, `nextConfig`, `name`, `version`, `private` (+70 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Core Dependencies` to `Package Manifest & Overrides`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Lint & Dev Tooling` to `Package Manifest & Overrides`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `Article Content Pipeline Walkthrough`, `nextConfig`, `name` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `SEO Checklist & Release Governance` be split into smaller, more focused modules?**
  _Cohesion score 0.14619883040935672 - nodes in this community are weakly interconnected._
- **Should `Core Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `Package Manifest & Overrides` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._