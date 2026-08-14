# Graph Report - autoblog-template  (2026-08-14)

## Corpus Check
- 39 files · ~195,020 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 254 nodes · 317 edges · 22 communities (17 shown, 5 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f8714854`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Public Documentation and Security
- Governance Changelog and CI
- Publishing API and Blog UI
- TypeScript Compiler Configuration
- Runtime Dependencies
- Package Metadata and Scripts
- Content Generation Integrations
- Development Dependencies
- Article Page Rendering
- Article Lifecycle Architecture
- Interactive Lifecycle Demo
- Product Workflow Illustration
- Vercel Function Configuration
- Daily Claim Lab
- Product Site Validation
- Root Layout Metadata
- Favicon Asset
- SEO Crawl Metadata
- Site Clipboard Interaction
- Next.js Configuration

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `GET()` - 9 edges
3. `Article` - 8 edges
4. `getClient()` - 8 edges
5. `AUTOBLOG_PROFILE` - 8 edges
6. `Auto-blog Product Site` - 8 edges
7. `Auto-blog Template` - 8 edges
8. `Auto-blog Deployment Guide` - 8 edges
9. `getArticleBySlug()` - 6 edges
10. `claimBlogRunToday()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --references--> `The Article Cycle (Cron -> Editorial Profile -> Generation -> Supabase -> /blog)`  [INFERRED]
  src/app/api/blog/generate/route.ts → README.md
- `AUTOBLOG_PROFILE` --references--> `What You Control (AUTOBLOG_PROFILE config)`  [INFERRED]
  src/lib/autoblog-profile.ts → README.md
- `Secrets, real domains, customer data, and environment files excluded` --semantically_similar_to--> `Private context exclusion`  [INFERRED] [semantically similar]
  CONTRIBUTING.md → .github/ISSUE_TEMPLATE/feature_request.yml
- `Secrets, real domains, customer data, and environment files excluded` --semantically_similar_to--> `Keys, private URLs, customer data, and environment files excluded`  [INFERRED] [semantically similar]
  CONTRIBUTING.md → .github/ISSUE_TEMPLATE/bug_report.yml
- `Secrets, real domains, customer data, and environment files excluded` --semantically_similar_to--> `Secret-free and private-data-free changes`  [INFERRED] [semantically similar]
  CONTRIBUTING.md → .github/pull_request_template.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Built-In Publication Guardrails** — docs_index_daily_claim_guardrail, docs_index_rls_published_only, docs_index_zero_bundled_credentials [EXTRACTED 1.00]
- **Core Publication Architecture** — readme_central_editorial_profile, readme_daily_execution_claim, readme_supabase_persistence_rls, readme_seo_content_quality [EXTRACTED 1.00]
- **Safe Deployment Sequence** — setup_company_profile_first, setup_dedicated_supabase_project, setup_predeploy_validation, setup_manual_pipeline_test, setup_first_publication_checklist [EXTRACTED 1.00]

## Communities (22 total, 5 thin omitted)

### Community 0 - "Public Documentation and Security"
Cohesion: 0.06
Nodes (37): Code-Owned Editorial Controls, Daily Claim Guardrail, Define Generate Store Publish, Editorial Direction Pipeline, Explicit Infrastructure Costs, Optional AI Pipeline, Owned Publishing System, Auto-blog Product Site (+29 more)

### Community 1 - "Governance Changelog and CI"
Cohesion: 0.06
Nodes (36): Auto-blog Template changelog, Idempotent daily reservation and interrupted-run recovery, nanoid transitive vulnerability remediation, Neil Patel blogpost guide, On-page SEO article-generation checklist, Optional text, cover, and Search Console integrations, Paid integrations disabled until explicit configuration, Per-installation cron secret (+28 more)

### Community 2 - "Publishing API and Blog UI"
Cohesion: 0.13
Nodes (25): The Article Cycle (Cron -> Editorial Profile -> Generation -> Supabase -> /blog), dynamic, GET(), maxDuration, BlogPage(), metadata, revalidate, ArticleCard() (+17 more)

### Community 3 - "TypeScript Compiler Configuration"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 4 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (17): googleapis, next, openai, dependencies, googleapis, next, openai, react (+9 more)

### Community 5 - "Package Metadata and Scripts"
Cohesion: 0.13
Nodes (14): license, name, overrides, gaxios, postcss, sharp, private, scripts (+6 more)

### Community 6 - "Content Generation Integrations"
Cohesion: 0.24
Nodes (11): What You Control (AUTOBLOG_PROFILE config), Generated Content Quality (SEO on-page checklist), AUTOBLOG_PROFILE, ArticleContent, buildUserPrompt(), generateArticle(), parseResponse(), fetchTopKeyword() (+3 more)

### Community 7 - "Development Dependencies"
Cohesion: 0.15
Nodes (13): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, @types/node, @types/react, @types/react-dom (+5 more)

### Community 8 - "Article Page Rendering"
Cohesion: 0.31
Nodes (7): ArticlePage(), generateMetadata(), Props, revalidate, ArticleBody(), ArticleBodyProps, getArticleBySlug()

### Community 9 - "Article Lifecycle Architecture"
Cohesion: 0.38
Nodes (7): Auto-blog article lifecycle map, Editorial brief with keywords, tone, and internal links, Integrations are opt-in, Optional text, SEO, and cover production, SEO and schema page on the owner's Next.js blog, Daily claim, row-level security, and published status control, Owner controls domain, database, credentials, frequency, and publishing

### Community 10 - "Interactive Lifecycle Demo"
Cohesion: 0.38
Nodes (7): Animated Auto-blog article lifecycle walkthrough, Blog stage with SEO, schema, and Next.js, Brief stage with keywords, tone, and internal links, Control stage with daily claim, RLS, and publication status, Owner controls domain, database, credentials, frequency, and publication, Production stage with optional text, SEO, and cover, Sequential highlighting of article pipeline stages

### Community 11 - "Product Workflow Illustration"
Cohesion: 0.33
Nodes (6): Content analytics dashboard, Illustrated automated blog content pipeline, Content processing and editing workspace, Published article page, Multiple source content cards, Flow from source material through article production to analytics

### Community 12 - "Vercel Function Configuration"
Cohesion: 0.33
Nodes (5): crons, functions, src/app/api/blog/generate/route.ts, maxDuration, memory

### Community 13 - "Daily Claim Lab"
Cohesion: 0.40
Nodes (3): claimLab, claimTabs, claimViews

### Community 14 - "Product Site Validation"
Cohesion: 0.40
Nodes (4): docs, ids, refs, root

## Knowledge Gaps
- **95 isolated node(s):** `Props`, `ArticleBodyProps`, `InsertArticleInput`, `.next/dev/types/**/*.ts`, `next-env.d.ts` (+90 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Runtime Dependencies` to `Package Metadata and Scripts`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Development Dependencies` to `Package Metadata and Scripts`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `Props`, `ArticleBodyProps`, `InsertArticleInput` to the rest of the system?**
  _95 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Public Documentation and Security` be split into smaller, more focused modules?**
  _Cohesion score 0.06156156156156156 - nodes in this community are weakly interconnected._
- **Should `Governance Changelog and CI` be split into smaller, more focused modules?**
  _Cohesion score 0.06349206349206349 - nodes in this community are weakly interconnected._
- **Should `Publishing API and Blog UI` be split into smaller, more focused modules?**
  _Cohesion score 0.12834224598930483 - nodes in this community are weakly interconnected._
- **Should `TypeScript Compiler Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._