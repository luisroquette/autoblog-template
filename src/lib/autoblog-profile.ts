/** Dados públicos da instalação. Nunca coloque chaves, tokens ou dados de clientes aqui. */
export const AUTOBLOG_PROFILE = {
  brand: {
    name: 'Sua Empresa',
    siteUrl: 'https://seudominio.com.br',
    logoUrl: 'https://seudominio.com.br/logo.png',
  },
  blog: {
    title: 'Blog | Sua Empresa',
    description: 'Conteúdo prático para ajudar compradores a avaliar soluções no seu nicho.',
    heading: 'Conteúdo para decisões melhores',
    intro: 'Guias, comparativos e explicações úteis sobre o seu nicho.',
  },
  editorial: {
    businessDescription: 'empresa B2B especializada em seu nicho',
    audience: 'decisores que buscam entender opções, riscos e critérios de escolha',
    // Persona: para QUEM se escreve (dores, contexto, decisões) — guia Neil/RD: persona antes da keyword.
    persona: 'gestores de compras e operações de empresas médias, sem tempo para avaliações longas, com medo de contratar errado e pagar custo escondido',
    tone: 'profissional, claro e sem jargão desnecessário',
    // URL da newsletter — aparece no CTA fallback quando cta.url estiver vazio
    newsletterUrl: '',
    internalLinks: [] as Array<{ label: string; url: string; description: string }>,
    // Categorias do blog: o LLM escolhe UMA por artigo (arquitetura da informação — RD)
    categories: [
      { slug: 'guias', label: 'Guias' },
      { slug: 'comparativos', label: 'Comparativos' },
      { slug: 'listas', label: 'Listas' },
      { slug: 'faq', label: 'FAQ' },
    ] as Array<{ slug: string; label: string }>,
    seedKeywords: [
      'processo B2B do seu nicho',
      'como avaliar solução B2B do seu nicho',
      'guia informacional do seu nicho',
    ],
  },
  cta: {
    title: 'Quer discutir o seu cenário?',
    subtitle: 'Fale com a equipe para avaliar os próximos passos.',
    buttonLabel: 'Entrar em contato',
    url: '/contato',
    // A/B de CTA: lista vazia = sem teste (usa title/subtitle/buttonLabel/url acima).
    // Com 2+ variantes, o sistema rotaciona por slug+semana (determinístico, sem
    // cookie) e mede os cliques por variante em /api/blog/metrics.
    variants: [] as Array<{ title: string; subtitle: string; buttonLabel: string; url: string }>,
  },
  theme: {
    // CTA em cor de contraste: primary forte sobre fundo claro converte mais (Neil Patel: +38%).
    primary: '#7B2FBE',
    background: '#FFFFFF',
    foreground: '#1A1524',
    muted: '#5C5668',
    border: '#E7E3EE',
    card: '#FFFFFF',
    destructive: '#DC2626',
  },
  // Formulário de captura (aparece no fim do artigo e na listagem quando o plug está ativo)
  leadForm: {
    title: 'Receba o próximo guia por e-mail',
    subtitle: 'Conteúdo prático direto na sua caixa — sem spam.',
    buttonLabel: 'Receber conteúdo',
    successMessage: 'Pronto! Você receberá os próximos guias.',
  },
  integrations: {
    googleSearchConsoleEnabled: false,
    imageGenerationEnabled: false,
    // GA4 opcional: preencha com o Measurement ID (G-XXXXXXX) para o gtag.js
    // entrar no layout. Vazio = só as métricas próprias da tabela blog_metrics.
    googleAnalyticsMeasurementId: '',
    // Opcional: gera outline validado antes do corpo (RD recomenda planejar antes de escrever).
    // Custo: 1 chamada extra de LLM por artigo.
    twoStageGenerationEnabled: false,
    // Captura de leads: entrega para um plug de CRM (nunca tabela própria).
    // destination 'trello' exige envs TRELLO_API_KEY, TRELLO_TOKEN, TRELLO_LIST_ID.
    leadCapture: {
      enabled: false,
      destination: 'trello',
    },
    // Divulgação pós-publish: cada canal é um plug ativo aqui.
    // 'telegram' (TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID),
    // 'email_digest' (EMAIL_DIGEST_WEBHOOK_URL — onde o MailMKT da família encaixa),
    // 'social_webhook' (SOCIAL_WEBHOOK_URL — entrega o post pronto p/ Zapier/n8n/Make).
    distribution: {
      enabled: false,
      channels: [] as string[],
    },
    // Mídia paga: hook reservado ("abrir a carteira"). Sem integração até o
    // dono escolher a plataforma — orçamento e canal viram config do perfil.
    paidPromotionEnabled: false,
    // Infográfico no fim do artigo (gpt-image-1 quadrado, sem texto).
    // Custo: 1 imagem extra por artigo — ligar junto com imageGenerationEnabled.
    infographicsEnabled: false,
  },
} as const;
