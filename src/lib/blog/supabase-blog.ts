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

export async function hasSuccessRunToday(): Promise<boolean> {
  const supabase = getClient();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD UTC
  const { data } = await supabase
    .from('blog_run_log')
    .select('id')
    .eq('run_date', today)
    .eq('status', 'success')
    .single();
  return !!data;
}

export async function getPublishedKeywords(): Promise<string[]> {
  const supabase = getClient();
  const { data } = await supabase.from('articles').select('keyword');
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
  const today = new Date().toISOString().slice(0, 10);
  const { error } = await supabase.from('blog_run_log').upsert(
    { run_date: today, ...params },
    { onConflict: 'run_date' }
  );
  if (error) console.error('[insertRunLog] Supabase error:', error.message);
}

export async function getAllArticles(): Promise<Article[]> {
  const supabase = getClient();
  const { data } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false });
  return data ?? [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = getClient();
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
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
