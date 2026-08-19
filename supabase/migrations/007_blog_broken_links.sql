-- Auditoria de links quebrados: snapshot por execução (delete + insert por
-- artigo), consultado pelo dono via /api/blog/audit-links.
create table if not exists public.blog_broken_links (
  id uuid primary key default gen_random_uuid(),
  article_slug text not null,
  url text not null,
  status int,
  checked_at timestamptz not null default now()
);

create index if not exists blog_broken_links_slug_idx
  on public.blog_broken_links (article_slug, checked_at);

alter table public.blog_broken_links enable row level security;
-- No policy needed: service role only (mesmo padrão de blog_run_log).
