# Changelog

Todas as mudanças relevantes do Auto-blog Template são registradas aqui.

O projeto segue [Versionamento Semântico](https://semver.org/lang/pt-BR/).

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

[0.2.0]: https://github.com/luisroquette/autoblog-template/releases/tag/v0.2.0

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

[0.1.0]: https://github.com/luisroquette/autoblog-template/releases/tag/v0.1.0
