import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { checkProject } from './assert-no-editor.mjs';

const fixture = (files) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'no-editor-'));
  for (const [name, content] of Object.entries(files)) {
    const file = path.join(dir, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(
      file,
      typeof content === 'string' ? content : JSON.stringify(content)
    );
  }
  return dir;
};
const clean = {
  'package.json': {
    dependencies: { '@sanee/core': '0.0.0', '@sanee/react': '0.0.0' },
  },
};

test('the real storefront is clean', () => {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  assert.deepEqual(checkProject(root), []);
});

test('a storefront with core + react + blocks passes', () => {
  assert.deepEqual(checkProject(fixture(clean)), []);
});

test('fails when package.json lists @sanee/editor (any section)', () => {
  const dir = fixture({
    'package.json': { devDependencies: { '@sanee/editor': '0.0.0' } },
  });
  assert.match(checkProject(dir)[0], /@sanee\/editor/);
});

test('allows a dev-only @babel/parser pulled in by eslint-config-next', () => {
  const dir = fixture({
    ...clean,
    'package-lock.json': {
      packages: {
        '': {},
        'node_modules/@babel/parser': { version: '7.29.13', dev: true },
        'node_modules/eslint-plugin-react-hooks': {
          dev: true,
          dependencies: { '@babel/parser': '^7.24.4' },
        },
      },
    },
  });
  assert.deepEqual(checkProject(dir), []);
});

test('fails on Sucrase / Babel parser / Tailwind browser / polygon-clipping in the lockfile', () => {
  for (const name of [
    'sucrase',
    '@babel/parser',
    '@tailwindcss/browser',
    'polygon-clipping',
  ]) {
    const dir = fixture({
      ...clean,
      'package-lock.json': {
        packages: { '': {}, [`node_modules/${name}`]: { version: '1.0.0' } },
      },
    });
    assert.ok(
      checkProject(dir).some((p) => p.includes(name)),
      name
    );
  }
});

test('fails when a package requires the editor (non-optional)', () => {
  const dir = fixture({
    ...clean,
    'package-lock.json': {
      packages: {
        'node_modules/sanee': { dependencies: { '@sanee/editor': '0.0.0' } },
      },
    },
  });
  assert.ok(
    checkProject(dir).some((p) => p.includes('requires @sanee/editor'))
  );
});

test('an OPTIONAL editor peer (the sanee umbrella) is allowed', () => {
  const dir = fixture({
    ...clean,
    'package-lock.json': {
      packages: {
        'node_modules/sanee': {
          peerDependencies: { '@sanee/editor': '0.0.0' },
          peerDependenciesMeta: { '@sanee/editor': { optional: true } },
        },
      },
    },
  });
  assert.deepEqual(checkProject(dir), []);
});

test('fails when a source file imports the editor', () => {
  const dir = fixture({
    ...clean,
    'src/app/page.tsx': `import { SaneeSiteEditor } from '@sanee/editor';`,
  });
  assert.ok(checkProject(dir).some((p) => p.includes('page.tsx')));
});

test('--build scans the .next output', () => {
  const ok = fixture({
    ...clean,
    '.next/server/app/page.js': 'console.log("hi")',
  });
  assert.deepEqual(checkProject(ok, { build: true }), []);
  const bad = fixture({
    ...clean,
    '.next/static/chunks/a.js': 'require("@sanee/editor")',
  });
  assert.ok(checkProject(bad, { build: true }).some((p) => p.includes('a.js')));
  assert.ok(
    checkProject(fixture(clean), { build: true }).some((p) =>
      p.includes('.next not found')
    )
  );
});
