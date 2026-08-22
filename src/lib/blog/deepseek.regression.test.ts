// REGRESSÃO (rodada 2 de revisão adversarial): askDeepseek() ganhou timeout de
// 60s na rodada 1 (quality-gate.ts / deepseek.ts). Esse timeout é real para
// geração de artigo completo (~2500 palavras) — bem mais provável de disparar
// do que quando askDeepseek não tinha timeout algum. Sem este fix, um timeout
// (ou qualquer erro de rede) na 1ª tentativa pulava direto a retentativa que
// já existe para JSON inválido, e propagava cru até o catch de route.ts —
// derrubando a publicação inteira por uma falha transitória recuperável.
import { describe, it, expect, vi, afterEach } from 'vitest';

const mockCreate = vi.fn();

vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(function OpenAIMock(this: {
    chat: { completions: { create: typeof mockCreate } };
  }) {
    this.chat = { completions: { create: mockCreate } };
  }),
}));

import {
  generateArticle,
  generateArticleOutline,
  regenerateWithFeedback,
  generateArticleFromOutline,
  type ArticleOutline,
} from './deepseek';

function apiResponse(content: string) {
  return { choices: [{ message: { content } }] };
}

const validOutlineJson = JSON.stringify({
  title: 'Como Escolher Solução B2B para sua Empresa',
  h2s: ['H2 1', 'H2 2', 'H2 3', 'H2 4'],
  angle: 'Ideia central',
});

const validArticleJson = JSON.stringify({
  title: 'Como Escolher Solução B2B',
  slug: 'como-escolher-solucao-b2b',
  meta_desc: 'meta',
  image_prompt: 'photo',
  content: '# artigo',
});

const timeoutError = Object.assign(new Error('Request timed out.'), { name: 'APIConnectionTimeoutError' });
const authError = Object.assign(new Error('Incorrect API key provided'), { name: 'AuthenticationError', status: 401 });
// Códigos documentados pela DeepSeek como permanentes (api-docs.deepseek.com/quick_start/error_codes):
// 402 saldo insuficiente, 422 parâmetros inválidos — nenhum dos dois se resolve numa 2ª tentativa idêntica.
const insufficientBalanceError = Object.assign(new Error('Insufficient Balance'), { name: 'PaymentRequiredError', status: 402 });
const invalidParamsError = Object.assign(new Error('Invalid parameters'), { name: 'UnprocessableEntityError', status: 422 });

afterEach(() => {
  mockCreate.mockReset();
});

describe('REGRESSÃO: timeout de askDeepseek não pode pular a retentativa existente', () => {
  it('generateArticleOutline: timeout na 1ª tentativa é tratado como falha de tentativa (retenta e sucede)', async () => {
    mockCreate
      .mockRejectedValueOnce(timeoutError)
      .mockResolvedValueOnce(apiResponse(validOutlineJson));

    const outline = await generateArticleOutline('solução b2b');

    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(outline.title).toContain('Solução B2B');
  });

  it('generateArticleOutline: timeout nas 2 tentativas ainda propaga um erro (não trava silenciosamente)', async () => {
    mockCreate.mockRejectedValue(timeoutError);

    await expect(generateArticleOutline('solução b2b')).rejects.toThrow();
    expect(mockCreate).toHaveBeenCalledTimes(2);
  });

  it('regenerateWithFeedback: timeout na 1ª tentativa é tratado como falha de tentativa (retenta e sucede)', async () => {
    mockCreate
      .mockRejectedValueOnce(timeoutError)
      .mockResolvedValueOnce(apiResponse(validArticleJson));

    const article = await regenerateWithFeedback('solução b2b', [
      { fix_instruction: 'remover clichê' },
    ]);

    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(article.slug).toBe('como-escolher-solucao-b2b');
  });

  it('generateArticleFromOutline: timeout na 1ª tentativa é tratado como falha de tentativa (retenta e sucede)', async () => {
    const outline: ArticleOutline = { title: 'X', h2s: ['a', 'b', 'c', 'd'], angle: 'y' };
    mockCreate
      .mockRejectedValueOnce(timeoutError)
      .mockResolvedValueOnce(apiResponse(validArticleJson));

    const article = await generateArticleFromOutline('solução b2b', outline);

    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(article.slug).toBe('como-escolher-solucao-b2b');
  });

  it('caso positivo: sem timeout, comportamento antigo (1 tentativa, JSON válido) continua igual', async () => {
    mockCreate.mockResolvedValueOnce(apiResponse(validOutlineJson));

    const outline = await generateArticleOutline('solução b2b');

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(outline.h2s).toHaveLength(4);
  });

  it('generateArticle (caminho padrão, twoStageGenerationEnabled=false): timeout na 1ª tentativa retenta e sucede', async () => {
    mockCreate
      .mockRejectedValueOnce(timeoutError)
      .mockResolvedValueOnce(apiResponse(validArticleJson));

    const article = await generateArticle('solução b2b');

    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(article.slug).toBe('como-escolher-solucao-b2b');
  });

  it('generateArticle: usa askDeepseek com timeout configurado (antes rodava sem timeout — default do SDK é 10min, > maxDuration de 300s da function)', async () => {
    mockCreate.mockResolvedValueOnce(apiResponse(validArticleJson));

    await generateArticle('solução b2b');

    const OpenAICtor = (await import('openai')).default;
    expect(OpenAICtor).toHaveBeenCalledWith(expect.objectContaining({ timeout: 60_000 }));
  });
});

