import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const docs = resolve(root, 'docs');
const html = await readFile(resolve(docs, 'index.html'), 'utf8');
const h1Count = (html.match(/<h1\b/g) || []).length;
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const tabs = (html.match(/role="tab"/g) || []).length;
const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map((match) => match[1].split('?', 1)[0])
  .filter((ref) => ref && !/^(?:#|https?:|data:|mailto:)/.test(ref));

if (h1Count !== 1) throw new Error(`Expected one H1, found ${h1Count}`);
if (ids.length !== new Set(ids).size) throw new Error('Duplicate IDs found');
if (tabs !== 3) throw new Error(`Expected three claim tabs, found ${tabs}`);
if (!html.includes('NO JOB IS RUN')) throw new Error('Simulation boundary is missing');
await Promise.all(refs.map((ref) => access(resolve(docs, ref))));
console.log(`Product site validation passed: one H1, ${ids.length} unique IDs, three claim states, explicit boundary, no missing assets`);
