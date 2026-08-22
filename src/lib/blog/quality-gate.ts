// src/lib/blog/quality-gate.ts
// Gate de qualidade por LLM-judge: roda DEPOIS da validação Yoast-style
// (validate.ts, que já regenera 1x) e ANTES da geração de imagens — não
// gasta imagem em conteúdo que ainda pode ser regenerado.
//
// Fail-open obrigatório: sem DEEPSEEK_API_KEY, ou se o judge falhar/retornar
// JSON malformado, o gate vira no-op (skipped) e o pipeline publica como hoje.
import OpenAI from 'openai';
import { AUTOBLOG_PROFILE } from '@/lib/autoblog-profile';
import type { ArticleContent } from './deepseek';

const MODEL = 'deepseek-v4-pro';

export interface JudgeIssue {
  severity: 'P0' | 'P1' | 'P2';
  category: string;
  section: string;
  problem: string;
  fix_instruction: string;
}

export interface JudgeCategories {
  content_quality: number;
  seo: number;
  eeat: number;
  technical: number;
  geo: number;
}

export interface JudgeResult {
  total_score: number;
  categories: JudgeCategories;
  issues: JudgeIssue[];
}

export interface QualityGateResult {
  skipped: boolean;
  total_score: number | null;
  categories: JudgeCategories | null;
  issues: JudgeIssue[];
}

const SKIPPED_RESULT: QualityGateResult = {
  skipped: true,
  total_score: null,
  categories: null,
  issues: [],
};

/** Timeout por chamada ao judge — sem isso, uma chamada travada trava o pipeline
 * inteiro (o gate roda em loop, até 3x por publicação) até o maxDuration da function. */
const REQUEST_TIMEOUT_MS = 60_000;

/** Pontuação máxima de cada categoria — usada para rejeitar (fail-open) scores
 * fora do range plausível, caso o judge hallucine um valor absurdo. */
const CATEGORY_MAX: Record<keyof JudgeCategories, number> = {
  content_quality: 30,
  seo: 25,
  eeat: 15,
  technical: 15,
  geo: 15,
};

/** Máximo de issues repassadas adiante — o system prompt pede "liste TODOS os
 * problemas", sem limite; isso evita um array anormalmente grande inflar o
 * prompt (e o custo) da regeneração seguinte. */
const MAX_ISSUES = 30;
const MAX_ISSUE_FIELD_LENGTH = 1000;

const VALID_SEVERITIES = new Set(['P0', 'P1', 'P2']);

function truncate(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.length > MAX_ISSUE_FIELD_LENGTH ? value.slice(0, MAX_ISSUE_FIELD_LENGTH) : value;
}

/** Descarta issues sem fix_instruction (o único campo obrigatório consumido
 * depois por regenerateWithFeedback) e limita tamanho/quantidade de cada campo
 * — o resto do shape do judge (severity/category/section/problem) não é
 * validado por outra validação, então é tratado como dado não confiável aqui. */
function sanitizeIssues(issues: unknown[]): JudgeIssue[] {
  return issues
    .filter((issue): issue is Record<string, unknown> => {
      if (typeof issue !== 'object' || issue === null) return false;
      const fix = (issue as Record<string, unknown>).fix_instruction;
      return typeof fix === 'string' && fix.trim() !== '';
    })
    .slice(0, MAX_ISSUES)
    .map(issue => ({
      severity: (VALID_SEVERITIES.has(issue.severity as string) ? issue.severity : 'P2') as JudgeIssue['severity'],
      category: truncate(issue.category),
      section: truncate(issue.section),
      problem: truncate(issue.problem),
      fix_instruction: truncate(issue.fix_instruction),
    }));
}

const { brand } = AUTOBLOG_PROFILE;

