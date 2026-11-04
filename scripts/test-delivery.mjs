import {chromium,expect} from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true})
const p=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2})
const errors=[],requests=[];p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url())})
await p.goto('file://'+path.resolve('../../outputs/GlowSurprise-preview.html'));await p.locator('canvas').waitFor();await p.getByRole('button',{name:'Unwrap your surprise'}).click();await expect(p.getByRole('button',{name:'Step inside our memories'})).toBeVisible({timeout:10000});expect(errors).toEqual([]);expect(requests).toEqual([])
console.log('PASS Portable HTML opens offline and reveals the letter without external requests')
await p.goto('http://127.0.0.1:4173');await p.setViewportSize({width:360,height:640});await p.waitForTimeout(1000);await p.screenshot({path:'../../outputs/screenshots/iphone-9x16.png',fullPage:true})
await p.setViewportSize({width:390,height:844});await p.reload();await p.locator('canvas').waitFor();await p.waitForTimeout(500)
const perf=await p.evaluate(async()=>{const intervals=[];let last=performance.now(),start=last;document.querySelector('.primary').click();await new Promise(resolve=>{function tick(t){intervals.push(t-last);last=t;if(t-start<3600)requestAnimationFrame(tick);else resolve()}requestAnimationFrame(tick)});intervals.sort((a,b)=>a-b);return {frames:intervals.length,p50FrameMs:intervals[Math.floor(intervals.length*.5)],p95FrameMs:intervals[Math.floor(intervals.length*.95)],approxFps:1000/(intervals.reduce((a,b)=>a+b,0)/intervals.length)}})
fs.writeFileSync('../../outputs/performance.json',JSON.stringify({environment:'Headless Chrome on this Mac, 390x844, DPR 2; not an iPhone hardware benchmark',...perf},null,2));console.log(perf)
await browser.close()
