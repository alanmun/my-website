/* Copies Markdown blogs from your local Obsidian vault into static/assets/blogs,
   excluding any files with "WIP" in the filename, and generates static/assets/blogs/index.json.
*/
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
require('dotenv').config();

function toWSLPathMaybe(p) {
  // Convert a Windows path like "C:\..." to "/mnt/c/..." when running under Linux/WSL
  if (!p) return p;
  const isLinux = process.platform === 'linux';
  const winDrive = /^[A-Za-z]:\\/;
  if (isLinux && winDrive.test(p)) {
    const drive = p[0].toLowerCase();
    const rest = p.slice(2).replace(/\\/g, '/');
    return `/mnt/${drive}${rest.startsWith('/') ? '' : '/'}${rest}`;
  }
  return p;
}

const RAW_SOURCE_DIR = process.env.PATH_TO_OBSIDIAN_BLOGS_FOLDER || '';
const SOURCE_DIR = toWSLPathMaybe(RAW_SOURCE_DIR);
const DEST_DIR = path.join(process.cwd(), 'static', 'assets', 'blogs');
const DEST_ASSETS_DIR = path.join(DEST_DIR, 'attachments');
const ASSETS_SRC_DIR = path.resolve(SOURCE_DIR, '..', 'assets'); // Obsidian attachments live alongside "blogs"
const ASSET_URL_BASE = '/assets/blogs/attachments/'; // Public URL where copied blog assets are served

function isMarkdown(file) {
  return path.extname(file).toLowerCase() === '.md';
}

function hasWipInName(name) {
  return /wip/i.test(name);
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function isValidId(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(value || ''));
}

function parseFrontMatter(content) {
  const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/);
  if (!match) return {};

  const meta = {};
  const block = match[1];
  const lines = block.split(/\r?\n/);
  for (const line of lines) {
    const kv = line.match(/^\s*([A-Za-z0-9_-]+)\s*:\s*(.+?)\s*$/);
    if (!kv) continue;
    const key = kv[1].toLowerCase();
    const rawValue = kv[2].trim();
    meta[key] = rawValue.replace(/^['"]|['"]$/g, '');
  }
  return meta;
}

// Remove a leading Obsidian/YAML front matter block if present
function stripFrontMatter(content) {
  if (!content) return content;
  const re = /^---\s*\r?\n[\s\S]*?\r?\n---\s*\r?\n?/;
  return content.replace(re, '');
}

// Build a case-insensitive index of files in the Obsidian "assets" directory
async function buildAssetIndex(root) {
  try {
    if (!fs.existsSync(root)) return null;
    const map = new Map();
    async function walk(dir, relBase = '') {
      const entries = await fsp.readdir(dir, { withFileTypes: true });
      for (const ent of entries) {
        const abs = path.join(dir, ent.name);
        const rel = relBase ? path.join(relBase, ent.name) : ent.name;
        if (ent.isDirectory()) {
          await walk(abs, rel);
        } else if (ent.isFile()) {
          map.set(ent.name.toLowerCase(), rel);
        }
      }
    }
    await walk(root, '');
    return map;
  } catch {
    return null;
  }
}

// Replace Obsidian embeds like ![[Pasted image 20250902124814.png]] with Markdown images,
// copy referenced assets, and return the list of used asset relative paths.
function rewriteObsidianEmbeds(md, assetIndex) {
  if (!md) return { rewritten: md, usedAssets: [] };
  if (!assetIndex) return { rewritten: md, usedAssets: [] };

  const used = [];
  const rewritten = md.replace(/!\[\[([^\]]+)\]\]/g, (match, inner) => {
    // Support optional pipe (alt text or width), we only use the target before '|'
    let target = inner;
    const pipeIdx = inner.indexOf('|');
    if (pipeIdx >= 0) target = inner.slice(0, pipeIdx);
    target = target.trim();

    // Resolve against assets index by basename
    const baseName = path.basename(target).toLowerCase();
    let rel = assetIndex.get(baseName);

    // If not found and target contains "assets/...", try that subpath (minus the "assets/" prefix)
    if (!rel) {
      const cand = target.replace(/^assets[\\/]/i, '');
      rel = assetIndex.get(cand.toLowerCase());
    }

    if (rel) {
      if (!used.includes(rel)) used.push(rel);
      const alt = path.parse(baseName).name;
      const url = encodeURI(ASSET_URL_BASE + toPosix(rel));
      return `![${alt}](${url})`;
    }
    // Leave unknown embeds untouched
    return match;
  });

  return { rewritten, usedAssets: used };
}