describe('REGRESSÃO: erro não-retentável (401/403/400) não deve gastar uma 2ª tentativa inútil', () => {
  it('generateArticleOutline: erro de autenticação (401) propaga na 1ª tentativa, sem retry', async () => {
    mockCreate.mockRejectedValueOnce(authError);

    await expect(generateArticleOutline('solução b2b')).rejects.toThrow('Incorrect API key');
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('regenerateWithFeedback: erro de autenticação (401) propaga na 1ª tentativa, sem retry', async () => {
    mockCreate.mockRejectedValueOnce(authError);

    await expect(
      regenerateWithFeedback('solução b2b', [{ fix_instruction: 'remover clichê' }]),
    ).rejects.toThrow('Incorrect API key');
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('generateArticleFromOutline: erro de autenticação (401) propaga na 1ª tentativa, sem retry', async () => {
    const outline: ArticleOutline = { title: 'X', h2s: ['a', 'b', 'c', 'd'], angle: 'y' };
    mockCreate.mockRejectedValueOnce(authError);

    await expect(generateArticleFromOutline('solução b2b', outline)).rejects.toThrow('Incorrect API key');
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('generateArticle: erro de autenticação (401) propaga na 1ª tentativa, sem retry', async () => {
    mockCreate.mockRejectedValueOnce(authError);

    await expect(generateArticle('solução b2b')).rejects.toThrow('Incorrect API key');
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('caso positivo: erro retentável (timeout, sem status) continua retentando normalmente', async () => {
    mockCreate
      .mockRejectedValueOnce(timeoutError)
      .mockResolvedValueOnce(apiResponse(validOutlineJson));

    const outline = await generateArticleOutline('solução b2b');

    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(outline.title).toContain('Solução B2B');
  });
});

describe('REGRESSÃO: 402 (saldo insuficiente) e 422 (parâmetros inválidos) são permanentes na DeepSeek — não devem retentar', () => {
  it('generateArticle: 402 (saldo insuficiente) propaga na 1ª tentativa, sem retry', async () => {
    mockCreate.mockRejectedValueOnce(insufficientBalanceError);

    await expect(generateArticle('solução b2b')).rejects.toThrow('Insufficient Balance');
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('generateArticleOutline: 402 (saldo insuficiente) propaga na 1ª tentativa, sem retry', async () => {
    mockCreate.mockRejectedValueOnce(insufficientBalanceError);

    await expect(generateArticleOutline('solução b2b')).rejects.toThrow('Insufficient Balance');
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('regenerateWithFeedback: 422 (parâmetros inválidos) propaga na 1ª tentativa, sem retry', async () => {
    mockCreate.mockRejectedValueOnce(invalidParamsError);

    await expect(
      regenerateWithFeedback('solução b2b', [{ fix_instruction: 'remover clichê' }]),
    ).rejects.toThrow('Invalid parameters');
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('generateArticleFromOutline: 422 (parâmetros inválidos) propaga na 1ª tentativa, sem retry', async () => {
    const outline: ArticleOutline = { title: 'X', h2s: ['a', 'b', 'c', 'd'], angle: 'y' };
    mockCreate.mockRejectedValueOnce(invalidParamsError);

    await expect(generateArticleFromOutline('solução b2b', outline)).rejects.toThrow('Invalid parameters');
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });
});

describe('REGRESSÃO: parseResponse rejeita ArticleContent sem meta_desc/image_prompt antes do cast (bug confirmado no coesasolar-site)', () => {
  // meta_desc ausente: validate.ts faz `metaDesc.length` sem guarda — vira TypeError cru.
  const missingMetaDescJson = JSON.stringify({
    title: 'Como Escolher Solução B2B',
    slug: 'como-escolher-solucao-b2b',
    image_prompt: 'photo',
    content: '# artigo',
  });

  // image_prompt ausente: route.ts interpola direto em template literal
  // (`${article.image_prompt}, wide establishing shot...`) sem `?? fallback` — vira
  // "undefined, wide establishing shot, no text", string não-vazia que passa pelo guard
  // de generateAndUploadBodyImages e dispara uma chamada PAGA a gpt-image-1 com prompt lixo.
  const missingImagePromptJson = JSON.stringify({
    title: 'Como Escolher Solução B2B',
    slug: 'como-escolher-solucao-b2b',
    meta_desc: 'meta',
    content: '# artigo',
  });

  // image_prompt vazio ('') — mesmo efeito prático do ausente (template literal vira
  // ", wide establishing shot..." mas o guard `!prompt?.trim()` de generateAndUploadCover
  // pega isso; o parse já deve rejeitar antes de chegar lá).
  const emptyImagePromptJson = JSON.stringify({
    title: 'Como Escolher Solução B2B',
    slug: 'como-escolher-solucao-b2b',
    meta_desc: 'meta',
    image_prompt: '   ',
    content: '# artigo',
  });

  it('generateArticle: meta_desc ausente na 1ª tentativa é tratado como JSON inválido (retenta e sucede com a 2ª resposta válida)', async () => {
    mockCreate
      .mockResolvedValueOnce(apiResponse(missingMetaDescJson))
      .mockResolvedValueOnce(apiResponse(validArticleJson));

    const article = await generateArticle('solução b2b');

    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(article.meta_desc).toBe('meta');
  });

  it('generateArticle: meta_desc ausente nas 2 tentativas lança deepseek_json_parse_failed (nunca chega ao cast)', async () => {
    mockCreate
      .mockResolvedValueOnce(apiResponse(missingMetaDescJson))
      .mockResolvedValueOnce(apiResponse(missingMetaDescJson));

    await expect(generateArticle('solução b2b')).rejects.toThrow('deepseek_json_parse_failed');
    expect(mockCreate).toHaveBeenCalledTimes(2);
  });

  it('generateArticle: image_prompt ausente na 1ª tentativa é tratado como JSON inválido (retenta e sucede)', async () => {
    mockCreate
      .mockResolvedValueOnce(apiResponse(missingImagePromptJson))
      .mockResolvedValueOnce(apiResponse(validArticleJson));

    const article = await generateArticle('solução b2b');

    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(article.image_prompt).toBe('photo');
  });

  it('generateArticle: image_prompt ausente nas 2 tentativas lança deepseek_json_parse_failed (nunca vira "undefined, wide establishing shot..." numa chamada paga)', async () => {
    mockCreate
      .mockResolvedValueOnce(apiResponse(missingImagePromptJson))
      .mockResolvedValueOnce(apiResponse(missingImagePromptJson));

    await expect(generateArticle('solução b2b')).rejects.toThrow('deepseek_json_parse_failed');
    expect(mockCreate).toHaveBeenCalledTimes(2);
  });

  it('generateArticle: image_prompt vazio/só espaço é tratado como ausente (retenta e sucede)', async () => {
    mockCreate
      .mockResolvedValueOnce(apiResponse(emptyImagePromptJson))
      .mockResolvedValueOnce(apiResponse(validArticleJson));

    const article = await generateArticle('solução b2b');

    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(article.image_prompt).toBe('photo');
  });

  it('regenerateWithFeedback: meta_desc ausente é tratado como JSON inválido, mesmo padrão de generateArticle', async () => {
    mockCreate
      .mockResolvedValueOnce(apiResponse(missingMetaDescJson))
      .mockResolvedValueOnce(apiResponse(validArticleJson));

    const article = await regenerateWithFeedback('solução b2b', [{ fix_instruction: 'x' }]);

    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(article.meta_desc).toBe('meta');
  });

  it('generateArticleFromOutline: image_prompt ausente é tratado como JSON inválido, mesmo padrão de generateArticle', async () => {
    const outline: ArticleOutline = { title: 'X', h2s: ['a', 'b', 'c', 'd'], angle: 'y' };
    mockCreate
      .mockResolvedValueOnce(apiResponse(missingImagePromptJson))
      .mockResolvedValueOnce(apiResponse(validArticleJson));

    const article = await generateArticleFromOutline('solução b2b', outline);

    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(article.image_prompt).toBe('photo');
  });

  it('caso positivo: JSON completo (title, slug, meta_desc, image_prompt, content) passa na 1ª tentativa sem retry', async () => {
    mockCreate.mockResolvedValueOnce(apiResponse(validArticleJson));

    const article = await generateArticle('solução b2b');

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(article.meta_desc).toBe('meta');
    expect(article.image_prompt).toBe('photo');
  });
});

describe('REGRESSÃO: parseOutline aceitava title de tipo errado (truthy check em vez de typeof) — isValidOutline crashava com TypeError em vez de tratar como outline inválido', () => {
  // title numérico é "truthy" (!123 === false), então o antigo `!parsed.title` deixava
  // passar; isValidOutline então chamava `outline.title.toLowerCase()` e number não tem
  // esse método — TypeError cru, fora do try/catch (que só envolve a chamada askDeepseek),
  // propagando e pulando a retentativa que já existe para outline inválido.
  const numericTitleJson = JSON.stringify({ title: 123, h2s: ['a', 'b', 'c', 'd'], angle: 'y' });

  it('generateArticleOutline: title numérico na 1ª tentativa é tratado como outline inválido (retenta e sucede, sem lançar TypeError)', async () => {
    mockCreate
      .mockResolvedValueOnce(apiResponse(numericTitleJson))
      .mockResolvedValueOnce(apiResponse(validOutlineJson));

    const outline = await generateArticleOutline('solução b2b');

    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(outline.title).toContain('Solução B2B');
  });

  it('generateArticleOutline: title numérico nas 2 tentativas lança deepseek_outline_failed (nunca um TypeError bruto)', async () => {
    mockCreate
      .mockResolvedValueOnce(apiResponse(numericTitleJson))
      .mockResolvedValueOnce(apiResponse(numericTitleJson));

    await expect(generateArticleOutline('solução b2b')).rejects.toThrow('deepseek_outline_failed');
    expect(mockCreate).toHaveBeenCalledTimes(2);
  });

  it('caso positivo: title string válido continua passando normalmente', async () => {
    mockCreate.mockResolvedValueOnce(apiResponse(validOutlineJson));

    const outline = await generateArticleOutline('solução b2b');

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(outline.title).toContain('Solução B2B');
  });
});

describe('REGRESSÃO: chamadas usam um model id ativo na DeepSeek, nunca o legado desativado', () => {
  it('generateArticle usa deepseek-v4-flash, não o deepseek-chat desativado em 2026-07-24', async () => {
    mockCreate.mockResolvedValueOnce(apiResponse(validArticleJson));

    await generateArticle('solução b2b');

    expect(mockCreate.mock.calls[0][0].model).toBe('deepseek-v4-flash');
    expect(mockCreate.mock.calls[0][0].model).not.toBe('deepseek-chat');
  });
});
