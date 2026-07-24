// src/lib/blog/supabase-blog.ts
import { createClient } from '@supabase/supabase-js';

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  meta_desc: string | null;
  content: string;
  cover_url: string | null;
  keyword: string | null;
  published_at: string;
}

export interface InsertArticleInput {
  slug: string;
  title: string;
  meta_desc: string | null;
  content: string;
  cover_url: string | null;
  keyword: string | null;
}

function getRunDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Claims today's run before generation, preventing concurrent cron duplicates. */
export async function claimBlogRunToday(): Promise<boolean> {
  const supabase = getClient();
  const runDate = getRunDate();
  const { data: existing } = await supabase
    .from('blog_run_log')
    .select('status, created_at')
    .eq('run_date', runDate)
    .single();

  if (existing?.status === 'success') return false;

  const staleBefore = new Date(Date.now() - 10 * 60_000).toISOString();
  if (existing?.status === 'running' && existing.created_at >= staleBefore) return false;

  if (existing?.status === 'error' || existing?.status === 'running') {
    let retry = supabase
      .from('blog_run_log')
      .update({ status: 'running', error: null })
      .eq('run_date', runDate)
      .eq('status', existing.status);
    if (existing.status === 'running') retry = retry.lt('created_at', staleBefore);
    const { data } = await retry.select('id').maybeSingle();
    return !!data;
  }

  const { error } = await supabase
    .from('blog_run_log')
    .insert({ run_date: runDate, status: 'running' });
  return !error;
}

export async function getPublishedKeywords(): Promise<string[]> {
  const supabase = getClient();
  const { data } = await supabase
    .from('articles')
    .select('keyword')
    .eq('status', 'published');
  return (data ?? []).map((r: { keyword: string | null }) => r.keyword ?? '').filter(Boolean);
}

export async function insertArticle(input: InsertArticleInput): Promise<string> {
  const supabase = getClient();
  const candidates = [input.slug, `${input.slug}-2`, `${input.slug}-3`];

  for (const slug of candidates) {
    const { error } = await supabase.from('articles').insert({ ...input, slug });
    if (!error) return slug;
    // 23505 = unique_violation in PostgreSQL
    if (error.code !== '23505') throw new Error(`Supabase insert error: ${error.message}`);
  }

  throw new Error('slug_collision');
}

export async function insertRunLog(params: {
  keyword?: string;
  status: 'success' | 'error';
  error?: string;
}): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase
    .from('blog_run_log')
    .update(params)
    .eq('run_date', getRunDate())
    .eq('status', 'running');
  if (error) console.error('[insertRunLog] Supabase error:', error.message);
}

export async function getAllArticles(): Promise<Article[]> {
  const supabase = getClient();
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  return data ?? [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = getClient();
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  return data ?? null;
}

export async function uploadCoverImage(
  slug: string,
  buffer: Buffer
): Promise<string | null> {
  const supabase = getClient();
  const path = `${slug}.png`;
  const { error } = await supabase.storage
    .from('blog-covers')
    .upload(path, buffer, { contentType: 'image/png', upsert: true });
  if (error) {
    console.error('[uploadCoverImage] Storage error:', error.message);
    return null;
  }
  const { data } = supabase.storage.from('blog-covers').getPublicUrl(path);
  return data.publicUrl;
}
