# Graph Report - My_Blog_Makes_Neil_Proud  (2026-08-20)

## Corpus Check
- 94 files · ~215,980 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 486 nodes · 813 edges · 43 communities (31 shown, 12 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.78)
- Token cost: 4,019 input · 1,916 output

## Community Hubs (Navigation)
- Perfil e Config do Blog
- Geração e Supabase
- Distribuição e Link Audit
- Release e Docs
- Build e Tooling
- Artigo e Schema SEO
- Config TypeScript
- Dependências
- Comentários
- Docs Pipeline Map
- ArticleBody e TOC
- Captura de Leads
- Métricas
- CTA e Conversão
- Docs Pipeline 4 Etapas
- Validador Yoast
- Imagens no Corpo
- Interlinkagem
- Vercel e Cron
- Ilustrações Docs
- Docs Product Site JS
- Script Validação Site
- Marca e Favicon
- Migration 001
- Docs Site JS
- Next Config
- PostCSS Config
- UI Pública e Migrations
- Calendário Editorial
- Comentários SQL
- Métricas SQL
- Links Quebrados SQL
- Template Issue
- Tabela Articles
- Articles Schema

## God Nodes (most connected - your core abstractions)
1. `GET()` - 23 edges
2. `AUTOBLOG_PROFILE` - 23 edges
3. `compilerOptions` - 16 edges
4. `getClient()` - 12 edges
5. `Release 1.0.0 (2026-08-19)` - 9 edges
6. `SETUP.md (guia de instalação)` - 8 edges
7. `scripts` - 7 edges
8. `POST()` - 7 edges
9. `buildSocialPost()` - 7 edges
10. `distributeArticle()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Tabela editorial_calendar` --conceptually_related_to--> `AUTOBLOG_PROFILE`  [INFERRED]
  SETUP.md → src/lib/autoblog-profile.ts
- `SETUP.md (guia de instalação)` --references--> `AUTOBLOG_PROFILE`  [EXTRACTED]
  SETUP.md → src/lib/autoblog-profile.ts
- `validate-product-site.mjs` --references--> `Product site (docs/index.html)`  [INFERRED]
  .github/workflows/ci.yml → docs/index.html
- `Bug Report Template (PT-BR)` --conceptually_related_to--> `SECURITY.md (política de segurança)`  [INFERRED]
  .github/ISSUE_TEMPLATE/bug_report.yml → SECURITY.md
- `PR Validation Checklist` --conceptually_related_to--> `SECURITY.md (política de segurança)`  [INFERRED]
  .github/pull_request_template.md → SECURITY.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Plano evolutivo em ondas (guias Neil Patel e RD Station)** — changelog_wave_a_foundations, changelog_wave_b_seo_content, changelog_wave_c_conversion, changelog_wave_d_authority [EXTRACTED 1.00]
- **Cadeia de migrations Supabase 001–008 (tabelas e RLS)** — setup_supabase_migration_chain, setup_articles_table, setup_blog_run_log_table, setup_editorial_calendar_table, setup_blog_comments_table, setup_blog_metrics_table, setup_blog_broken_links_table [EXTRACTED 1.00]
- **Endpoints protegidos por CRON_SECRET (Bearer)** — setup_daily_generate_endpoint, setup_comments_moderate_endpoint, setup_guest_posts_endpoint, setup_cron_secret_auth [EXTRACTED 1.00]
- **Autoblog Pipeline: Input, Processing, Output** — assets_autoblog_hero_input_panels, assets_autoblog_hero_processing_hub, assets_autoblog_hero_output_documents [EXTRACTED 1.00]
- **O ciclo de um artigo (pipeline stages)** — assets_pipeline_map_pauta, assets_pipeline_map_producao, assets_pipeline_map_controle, assets_pipeline_map_seu_blog [EXTRACTED 1.00]
- **Validação do banco (Controle mechanisms)** — assets_pipeline_map_claim_diario, assets_pipeline_map_rls, assets_pipeline_map_status_publicado [INFERRED 0.85]
- **Content Pipeline Flow (Pauta → Produção → Controle → Seu Blog)** — assets_pipeline_walkthrough_pauta, assets_pipeline_walkthrough_producao, assets_pipeline_walkthrough_controle, assets_pipeline_walkthrough_seu_blog [EXTRACTED 1.00]
- **Control Stage Publication Gates** — assets_pipeline_walkthrough_controle, assets_pipeline_walkthrough_daily_claim, assets_pipeline_walkthrough_rls_status [EXTRACTED 1.00]
- **Blog Brand Mark** — docs_favicon_favicon, docs_favicon_mb_monogram, docs_favicon_brand_palette [INFERRED 0.85]

## Communities (43 total, 12 thin omitted)

### Community 0 - "Perfil e Config do Blog"
Cohesion: 0.06
Nodes (32): BlogPage(), metadata, revalidate, CategoryPage(), Props, revalidate, inter, metadata (+24 more)

### Community 1 - "Geração e Supabase"
Cohesion: 0.11
Nodes (41): dynamic, GET(), maxDuration, ArticleContent, ArticleOutline, askDeepseek(), buildInternalLinksSection(), buildUserPrompt() (+33 more)

### Community 2 - "Distribuição e Link Audit"
Cohesion: 0.09
Nodes (37): GET(), maxDuration, POST(), buildDistributionArticle(), buildEmailDigestPayload(), buildSocialPost(), distributeArticle(), DISTRIBUTION_CHANNELS (+29 more)

