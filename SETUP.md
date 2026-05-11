# Autoblog White-Label — Setup Rápido

## 1. Copiar arquivos para o projeto

```
src/lib/blog/          → copiar pasta inteira
src/app/api/blog/      → copiar pasta inteira
src/app/blog/          → copiar pasta inteira
src/components/blog/   → copiar pasta inteira
vercel.json            → mesclar com o existente (não sobrescrever)
```

## 2. Instalar dependências

```bash
npm install openai googleapis react-markdown remark-gfm
```

## 3. Configurar variáveis de ambiente

Copiar `.env` deste diretório para `.env.local` do projeto.
Substituir os 3 placeholders de Supabase e o CRON_SECRET.

```bash
# Gerar CRON_SECRET:
openssl rand -hex 32

# Adicionar na Vercel (usar printf, não echo):
printf "%s" "SEU_CRON_SECRET" | vercel env add CRON_SECRET production
printf "%s" "SUA_SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
printf "%s" "SUA_ANON_KEY"     | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
printf "%s" "SUA_SERVICE_KEY"  | vercel env add SUPABASE_SERVICE_ROLE_KEY production
# As demais (DEEPSEEK, OPENAI, GOOGLE_*) já estão no .env — copiar direto
```

## 4. Criar tabelas no Supabase

```sql
CREATE TABLE articles (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text UNIQUE NOT NULL,
  title        text NOT NULL,
  meta_desc    text,
  content      text NOT NULL,
  cover_url    text,
  keyword      text,
  published_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX articles_published_at_idx ON articles (published_at DESC);

CREATE TABLE blog_run_log (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_date   date UNIQUE NOT NULL,
  keyword    text,
  status     text NOT NULL,
  error      text,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

## 5. Criar bucket no Supabase Storage

Nome: `blog-covers` | Visibilidade: **Public**

## 6. Configurar os 4 pontos brand-specific

| Arquivo | O que configurar |
|---------|-----------------|
| `src/lib/blog/seed-keywords.ts` | Keywords do nicho (mín. 10) |
| `src/lib/blog/gsc.ts` | `SITE_URL` com domínio do projeto |
| `src/lib/blog/deepseek.ts` | `SYSTEM_PROMPT` com empresa, tom, links internos, CTA |
| `src/app/blog/[slug]/page.tsx` | `SITE_NAME`, `SITE_URL`, `LOGO_URL`, `CTA_*` |

## 7. Testar

```bash
# Deploy e testar:
curl -H "Authorization: Bearer $CRON_SECRET" https://seudominio.com.br/api/blog/generate

# Deve retornar: {"success":true,"slug":"..."}
# Tempo esperado: 30–90s (DeepSeek ~5s, gpt-image-1 ~30–60s)
```

## Referência completa

Ver `docs/autoblog-whitelabel-plan.md` no repo gaussmob-nextjs.
