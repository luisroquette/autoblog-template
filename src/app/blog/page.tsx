// src/app/blog/page.tsx
// ⚙️ CONFIGURAR: title, description, canonical, textos da página

import type { Metadata } from 'next';
import { getAllArticles } from '@/lib/blog/supabase-blog';
import type { Article } from '@/lib/blog/supabase-blog';
import ArticleCard from '@/components/blog/ArticleCard';
import BlogPagination from '@/components/blog/BlogPagination';

export const revalidate = 3600; // ISR 1h

export const metadata: Metadata = {
  title: 'Blog — [Tópico Principal] | [Nome do Site]',
  description: '[Descrição do blog em 1–2 frases com keywords do nicho].',
  alternates: { canonical: 'https://seudominio.com.br/blog' },
};

const PAGE_SIZE = 12;

export default async function BlogPage() {
  let articles: Article[] = [];
  try {
    articles = await getAllArticles();
  } catch {
    // Supabase indisponível em build time — retorna listagem vazia
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-16">
        <header className="mb-12 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Blog {/* ⚙️ CONFIGURAR */}
          </h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            [Descrição do blog em 1–2 frases] {/* ⚙️ CONFIGURAR */}
          </p>
        </header>

        {articles.length === 0 ? (
          <p className="text-center text-muted-foreground">Nenhum artigo publicado ainda.</p>
        ) : (
          <BlogPagination articles={articles} pageSize={PAGE_SIZE} />
        )}
      </div>
    </main>
  );
}
