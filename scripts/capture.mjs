import {chromium} from '@playwright/test'
import fs from 'node:fs'
const out='../../outputs/screenshots';fs.mkdirSync(out,{recursive:true})
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true})
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true})
page.on('pageerror',e=>console.log('ERROR:',e.message))
await page.goto('http://127.0.0.1:4172');await page.waitForTimeout(1500);await page.screenshot({path:out+'/before-iphone.png',fullPage:true})
await page.goto('http://127.0.0.1:4173');await page.waitForTimeout(2500);await page.screenshot({path:out+'/iteration1-iphone.png',fullPage:true})
await page.setViewportSize({width:1440,height:1000});await page.waitForTimeout(500);await page.screenshot({path:out+'/iteration1-desktop.png',fullPage:true})
// Freeze the same original model as a lightweight no-WebGL fallback.
const poster=await page.locator('canvas').evaluate(canvas=>canvas.toDataURL('image/webp',.93))
fs.writeFileSync('public/gift-poster.webp',Buffer.from(poster.split(',')[1],'base64'))
await browser.close()
