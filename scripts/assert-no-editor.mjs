#!/usr/bin/env node
/**
 * CI / build assertion: the storefront bundle graph must NOT contain the Sanee editor or its heavy
 * dependencies (docs/host-integration-shoppp.md §1 "Never import", §6.5, §11 "Bundle").
 *
 *   node scripts/assert-no-editor.mjs            # package.json + package-lock.json + src imports
 *   node scripts/assert-no-editor.mjs --build    # additionally scan the .next output (run after `next build`)
 *
 * Wired as `prebuild` (manifest check) and `postbuild` (output check) in package.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Packages the editor pulls in. None of them may be in the storefront's dependency graph. */
export const FORBIDDEN_PACKAGES = [
  '@sanee/editor',
  'sucrase',
  '@babel/parser',
  '@tailwindcss/browser',
  'polygon-clipping',
  'monaco-editor',
  '@monaco-editor/react',
];

/**
 * eslint-config-next depends on eslint-plugin-react-hooks, which depends on
 * @babel/parser. That copy is dev-only and is not part of the storefront bundle.
 * A production dependency on @babel/parser still fails.
 */
const DEV_ONLY_ALLOWED = new Set(['@babel/parser']);

const allowsDevOnly = (name, entry) =>
  DEV_ONLY_ALLOWED.has(name) && entry?.dev === true;

/** Strings that must not appear in source imports or in the built output. */
// Only real imports count (comments may legitimately name the editor).
const FORBIDDEN_IMPORT =
  /(?:\bfrom|\bimport|\brequire\(|\bimport\()\s*['"](?:@sanee\/editor|sanee\/editor)(?:\/[^'"]*)?['"]/;
const FORBIDDEN_IN_BUILD = [
  /@sanee\/editor/,
  /sanee\/editor/,
  /monaco-editor/,
  /@tailwindcss\/browser/,
  /polygon-clipping/,
];

const walk = (dir, filter, out = []) => {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'cache') continue;
      walk(full, filter, out);
    } else if (filter(full)) out.push(full);
  }
  return out;
};

export function checkProject(root, { build = false } = {}) {
  const problems = [];
  const read = (file) =>
    fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;

  const pkgText = read(path.join(root, 'package.json'));
  if (pkgText) {
    const pkg = JSON.parse(pkgText);
    for (const section of [
      'dependencies',
      'devDependencies',
      'optionalDependencies',
      'peerDependencies',
      'overrides',
    ]) {
      for (const name of Object.keys(pkg[section] ?? {})) {
        if (FORBIDDEN_PACKAGES.includes(name))
          problems.push(`package.json ${section} lists ${name}`);
      }
    }
  }

  const lockText = read(path.join(root, 'package-lock.json'));
  if (lockText) {
    const lock = JSON.parse(lockText);
    for (const [key, entry] of Object.entries(lock.packages ?? {})) {
      const name = key.split('node_modules/').pop();
      if (
        name &&
        FORBIDDEN_PACKAGES.includes(name) &&
        !allowsDevOnly(name, entry)
      )
        problems.push(`package-lock.json contains ${key}`);
    }
    for (const [key, entry] of Object.entries(lock.packages ?? {})) {
      for (const section of [
        'dependencies',
        'optionalDependencies',
        'peerDependencies',
      ]) {
        for (const dep of Object.keys(entry[section] ?? {})) {
          if (
            FORBIDDEN_PACKAGES.includes(dep) &&
            !entry.peerDependenciesMeta?.[dep]?.optional &&
            !allowsDevOnly(dep, entry)
          )
            problems.push(
              `package-lock.json: ${key || '(root)'} ${section} requires ${dep}`
            );
        }
      }
    }
  }

  for (const file of walk(path.join(root, 'src'), (f) =>
    /\.(m?[jt]sx?)$/.test(f)
  )) {
    const text = fs.readFileSync(file, 'utf8');
    if (FORBIDDEN_IMPORT.test(text))
      problems.push(`${path.relative(root, file)} imports the Sanee editor`);
  }

  if (build) {
    const next = path.join(root, '.next');
    if (!fs.existsSync(next))
      problems.push('.next not found: run `next build` before --build');
    for (const file of walk(
      next,
      (f) =>
        /\.(js|mjs|cjs|css|json|html|rsc)$/.test(f) &&
        !/[\\/]cache[\\/]/.test(f)
    )) {
      const text = fs.readFileSync(file, 'utf8');
      for (const re of FORBIDDEN_IN_BUILD) {
        if (re.test(text)) {
          problems.push(`${path.relative(root, file)} contains ${re}`);
          break;
        }
      }
    }
  }
  return problems;
}

const isMain =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const problems = checkProject(root, {
    build: process.argv.includes('--build'),
  });
  if (problems.length) {
    console.error(
      'Storefront bundle assertion FAILED: the Sanee editor must not reach the customer web.'
    );
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  console.log(
    `Storefront bundle assertion passed${process.argv.includes('--build') ? ' (package manifests, sources and .next output)' : ' (package manifests and sources)'}.`
  );
}
