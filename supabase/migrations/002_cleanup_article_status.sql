-- 002: remove estados mortos de articles.status.
-- O código nunca grava 'generating'/'failed' — o check aceitava estados que não existem.
DO $$
DECLARE
  old_constraint text;
BEGIN
  SELECT conname INTO old_constraint
  FROM pg_constraint
  WHERE conrelid = 'public.articles'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) ILIKE '%generating%';

  IF old_constraint IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.articles DROP CONSTRAINT %I', old_constraint);
    ALTER TABLE public.articles
      ADD CONSTRAINT articles_status_check CHECK (status = 'published');
  END IF;
END $$;
