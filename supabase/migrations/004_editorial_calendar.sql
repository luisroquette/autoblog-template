-- Calendário editorial: pauta planejada pelo maintainer do blog.
-- Campos do guia Neil Patel: keyword, relacionadas, concorrentes, estrutura da
-- pauta, pontos de atenção, data e link do artigo publicado.
create table if not exists public.editorial_calendar (
  id uuid primary key default gen_random_uuid(),
  keyword text not null unique,
  related_keywords text[] not null default '{}',
  competitors text[] not null default '{}',
  outline_structure text,
  attention_points text,
  scheduled_date date,
  status text not null default 'planned' check (status in ('planned', 'published', 'skipped')),
  article_slug text,
  created_at timestamptz not null default now()
);

create index if not exists editorial_calendar_planned_idx
  on public.editorial_calendar (status, scheduled_date);

alter table public.editorial_calendar enable row level security;
-- No policy needed: service role only (mesmo padrão de blog_run_log).
