-- 003: colunas da Onda B — cover_alt (alt descritivo da capa), page_title (título SEO
-- separado do H1 editorial), category (arquitetura da informação).
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS cover_alt text,
  ADD COLUMN IF NOT EXISTS page_title text,
  ADD COLUMN IF NOT EXISTS category text;
