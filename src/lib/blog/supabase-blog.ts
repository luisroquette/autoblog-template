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
  page_title: string | null;
  meta_desc: string | null;
  content: string;
  cover_url: string | null;
  cover_alt: string | null;
  keyword: string | null;
  category: string | null;
  published_at: string;
  // Guest post (migration 008) — opcionais porque tabelas antigas podem não ter
  guest_author?: string | null;
  guest_bio?: string | null;
  guest_url?: string | null;
}

/** Campos leves para listagem — sem `content`, que pesa centenas de KB no ISR. */
export interface ArticleSummary {
  slug: string;
  title: string;
  meta_desc: string | null;
  cover_url: string | null;
  keyword: string | null;
  category: string | null;
  published_at: string;
}

export interface InsertArticleInput {
  slug: string;
  title: string;
  page_title: string | null;
  meta_desc: string | null;
  content: string;
  cover_url: string | null;
  cover_alt: string | null;
  keyword: string | null;
  category: string | null;
  guest_author?: string | null;
  guest_bio?: string | null;
  guest_url?: string | null;
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

/** Candidatos de interlinkagem: slugs/títulos publicados para alimentar o prompt. */
export async function getLinkCandidates(): Promise<Array<{ slug: string; title: string }>> {
  const supabase = getClient();
  const { data } = await supabase
    .from('articles')
    .select('slug, title')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(30);
  return data ?? [];
}

export async function getAllArticles(): Promise<ArticleSummary[]> {
  const supabase = getClient();
  const { data } = await supabase
    .from('articles')
    .select('slug, title, meta_desc, cover_url, keyword, category, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  return data ?? [];
}

export async function getArticlesByCategory(category: string): Promise<ArticleSummary[]> {
  const supabase = getClient();
  const { data } = await supabase
    .from('articles')
    .select('slug, title, meta_desc, cover_url, keyword, category, published_at')
    .eq('status', 'published')
    .eq('category', category)
    .order('published_at', { ascending: false });
  return data ?? [];
}

/** Slug + content de todos os publicados — usado na auditoria de links. */
export async function getAllArticleContents(): Promise<Array<{ slug: string; content: string }>> {
  const supabase = getClient();
  const { data } = await supabase
    .from('articles')
    .select('slug, content')
    .eq('status', 'published');
  return data ?? [];
}

/** Checagem barata de existência (sem baixar content) — validação de comentários. */
export async function articleSlugExists(slug: string): Promise<boolean> {
  const supabase = getClient();
  const { data } = await supabase
    .from('articles')
    .select('slug')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return !!data;
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

/** Upload genérico no bucket blog-covers (capa e imagens do corpo). */
export async function uploadImageToStorage(
  path: string,
  buffer: Buffer,
  contentType: string,
): Promise<string | null> {
  const supabase = getClient();
  const { error } = await supabase.storage
    .from('blog-covers')
    .upload(path, buffer, { contentType, upsert: true });
  if (error) {
    console.error('[uploadImageToStorage] Storage error:', error.message);
    return null;
  }
  const { data } = supabase.storage.from('blog-covers').getPublicUrl(path);
  return data.publicUrl;
}
