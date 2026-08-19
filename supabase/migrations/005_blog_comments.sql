-- Comentários do blog: moderação obrigatória (approved=false até o dono aprovar).
-- Comentários pendentes também alimentam o calendário editorial (fonte de pautas).
create table if not exists public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  article_slug text not null,
  author_name text not null,
  content text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists blog_comments_article_idx
  on public.blog_comments (article_slug, approved);

create index if not exists blog_comments_pending_idx
  on public.blog_comments (approved, created_at);

alter table public.blog_comments enable row level security;
-- No policy needed: service role only (mesmo padrão de blog_run_log).
