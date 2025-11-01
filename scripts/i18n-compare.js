#!/usr/bin/env node
/*
 I18N HTML comparator (Security-fixed version)
 - Scans Portuguese (root), English (en/), Spanish (es/) html files
 - Maps equivalent pages (handling obrigado/thank-you/gracias alias)
 - Detects missing pages per language
 - Compares structure-only fingerprints (tags only, no text/attrs/scripts/styles)
 - Outputs a Markdown report to stdout
 
 Security fixes:
 - Fixed ReDoS vulnerability in stripBetween function
 - Added input validation and size limits
 - Improved regex patterns to prevent catastrophic backtracking
*/

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const repoRoot = path.resolve(__dirname, '..');

// Security: Maximum file size to process (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

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
  
  try {
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
  } catch (err) {
    console.error(`Warning: Cannot read directory ${dir}: ${err.message}`);
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
      const key = relKeyFor(code, file);
      if (!pages.has(key)) pages.set(key, {});
      pages.get(key)[code] = file;
    }
  }
  return pages;
}

function read(file) {
  // Security: Check file size before reading
  const stats = fs.statSync(file);
  if (stats.size > MAX_FILE_SIZE) {
    console.warn(`Warning: File ${file} exceeds ${MAX_FILE_SIZE} bytes, skipping`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

/**
 * SECURITY FIX: Improved stripBetween function to prevent ReDoS
 * Instead of using [\\s\\S]*? which can cause catastrophic backtracking,
 * we use a more specific and safer approach with chunked processing
 */
function stripBetween(text, startTag, endTag) {
  if (!text || typeof text !== 'string') return '';
  
  // Escape regex special characters in tags
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const safeStart = escapeRegex(startTag);
  const safeEnd = escapeRegex(endTag);
  
  let result = text;
  let maxIterations = 1000; // Safety limit to prevent infinite loops
  let iterations = 0;
  
  // Use a safer approach: find and remove one block at a time
  while (iterations < maxIterations) {
    // Create a regex that matches the opening tag, then uses a negated character class
    // or a lazy quantifier with a reasonable limit
    const regex = new RegExp(`${safeStart}(?:(?!${safeEnd}).){0,50000}?${safeEnd}`, 'i');
    const match = result.match(regex);
    
    if (!match) break;
    
    result = result.slice(0, match.index) + result.slice(match.index + match[0].length);
    iterations++;
  }
  
  if (iterations >= maxIterations) {
    console.warn('Warning: stripBetween reached iteration limit, possible malformed HTML');
  }
  
  return result;
}

/**
 * Alternative safer implementation using indexOf for better performance
 */
function stripBetweenSafe(text, startTag, endTag) {
  if (!text || typeof text !== 'string') return '';
  
  let result = '';
  let pos = 0;
  let searchStart = 0;
  let iterations = 0;
  const maxIterations = 1000;
  
  while (iterations < maxIterations) {
    const startIndex = text.indexOf(startTag, searchStart);
    if (startIndex === -1) {
      result += text.slice(pos);
      break;
    }
    
    result += text.slice(pos, startIndex);
    
    const endIndex = text.indexOf(endTag, startIndex + startTag.length);
    if (endIndex === -1) {
      // Malformed: no closing tag found, skip the rest
      break;
    }
    
    pos = endIndex + endTag.length;
    searchStart = pos;
    iterations++;
  }
  
  if (iterations >= maxIterations) {
    console.warn('Warning: stripBetweenSafe reached iteration limit');
  }
  
  return result;
}

function normalizeStructure(html) {
  if (!html || typeof html !== 'string') return '';
  
  let s = html;
  
  // Remove BOM if any
  s = s.replace(/^\uFEFF/, '');
  
  // Remove comments (with length limit to prevent ReDoS)
  // Fix: Remove HTML comments repeatedly until none remain to ensure full sanitization
  let prev;
  do {
    prev = s;
    s = s.replace(/<!--[\s\S]{0,10000}?-->/g, '');
  } while (s !== prev);
  
  // Remove script and style blocks using the safe function
  s = stripBetweenSafe(s, '<script', '</script>');
  s = stripBetweenSafe(s, '<style', '</style>');
  
  // Remove text between tags while preserving tags
  s = s.replace(/>([^<]{0,1000})</g, '><');
  
  // Remove attributes: turn <tag attr="..."> into <tag>
  s = s.replace(/<([a-zA-Z0-9\-]+)(\s+[^>]{0,500}?)>/g, '<$1>');
  
  // Lowercase tag names
  s = s.replace(/<\/?([A-Z0-9\-]+)>/g, (m) => m.toLowerCase());
  
  // Remove doctype
  s = s.replace(/<!doctype[^>]{0,200}>/gi, '');
  
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
  const re = /<\/?([a-z0-9\-]+)[^>]{0,500}>/gi;
  let m;
  let iterations = 0;
  const maxIterations = 100000;
  
  while ((m = re.exec(html)) && iterations < maxIterations) {
    const name = m[1].toLowerCase();
    if (!counts[name]) counts[name] = 0;
    counts[name]++;
    iterations++;
  }
  
  return counts;
}

function formatCountsDiff(countsByLang) {
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
  out += `# I18N HTML Comparison Report (Security-Fixed)\n\n`;
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
    const presentLangs = LANGS.map(l => l.code).filter(code => !!entry[code]);
    if (presentLangs.length < 2) continue;

    const structs = {};
    const fps = {};
    const counts = {};
    for (const lang of presentLangs) {
      const html = read(entry[lang]);
      if (!html) continue; // Skip if file was too large or couldn't be read
      
      const structure = normalizeStructure(html);
      structs[lang] = structure;
      fps[lang] = fingerprint(structure);
      counts[lang] = countTags(structure);
    }

    const fpValues = Object.values(fps);
    if (fpValues.length < 2) continue; // Skip if we couldn't process enough files
    
    const allEqual = fpValues.every(v => v === fpValues[0]);
    if (!allEqual) {
      diffCount++;
      out += `### ${key}\n\n`;
      out += `Files:\n`;
      for (const lang of presentLangs) {
        if (fps[lang]) {
          out += `- ${lang}: ${path.relative(repoRoot, entry[lang]).replace(/\\\\/g, '/')} (fp ${fps[lang]})\n`;
        }
      }
      out += `\nTag counts comparison:\n\n`;
      out += formatCountsDiff(counts) + '\n\n';
      out += `Structure preview (first 300 chars per language):\n\n`;
      for (const lang of presentLangs) {
        if (structs[lang]) {
          const prev = structs[lang].slice(0, 300).replace(/\n/g, ' ');
          out += `- ${lang}: ${prev}\n`;
        }
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
    console.error(err.stack);
    process.exit(1);
  }
}
