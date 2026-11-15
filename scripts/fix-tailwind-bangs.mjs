import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const root = process.cwd();

// Only rewrite known broken utility suffixes / units. Do not touch English "word!".
const files = execSync(
  "rg -l --glob '!node_modules' --glob '!.next' --glob '*.{tsx,ts,jsx,js}' '\\[[0-9]+!px\\]|hidden!|block!|flex!|w-fit!|text-black!|text-brand!|bg-brand-tint!|bg-transparent!|md:bg-transparent!|first-letter:uppercase!' src",
  { encoding: 'utf8', cwd: root },
)
  .trim()
  .split('\n')
  .filter(Boolean);

const replacements = [
  [/\[(\d+)!px\]/g, '[$1px]'],
  [/\bhidden!/g, '!hidden'],
  [/\bblock!/g, '!block'],
  [/\bflex!/g, '!flex'],
  [/\bw-fit!/g, '!w-fit'],
  [/\btext-black!/g, '!text-black'],
  [/\btext-brand!/g, '!text-brand'],
  [/\bbg-brand-tint!/g, '!bg-brand-tint'],
  [/\bmd:bg-transparent!/g, 'md:!bg-transparent'],
  [/\bbg-transparent!/g, '!bg-transparent'],
  [/\bfirst-letter:uppercase!/g, 'first-letter:!uppercase'],
];

let changed = 0;
for (const file of files) {
  const full = path.join(root, file);
  let content = fs.readFileSync(full, 'utf8');
  const before = content;
  for (const [re, to] of replacements) {
    content = content.replace(re, to);
  }
  if (content !== before) {
    fs.writeFileSync(full, content);
    changed += 1;
    console.log('fixed', file);
  }
}
console.log('files changed', changed);
