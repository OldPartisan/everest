#!/usr/bin/env node
/**
 * Local preview of the static export under the production basePath.
 * The exported site expects /everest/... because GitHub Pages serves it there.
 *
 * Usage: npm run build && npm run preview
 */
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const root = resolve('out');
const base = '/everest';
const port = Number(process.env.PORT ?? 3000);

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.glb': 'model/gltf-binary',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

const server = createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
  let pathname = decodeURIComponent(url.pathname);

  if (pathname === '/' || pathname === base) {
    response.writeHead(308, { Location: `${base}/` });
    response.end();
    return;
  }

  if (!pathname.startsWith(`${base}/`)) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found. The preview lives at /everest/.');
    return;
  }

  let relative = pathname.slice(base.length);
  if (relative.endsWith('/')) relative += 'index.html';

  let file = normalize(join(root, relative));
  if (!file.startsWith(root)) {
    response.writeHead(403);
    response.end();
    return;
  }

  if (existsSync(file) && statSync(file).isDirectory()) {
    file = join(file, 'index.html');
  }

  if (!existsSync(file)) {
    const notFound = join(root, '404.html');
    if (existsSync(notFound)) {
      response.writeHead(404, { 'Content-Type': contentTypes['.html'] });
      createReadStream(notFound).pipe(response);
      return;
    }
    response.writeHead(404);
    response.end();
    return;
  }

  const contentType = contentTypes[extname(file)] ?? 'application/octet-stream';
  const compressible = /^(text\/|application\/(json|manifest\+json|xml)|image\/svg)/.test(contentType);
  const acceptsGzip = (request.headers['accept-encoding'] ?? '').includes('gzip');

  if (compressible && acceptsGzip) {
    const body = gzipSync(readFileSync(file));
    response.writeHead(200, {
      'Content-Type': contentType,
      'Content-Encoding': 'gzip',
      'Content-Length': body.length,
      'Vary': 'Accept-Encoding',
      'Cache-Control': 'no-store',
    });
    response.end(body);
    return;
  }

  response.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
  });
  createReadStream(file).pipe(response);
});

server.listen(port, () => {
  console.log(`Everest preview: http://localhost:${port}${base}/`);
});
