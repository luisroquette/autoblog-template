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