const JUDGE_SYSTEM_PROMPT = `Você é um editor sênior de SEO e conteúdo que avalia artigos de blog em
português brasileiro escritos para ${brand.name} (${brand.siteUrl}). Sua nota é a última
barreira antes da publicação — seja rigoroso e específico.

Avalie o artigo em 5 categorias, somando até 100 pontos:

## Qualidade de conteúdo (30pt)
Profundidade real (não superficial), clareza, originalidade do ângulo. ZERO clichês de IA:
"no mundo dinâmico de", "é importante notar que", "em suma", "vale ressaltar",
"cada vez mais", "de acordo com especialistas", "solução inovadora", "no cenário atual".
Cada clichê encontrado derruba pontos desta categoria.

## SEO (25pt)
Não julgue apenas PRESENÇA de title/meta/H2s/links — isso já é checado por outra validação.
Julgue QUALIDADE: o title é persuasivo ou genérico? A meta description vende o clique ou só
descreve? Os H2s cobrem o tema com progressão lógica? A keyword aparece com naturalidade
(nunca stuffing)? Os links (internos e externos) têm âncoras relevantes e destino coerente?

## E-E-A-T (15pt)
Fontes citadas são reais e verificáveis (nunca invente autoridade — se uma citação parecer
fabricada, penalize). Sinais de experiência prática, dados de mercado com fonte, ou
posicionamento honesto (reconhecer limitações). Citações em blockquote com atribuição real.

## Técnico (15pt)
Markdown limpo (sem quebra de sintaxe, sem heading órfão, sem tabela malformada), hierarquia
de headers coerente (H3 dentro de H2, H4 dentro de H3), alt text da capa presente e descritivo,
zero markdown de imagem solto no corpo.

## GEO / citabilidade por IA (15pt)
O box "Em resumo" tem bullets auto-contidos que uma IA pode citar como resposta direta, sem
depender do resto do artigo? Os parágrafos são auto-contidos (fazem sentido isolados)? Existe
uma resposta direta e clara à pergunta central da keyword logo após o lead?

## Formato de saída — APENAS JSON, sem markdown ao redor, sem texto antes ou depois
{
  "total_score": <soma das 5 categorias, 0-100>,
  "categories": {
    "content_quality": <0-30>,
    "seo": <0-25>,
    "eeat": <0-15>,
    "technical": <0-15>,
    "geo": <0-15>
  },
  "issues": [
    {
      "severity": "P0 | P1 | P2",
      "category": "content_quality | seo | eeat | technical | geo",
      "section": "onde no artigo (ex: 'H2 3', 'meta description', 'Em resumo')",
      "problem": "o que está errado, específico e acionável",
      "fix_instruction": "instrução direta de como corrigir, para outro LLM reescrever o artigo"
    }
  ]
}

P0 = derruba a publicação (erro factual, clichê grave, quebra estrutural).
P1 = perda de pontos relevante mas não bloqueante.
P2 = polimento opcional.
Liste TODOS os problemas relevantes, mesmo que pequenos — não filtre por importância.`;

function buildJudgeUserMessage(article: ArticleContent): string {
  return JSON.stringify({
    title: article.title,
    page_title: article.page_title ?? null,
    meta_desc: article.meta_desc,
    category: article.category ?? null,
    cover_alt: article.cover_alt ?? null,
    content: article.content,
  });
}

/** Parse defensivo: JSON pode vir malformado — falha de parse é fail-open, nunca exceção. */
function parseJudgeResponse(text: string): JudgeResult | null {
  try {
    const cleaned = text
      .replace(/^```(?:json)?\n?/m, '')
      .replace(/\n?```$/m, '')
      .trim();
    const parsed = JSON.parse(cleaned);

    if (typeof parsed.total_score !== 'number') return null;
    if (!(parsed.total_score >= 0 && parsed.total_score <= 100)) return null;
    if (typeof parsed.categories !== 'object' || parsed.categories === null) return null;
    const requiredCategories = ['content_quality', 'seo', 'eeat', 'technical', 'geo'] as const;
    for (const key of requiredCategories) {
      const value = parsed.categories[key];
      if (typeof value !== 'number') return null;
      if (!(value >= 0 && value <= CATEGORY_MAX[key])) return null;
    }
    if (!Array.isArray(parsed.issues)) return null;

    return {
      ...parsed,
      issues: sanitizeIssues(parsed.issues),
    } as JudgeResult;
  } catch {
    return null;
  }
}

/**
 * Roda o LLM-judge sobre o artigo final. Fail-open: sem DEEPSEEK_API_KEY, ou
 * se a chamada/parse falhar por qualquer motivo, retorna { skipped: true } e
 * loga um warn — nunca lança, nunca bloqueia o pipeline de publicação.
 */
export async function runQualityGate(article: ArticleContent): Promise<QualityGateResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.warn('[quality-gate] DEEPSEEK_API_KEY não configurada — gate pulado (fail-open).');
    return SKIPPED_RESULT;
  }

  try {
    const client = new OpenAI({
      apiKey,
      baseURL: 'https://api.deepseek.com/v1',
      timeout: REQUEST_TIMEOUT_MS,
    });
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: JUDGE_SYSTEM_PROMPT },
        { role: 'user', content: buildJudgeUserMessage(article) },
      ],
      // 2000 tokens era insuficiente: o system prompt pede "liste TODOS os
      // problemas" — um artigo ruim com muitas issues truncava o JSON no meio
      // e o parse falhava (fail-open), justo no caso em que o gate mais importa.
      max_tokens: 4000,
    });

    const text = response.choices[0]?.message?.content ?? '';
    const parsed = parseJudgeResponse(text);

    if (!parsed) {
      console.warn('[quality-gate] Resposta do judge não pôde ser parseada — gate pulado (fail-open).');
      return SKIPPED_RESULT;
    }

    return {
      skipped: false,
      total_score: parsed.total_score,
      categories: parsed.categories,
      issues: parsed.issues,
    };
  } catch (err) {
    // Loga só a mensagem, nunca o objeto de erro bruto (pode carregar headers/
    // corpo de resposta da API em erros de autenticação).
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn('[quality-gate] Chamada ao judge falhou — gate pulado (fail-open):', errorMsg);
    return SKIPPED_RESULT;
  }
}
