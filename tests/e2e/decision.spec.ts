import { test,expect } from '@playwright/test';

test('computed question, entered evidence, actual reversal, and robust DECIDE NOW',async({page},info)=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');await page.getByRole('button',{name:'Load example decision'}).click();
  await expect(page.getByTestId('score-0')).toHaveText('63.00');
  await expect(page.getByTestId('score-1')).toHaveText('53.00');
  await expect(page.getByRole('heading',{name:'How many mandatory office days does each position require?'})).toBeVisible();
  await expect(page.getByTestId('question-value')).toHaveText('7.50');
  await expect(page.getByText('assumed modeling weights, not empirical probabilities',{exact:false})).toBeVisible();
  await page.screenshot({path:info.outputPath('before-evidence.png'),fullPage:true});
  await page.getByRole('textbox',{name:'Northstar answer',exact:true}).fill('5');
  await page.getByRole('textbox',{name:'Harbor answer',exact:true}).fill('1');
  await page.getByRole('button',{name:'Update decision'}).click();
  await expect(page.getByTestId('score-0')).toHaveText('43.00');
  await expect(page.getByTestId('score-1')).toHaveText('65.00');
  await expect(page.getByTestId('gap-range')).toHaveText('[-24.00, -20.00]');
  await expect(page.getByRole('heading',{name:'DECIDE NOW',exact:true})).toBeVisible();
  await expect(page.getByText('You know enough to make a decision.',{exact:true})).toBeVisible();
  await expect(page.getByRole('heading',{name:'New evidence. A different direction.'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Update decision'})).toHaveCount(0);
  await expect(page.getByRole('textbox',{name:'Northstar Career growth fit lower bound'})).toHaveValue('6');
  await expect(page.getByRole('textbox',{name:'Harbor Annual paid leave upper bound'})).toHaveValue('22');
  await page.screenshot({path:info.outputPath('after-evidence.png'),fullPage:true});
  expect(errors).toEqual([]);
});

test('partial evidence resolves only its target and permits the remaining answer',async({page})=>{
  await page.goto('/');await page.getByRole('button',{name:'Load example decision'}).click();
  await page.getByRole('textbox',{name:'Northstar answer',exact:true}).fill('5');
  await page.getByRole('button',{name:'Update decision'}).click();
  await expect(page.getByRole('textbox',{name:'Northstar Office attendance value',exact:true})).toHaveValue('5');
  await expect(page.getByRole('textbox',{name:'Harbor Office attendance lower bound'})).toHaveValue('0');
  await page.getByRole('textbox',{name:'Harbor answer',exact:true}).fill('1');
  await page.getByRole('button',{name:'Update decision'}).click();
  await expect(page.getByRole('heading',{name:'DECIDE NOW',exact:true})).toBeVisible();
});

test('bad evidence does not alter the committed decision',async({page})=>{
  await page.goto('/');await page.getByRole('button',{name:'Load example decision'}).click();
  await page.getByRole('textbox',{name:'Northstar answer',exact:true}).fill('6');
  await page.getByRole('button',{name:'Update decision'}).click();
  await expect(page.getByRole('alert')).toContainText('between 0 and 5');
  await expect(page.getByTestId('score-0')).toHaveText('63.00');
  await expect(page.getByTestId('question-value')).toHaveText('7.50');
});
