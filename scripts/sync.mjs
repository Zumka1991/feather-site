// Переносит материалы из репозитория feather-de в сайт: руководство (RU/EN),
// журнал выпусков, версию, скриншоты и обои. Результат коммитится, поэтому сама
// сборка сайта от соседнего репозитория не зависит.
//
//   node scripts/sync.mjs            # берёт ../feather-de
//   FEATHER_DE=/путь node scripts/sync.mjs
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { marked } from 'marked';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.resolve(process.env.FEATHER_DE || path.join(root, '..', 'feather-de'));
const GH = 'https://github.com/Zumka1991/feather-de/blob/master/';

if (!existsSync(path.join(src, 'docs', 'USER_GUIDE.md'))) {
  console.error(`Не найден репозиторий feather-de: ${src}`);
  process.exit(1);
}

const out = (...p) => path.join(root, ...p);
const ensure = (dir) => mkdir(dir, { recursive: true });

// --- Руководство -----------------------------------------------------------
async function guide(lang) {
  const file = lang === 'ru' ? 'USER_GUIDE.md' : 'USER_GUIDE.en.md';
  let md = await readFile(path.join(src, 'docs', file), 'utf8');
  const lines = md.split('\n');
  const kept = [];
  let skip = false;
  for (const line of lines) {
    if (/^# /.test(line)) continue; // заголовок рисует страница
    if (/^\*\*\[🇬🇧|^\*\*\[🇷🇺/.test(line)) continue; // навигация GitHub
    if (/^## (Содержание|Table of Contents)\s*$/.test(line)) { skip = true; continue; }
    if (skip && /^## /.test(line)) skip = false;
    if (skip) continue;
    kept.push(line);
  }
  md = kept.join('\n')
    .replace(/\]\(images\/guide\/(ru|en)\/([\w-]+)\.png\)/g, '](/shots/$1/$2.webp)')
    .replace(/\]\(\.\.\/([^)]+)\)/g, `](${GH}$1)`)
    .replace(/\]\((?!https?:|\/|#)([^)]+\.md)\)/g, `](${GH}docs/$1)`)
    .replace(/\n---\n(\s*\n---\n)+/g, '\n---\n')
    .replace(/^\s*---\s*\n/, '');
  await ensure(out('src', 'content'));
  await writeFile(out('src', 'content', `guide.${lang}.md`), md.trim() + '\n');
}

// --- Скриншоты и обои ------------------------------------------------------
async function shots() {
  for (const lang of ['ru', 'en']) {
    const dir = path.join(src, 'docs', 'images', 'guide', lang);
    await ensure(out('public', 'shots', lang));
    for (const f of (await readdir(dir)).filter((n) => n.endsWith('.png'))) {
      const base = f.replace(/\.png$/, '');
      const img = sharp(path.join(dir, f));
      await img.clone().webp({ quality: 86 }).toFile(out('public', 'shots', lang, `${base}.webp`));
      await img.clone().resize({ width: 800 }).webp({ quality: 82 })
        .toFile(out('public', 'shots', lang, `${base}-800.webp`));
    }
  }
}

async function walls() {
  const dir = path.join(src, 'assets', 'wallpapers');
  await ensure(out('public', 'walls'));
  const names = [];
  for (const f of await readdir(dir)) {
    const m = f.match(/^feather-(\w+)\.(png|jpg)$/);
    if (!m) continue;
    names.push(m[1]);
    const img = sharp(path.join(dir, f));
    await img.clone().resize({ width: 1920 }).webp({ quality: 80 }).toFile(out('public', 'walls', `${m[1]}.webp`));
    await img.clone().resize({ width: 640 }).webp({ quality: 78 }).toFile(out('public', 'walls', `${m[1]}-640.webp`));
  }
  return names.sort();
}

// --- Журнал выпусков -------------------------------------------------------
async function changelog() {
  const md = await readFile(path.join(src, 'CHANGELOG.md'), 'utf8');
  const parts = md.split(/^## /m).slice(1);
  const releases = [];
  for (const part of parts) {
    const nl = part.indexOf('\n');
    const head = part.slice(0, nl).trim();
    const m = head.match(/^(\d{4}-\d{2}-\d{2})\s+—\s+Выпуск\s+(\d+\.\d+\.\d+)/);
    if (!m) continue;
    const body = part.slice(nl + 1).trim()
      .replace(/\]\((?!https?:|#)([^)]+)\)/g, `](${GH}$1)`);
    releases.push({ date: m[1], version: m[2], html: marked.parse(body) });
  }
  return releases;
}

const cargo = await readFile(path.join(src, 'Cargo.toml'), 'utf8');
const version = cargo.match(/^version\s*=\s*"([^"]+)"/m)[1];

await guide('ru');
await guide('en');
await shots();
const wallpapers = await walls();
const releases = await changelog();
await ensure(out('src', 'data'));
await writeFile(out('src', 'data', 'changelog.json'), JSON.stringify(releases, null, 1) + '\n');
await writeFile(
  out('src', 'data', 'project.json'),
  JSON.stringify({ version, released: releases[0]?.date ?? null, wallpapers }, null, 2) + '\n',
);
console.log(`Пёрышко ${version}: руководство, ${releases.length} выпусков, ${wallpapers.length} обоев, скриншоты.`);
