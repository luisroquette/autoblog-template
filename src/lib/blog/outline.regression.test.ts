// REGRESSÃO: pipeline em 2 etapas — outline validado antes do corpo.
import { describe, it, expect } from 'vitest';
import { parseOutline, isValidOutline } from './deepseek';

describe('REGRESSÃO: outline (etapa 1 do pipeline em 2 etapas)', () => {
  it('parseOutline aceita JSON válido, inclusive com code fences', () => {
    const raw = '```json\n{"title":"Como Avaliar Solução B2B","h2s":["Critérios","Erros","Comparar","Contratos","Conclusão"],"angle":"avaliar sem custo escondido"}\n```';
    const outline = parseOutline(raw);
    expect(outline?.title).toBe('Como Avaliar Solução B2B');
    expect(outline?.h2s).toHaveLength(5);
  });

  it('parseOutline rejeita JSON inválido ou sem campos obrigatórios', () => {
    expect(parseOutline('não é json')).toBeNull();
    expect(parseOutline('{"title":"só título"}')).toBeNull();
  });

  it('isValidOutline exige 4 a 6 H2s e keyword no título', () => {
    const base = {
      title: 'Como Avaliar Solução B2B sem Riscos',
      h2s: ['Critérios', 'Erros comuns', 'Comparação', 'Contratos', 'Conclusão'],
      angle: 'avaliar sem custo escondido',
    };
    expect(isValidOutline(base, 'como avaliar solução b2b')).toBe(true);

    expect(isValidOutline({ ...base, h2s: ['Um', 'Dois'] }, 'como avaliar solução b2b')).toBe(false);
    expect(isValidOutline({ ...base, title: 'Guia de compras' }, 'como avaliar solução b2b')).toBe(false);
  });
});
