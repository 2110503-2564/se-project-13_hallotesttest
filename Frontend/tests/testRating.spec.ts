import { test, expect, Page } from '@playwright/test';

async function signIn(page: Page) {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('chitipat.put@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign In' }).click();
}

test('user can edit own review and average rating updates', async ({ page }) => {

  signIn(page);
  await expect(page.getByRole('link', { name: 'Sign out of Achi' })).toBeVisible();
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'View Co-Working Space(s)' }).click();
  await page.getByRole('link', { name: 'Co-Working Picture Samyan Op-' }).click();
  // Capture old average rating
  const ratingLocator = page.locator('span.text-6xl.font-bold.text-white').first();
  const oldAverageRating = await ratingLocator.innerText();
  console.log('Old Rating:', oldAverageRating);

  // Edit review
  await page.locator('label').filter({ hasText: '1 Star' }).click();
  await page.getByRole('button', { name: 'Update' }).click();
  await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();

  // Wait for new average rating
  await expect(ratingLocator).not.toHaveText(oldAverageRating);

  const newAverageRating = await ratingLocator.innerText();
  console.log('New Rating:', newAverageRating);

  // Optional: parse and check numeric values
  expect(parseFloat(newAverageRating)).not.toBeNaN();
});