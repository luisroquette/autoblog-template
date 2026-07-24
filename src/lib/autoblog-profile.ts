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
    tone: 'profissional, claro e sem jargão desnecessário',
    internalLinks: [] as Array<{ label: string; url: string; description: string }>,
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
  },
  integrations: {
    googleSearchConsoleEnabled: false,
    imageGenerationEnabled: false,
  },
} as const;
