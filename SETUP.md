# Coloque o My_Blog_Makes_Neil_Proud no ar

Este guia parte de uma cópia nova do template. Cada instalação deve ter seu
próprio projeto Supabase, domínio e variáveis de ambiente.

## 1. Crie a sua cópia

Use o botão **Fork** no GitHub e clone o repositório que ficou na sua conta:

```bash
git clone https://github.com/SEU-USUARIO/My_Blog_Makes_Neil_Proud.git
cd My_Blog_Makes_Neil_Proud
npm ci
cp .env.example .env.local
```

`npm ci` usa exatamente o `package-lock.json`. Ele é a escolha certa para uma
instalação nova ou para CI.

## 2. Defina a empresa antes de ligar automações

Edite [`src/lib/autoblog-profile.ts`](./src/lib/autoblog-profile.ts). É ali que
ficam marca, domínio, descrição do negócio, público, tom, keywords, links
internos e CTA.

O objetivo é manter dados da empresa fora da lógica do pipeline. Não espalhe
nome, URL ou texto de CTA por componentes e prompts.

## 3. Crie o banco da instalação

Crie um projeto Supabase novo. No SQL Editor, execute as migrations de
[`supabase/migrations/`](./supabase/migrations/) EM ORDEM NUMÉRICA (001 a 008).
A 001 cria `articles` e `blog_run_log`; a 004 cria o calendário editorial
(`editorial_calendar`); a 005 cria os comentários (`blog_comments`); a 006 cria
as métricas (`blog_metrics`); a 007 cria a auditoria de links
(`blog_broken_links`); a 008 adiciona os campos de guest post em `articles`.

Depois, crie um bucket chamado `blog-covers` com visibilidade **Public**. Ele
só é necessário se você decidir habilitar capas geradas.

## 4. Preencha as variáveis locais

Abra `.env.local`. As quatro variáveis abaixo são a base da instalação:

| Variável | De onde vem | Onde pode ficar |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Configurações do projeto Supabase | Cliente e servidor |
| `SUPABASE_SERVICE_ROLE_KEY` | Configurações do projeto Supabase | Somente servidor |
| `CRON_SECRET` | Gerado por você | Somente servidor |

Gere o segredo do cron localmente:

```bash
openssl rand -hex 32
```

Nunca versione `.env.local`. Também não reutilize arquivo de ambiente de outro
projeto, mesmo que as variáveis tenham o mesmo nome.

As outras variáveis são opt-in:

| Variável | Necessária quando |
| --- | --- |
| `DEEPSEEK_API_KEY` | Você quiser gerar artigos pelo endpoint diário |
| `OPENAI_API_KEY` | `imageGenerationEnabled` estiver como `true` |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` | `googleSearchConsoleEnabled` estiver como `true` |
| `TRELLO_API_KEY`, `TRELLO_TOKEN`, `TRELLO_LIST_ID` | `leadCapture.enabled` estiver como `true` |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Canal `telegram` em `distribution.channels` |
| `EMAIL_DIGEST_WEBHOOK_URL` | Canal `email_digest` em `distribution.channels` (ex.: MailMKT da família) |
| `SOCIAL_WEBHOOK_URL` | Canal `social_webhook` em `distribution.channels` (Zapier/n8n/Make) |

## 5. Valide antes do deploy

```bash
npm run lint
npm run audit:runtime
npm run build
```

O build precisa terminar sem depender de credenciais de provedores externos.

## 6. Faça o deploy

Suba a aplicação na Vercel ou em uma plataforma compatível com Next.js. Cadastre
as mesmas variáveis de ambiente do `.env.local`, mas mantenha a service role e
o `CRON_SECRET` apenas no ambiente de servidor.

O [`vercel.json`](./vercel.json) agenda `/api/blog/generate` às 09:00 UTC de
segunda a sexta (pula fins de semana). A Vercel envia o segredo em
`Authorization: Bearer $CRON_SECRET`. Altere o agendamento se esse horário não
servir para a operação.

## 7. Teste o pipeline de propósito

Depois do deploy, com `DEEPSEEK_API_KEY` configurada, dispare uma execução
manual:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://seudominio.com.br/api/blog/generate
```

Uma execução bem-sucedida retorna `{ "success": true, "slug": "..." }`.
Confira o artigo em `/blog`, a linha de execução em `blog_run_log` e o acesso
anônimo no navegador. Um segundo disparo no mesmo dia deve retornar
`already_run_today`.

## 8. Wizard de setup e moderação de comentários

A página `/setup` mostra um checklist do que está conectado e do que falta em
cada integração — sem expor segredos, apenas a presença das variáveis.

Comentários entram pendentes. Para moderar, use o endpoint protegido pelo
`CRON_SECRET`:

```bash
# Lista pendentes
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://seudominio.com.br/api/blog/comments/moderate

# Aprova um comentário (revalida a página do artigo)
curl -X POST -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"action":"approve","id":"<uuid>"}' \
  https://seudominio.com.br/api/blog/comments/moderate
```

## 9. Guest posts (backlinks seguros)

O processo de guest post é o único caminho seguro de backlinks (guia Neil
Patel). O texto vem de um convidado humano; a revisão editorial é sua, ANTES
de publicar via endpoint protegido:

```bash
curl -X POST -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Título do artigo do convidado",
    "slug": "slug-kebab-do-artigo",
    "meta_desc": "Meta description entre 50 e 155 chars",
    "content": "Artigo completo em markdown (mínimo 800 palavras)",
    "keyword": "palavra-chave do artigo",
    "category": "guias",
    "guest_author": "Nome do Convidado",
    "guest_bio": "Uma linha sobre o convidado",
    "guest_url": "https://site-do-convidado.com.br"
  }' \
  https://seudominio.com.br/api/blog/guest-posts
```

Regras do processo:
- Validação básica é automática (título, slug, meta, 800+ palavras, URL http(s)).
- A resposta lista os `externalLinks` que o convidado inseriu — revise antes
  de aprovar (anti-link-spam).
- O byline do artigo mostra "Por [convidado]" com `rel="author"` e link seguido
  para o site dele — é a moeda do guest post.
- A divulgação pós-publish roda automaticamente se `distribution` estiver ligada.

## Antes da primeira publicação automática

- [ ] Perfil editorial revisado por quem entende da empresa.
- [ ] Migrations aplicadas no projeto Supabase correto.
- [ ] Leitura pública testada sem expor logs internos.
- [ ] `CRON_SECRET` presente na plataforma de deploy.
- [ ] Custo, limite e responsável por cada integração definidos.
- [ ] Rota manual testada antes de deixar o cron rodar sozinho.

Para relatar uma vulnerabilidade, siga [SECURITY.md](./SECURITY.md) e não abra
issue com chaves, logs sensíveis ou dados de clientes.
