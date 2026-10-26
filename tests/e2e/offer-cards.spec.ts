import { test, expect } from '@playwright/test';

test('mobile touch can load, scroll the page, and update evidence',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:5173/');await page.getByRole('button',{name:'Load example decision'}).tap();
  const cdp=await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:5,y:700}]});
  for(let y=680;y>=300;y-=20)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:5,y}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(0);
  await page.getByRole('textbox',{name:'Northstar answer',exact:true}).tap();
  await page.getByRole('textbox',{name:'Northstar answer',exact:true}).fill('5');
  await page.getByRole('textbox',{name:'Harbor answer',exact:true}).fill('1');
  await page.getByRole('button',{name:'Update decision',exact:true}).tap();
  await expect(page.getByTestId('score-1')).toHaveText('65.00');
  await context.close();
});

for (const width of [1440, 390, 320]) test(`offer profiles, current evidence, and readable layout at ${width}px`, async ({page}, info) => {
  await page.setViewportSize({width,height:844});
  await page.goto('/');
  await page.getByRole('button',{name:'Load example decision'}).click();
  const a=page.getByRole('region',{name:'Northstar offer information',exact:true});
  const b=page.getByRole('region',{name:'Harbor offer information',exact:true});
  await expect(a).toContainText('Product Analyst');
  await expect(a).toContainText('110000');
  await expect(b).toContainText('100000');
  await expect(a).toContainText('Not yet confirmed');
  await expect(a).toContainText('Assumed range: 0–5 days / week');
  for(const region of [a,b]) {
    await region.focus();
    await expect(region).toBeFocused();
    const score=page.getByTestId(region===a?'score-0':'score-1');
    expect(await score.evaluate(el=>!!el.closest('.offer-details'))).toBe(false);
  }
  const ab=await a.boundingBox(),bb=await b.boundingBox();
  if(width>=900){expect(ab!.height).toBe(bb!.height);expect(ab!.y).toBe(bb!.y);}
  else {expect(bb!.y).toBeGreaterThan(ab!.y+ab!.height);expect(await a.evaluate(el=>getComputedStyle(el).resize)).toBe('none');}
  for(const answers of [['5','1','43.00','65.00','[-24.00, -20.00]'],['0','5','83.00','33.00','[48.00, 52.00]']]) {
    await page.getByRole('textbox',{name:'Northstar answer',exact:true}).fill(answers[0]);
    await page.getByRole('textbox',{name:'Harbor answer',exact:true}).fill(answers[1]);
    await page.getByRole('button',{name:'Update decision',exact:true}).click();
    await expect(page.getByTestId('score-0')).toHaveText(answers[2]);
    await expect(page.getByTestId('score-1')).toHaveText(answers[3]);
    await expect(page.getByTestId('gap-range')).toHaveText(answers[4]);
    await expect(page.getByRole('heading',{name:'DECIDE NOW',exact:true})).toBeVisible();
    await expect(a.getByRole('row').filter({hasText:'Office attendance'})).toContainText(`${answers[0]} days / week`);
    await expect(b.getByRole('row').filter({hasText:'Office attendance'})).toContainText(`${answers[1]} days / week`);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.screenshot({path:info.outputPath(`offer-${answers[0]}-${answers[1]}.png`),fullPage:true});
    await page.getByRole('button',{name:'Reset example',exact:false}).click();
  }
});

test('desktop native resize and keyboard scroll are independent and keep scores outside',async({page})=>{
  await page.goto('/');await page.getByRole('button',{name:'Load example decision'}).click();
  const a=page.getByRole('region',{name:'Northstar offer information',exact:true});
  const b=page.getByRole('region',{name:'Harbor offer information',exact:true});
  await a.scrollIntoViewIfNeeded();
  const original=await a.boundingBox(),other=await b.boundingBox();
  await page.mouse.move(original!.x+original!.width-5,original!.y+original!.height-5);
  await page.mouse.down();await page.mouse.move(original!.x+original!.width-5,original!.y+original!.height-140,{steps:12});await page.mouse.up();
  const smaller=await a.boundingBox();expect(smaller!.height).toBeLessThan(original!.height-50);
  expect((await b.boundingBox())!.height).toBe(other!.height);
  expect(smaller!.width).toBe(original!.width);
  await a.focus();await page.keyboard.press('End');
  await expect.poll(()=>a.evaluate(el=>el.scrollTop)).toBeGreaterThan(0);
  expect(await b.evaluate(el=>el.scrollTop)).toBe(0);
  await expect(page.getByTestId('score-0')).toHaveText('63.00');
  const score=await page.getByTestId('score-0').boundingBox();expect(score!.y).toBeGreaterThan(smaller!.y+smaller!.height);
  await page.mouse.move(smaller!.x+smaller!.width-5,smaller!.y+smaller!.height-5);
  await page.mouse.down();await page.mouse.move(smaller!.x+smaller!.width-5,smaller!.y+smaller!.height+120,{steps:12});await page.mouse.up();
  expect((await a.boundingBox())!.height).toBeGreaterThan(smaller!.height+50);
  expect((await b.boundingBox())!.height).toBe(other!.height);
});
