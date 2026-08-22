// REGRESSÃO: gate de qualidade por LLM-judge (quality-gate.ts).
// Protege: parse de score válido, fail-open sem DEEPSEEK_API_KEY, fail-open
// com JSON malformado, e a lógica de loop (para em score>=90 / para em 2 tentativas)
// replicada aqui exatamente como em route.ts — nunca chama a API real.
import { describe, it, expect, vi, afterEach } from 'vitest';

const mockCreate = vi.fn();

vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(function OpenAIMock(this: {
    chat: { completions: { create: typeof mockCreate } };
  }) {
    this.chat = { completions: { create: mockCreate } };
  }),
}));

import OpenAICtor from 'openai';
import { runQualityGate, type JudgeIssue } from './quality-gate';
import type { ArticleContent } from './deepseek';

function makeArticle(overrides: Partial<ArticleContent> = {}): ArticleContent {
  return {
    title: 'Como Avaliar Solução B2B',
    slug: 'como-avaliar-solucao-b2b',
    meta_desc: 'Aprenda como avaliar solução b2b com um método simples e direto',
    image_prompt: 'photorealistic scene',
    content: '# Como Avaliar Solução B2B\n\nConteúdo do artigo...\n\n## Em resumo\n\n- ponto 1',
    ...overrides,
  };
}

/** Resposta crua da API OpenAI-compatible (DeepSeek) com o JSON do judge no content. */
function judgeApiResponse(json: unknown) {
  return { choices: [{ message: { content: JSON.stringify(json) } }] };
}

function validJudgeJson(total_score: number, issues: JudgeIssue[] = []) {
  return {
    total_score,
    categories: { content_quality: 20, seo: 15, eeat: 10, technical: 10, geo: 10 },
    issues,
  };
}

afterEach(() => {
  vi.unstubAllEnvs();
  mockCreate.mockReset();
});

describe('REGRESSÃO: quality-gate — parse e fail-open', () => {
  it('parseia um score válido retornado pelo judge', async () => {
    vi.stubEnv('DEEPSEEK_API_KEY', 'sk-deepseek-teste');
    mockCreate.mockResolvedValueOnce(judgeApiResponse(validJudgeJson(85)));

    const result = await runQualityGate(makeArticle());

    expect(result.skipped).toBe(false);
    expect(result.total_score).toBe(85);
    expect(result.categories).toEqual({ content_quality: 20, seo: 15, eeat: 10, technical: 10, geo: 10 });
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('fail-open: sem DEEPSEEK_API_KEY, pula o gate sem chamar a API', async () => {
    vi.stubEnv('DEEPSEEK_API_KEY', '');

    const result = await runQualityGate(makeArticle());

    expect(result.skipped).toBe(true);
    expect(result.total_score).toBeNull();
    expect(result.issues).toEqual([]);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('fail-open: JSON malformado do judge não quebra o pipeline', async () => {
    vi.stubEnv('DEEPSEEK_API_KEY', 'sk-deepseek-teste');
    mockCreate.mockResolvedValueOnce({ choices: [{ message: { content: 'não é json {{{' } }] });

    const result = await runQualityGate(makeArticle());

    expect(result.skipped).toBe(true);
    expect(result.total_score).toBeNull();
  });

  it('fail-open: JSON válido mas fora do schema esperado (falta categories)', async () => {
    vi.stubEnv('DEEPSEEK_API_KEY', 'sk-deepseek-teste');
    mockCreate.mockResolvedValueOnce(judgeApiResponse({ total_score: 90, issues: [] }));

    const result = await runQualityGate(makeArticle());

    expect(result.skipped).toBe(true);
  });

  it('fail-open: a chamada à API lançando exceção não propaga erro', async () => {
    vi.stubEnv('DEEPSEEK_API_KEY', 'sk-deepseek-teste');
    mockCreate.mockRejectedValueOnce(new Error('network down'));

    const result = await runQualityGate(makeArticle());

    expect(result.skipped).toBe(true);
    expect(result.total_score).toBeNull();
  });

  it('fail-open: total_score acima de 100 (judge hallucinou) é rejeitado', async () => {
    vi.stubEnv('DEEPSEEK_API_KEY', 'sk-deepseek-teste');
    mockCreate.mockResolvedValueOnce(judgeApiResponse(validJudgeJson(150)));

    const result = await runQualityGate(makeArticle());

    expect(result.skipped).toBe(true);
    expect(result.total_score).toBeNull();
  });

  it('fail-open: total_score negativo é rejeitado', async () => {
    vi.stubEnv('DEEPSEEK_API_KEY', 'sk-deepseek-teste');
    mockCreate.mockResolvedValueOnce(judgeApiResponse(validJudgeJson(-10)));

    const result = await runQualityGate(makeArticle());

    expect(result.skipped).toBe(true);
    expect(result.total_score).toBeNull();
  });

  it('fail-open: categoria acima do máximo do rubric (ex: content_quality > 30) é rejeitada', async () => {
    vi.stubEnv('DEEPSEEK_API_KEY', 'sk-deepseek-teste');
    mockCreate.mockResolvedValueOnce(judgeApiResponse({
      total_score: 85,
      categories: { content_quality: 99, seo: 15, eeat: 10, technical: 10, geo: 10 },
      issues: [],
    }));

    const result = await runQualityGate(makeArticle());

    expect(result.skipped).toBe(true);
  });

  it('sanitiza issues: descarta issue sem fix_instruction em vez de repassar "undefined" adiante', async () => {
    vi.stubEnv('DEEPSEEK_API_KEY', 'sk-deepseek-teste');
    mockCreate.mockResolvedValueOnce(judgeApiResponse(validJudgeJson(60, [
      // issue malformada do judge: sem fix_instruction
      { severity: 'P0', category: 'seo', section: 'title', problem: 'genérico' } as unknown as JudgeIssue,
      { severity: 'P1', category: 'content_quality', section: 'lead', problem: 'clichê', fix_instruction: 'remover clichê' },
    ])));

    const result = await runQualityGate(makeArticle());

    expect(result.skipped).toBe(false);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].fix_instruction).toBe('remover clichê');
  });

  it('sanitiza issues: severity inválida do judge cai para P2 em vez de vazar valor arbitrário', async () => {
    vi.stubEnv('DEEPSEEK_API_KEY', 'sk-deepseek-teste');
    mockCreate.mockResolvedValueOnce(judgeApiResponse(validJudgeJson(60, [
      { severity: 'critical' as unknown as JudgeIssue['severity'], category: 'seo', section: 'title', problem: 'x', fix_instruction: 'corrigir' },
    ])));

    const result = await runQualityGate(makeArticle());

    expect(result.skipped).toBe(false);
    expect(result.issues[0].severity).toBe('P2');
  });

  it('limita a lista de issues a 30, mesmo se o judge devolver mais', async () => {
    vi.stubEnv('DEEPSEEK_API_KEY', 'sk-deepseek-teste');
    const manyIssues = Array.from({ length: 50 }, (_, i) => ({
      severity: 'P2' as const,
      category: 'seo',
      section: `H2 ${i}`,
      problem: `problema ${i}`,
      fix_instruction: `corrigir ${i}`,
    }));
    mockCreate.mockResolvedValueOnce(judgeApiResponse(validJudgeJson(50, manyIssues)));

    const result = await runQualityGate(makeArticle());

    expect(result.skipped).toBe(false);
    expect(result.issues).toHaveLength(30);
  });

  it('configura timeout e max_tokens na chamada ao judge (sem timeout, uma chamada travada trava o pipeline)', async () => {
    vi.stubEnv('DEEPSEEK_API_KEY', 'sk-deepseek-teste');
    mockCreate.mockResolvedValueOnce(judgeApiResponse(validJudgeJson(90)));

    await runQualityGate(makeArticle());

    expect(OpenAICtor).toHaveBeenCalledWith(expect.objectContaining({ timeout: expect.any(Number) }));
    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ max_tokens: 4000 }));
  });
});

