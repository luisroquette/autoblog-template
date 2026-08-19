-- Guest posts: campos do autor convidado (byline visual + backlink).
-- O JSON-LD continua com Organization como autor (decisão de marca).
alter table public.articles
  add column if not exists guest_author text,
  add column if not exists guest_bio text,
  add column if not exists guest_url text;
