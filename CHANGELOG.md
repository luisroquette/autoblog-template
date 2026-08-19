# Changelog

Todas as mudanças relevantes do My_Blog_Makes_Neil_Proud são registradas aqui.

O projeto segue [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-08-19

Primeira versão estável: o plano evolutivo completo (guias Neil Patel e RD
Station) está implementado e validado — das fundações de SEO à autoridade.

### Adicionado

**Onda A — Fundações**
- Sitemap e robots dinâmicos (artigos + categorias).
- Tema visual no perfil (Tailwind v4 + Inter, CTA em cor de contraste).
- Validador pós-geração estilo Yoast com 23 regras medidas no artigo real;
  artigo reprovado regenera uma vez antes de publicar com avisos.
- Persona no perfil e prompt ampliado: uma única grande ideia, gatilhos
  emocionais na abertura, lead jornalístico, formatos por intenção de busca,
  tabelas, storytelling, antecipação de objeções no fechamento.
- Testes (vitest) com hook pre-push bloqueando regressão.

**Onda B — SEO de conteúdo**
- Interlinkagem automática por sobreposição de tokens.
- Google Search Console plugável (diagnóstico claro quando desligado).
- Capa webp otimizada (1280px, q80) + imagens no corpo com alt por keyword.
- JSON-LD: BlogPosting, FAQPage (H2s em pergunta) e BreadcrumbList.
- Campo `page_title` separado do H1 (SEO curto × título editorial).
- Categorias com página `/categoria/[slug]` e breadcrumbs visuais.
- Embed seguro de vídeo (allowlist YouTube/Vimeo, `youtube-nocookie.com`).
- Pipeline opcional em 2 etapas: outline validado antes do corpo.

**Onda C — Conversão**
- Captura de leads via plugs de CRM — primeira integração Trello (sem tabela
  própria de subscribers, por decisão de produto).
- Calendário editorial no banco: pauta planejada TEM precedência sobre o seed;
  relacionadas, concorrentes e pontos de atenção enriquecem o prompt.
- Divulgação pós-publish em plugs: Telegram, digest por e-mail (webhook onde o
  MailMKT da família encaixa) e webhook social com post adaptado por canal.
- Wizard `/setup`: checklist do que está conectado e do que falta.
- Comentários com moderação obrigatória (aprovação via endpoint protegido).
- Infográfico opcional no corpo e CTA fallback (compartilhar/newsletter)
  quando o CTA primário não está configurado.

**Onda D — Autoridade**
- Métricas próprias (view, metade da página, fim) + GA4 opcional por
  measurement id no perfil.
- A/B de CTA: variantes no perfil, rotação determinística por slug+semana
  (sem cookie) e cliques medidos por variante.
- Auditoria semanal de links quebrados (internos de blog checados na tabela;
  externos via fetch com timeout e User-Agent próprio; 401/403 não contam).
- Processo de guest posts: endpoint de publicação com gate de qualidade,
  byline `rel="author"`, backlink do convidado e divulgação reusada.

### Alterado

- Regras editoriais do corpo do artigo: texto sempre justificado, H2 em cor
  mais clara que o H1, simplificação visual (bullets e fluxogramas em texto),
  um CTA após cada imagem.
- Cron de publicação agora roda apenas em dias úteis (`0 9 * * 1-5`);
  auditoria de links às segundas (`0 10 * * 1`).
- Documentação (README, SETUP) atualizada para as 8 migrations e as novas
  integrações; `ignoreCommand` no vercel.json para commits só de docs.

### Corrigido

- Token `destructive` ausente no tema (mensagens de erro sem cor).
- Pauta sem data nunca era selecionada (query excluía NULL).
- Post do X estourava 280 caracteres com URL longa; `truncate` quebrava com
  orçamento zerado.
- Título com caracteres de markdown quebrava o `parse_mode` do Telegram.
- Comentário em artigo inexistente era aceito (spam órfão).
- Guest post aceitava categoria fora do perfil (artigo órfão).
- Query redundante no pipeline quando a pauta vinha do calendário.
- CTA após imagem renderizava em itálico (default do prose).

### Segurança

- `rel="author noopener noreferrer"` no byline de guest (anti-tabnabbing).
- Honeypots e limites de tamanho em leads e comentários; slug com sanitização
  estrita contra injeção.
- Bots/crawlers não inflam métricas (filtro de user-agent no beacon).
- Lead que falha no CRM é logado para recuperação manual (sem PII excessiva).

### Validação

- 119 testes de regressão em 14 arquivos (vitest).
- ESLint, `tsc --noEmit` e build de produção sem erros.
- Deploy de produção realizado com `vercel build --prod` +
  `vercel deploy --prebuilt` (0 build minutes).

[1.0.0]: https://github.com/luisroquette/My_Blog_Makes_Neil_Proud/compare/v0.2.0...v1.0.0

## [0.2.0] - 2026-08-08

### Adicionado

- Checklist de SEO on-page no prompt de geração de artigo (`src/lib/blog/deepseek.ts`),
  baseado no guia de blogpost do Neil Patel: keyword nas primeiras palavras do
  título, na URL e já na primeira frase do lead; título com promessa concreta em
  vez de rótulo genérico; hierarquia real de headers (H2 por bloco de assunto,
  H3/H4 para subdivisões, em vez de tudo em H2 plano); exigência de ao menos um
  link externo real e relevante, com guarda explícita contra URL inventada.

### Corrigido

- Vulnerabilidade alta em `nanoid` (transitiva via `next` → `postcss`,
  GHSA-2v37-7h3g-55p8) que travava `npm run audit:runtime` no CI.

### Validação

- Geração real testada (deepseek-chat): keyword presente em título, slug,
  meta description e primeira frase; hierarquia de headers não-plana (8 H2 +
  11 H3 num artigo de teste); links externos reais, nenhum inventado.
- ESLint, build de produção e auditoria de dependências de runtime sem
  vulnerabilidades.

[0.2.0]: https://github.com/luisroquette/My_Blog_Makes_Neil_Proud/releases/tag/v0.2.0

## [0.1.0] - 2026-07-24

### Adicionado

- Template white-label em Next.js e Supabase para transformar pauta em artigo
  publicado no domínio da empresa.
- Perfil único para marca, audiência, tom, palavras-chave, links internos, CTA e
  integrações.
- Pipeline com reserva diária idempotente, recuperação de execução interrompida e
  leitura pública apenas de artigos publicados.
- Páginas de blog com metadados SEO e dados estruturados.
- Integrações opcionais para geração de texto, capas e Google Search Console.
- Migration com tabelas, índices e políticas RLS.
- Guia completo de setup, demonstração visual, grafo de arquitetura e CI.

### Segurança

- Credenciais sensíveis permanecem somente no servidor.
- Cron protegido por segredo próprio de cada instalação.
- Integrações pagas desligadas até configuração explícita.
- Cadeia de produção atualizada para eliminar vulnerabilidades altas conhecidas.

### Validação

- ESLint e build de produção.
- Auditoria de dependências de runtime sem vulnerabilidades altas ou críticas.

[0.1.0]: https://github.com/luisroquette/My_Blog_Makes_Neil_Proud/releases/tag/v0.1.0
