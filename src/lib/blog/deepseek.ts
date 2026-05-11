// src/lib/blog/deepseek.ts
// ⚙️ CONFIGURAR: SYSTEM_PROMPT e buildUserPrompt com identidade do projeto

import OpenAI from 'openai';

export interface ArticleContent {
  title: string;
  slug: string;
  meta_desc: string;
  image_prompt: string;
  content: string;
}

// ⚙️ CONFIGURAR COMPLETAMENTE — adaptar ao nicho, empresa, tom e links internos
const SYSTEM_PROMPT = `Você redige blogposts para [NOME DA EMPRESA] ([dominio.com.br]),
[DESCRIÇÃO: o que a empresa faz e para quem]. Escreva em português brasileiro.

## TOM DE VOZ
[ex: profissional mas acessível, foco em educação do mercado B2B]
[ex: direto, sem jargão corporativo]

## ESTRUTURA OBRIGATÓRIA
1. H1 com keyword principal (máx 60 chars)
2. LEAD em exatamente 3 parágrafos:
   - Parágrafo 1: dor ou dado surpreendente (NÃO começar com "Neste artigo…")
   - Parágrafo 2: por que o problema importa AGORA (mercado, regulação, tendência)
   - Parágrafo 3: promessa explícita do artigo
3. 4 a 6 H2s com keyword/variações semânticas em ≥ 2 deles
4. Parágrafos máx 4 linhas. Uma ideia por parágrafo.
5. CTA final específico com link de contato.

## REGRAS
- Mínimo 2 sinais de E-E-A-T: experiência prática, dado de mercado com fonte,
  norma técnica, ou posicionamento honesto (reconhecer limitações quando verdadeiro).
- Dados concretos > percentuais vagos: "R$ 3.200/mês" em vez de "até 40%".
- Vocabulário proibido: "solução inovadora", "cada vez mais", "é importante ressaltar",
  "de acordo com especialistas", "no contexto atual", "vários"/"alguns" sem número.

## LINKS INTERNOS OBRIGATÓRIOS (âncoras naturais, distribuídas pelo texto)
- [TEXTO DA ÂNCORA 1](/pagina-1) — ex: "nossos produtos" → /produtos
- [TEXTO DA ÂNCORA 2](/pagina-2)
- [TEXTO DA ÂNCORA 3](/pagina-3)
- [seja parceiro](/parceria) ou equivalente

## TEMPLATE DO CTA FINAL
Recapitular o problema em 1 frase. Mencionar que [EMPRESA] resolve [SOLUÇÃO].
Convidar para ação de baixo atrito: "[TEXTO DO BOTÃO]" com link [URL DE CONTATO].`;

function buildUserPrompt(keyword: string): string {
  return `Escreva um artigo SEO completo sobre "${keyword}" seguindo TODAS as regras do system prompt.

Retorne SOMENTE um JSON válido (sem markdown ao redor, sem texto antes ou depois):
{
  "title": "Título H1/SEO com keyword principal (máx 60 chars)",
  "slug": "slug-kebab-case-max-6-palavras-sem-artigos",
  "meta_desc": "Keyword + resultado específico que o artigo entrega (máx 155 chars, sem ponto final)",
  "image_prompt": "Cena fotorrealista em inglês para o tema, sem texto na imagem, sem logos, high quality, 4k",
  "content": "Artigo completo em markdown (1500–2500 palavras)"
}

CHECKLIST interno antes de gerar (valide cada item):
- [ ] Lead: exatamente 3 parágrafos (dor → contexto → promessa)
- [ ] H1 ≤ 60 chars com keyword
- [ ] Meta description ≤ 155 chars com keyword, sem ponto final
- [ ] 4 a 6 H2s, keyword ou variação semântica em ≥ 2 deles
- [ ] Parágrafos máx 4 linhas
- [ ] Mínimo 2 sinais de E-E-A-T presentes
- [ ] Nenhuma palavra do vocabulário proibido
- [ ] Links internos com âncoras naturais distribuídos no texto
- [ ] CTA final com link de contato específico
- [ ] ZERO markdown de imagem no content (sem ![]() )`;
}

function parseResponse(text: string): ArticleContent | null {
  try {
    const cleaned = text
      .replace(/^```(?:json)?\n?/m, '')
      .replace(/\n?```$/m, '')
      .trim();
    const parsed = JSON.parse(cleaned);
    if (!parsed.title || !parsed.slug || !parsed.content) return null;
    return parsed as ArticleContent;
  } catch {
    return null;
  }
}

export async function generateArticle(keyword: string): Promise<ArticleContent> {
  const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
  });

  for (let attempt = 1; attempt <= 2; attempt++) {
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(keyword) },
      ],
      temperature: 0.7,
    });

    const text = response.choices[0]?.message?.content ?? '';
    const parsed = parseResponse(text);
    if (parsed) return parsed;

    if (attempt === 2) break;
    console.warn(`[deepseek] Tentativa ${attempt} retornou JSON inválido. Retentando...`);
  }

  throw new Error('deepseek_json_parse_failed');
}
