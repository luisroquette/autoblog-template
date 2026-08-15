# Graph Report - My_Blog_Makes_Neil_Proud  (2026-08-14)

## Corpus Check
- 30 files · ~195,020 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 254 nodes · 310 edges · 26 communities (20 shown, 6 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5bedff44`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- My_Blog_Makes_Neil_Proud Product Site
- White-label Next.js and Supabase publishing template
- supabase-blog.ts
- compilerOptions
- dependencies
- package.json
- AUTOBLOG_PROFILE
- devDependencies
- [slug]/page.tsx
- Optional text, SEO, and cover production
- Control stage with daily claim, RLS, and publication status
- Illustrated automated blog content pipeline
- src/app/api/blog/generate/route.ts
- sota-claim.js
- validate-product-site.mjs
- layout.tsx
- Lime A-dot monogram on a dark background
- Public Crawl Policy
- site.js
- next.config.ts
- blog/page.tsx
- On-page SEO article-generation checklist
- include
- 001_autoblog.sql

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `GET()` - 9 edges
3. `AUTOBLOG_PROFILE` - 8 edges
4. `getClient()` - 8 edges
5. `Article` - 8 edges
6. `My_Blog_Makes_Neil_Proud Product Site` - 8 edges
7. `My_Blog_Makes_Neil_Proud` - 8 edges
8. `My_Blog_Makes_Neil_Proud Deployment Guide` - 8 edges
9. `scripts` - 6 edges
10. `include` - 6 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --references--> `The Article Cycle (Cron -> Editorial Profile -> Generation -> Supabase -> /blog)`  [INFERRED]
  src/app/api/blog/generate/route.ts → README.md
- `AUTOBLOG_PROFILE` --references--> `What You Control (AUTOBLOG_PROFILE config)`  [INFERRED]
  src/lib/autoblog-profile.ts → README.md
- `Secrets, real domains, customer data, and environment files excluded` --semantically_similar_to--> `Keys, private URLs, customer data, and environment files excluded`  [INFERRED] [semantically similar]
  CONTRIBUTING.md → .github/ISSUE_TEMPLATE/bug_report.yml
- `Secrets, real domains, customer data, and environment files excluded` --semantically_similar_to--> `Private context exclusion`  [INFERRED] [semantically similar]
  CONTRIBUTING.md → .github/ISSUE_TEMPLATE/feature_request.yml
- `Secrets, real domains, customer data, and environment files excluded` --semantically_similar_to--> `Secret-free and private-data-free changes`  [INFERRED] [semantically similar]
  CONTRIBUTING.md → .github/pull_request_template.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Built-In Publication Guardrails** — docs_index_daily_claim_guardrail, docs_index_rls_published_only, docs_index_zero_bundled_credentials [EXTRACTED 1.00]
- **Core Publication Architecture** — readme_central_editorial_profile, readme_daily_execution_claim, readme_supabase_persistence_rls, readme_seo_content_quality [EXTRACTED 1.00]
- **Safe Deployment Sequence** — setup_company_profile_first, setup_dedicated_supabase_project, setup_predeploy_validation, setup_manual_pipeline_test, setup_first_publication_checklist [EXTRACTED 1.00]

## Communities (26 total, 6 thin omitted)

### Community 0 - "My_Blog_Makes_Neil_Proud Product Site"
Cohesion: 0.06
Nodes (37): Code-Owned Editorial Controls, Daily Claim Guardrail, Define Generate Store Publish, Editorial Direction Pipeline, Explicit Infrastructure Costs, Optional AI Pipeline, Owned Publishing System, My_Blog_Makes_Neil_Proud Product Site (+29 more)

### Community 1 - "White-label Next.js and Supabase publishing template"
Cohesion: 0.10
Nodes (23): Idempotent daily reservation and interrupted-run recovery, Optional text, cover, and Search Console integrations, Paid integrations disabled until explicit configuration, Per-installation cron secret, Public reads limited to published articles, Sensitive credentials remain server-side, Single profile for brand, audience, tone, SEO, CTA, and integrations, White-label Next.js and Supabase publishing template (+15 more)

### Community 2 - "supabase-blog.ts"
Cohesion: 0.29
Nodes (13): The Article Cycle (Cron -> Editorial Profile -> Generation -> Supabase -> /blog), dynamic, GET(), maxDuration, generateAndUploadCover(), claimBlogRunToday(), getClient(), getPublishedKeywords() (+5 more)

### Community 3 - "compilerOptions"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 4 - "dependencies"
Cohesion: 0.12
Nodes (17): googleapis, next, openai, dependencies, googleapis, next, openai, react (+9 more)

### Community 5 - "package.json"
Cohesion: 0.13
Nodes (14): license, name, overrides, gaxios, postcss, sharp, private, scripts (+6 more)

### Community 6 - "AUTOBLOG_PROFILE"
Cohesion: 0.22
Nodes (11): What You Control (AUTOBLOG_PROFILE config), Generated Content Quality (SEO on-page checklist), AUTOBLOG_PROFILE, ArticleContent, buildUserPrompt(), generateArticle(), parseResponse(), fetchTopKeyword() (+3 more)

### Community 7 - "devDependencies"
Cohesion: 0.15
Nodes (13): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, @types/node, @types/react, @types/react-dom (+5 more)

### Community 8 - "[slug]/page.tsx"
Cohesion: 0.31
Nodes (7): ArticlePage(), generateMetadata(), Props, revalidate, ArticleBody(), ArticleBodyProps, getArticleBySlug()

### Community 9 - "Optional text, SEO, and cover production"
Cohesion: 0.38
Nodes (7): My_Blog_Makes_Neil_Proud article lifecycle map, Editorial brief with keywords, tone, and internal links, Integrations are opt-in, Optional text, SEO, and cover production, SEO and schema page on the owner's Next.js blog, Daily claim, row-level security, and published status control, Owner controls domain, database, credentials, frequency, and publishing

### Community 10 - "Control stage with daily claim, RLS, and publication status"
Cohesion: 0.38
Nodes (7): Animated My_Blog_Makes_Neil_Proud article lifecycle walkthrough, Blog stage with SEO, schema, and Next.js, Brief stage with keywords, tone, and internal links, Control stage with daily claim, RLS, and publication status, Owner controls domain, database, credentials, frequency, and publication, Production stage with optional text, SEO, and cover, Sequential highlighting of article pipeline stages

### Community 11 - "Illustrated automated blog content pipeline"
Cohesion: 0.33
Nodes (6): Content analytics dashboard, Illustrated automated blog content pipeline, Content processing and editing workspace, Published article page, Multiple source content cards, Flow from source material through article production to analytics

### Community 12 - "src/app/api/blog/generate/route.ts"
Cohesion: 0.33
Nodes (5): crons, functions, src/app/api/blog/generate/route.ts, maxDuration, memory

### Community 13 - "sota-claim.js"
Cohesion: 0.40
Nodes (3): claimLab, claimTabs, claimViews

### Community 14 - "validate-product-site.mjs"
Cohesion: 0.40
Nodes (4): docs, ids, refs, root

### Community 22 - "blog/page.tsx"
Cohesion: 0.23
Nodes (10): BlogPage(), metadata, revalidate, ArticleCard(), ArticleCardProps, BlogPagination(), BlogPaginationProps, HomeBlogSectionProps (+2 more)

### Community 23 - "On-page SEO article-generation checklist"
Cohesion: 0.17
Nodes (13): My_Blog_Makes_Neil_Proud changelog, nanoid transitive vulnerability remediation, Neil Patel blogpost guide, On-page SEO article-generation checklist, Real relevant external links without invented URLs, Real DeepSeek article-generation validation, Semantic Versioning, My_Blog_Makes_Neil_Proud 0.1.0 (+5 more)

### Community 24 - "include"
Cohesion: 0.22
Nodes (8): .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude, include

## Knowledge Gaps
- **98 isolated node(s):** `copyButton`, `claimLab`, `claimTabs`, `claimViews`, `nextConfig` (+93 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `compilerOptions` to `include`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `copyButton`, `claimLab`, `claimTabs` to the rest of the system?**
  _98 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `My_Blog_Makes_Neil_Proud Product Site` be split into smaller, more focused modules?**
  _Cohesion score 0.06156156156156156 - nodes in this community are weakly interconnected._
- **Should `White-label Next.js and Supabase publishing template` be split into smaller, more focused modules?**
  _Cohesion score 0.09881422924901186 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._