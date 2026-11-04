import {chromium} from '@playwright/test'
import fs from 'node:fs'
const out='../../outputs/realism-v2';fs.mkdirSync(out,{recursive:true})
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true})
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true})
page.on('pageerror',e=>console.log('ERROR:',e.message))
await page.goto('http://127.0.0.1:4173');await page.locator('.baked-gift .gift-poster').waitFor();await page.waitForTimeout(1800)
await page.screenshot({path:out+'/after-iphone.png',fullPage:true})
await page.getByRole('button',{name:'Unwrap your surprise',exact:true}).click();await page.waitForTimeout(1800);await page.screenshot({path:out+'/opening-iphone.png'});await page.getByRole('button',{name:'Step inside our memories'}).waitFor();await page.waitForTimeout(1000);await page.screenshot({path:out+'/letter-iphone.png',fullPage:true})
await page.getByRole('button',{name:'Step inside our memories'}).click();await page.getByRole('button',{name:'Next memory'}).waitFor();await page.waitForTimeout(800);await page.screenshot({path:out+'/memories-iphone.png',fullPage:true})
await page.getByRole('button',{name:'And one more thing'}).click();await page.getByRole('button',{name:'Feel it all again'}).waitFor();await page.waitForTimeout(1000);await page.screenshot({path:out+'/final-iphone.png',fullPage:true})
await page.getByRole('button',{name:'Make it yours',exact:false}).click();await page.screenshot({path:out+'/editor-iphone.png',fullPage:true});await page.keyboard.press('Escape')
await page.setViewportSize({width:1440,height:1000});await page.getByRole('button',{name:'GlowSurprise home'}).click();await page.waitForTimeout(1800);await page.screenshot({path:out+'/after-desktop.png',fullPage:true})
await browser.close()