describe('REGRESSÃO: quality-gate — loop de regeneração (mesma condição de route.ts)', () => {
  /** Replica exatamente o loop de route.ts: while (!skipped && score < 90 && attempt < 2). */
  async function runLoop(article: ArticleContent) {
    let attempt = 0;
    let judged = await runQualityGate(article);
    while (!judged.skipped && judged.total_score !== null && judged.total_score < 90 && attempt < 2) {
      attempt++;
      judged = await runQualityGate(article); // regeneração é mockada — reusa o mesmo artigo
    }
    return { judged, attempt };
  }

  it('para no primeiro score >= 90, sem regenerar', async () => {
    vi.stubEnv('DEEPSEEK_API_KEY', 'sk-deepseek-teste');
    mockCreate.mockResolvedValueOnce(judgeApiResponse(validJudgeJson(95)));

    const { judged, attempt } = await runLoop(makeArticle());

    expect(attempt).toBe(0);
    expect(judged.total_score).toBe(95);
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('para após 2 tentativas mesmo se o score continuar abaixo de 90', async () => {
    vi.stubEnv('DEEPSEEK_API_KEY', 'sk-deepseek-teste');
    mockCreate
      .mockResolvedValueOnce(judgeApiResponse(validJudgeJson(60, [
        { severity: 'P0', category: 'content_quality', section: 'lead', problem: 'clichê', fix_instruction: 'remover clichê' },
      ])))
      .mockResolvedValueOnce(judgeApiResponse(validJudgeJson(70)))
      .mockResolvedValueOnce(judgeApiResponse(validJudgeJson(75)));

    const { judged, attempt } = await runLoop(makeArticle());

    expect(attempt).toBe(2);
    expect(judged.total_score).toBe(75);
    expect(mockCreate).toHaveBeenCalledTimes(3);
  });

  it('caso positivo: score alto na primeira tentativa publica sem regenerar e sem perder issues vazias', async () => {
    vi.stubEnv('DEEPSEEK_API_KEY', 'sk-deepseek-teste');
    mockCreate.mockResolvedValueOnce(judgeApiResponse(validJudgeJson(100)));

    const { judged, attempt } = await runLoop(makeArticle());

    expect(attempt).toBe(0);
    expect(judged.skipped).toBe(false);
    expect(judged.total_score).toBe(100);
    expect(judged.issues).toEqual([]);
  });
});
