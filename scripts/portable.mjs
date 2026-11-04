import {build} from 'esbuild'
import fs from 'node:fs'
const target=process.argv[2]||'../../outputs/GlowSurprise-preview.html'
const result=await build({entryPoints:['src/main.tsx'],bundle:true,format:'iife',jsx:'automatic',minify:true,target:['safari16','chrome110'],write:false,outfile:'app.js',external:['/fonts/*'],define:{'process.env.NODE_ENV':'"production"'}})
let css=result.outputFiles.find(f=>f.path.endsWith('.css')).text
for(const name of ['cormorant-garamond-latin-400-normal.woff2','cormorant-garamond-latin-400-italic.woff2'])css=css.replaceAll('/fonts/'+name,'data:font/woff2;base64,'+fs.readFileSync('public/fonts/'+name).toString('base64'))
const script=result.outputFiles.find(f=>f.path.endsWith('.js')).text.replaceAll('</script','<\\/script')
const poster='data:image/webp;base64,'+fs.readFileSync('public/gift-poster.webp').toString('base64')
const licenses=fs.readFileSync('public/THIRD-PARTY-NOTICES.txt','utf8').replaceAll('--','—')
fs.writeFileSync(target,`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>GlowSurprise — Private preview</title><style>${css}</style></head><body><!-- ${licenses} --><div id="root"></div><script>window.__GIFT_POSTER__=${JSON.stringify(poster)};</script><script>${script}</script></body></html>`)
console.log(target)
