import {chromium,expect} from '@playwright/test'
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true})
try{
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true})
 await page.goto('http://127.0.0.1:4173');await page.getByRole('button',{name:'Make it yours'}).click()
 await page.getByLabel('For',{exact:true}).fill('Our Christmas')
 const photo=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=600;c.height=800;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,0,800);g.addColorStop(0,'#678989');g.addColorStop(1,'#ddc79f');x.fillStyle=g;x.fillRect(0,0,600,800);x.fillStyle='#f7e8bd';x.beginPath();x.arc(410,210,70,0,Math.PI*2);x.fill();x.fillStyle='#25483f';x.beginPath();x.moveTo(0,420);x.quadraticCurveTo(200,320,600,620);x.lineTo(600,800);x.lineTo(0,800);x.fill();x.fillStyle='#eee5d2';x.font='15px sans-serif';x.fillText('DEMONSTRATION ARTWORK',35,760);return c.toDataURL('image/png').split(',')[1]})
 await page.getByLabel('Upload photos').setInputFiles([{name:'winter-art.png',mimeType:'image/png',buffer:Buffer.from(photo,'base64')}]);await expect(page.getByLabel('Caption',{exact:true})).toBeVisible()
 await page.getByLabel('Caption',{exact:true}).fill('Our little forever.')
 await page.locator('dialog').evaluate(el=>{el.scrollTop=el.scrollHeight-el.clientHeight});await page.screenshot({path:'../../outputs/realism-v2/studio-memories-controls.png'})
 await page.getByRole('button',{name:'Preview my gift'}).click();await page.getByRole('button',{name:'Unwrap your surprise'}).click();await page.locator('.is-baked-opening').waitFor();await page.waitForTimeout(3700);await page.screenshot({path:'../../outputs/realism-v2/personalized-reveal.png'})
 await page.getByRole('button',{name:'Step inside our memories'}).click();await page.getByAltText('Your memory 1').waitFor();await page.waitForTimeout(800);await page.screenshot({path:'../../outputs/realism-v2/personalized-memory.png',fullPage:true})
 await page.locator('.memory-display').focus();await page.keyboard.press('ArrowRight');await expect(page.getByAltText('Your memory 1')).toBeVisible()
}finally{await browser.close()}