// Extract created date from front matter or fall back to file mtime
async function getDateForFile(absPath) {
  try {
    const content = await fsp.readFile(absPath, 'utf8');
    const fmMatch = content.match(/^---\s*[\s\S]*?---/);
    if (fmMatch) {
      const createdMatch = fmMatch[0].match(/^\s*created\s*:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/m);
      if (createdMatch) return createdMatch[1];
    }
  } catch (e) { /* ignore */ }
  try {
    const st = await fsp.stat(absPath);
    const dt = new Date(st.mtime);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const d = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  } catch (e) {
    return '1970-01-01';
  }
}

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''));
}

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
}

async function copyFile(src, dest) {
  await ensureDir(path.dirname(dest));
  await fsp.copyFile(src, dest);
}

async function walkAndCopy(srcDir, relBase, index, assetIndex) {
  const entries = await fsp.readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(srcDir, entry.name);
    const rel = relBase ? path.join(relBase, entry.name) : entry.name;

    if (entry.isDirectory()) {
      await walkAndCopy(abs, rel, index, assetIndex);
    } else if (entry.isFile()) {
      if (!isMarkdown(entry.name)) continue;
      if (hasWipInName(entry.name)) continue;

      const destAbs = path.join(DEST_DIR, rel);
      await ensureDir(path.dirname(destAbs));
      const raw = await fsp.readFile(abs, 'utf8');
      const meta = parseFrontMatter(raw);
      const id = (meta.id || '').trim();
      if (!id) {
        throw new Error(`[pull-blogs] Missing required front matter id in: ${abs}`);
      }
      if (!isValidId(id)) {
        throw new Error(
          `[pull-blogs] Invalid id "${id}" in: ${abs}. ` +
          'Expected lowercase kebab-case: /^[a-z0-9]+(?:-[a-z0-9]+)*$/'
        );
      }
      const stripped = stripFrontMatter(raw);

      // Rewrite Obsidian embeds and stage assets for copy
      let rewritten = stripped;
      let usedAssets = [];
      if (assetIndex) {
        const result = rewriteObsidianEmbeds(stripped, assetIndex);
        rewritten = result.rewritten;
        usedAssets = result.usedAssets;

        // Copy any referenced assets preserving relative structure
        for (const relAsset of usedAssets) {
          const srcAsset = path.join(ASSETS_SRC_DIR, relAsset);
          const destAsset = path.join(DEST_ASSETS_DIR, relAsset);
          await ensureDir(path.dirname(destAsset));
          try {
            await fsp.copyFile(srcAsset, destAsset);
          } catch {
            // Ignore missing assets; the embed will remain as-is
          }
        }
      }

      await fsp.writeFile(destAbs, rewritten, 'utf8');

      const base = path.parse(entry.name).name; // filename without extension
      const urlPath = encodeURI('/' + toPosix(path.join('assets', 'blogs', rel))); // e.g., /assets/blogs/subdir/file.md
      const date = isIsoDate(meta.created) ? meta.created : await getDateForFile(abs);
      const title = meta.title || base;
      index.push({
        title,
        id,
        slug: id,
        path: urlPath,
        date
      });
    }
  }
}

async function main() {
  try {
    if (!SOURCE_DIR) {
      console.warn('[pull-blogs] PATH_TO_OBSIDIAN_BLOGS_FOLDER is not set. Skipping blog copy.');
      return;
    }
    if (!fs.existsSync(SOURCE_DIR)) {
      console.warn(
        `[pull-blogs] SOURCE_DIR not found: ${SOURCE_DIR}` +
        (RAW_SOURCE_DIR && RAW_SOURCE_DIR !== SOURCE_DIR ? ` (from ${RAW_SOURCE_DIR})` : '') +
        `. Skipping blog copy.`
      );
      return;
    }

    // Clean destination before copy to ensure a fresh sync
    if (fs.existsSync(DEST_DIR)) {
      await fsp.rm(DEST_DIR, { recursive: true, force: true });
    }
    await ensureDir(DEST_DIR);
    const index = [];
    const assetIndex = await buildAssetIndex(ASSETS_SRC_DIR);
    await walkAndCopy(SOURCE_DIR, '', index, assetIndex);

    // Sort by title ascending for deterministic order
    index.sort((a, b) => a.title.localeCompare(b.title));
    const seenIds = new Set();
    for (const post of index) {
      const id = post.id;
      if (seenIds.has(id)) {
        throw new Error(`[pull-blogs] Duplicate id "${id}" found in blog index generation.`);
      }
      seenIds.add(id);
    }

    const idxPath = path.join(DEST_DIR, 'index.json');
    await fsp.writeFile(idxPath, JSON.stringify(index, null, 2), 'utf8');

    console.log(`[pull-blogs] Copied ${index.length} blog(s) into ${DEST_DIR} and wrote index.json`);
  } catch (err) {
    console.error('[pull-blogs] Failed:', err);
    process.exitCode = 1;
  }
}

main();
