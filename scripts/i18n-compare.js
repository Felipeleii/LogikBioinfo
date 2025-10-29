#!/usr/bin/env node
/*
 I18N HTML comparator
 - Scans Portuguese (root), English (en/), Spanish (es/) html files
 - Maps equivalent pages (handling obrigado/thank-you/gracias alias)
 - Detects missing pages per language
 - Compares structure-only fingerprints (tags only, no text/attrs/scripts/styles)
 - Outputs a Markdown report to stdout
*/

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const repoRoot = path.resolve(__dirname, '..');

const LANGS = [
  { code: 'pt', base: repoRoot },
  { code: 'en', base: path.join(repoRoot, 'en') },
  { code: 'es', base: path.join(repoRoot, 'es') },
];

const PT_EXCLUDE_DIRS = new Set(['en', 'es', 'unused_files', 'node_modules']);

function isHtml(file) {
  return file.toLowerCase().endsWith('.html');
}

function walk(dir, options = {}) {
  const { excludeTop = new Set() } = options;
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const dirent of list) {
    const full = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      if (dir === repoRoot && excludeTop.has(dirent.name)) continue;
      results = results.concat(walk(full, options));
    } else if (dirent.isFile()) {
      if (isHtml(dirent.name)) results.push(full);
    }
  }
  return results;
}

function relKeyFor(lang, fullPath) {
  if (lang === 'pt') {
    const rel = path.relative(repoRoot, fullPath).replace(/\\/g, '/');
    // normalize alias only at root level
    if (rel === 'obrigado.html') return 'thank-you.html';
    return rel;
  }
  if (lang === 'en') {
    let rel = path.relative(path.join(repoRoot, 'en'), fullPath).replace(/\\/g, '/');
    if (rel === 'thank-you.html') rel = 'thank-you.html';
    return rel;
  }
  if (lang === 'es') {
    let rel = path.relative(path.join(repoRoot, 'es'), fullPath).replace(/\\/g, '/');
    if (rel === 'gracias.html') rel = 'thank-you.html';
    return rel;
  }
  return path.basename(fullPath);
}

function collectFiles() {
  const pages = new Map(); // key -> { pt, en, es }

  for (const { code, base } of LANGS) {
    if (!fs.existsSync(base)) continue;
    const files = code === 'pt' ? walk(base, { excludeTop: PT_EXCLUDE_DIRS }) : walk(base);
    for (const file of files) {
      // Ignore files inside en/ or es/ when scanning pt (already excluded at top)
      const key = relKeyFor(code, file);
      if (!pages.has(key)) pages.set(key, {});
      pages.get(key)[code] = file;
    }
  }
  return pages;
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function stripBetween(text, startTag, endTag) {
  // remove occurrences of blocks like <script ...>...</script>
  const regex = new RegExp(`${startTag}[\\s\\S]*?${endTag}`, 'gi');
  return text.replace(regex, '');
}

function normalizeStructure(html) {
  let s = html;
  // Remove BOM if any
  s = s.replace(/^\uFEFF/, '');
  // Remove comments
  s = s.replace(/<!--([\s\S]*?)-->/g, '');
  // Remove script and style blocks entirely
  s = stripBetween(s, '<script[^>]*?>', '<\\/script>');
  s = stripBetween(s, '<style[^>]*?>', '<\\/style>');
  // Remove text between tags while preserving tags. Replace text nodes with nothing.
  // Strategy: collapse sequences like ">text<" into "><"
  s = s.replace(/>([^<]+)</g, (m, text) => '><');
  // Remove attributes: turn <tag attr="..."> into <tag>
  s = s.replace(/<([a-zA-Z0-9\-]+)(\s+[^>]*?)>/g, '<$1>');
  // Lowercase tag names
  s = s.replace(/<\/?([A-Z0-9\-]+)>/g, (m, name) => m.toLowerCase());
  // Remove doctype
  s = s.replace(/<!doctype[^>]*>/gi, '');
  // Collapse whitespace
  s = s.replace(/\s+/g, ' ');
  // Trim
  s = s.trim();
  return s;
}

function fingerprint(structure) {
  return crypto.createHash('sha1').update(structure).digest('hex');
}

function countTags(html) {
  const counts = Object.create(null);
  const re = /<\/?([a-z0-9\-]+)[^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const name = m[1].toLowerCase();
    if (!counts[name]) counts[name] = 0;
    counts[name]++;
  }
  return counts;
}

function formatCountsDiff(countsByLang) {
  // Union of tag names
  const names = new Set();
  for (const lang of Object.keys(countsByLang)) {
    Object.keys(countsByLang[lang]).forEach(n => names.add(n));
  }
  const rows = [];
  const header = ['tag', ...Object.keys(countsByLang)].join(' | ');
  const sep = Array(1 + Object.keys(countsByLang).length).fill('---').join(' | ');
  rows.push(header);
  rows.push(sep);
  for (const name of Array.from(names).sort()) {
    const values = [name, ...Object.keys(countsByLang).map(l => countsByLang[l][name] || 0)];
    rows.push(values.join(' | '));
  }
  return rows.join('\n');
}

function main() {
  const pages = collectFiles();
  const now = new Date();
  const dt = now.toISOString();
  let out = '';
  out += `# I18N HTML Comparison Report\n\n`;
  out += `Generated: ${dt}\n\n`;
  out += `Languages: pt (root), en (/en), es (/es)\n\n`;

  const keys = Array.from(pages.keys()).sort();

  // Missing pages section
  out += `## Missing pages by language\n\n`;
  let missingCount = 0;
  for (const key of keys) {
    const entry = pages.get(key);
    const missing = LANGS.map(l => l.code).filter(code => !entry[code]);
    if (missing.length) {
      missingCount++;
      out += `- ${key}: missing in ${missing.join(', ')}\n`;
    }
  }
  if (missingCount === 0) out += `- None — all pages exist in all languages (or intentionally unmatched).\n`;

  // Structural differences section
  out += `\n## Structural differences (tags only)\n\n`;
  let diffCount = 0;
  for (const key of keys) {
    const entry = pages.get(key);
    // Only compare if at least two languages present
    const presentLangs = LANGS.map(l => l.code).filter(code => !!entry[code]);
    if (presentLangs.length < 2) continue;

    const structs = {};
    const fps = {};
    const counts = {};
    for (const lang of presentLangs) {
      const html = read(entry[lang]);
      const structure = normalizeStructure(html);
      structs[lang] = structure;
      fps[lang] = fingerprint(structure);
      counts[lang] = countTags(structure);
    }

    const fpValues = Object.values(fps);
    const allEqual = fpValues.every(v => v === fpValues[0]);
    if (!allEqual) {
      diffCount++;
      out += `### ${key}\n\n`;
      out += `Files:\n`;
      for (const lang of presentLangs) {
        out += `- ${lang}: ${path.relative(repoRoot, entry[lang]).replace(/\\\\/g, '/')} (fp ${fps[lang]})\n`;
      }
      out += `\nTag counts comparison:\n\n`;
      out += formatCountsDiff(counts) + '\n\n';
      out += `Structure preview (first 300 chars per language):\n\n`;
      for (const lang of presentLangs) {
        const prev = structs[lang].slice(0, 300).replace(/\n/g, ' ');
        out += `- ${lang}: ${prev}\n`;
      }
      out += `\n`;
    }
  }
  if (diffCount === 0) out += `- None — All compared pages share the same structure.\n`;

  // Write to stdout
  process.stdout.write(out);
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}
