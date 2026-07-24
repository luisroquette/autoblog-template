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
npm install
```

## 3. Configurar variáveis de ambiente

Copiar `.env.example` para `.env.local` do projeto.
Preencher todas as variáveis com credenciais criadas para esta instalação.
Nunca copiar `.env` de outro projeto e nunca versionar `.env.local`.

```bash
# Gerar CRON_SECRET:
openssl rand -hex 32

# Adicionar na Vercel (usar printf, não echo):
printf "%s" "SEU_CRON_SECRET" | vercel env add CRON_SECRET production
printf "%s" "SUA_SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
printf "%s" "SUA_ANON_KEY"     | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
printf "%s" "SUA_SERVICE_KEY"  | vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Configure DEEPSEEK, OPENAI e GOOGLE_* somente se escolher usar essas integrações.
```

A Vercel envia `Authorization: Bearer $CRON_SECRET` nas invocações de cron.
O endpoint falha fechado quando a variável está ausente ou não corresponde.

## 4. Criar tabelas no Supabase

Aplicar `supabase/migrations/001_autoblog.sql` em um projeto Supabase novo.
Ela cria as tabelas, índices e RLS. A leitura pública fica limitada a artigos
com status `published`; logs de execução não têm leitura pública.

## 5. Criar bucket no Supabase Storage

Nome: `blog-covers` | Visibilidade: **Public**

## 6. Configurar o perfil público

Edite apenas `src/lib/autoblog-profile.ts`: marca, domínio, conteúdo do blog,
tom, keywords, links internos e CTA. Não espalhe valores de marca pela lógica
do pipeline.

Por padrão, GSC e geração de imagem estão desligados no perfil. Habilite cada
integração somente depois de configurar a variável correspondente na sua conta.

## 7. Testar

```bash
# Deploy e testar:
curl -H "Authorization: Bearer $CRON_SECRET" https://seudominio.com.br/api/blog/generate

# Deve retornar: {"success":true,"slug":"..."}
# Tempo esperado: 30–90s (DeepSeek ~5s, gpt-image-1 ~30–60s)
```

## Antes de publicar

Revise perfil, migrations, variáveis de ambiente e `SECURITY.md`. Faça o
primeiro deploy sem integrar provedores de IA ou GSC; valide leitura pública,
cron autenticado e idempotência antes de habilitar automação.
