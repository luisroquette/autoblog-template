// src/lib/blog/seed-keywords.ts
// ⚙️ CONFIGURAR: substituir com keywords do nicho do projeto

export const SEED_KEYWORDS = [
  "keyword principal 1",
  "keyword principal 2",
  "keyword principal 3",
  "keyword principal 4",
  "keyword principal 5",
  "keyword principal 6",
  "keyword principal 7",
  "keyword principal 8",
  "keyword principal 9",
  "keyword principal 10",
];

export function getNextSeedKeyword(dayOfYear: number): string {
  return SEED_KEYWORDS[dayOfYear % SEED_KEYWORDS.length];
}