### Community 3 - "Release e Docs"
Cohesion: 0.07
Nodes (34): Bug Report Template (PT-BR), Pull Request Template, PR Validation Checklist, CI Workflow (npm ci, audit, lint, build), validate-product-site.mjs, A/B de CTA (rotação determinística por slug+semana), Guia Neil Patel (blogpost), Guia RD Station (+26 more)

### Community 4 - "Build e Tooling"
Cohesion: 0.06
Nodes (35): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @tailwindcss/typography (+27 more)

### Community 5 - "Artigo e Schema SEO"
Cohesion: 0.12
Nodes (22): ArticlePage(), generateMetadata(), Props, revalidate, ArticleMetrics(), onScroll(), send(), CommentForm() (+14 more)

### Community 6 - "Config TypeScript"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 7 - "Dependências"
Cohesion: 0.09
Nodes (23): github-slugger, googleapis, next, openai, dependencies, github-slugger, googleapis, next (+15 more)

### Community 8 - "Comentários"
Cohesion: 0.19
Nodes (17): GET(), isAuthorized(), POST(), POST(), Comments(), Comment, CommentInput, CommentValidation (+9 more)

### Community 9 - "Docs Pipeline Map"
Cohesion: 0.20
Nodes (15): My_Blog_Makes_Neil_Proud Pipeline Map, Claim diário (deduplicação de posts), Contexto editorial (tom e links internos), Controle (validation gate), Controle total do usuário (domínio, banco, credenciais, frequência, publicação), Geração opcional de texto, Keywords, Next.js (+7 more)

### Community 10 - "ArticleBody e TOC"
Cohesion: 0.21
Nodes (10): ArticleBody(), ArticleBodyProps, components, HastElement, isVideoOnlyParagraph(), cleanInline(), extractToc(), TocItem (+2 more)

### Community 11 - "Captura de Leads"
Cohesion: 0.31
Nodes (9): POST(), deliverLead(), isHoneypot(), LEAD_PLUGINS, LeadDestination, LeadPayload, LeadValidation, resolveLeadPlugin() (+1 more)

### Community 12 - "Métricas"
Cohesion: 0.34
Nodes (11): GET(), POST(), BOT_PATTERNS, getArticleMetrics(), getClient(), insertMetric(), isLikelyBot(), isValidMetricEvent() (+3 more)

### Community 13 - "CTA e Conversão"
Cohesion: 0.26
Nodes (9): CtaButton(), CtaButtonProps, EndCta(), EndCtaProps, buildShareUrls(), CtaVariant, hasPrimaryCta(), resolveCtaVariant() (+1 more)

### Community 14 - "Docs Pipeline 4 Etapas"
Cohesion: 0.33
Nodes (10): Pipeline Walkthrough (4-Stage Content Engine), Keywords, Tone & Internal Links (Agenda Spec), Controle (Control Stage), Daily Claim, Next.js (Blog Target), Pauta (Agenda Stage), Produção (Content Production Stage), RLS & Published Status (Publication Gate) (+2 more)

### Community 15 - "Validador Yoast"
Cohesion: 0.33
Nodes (8): normalize(), fill(), makeValidInput(), rules(), validateArticle(), ValidationInput, ValidationIssue, ValidationResult

### Community 16 - "Imagens no Corpo"
Cohesion: 0.31
Nodes (5): BodyImage, injectBodyImages(), injectInfographic(), InlineCta, IMAGES

### Community 17 - "Interlinkagem"
Cohesion: 0.48
Nodes (5): LinkCandidate, ARTICLES, scoreInternalLinks(), STOPWORDS, tokenize()

### Community 18 - "Vercel e Cron"
Cohesion: 0.29
Nodes (6): crons, functions, src/app/api/blog/generate/route.ts, ignoreCommand, maxDuration, memory

### Community 19 - "Ilustrações Docs"
Cohesion: 0.70
Nodes (5): Autoblog Hero Illustration, Autoblog Analytics Line Chart, Autoblog Content Input Panels, Autoblog Published Output (Documents), Autoblog Processing Hub (Laptop)

### Community 20 - "Docs Product Site JS"
Cohesion: 0.40
Nodes (3): claimLab, claimTabs, claimViews

### Community 21 - "Script Validação Site"
Cohesion: 0.40
Nodes (4): docs, ids, refs, root

### Community 22 - "Marca e Favicon"
Cohesion: 0.67
Nodes (3): Blog Brand Palette (dark green #17201d + lime #d9ff57), Favicon (My Blog Makes Neil Proud), MB Monogram

## Knowledge Gaps
- **139 isolated node(s):** `copyButton`, `claimLab`, `claimTabs`, `claimViews`, `nextConfig` (+134 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AUTOBLOG_PROFILE` connect `Perfil e Config do Blog` to `Geração e Supabase`, `Distribuição e Link Audit`, `Release e Docs`, `Artigo e Schema SEO`, `Captura de Leads`, `CTA e Conversão`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Why does `SETUP.md (guia de instalação)` connect `Release e Docs` to `Perfil e Config do Blog`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `Tabela editorial_calendar` connect `Release e Docs` to `Perfil e Config do Blog`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `copyButton`, `claimLab`, `claimTabs` to the rest of the system?**
  _139 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Perfil e Config do Blog` be split into smaller, more focused modules?**
  _Cohesion score 0.06352941176470588 - nodes in this community are weakly interconnected._
- **Should `Geração e Supabase` be split into smaller, more focused modules?**
  _Cohesion score 0.10815602836879433 - nodes in this community are weakly interconnected._
- **Should `Distribuição e Link Audit` be split into smaller, more focused modules?**
  _Cohesion score 0.0851063829787234 - nodes in this community are weakly interconnected._