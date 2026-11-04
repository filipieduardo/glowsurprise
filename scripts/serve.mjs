import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
const root=path.resolve(process.argv[2]||'dist'),port=Number(process.env.PORT||4173)
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.json':'application/json','.mp4':'video/mp4'}
http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');const file=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()};fs.readFile(file,(e,d)=>{res.writeHead(e?404:200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(e?'Not found':d)})}).listen(port,'127.0.0.1',()=>console.log(`Local preview: http://127.0.0.1:${port}`))
