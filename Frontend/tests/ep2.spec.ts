import { test, expect, Page } from '@playwright/test';

async function signIn(page: Page) {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('chitipat.put@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign In' }).click();
}

// TC10: Rate 5 stars for a co-working space
test('TC10: Rate 5 stars and check average rating change', async ({ page }) => {
  await signIn(page);

  await expect(page.getByRole('link', { name: 'Sign out of Achi' })).toBeVisible();
  await page.getByRole('link', { name: 'View Co-Working Space(s)' }).click();
  await page.getByRole('link', { name: 'Co-Working Picture Samyan Op-' }).click();

  await expect(page.getByRole('heading', { name: 'Write Your Feedback' })).toBeVisible();
  const oldAverage = page.locator('span.text-6xl.font-bold.text-white').first().innerText();

  await page.locator('label').filter({ hasText: '5 Stars' }).click();
  await page.getByRole('textbox', { name: 'Your comment...' }).fill('Very clean and comfortable space');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();

  const newAverage = page.locator('span.text-6xl.font-bold.text-white').first().innerText();
  expect(oldAverage).not.toEqual(newAverage); // Average should change
});

// TC11: Comment "Very clean and comfortable space"
test('TC11: Submit comment successfully', async ({ page }) => {
  await signIn(page);
  await expect(page.getByRole('link', { name: 'Sign out of Achi' })).toBeVisible();
  await page.getByRole('link', { name: 'View Co-Working Space(s)' }).click();
  await page.getByRole('link', { name: 'Co-Working Picture Samyan Op-' }).click();

  await expect(page.getByRole('textbox', { name: 'Your comment...' })).toHaveValue('Very clean and comfortable space');
  await expect(page.getByText('Feedback by : Achi')).toBeVisible();
});

// TC12: View average rating and total ratings
test('TC12: View average and total number of ratings', async ({ page }) => {
  await signIn(page);
  await expect(page.getByRole('link', { name: 'Sign out of Achi' })).toBeVisible();
  await page.getByRole('link', { name: 'View Co-Working Space(s)' }).click();
  await page.getByRole('link', { name: 'Co-Working Picture Samyan Op-' }).click();

  const avgRating = page.locator('span.text-6xl.font-bold.text-white').first();
  const totalRatings = page.locator('span.text-6xl.text-white.font-bold.mb-2');

  await expect(avgRating).toBeVisible();
  await expect(totalRatings).toBeVisible();
});

// TC13: Scroll through user reviews
test('TC13: Scroll and view individual user ratings and comments', async ({ page }) => {
  await signIn(page);
  await expect(page.getByRole('link', { name: 'Sign out of Achi' })).toBeVisible();
  await page.getByRole('link', { name: 'View Co-Working Space(s)' }).click();
  await page.getByRole('link', { name: 'Co-Working Picture Samyan Op-' }).click();

  await page.locator('text=Reviews').scrollIntoViewIfNeeded();
  await expect(page.locator('text=Reviews')).toBeVisible();
});

// TC14: Edit rating - Change stars
test('TC14: Change star rating and check average updated', async ({ page }) => {
  await signIn(page);
  await expect(page.getByRole('link', { name: 'Sign out of Achi' })).toBeVisible();
  await page.getByRole('link', { name: 'View Co-Working Space(s)' }).click();
  await page.getByRole('link', { name: 'Co-Working Picture Samyan Op-' }).click();
  const ratingLocator = page.locator('span.text-6xl.font-bold.text-white').first();
  await expect(page.getByRole('heading', { name: 'Update Your Feedback' })).toBeVisible();
  const oldAverage = await ratingLocator.innerText();

  await page.locator('label').filter({ hasText: '1 Star' }).click();
  await page.getByRole('textbox', { name: 'Your comment...' }).fill('Updated to 1 stars');
  await page.getByRole('button', { name: 'Update' }).click();
  await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(ratingLocator).not.toHaveText(oldAverage);
  const newAverage = await ratingLocator.innerText();
  expect(oldAverage).not.toEqual(newAverage);
});

// TC15: Edit rating - Update comment
test('TC15: Update comment and verify', async ({ page }) => {
  await signIn(page);
  await expect(page.getByRole('link', { name: 'Sign out of Achi' })).toBeVisible();
  await page.getByRole('link', { name: 'View Co-Working Space(s)' }).click();
  await page.getByRole('link', { name: 'Co-Working Picture Samyan Op-' }).click();

  await page.getByRole('textbox', { name: 'Your comment...' }).fill('Excellent workspace and service');
  await page.getByRole('button', { name: 'Update' }).click();
  await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();

  await expect(page.getByRole('textbox', { name: 'Your comment...' })).toHaveValue('Excellent workspace and service');
});

// TC16: Delete my rating
test('TC16: Delete own rating and check average updated', async ({ page }) => {
  await signIn(page);
  await expect(page.getByRole('link', { name: 'Sign out of Achi' })).toBeVisible();
  await page.getByRole('link', { name: 'View Co-Working Space(s)' }).click();
  await page.getByRole('link', { name: 'Co-Working Picture Samyan Op-' }).click();
  const ratingLocator = page.locator('span.text-6xl.font-bold.text-white').first();
  const oldAverage = await ratingLocator.innerText();

  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(ratingLocator).not.toHaveText(oldAverage);
  const newAverage = await ratingLocator.innerText();
  expect(oldAverage).not.toEqual(newAverage);

  await expect(page.getByRole('heading', { name: 'Write Your Feedback' })).toBeVisible();
});
