// src/app/blog/[slug]/page.tsx
// ⚙️ CONFIGURAR: SITE_NAME, SITE_URL, LOGO_URL, CTA

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug } from '@/lib/blog/supabase-blog';
import ArticleBody from '@/components/blog/ArticleBody';

export const revalidate = 86400; // ISR 24h
// dynamicParams: true é o default — novos slugs renderizados on-demand sem 404

// ⚙️ CONFIGURAR
const SITE_NAME = '[Nome do Site]';
const SITE_URL = 'https://seudominio.com.br';
const LOGO_URL = 'https://seudominio.com.br/logo.png';
const CTA_TITLE = '[Título do CTA — ex: Quer saber mais?]';
const CTA_SUBTITLE = '[Subtítulo — ex: Fale com um especialista sem compromisso.]';
const CTA_BUTTON_TEXT = '[Texto do botão]';
const CTA_URL = '[URL de contato — ex: https://wa.me/55...]';

interface Props {
  params: Promise<{ slug: string }>; // Next.js 16: params é Promise
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} | ${SITE_NAME}`,
    description: article.meta_desc ?? undefined,
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
    openGraph: {
      title: article.title,
      description: article.meta_desc ?? undefined,
      url: `${SITE_URL}/blog/${slug}`,
      images: article.cover_url ? [{ url: article.cover_url, width: 1536, height: 1024 }] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const publishedDate = new Date(article.published_at).toISOString();
  const readableDate = new Date(article.published_at).toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.meta_desc,
    image: article.cover_url,
    datePublished: publishedDate,
    dateModified: publishedDate,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${slug}` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <main className="min-h-screen bg-background">
        <div className="container max-w-3xl mx-auto px-4 py-16">
          <Link
            href="/blog"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 inline-block"
          >
            ← Blog
          </Link>

          {/* Usar <img> padrão, NÃO next/image — evita configurar remotePatterns para Supabase Storage */}
          {article.cover_url && (
            <img
              src={article.cover_url}
              alt={article.title}
              className="w-full rounded-2xl mb-8 object-cover max-h-[400px]"
            />
          )}

          <header className="mb-8">
            {article.keyword && (
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary mb-3 block">
                {article.keyword}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3">
              {article.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {SITE_NAME} · <time dateTime={publishedDate}>{readableDate}</time>
            </p>
          </header>

          <ArticleBody content={article.content} />

          <div className="mt-12 p-6 rounded-2xl border border-primary/30 bg-primary/5 text-center">
            <p className="font-semibold text-foreground mb-2">{CTA_TITLE}</p>
            <p className="text-sm text-muted-foreground mb-4">{CTA_SUBTITLE}</p>
            <a
              href={CTA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-3 font-semibold text-sm transition-all"
            >
              {CTA_BUTTON_TEXT}
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
