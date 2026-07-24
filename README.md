# Auto-blog Template

Seu site já tem um blog vazio. Este template resolve a parte chata: pauta,
produção, capa, publicação e páginas SEO, com uma configuração por empresa.

Você fica com o domínio, banco, credenciais e controle editorial. O template
não compartilha dados entre instalações e começa com integrações pagas
desligadas.

> Um template de infraestrutura editorial: você adapta a estratégia, aprova o
> que fizer sentido e opera tudo na sua própria conta.

```mermaid
flowchart LR
  A[Keywords do seu nicho] --> B[Pipeline diário]
  B --> C[Artigo + SEO]
  C --> D[Supabase]
  D --> E[/blog no seu domínio]
```

## Por que usar

- Configure marca, tom, CTA, links e keywords em um arquivo.
- Publique no seu próprio Next.js, Supabase e Vercel.
- Use IA, GSC e imagem só quando quiser e com suas próprias contas.
- Evite duplicidade de cron com claim atômico e recuperação de execução parada.
- Exponha ao público somente artigos publicados, protegidos por RLS.

O objetivo é simples: tirar um blog próprio do zero sem transformar cada novo
artigo em uma tarefa manual.

## Para quem serve

Funciona especialmente bem para SaaS B2B, consultorias, serviços técnicos,
agências e empresas locais com um produto ou serviço que precisa de contexto
antes da compra.

Não é indicado, sem uma camada editorial e de compliance própria, para saúde,
jurídico, investimentos, seguros, apostas ou instruções que possam colocar
alguém em risco.

## Comece em poucos passos

```bash
git clone <seu-fork>
cd autoblog-template
npm install
cp .env.example .env.local
```

Depois:

1. Edite [`src/lib/autoblog-profile.ts`](./src/lib/autoblog-profile.ts).
2. Crie um projeto Supabase novo e aplique
   [`supabase/migrations/001_autoblog.sql`](./supabase/migrations/001_autoblog.sql).
3. Configure as variáveis da sua instalação.
4. Rode `npm run lint` e `npm run build`.
5. Siga o [guia completo](./SETUP.md) antes de ativar o cron.

## O que você configura

| Área | Onde |
| --- | --- |
| Marca, domínio e SEO | `src/lib/autoblog-profile.ts` |
| Tom, público, links e keywords | `src/lib/autoblog-profile.ts` |
| CTA final | `src/lib/autoblog-profile.ts` |
| Banco e RLS | `supabase/migrations/001_autoblog.sql` |
| Frequência | `vercel.json` |

## O que acontece em uma execução

1. O cron autenticado reserva a execução do dia.
2. O sistema seleciona uma pauta a partir das keywords configuradas.
3. Com a integração de texto habilitada, gera o artigo e os metadados SEO.
4. O artigo é salvo e aparece em `/blog` somente quando estiver publicado.

Sem credenciais válidas de geração, a execução não publica conteúdo. Sem
`CRON_SECRET` válido, o endpoint recusa a execução.

## Segurança e operação

O cron exige `CRON_SECRET`. A chave service-role fica só no servidor. GSC e
imagem começam desligados. A geração falha fechada quando não houver segredo
de cron válido, e uma execução presa pode ser recuperada sem publicar duas
vezes no mesmo dia.

Leia [SECURITY.md](./SECURITY.md) e o [SETUP.md](./SETUP.md) antes de fazer o
primeiro deploy.

## Custos

O repositório não chama nenhum provedor por padrão. Quando você habilitar
texto, imagem ou GSC, os custos e limites passam a ser os da sua própria conta.

## Contribuir

Correções que tornam o template mais seguro, portátil ou simples de configurar
são bem-vindas. Veja [CONTRIBUTING.md](./CONTRIBUTING.md).

## Licença

[MIT](./LICENSE) © 2026 Luis Roquette.
