-- Métricas próprias do blog (independentes de GA4): views, engajamento
-- (scroll50 = metade do artigo lida, end = fim da página) e cliques de CTA
-- (com variante do A/B). O beacon vive no artigo e grava via service role.
create table if not exists public.blog_metrics (
  id uuid primary key default gen_random_uuid(),
  article_slug text not null,
  event text not null check (event in ('view', 'scroll50', 'end', 'cta')),
  variant text,
  created_at timestamptz not null default now()
);

create index if not exists blog_metrics_slug_event_idx
  on public.blog_metrics (article_slug, event);

alter table public.blog_metrics enable row level security;
-- No policy needed: service role only (mesmo padrão de blog_run_log).
