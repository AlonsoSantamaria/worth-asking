import { test, expect } from '@playwright/test';

test('load, edit importance, and recover from invalid assumptions', async ({ page }, info) => {
  const errors: string[] = []; page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await page.getByRole('button',{name:'Load example decision'}).click();
  await expect(page.getByTestId('score-0')).toHaveText('63.00');
  await expect(page.getByTestId('score-1')).toHaveText('53.00');
  await expect(page.getByTestId('gap-range')).toHaveText('[-32.00, 52.00]');
  await page.screenshot({ path:info.outputPath('initial-desktop.png'), fullPage:true });
  const salary=page.getByRole('textbox',{name:'Annual salary importance',exact:true});
  await salary.fill('0');
  await expect(page.getByTestId('score-0')).toHaveText('55.00');
  const lower=page.getByRole('textbox',{name:'Northstar Office attendance lower bound'});
  await lower.fill('6');
  await expect(page.getByRole('alert')).toContainText('Cannot evaluate');
  await expect(page.getByTestId('score-0')).toHaveText('—');
  await expect(page.getByText('Previous valid evaluation:',{exact:false})).toBeVisible();
  await lower.fill('0');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByTestId('score-0')).toHaveText('55.00');
  expect(errors).toEqual([]);
});
