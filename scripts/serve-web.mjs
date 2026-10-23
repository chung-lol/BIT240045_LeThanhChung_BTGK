/**
 * Phục vụ bản web đã export (thư mục dist/) tại http://localhost:<PORT>.
 * expo-sqlite trên web cần SharedArrayBuffer => trình duyệt bắt buộc header COOP/COEP;
 * dev server của Expo không gắn header này cho trang HTML nên dùng server tĩnh này.
 * Cách dùng: npm run web:local   (= expo export -p web && node scripts/serve-web.mjs)
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const port = Number(process.env.PORT ?? 8080);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  let file = path.join(root, urlPath);
  if (!file.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  if (!existsSync(file) || statSync(file).isDirectory()) {
    // Expo Router single-page: mọi route (vd /dish/abc) đều trả index.html
    const asHtml = `${file}.html`;
    file = existsSync(asHtml) ? asHtml : path.join(root, 'index.html');
  }
  res.writeHead(200, {
    'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream',
    'Cross-Origin-Embedder-Policy': 'credentialless',
    'Cross-Origin-Opener-Policy': 'same-origin',
  });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`FoodManager web: http://localhost:${port}`));
