// Build script — esbuild (native, low-memory) instead of Vite's bundler,
// which relies on WebAssembly and can't allocate on this sandbox.
import { build } from 'esbuild'
import postcss from 'postcss'
import tailwind from '@tailwindcss/postcss'
import fs from 'node:fs'
import path from 'node:path'

const outDir = 'dist'
fs.rmSync(outDir, { recursive: true, force: true })
fs.mkdirSync(path.join(outDir, 'assets'), { recursive: true })

// 1) Compile Tailwind -> a single stylesheet
const css = fs.readFileSync('src/index.css', 'utf8') + '\n' + fs.readFileSync('src/glowsurprise-v5.css', 'utf8') + '\n' + fs.readFileSync('src/glowsurprise-v6.css', 'utf8') + '\n' + fs.readFileSync('src/glowsurprise-v7.css', 'utf8')
const processed = await postcss([tailwind()]).process(css, { from: 'src/index.css' })
fs.writeFileSync(path.join(outDir, 'assets', 'index.css'), processed.css)
console.log('css ok:', processed.css.length, 'bytes')

// 2) Bundle the app
await build({
  entryPoints: ['src/main.tsx'],
  bundle: true,
  format: 'esm',
  jsx: 'automatic',
  outfile: path.join(outDir, 'assets', 'main.js'),
  minify: true,
  target: 'esnext',
  sourcemap: false,
  define: { 'process.env.NODE_ENV': '"production"' },
  loader: {
    '.png': 'dataurl',
    '.jpg': 'dataurl',
    '.jpeg': 'dataurl',
    '.webp': 'dataurl',
    '.svg': 'dataurl',
  },
  logLevel: 'info',
})

// 3) Copy anything in public/
if (fs.existsSync('public')) {
  fs.cpSync('public', outDir, { recursive: true })
}

// 4) Write index.html
const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#081e1a" />
    <meta name="description" content="GlowSurprise by GlowBauble — a magical Christmas gift, made personal." />
    <title>GlowSurprise™ | A Christmas Gift to Remember</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300..700&family=Caveat:wght@400..700&family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@400;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="./assets/index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script id="bd-content">window.__BIRTHDAY_CONTENT__ = null;</script>
    <script type="module" src="./assets/main.js"></script>
  </body>
</html>
`
fs.writeFileSync(path.join(outDir, 'index.html'), html)
console.log('build complete -> dist/')
