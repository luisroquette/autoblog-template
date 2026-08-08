# Changelog

Todas as mudanças relevantes do Auto-blog Template são registradas aqui.

O projeto segue [Versionamento Semântico](https://semver.org/lang/pt-BR/).

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
