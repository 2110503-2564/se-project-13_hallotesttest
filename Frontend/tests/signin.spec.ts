import { test, expect } from '@playwright/test';

test('test add reviews', async ({ page }) => {
  //Sign in to the application
  await page.goto('http://localhost:3000/');
  await expect(page).toHaveTitle(/Space Co-Working/)
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('chitipat.put@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByRole('link', { name: 'Sign out of Achi' })).toBeVisible();
  //Test add review
  await page.getByRole('link', { name: 'View Co-Working Space(s)' }).click();
  await page.getByRole('link', { name: 'Co-Working Picture Samyan Op-' }).click();
  await expect(page.getByRole('heading', { name: 'Samyan Op-Co' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Write Your Feedback' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Your comment...' })).toBeEmpty();
  await expect(page.locator('label').filter({ hasText: '1 Star' })).toBeVisible();
  await expect(page.locator('label').filter({ hasText: '2 Star' })).toBeVisible();
  await expect(page.locator('label').filter({ hasText: '3 Star' })).toBeVisible();
  await expect(page.locator('label').filter({ hasText: '4 Star' })).toBeVisible();
  await expect(page.locator('label').filter({ hasText: '5 Star' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible(); 
  await expect(page.getByText('Feedback by : Achi')).toBeVisible();
  await page.locator('label').filter({ hasText: '5 Stars' }).click();
  await page.getByRole('textbox', { name: 'Your comment...' }).click();
  await page.getByRole('textbox', { name: 'Your comment...' }).fill('Good');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.locator('label').filter({ hasText: '5 Stars' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Your comment...' })).toHaveValue('Good');
  await expect(page.getByRole('heading', { name: 'Update Your Feedback' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Update' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
});

test('test update reiew', async ({ page }) => {
  //Sign in to the application
  await page.goto('http://localhost:3000/');
  await expect(page).toHaveTitle(/Space Co-Working/)
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('chitipat.put@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign In' }).click();
  //Update review
  await expect(page.getByRole('link', { name: 'Sign out of Achi' })).toBeVisible();
  await page.getByRole('link', { name: 'View Co-Working Space(s)' }).click();
  await page.getByRole('link', { name: 'Co-Working Picture Samyan Op-' }).click();
  await expect(page.getByRole('heading', { name: 'Update Your Feedback' })).toBeVisible();
  //Before Update Average
  await expect(page.getByText('3.5')).toBeVisible();
  await page.locator('label').filter({ hasText: '1 Star' }).click();
  await page.getByRole('textbox', { name: 'Your comment...' }).click();
  await page.getByRole('textbox', { name: 'Your comment...' }).fill('Bad');
  await expect(page.getByText('Good', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Update' }).click();
  await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  //After Update Average
  await expect(page.getByPlaceholder('Your comment...')).toContainText('Bad');
  await expect(page.getByRole('textbox', { name: 'Your comment...' })).toHaveValue('Bad');
  await expect(page.getByText('2.8')).toBeVisible();
});

test('test delete review', async ({ page }) => {
  //Sign in to the application
  await page.goto('http://localhost:3000/');
  await expect(page).toHaveTitle(/Space Co-Working/)
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('chitipat.put@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign In' }).click();
  //Test delete review
  await expect(page.getByRole('link', { name: 'Sign out of Achi' })).toBeVisible();
  await page.getByRole('link', { name: 'View Co-Working Space(s)' }).click();
  await page.getByRole('link', { name: 'Co-Working Picture Samyan Op-' }).click();
  await expect(page.getByRole('heading', { name: 'Update Your Feedback' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Update' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('heading', { name: 'Write Your Feedback' })).toBeVisible();
});

