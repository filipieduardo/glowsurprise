import {chromium} from '@playwright/test'
import {build} from 'esbuild'
import {createServer} from 'node:http'
import fs from 'node:fs'
import path from 'node:path'

// The model uses CanvasTexture, so export in an isolated browser, never in the app.
const out=path.resolve(process.env.GIFT_ART_DIR||'.gift-art')
fs.mkdirSync(out,{recursive:true})
const bundle=await build({entryPoints:['scripts/export-model.ts'],bundle:true,write:false,format:'iife'})
const server=createServer((req,res)=>{
  res.setHeader('Content-Type',req.url==='/model.js'?'text/javascript':'text/html')
  res.end(req.url==='/model.js'?bundle.outputFiles[0].text:'<!doctype html><script src="/model.js"></script>')
})
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true})
try{
  const page=await browser.newPage()
  await page.goto(`http://127.0.0.1:${server.address().port}`)
  await page.waitForFunction(()=>window.modelBase64)
  fs.writeFileSync(path.join(out,'gift.glb'),Buffer.from(await page.evaluate(()=>window.modelBase64),'base64'))
  console.log('Original gift model exported to '+out)
}finally{await browser.close();server.close()}
