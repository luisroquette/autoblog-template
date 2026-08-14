# Coloque o My_Blog_Makes_Neil_Proud no ar

Este guia parte de uma cópia nova do template. Cada instalação deve ter seu
próprio projeto Supabase, domínio e variáveis de ambiente.

## 1. Crie a sua cópia

Use o botão **Fork** no GitHub e clone o repositório que ficou na sua conta:

```bash
git clone https://github.com/SEU-USUARIO/autoblog-template.git
cd autoblog-template
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

Crie um projeto Supabase novo. No SQL Editor, execute
[`supabase/migrations/001_autoblog.sql`](./supabase/migrations/001_autoblog.sql).
Ela cria `articles`, `blog_run_log`, os índices e as regras de RLS.

Depois, crie um bucket chamado `blog-covers` com visibilidade **Public**. Ele
só é necessário se você decidir habilitar capas geradas.

## 4. Preencha as variáveis locais

Abra `.env.local`. As quatro variáveis abaixo são a base da instalação:

| Variável | De onde vem | Onde pode ficar |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Configurações do projeto Supabase | Cliente e servidor |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Configurações do projeto Supabase | Cliente e servidor |
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

## 5. Valide antes do deploy

```bash
npm run lint
npm audit
npm run build
```

O build precisa terminar sem depender de credenciais de provedores externos.

## 6. Faça o deploy

Suba a aplicação na Vercel ou em uma plataforma compatível com Next.js. Cadastre
as mesmas variáveis de ambiente do `.env.local`, mas mantenha a service role e
o `CRON_SECRET` apenas no ambiente de servidor.

O [`vercel.json`](./vercel.json) agenda `/api/blog/generate` diariamente às
09:00 UTC. A Vercel envia o segredo em `Authorization: Bearer $CRON_SECRET`.
Altere o agendamento se esse horário não servir para a operação.

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

## Antes da primeira publicação automática

- [ ] Perfil editorial revisado por quem entende da empresa.
- [ ] Migrations aplicadas no projeto Supabase correto.
- [ ] Leitura pública testada sem expor logs internos.
- [ ] `CRON_SECRET` presente na plataforma de deploy.
- [ ] Custo, limite e responsável por cada integração definidos.
- [ ] Rota manual testada antes de deixar o cron rodar sozinho.

Para relatar uma vulnerabilidade, siga [SECURITY.md](./SECURITY.md) e não abra
issue com chaves, logs sensíveis ou dados de clientes.
