"use client";
import Link from 'next/link';
import ArticleCard from './ArticleCard';
import type { Article } from '@/lib/blog/supabase-blog';

interface HomeBlogSectionProps {
  articles: Pick<Article, 'slug' | 'title' | 'meta_desc' | 'cover_url' | 'keyword' | 'published_at'>[];
}

export default function HomeBlogSection({ articles }: HomeBlogSectionProps) {
  if (articles.length === 0) return null;

  return (
    <div className="liquid-glass-strong rounded-3xl overflow-hidden p-8 md:p-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary mb-2">
            Blog
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Conteúdo sobre mobilidade elétrica
          </h2>
        </div>
        <Link
          href="/blog"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Ver todos os artigos →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      <div className="mt-6 sm:hidden">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Ver todos os artigos →
        </Link>
      </div>
    </div>
  );
}
