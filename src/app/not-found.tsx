import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-4xl font-bold text-foreground mb-3">
          Página não encontrada
        </h1>
        <p className="text-muted-foreground mb-8">
          O conteúdo que você procura não existe ou mudou de endereço.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-3 font-semibold text-sm transition-all"
        >
          ← Voltar ao blog
        </Link>
      </div>
    </main>
  );
}
