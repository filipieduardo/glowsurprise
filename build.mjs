import { build } from 'esbuild'
import fs from 'node:fs'
fs.rmSync('dist',{recursive:true,force:true});fs.mkdirSync('dist/assets',{recursive:true})
await build({entryPoints:['src/main.tsx'],bundle:true,format:'esm',splitting:true,jsx:'automatic',outdir:'dist/assets',minify:true,target:['safari16','chrome110'],sourcemap:false,define:{'process.env.NODE_ENV':'"production"'},external:['/fonts/*'],logLevel:'info',metafile:true}).then(result=>fs.writeFileSync('dist/build-meta.json',JSON.stringify(result.metafile)))
fs.cpSync('public','dist',{recursive:true})
// Relative URLs support a preview path as well as a future GitHub Pages subpath.
const css='dist/assets/main.css';fs.writeFileSync(css,fs.readFileSync(css,'utf8').replaceAll('/fonts/','../fonts/'))
fs.writeFileSync('dist/index.html',`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#071b19"><meta name="description" content="A little wonder. A world of memories. A personal Christmas gift by GlowSurprise."><title>GlowSurprise — A little Christmas wonder</title><link rel="icon" href="./favicon.svg"><link rel="preload" href="./fonts/cormorant-garamond-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="./assets/main.css"></head><body><div id="root"></div><script type="module" src="./assets/main.js"></script></body></html>`)
console.log('Production preview built in dist/')
