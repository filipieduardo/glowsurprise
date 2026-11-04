import {chromium,webkit,expect} from '@playwright/test'
import fs from 'node:fs'
import {createHash} from 'node:crypto'
const out='../../outputs/realism-v2',results=[]
fs.mkdirSync(out,{recursive:true})
for(const [name,engine] of [['chrome',chromium],['webkit',webkit]]){
 const browser=await engine.launch(name==='chrome'?{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true}:{})
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true})
  await page.goto('http://127.0.0.1:4173');await page.getByRole('button',{name:'Pause snow'}).click()
  await page.getByRole('button',{name:'Unwrap your surprise'}).click();await page.locator('.is-baked-opening').waitFor()
  const hashes=[]
  for(const [step,delay] of [['early',150],['middle',1550],['reveal',1700]]){
   await page.waitForTimeout(delay)
   // Canvas drawImage returns the default frame of an animated image. Compare the composited browser pixels instead, with other animated layers hidden.
   const pixels=await page.locator('.gift-poster').screenshot({style:'.snow,.light-bloom{visibility:hidden!important}.gift-poster{background:#061a18!important;filter:none!important}'})
   hashes.push(createHash('sha256').update(pixels).digest('hex'))
   await page.screenshot({path:`${out}/${name}-opening-${step}.png`})
  }
  expect(new Set(hashes).size).toBe(3)
  await expect(page.getByRole('button',{name:'Step inside our memories'})).toBeVisible({timeout:5000})
  results.push({name:`${name}: animated image changes frames and completes`,status:'PASS'})
  if(name==='chrome'){
   await page.route('**/gift-opening.webp',route=>route.abort());await page.reload()
   await page.getByRole('button',{name:'Unwrap your surprise'}).click();await expect(page.locator('.is-unwrapping')).toBeVisible()
   await expect(page.getByRole('button',{name:'Step inside our memories'})).toBeVisible({timeout:10000})
   results.push({name:'Animation fetch failure falls back to layers and letter',status:'PASS'})
  }
 }finally{await browser.close()}
}
fs.writeFileSync(out+'/opening-tests.json',JSON.stringify({results},null,2));console.log(results)
