import { test, expect, Page } from '@playwright/test';

// Reusable login function
async function loginAsAdmin(page: Page) {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('admin@admin.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign In' }).click();
}

test('TC1 - Ban active user', async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page.getByRole('link', { name: 'Sign out of Administration' })).toBeVisible();
  await page.getByRole('link', { name: 'Manage Users' }).click();
  await page.getByRole('row', { name: /test test@gmail.com/i }).getByRole('button', { name: 'Ban' }).click();
  await page.locator('textarea').click();
  await page.locator('textarea').fill('Test Banning');
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await expect(page.getByRole('row', { name: /test test@gmail.com/i })).toContainText('Banned');
});

test('TC2 - Banned user tries reservation', async ({ page }) => {
  // Assuming the banned user flow: log in as banned user
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('test@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByRole('link', { name: 'Sign out of test' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Account Banned' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('link', { name: 'Book Co-Working Space' }).click();
  await page.getByRole('combobox', { name: 'Please select a Co-Working' }).click();
  await page.getByRole('option', { name: 'Samyan Op-Co' }).click();
  await page.getByRole('button', { name: 'Choose date' }).click();
  await page.getByRole('gridcell', { name: '30' }).click();
  await page.getByRole('button', { name: 'Book Your Co-Working Space' }).click();
  await expect(page.getByText('You are banned.')).toBeVisible();
});

test('TC3 - Banned user can login but restricted', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('test@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await expect(page.getByRole('link', { name: 'Sign out of test' })).toBeVisible();
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByRole('heading', { name: 'Account Banned' })).toBeVisible();
});

test('TC4 - Unban banned user', async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page.getByRole('link', { name: 'Sign out of Administration' })).toBeVisible();
  await page.getByRole('link', { name: 'Manage Users' }).click();
  await page.getByRole('row', { name: /test test@gmail.com/i }).getByRole('button', { name: 'Unban' }).click();
  await page.getByRole('button', { name: 'Unban' }).nth(3).click();
  await expect(page.getByRole('row', { name: /test test@gmail.com/i })).toContainText('Active');
});

test('TC5 - Unbanned user makes reservation', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('test@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByRole('link', { name: 'Sign out of test' })).toBeVisible();
  await page.getByRole('link', { name: 'Book Co-Working Space' }).click();
  await page.getByRole('combobox', { name: 'Please select a Co-Working' }).click();
  await page.getByRole('option', { name: 'Samyan Op-Co' }).click();
  await page.getByRole('button', { name: 'Choose date' }).click();
  await page.getByRole('gridcell', { name: '30' }).click();
  await page.getByRole('button', { name: 'Book Your Co-Working Space' }).click();
  page.once('dialog', dialog => {
    expect(dialog.message()).toContain('Booking was successful!');
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });

});

test('TC6 - View list of banned users', async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page.getByRole('link', { name: 'Sign out of Administration' })).toBeVisible();
  await page.getByRole('link', { name: 'Manage Users' }).click();
  await expect(page.getByRole('table'));
});

test('TC7 - View details of a banned user', async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page.getByRole('link', { name: 'Sign out of Administration' })).toBeVisible();
  await page.getByRole('link', { name: 'Manage Users' }).click();
  await page.getByRole('row', { name: /test test@gmail.com/i }).click(); // Click row
  await expect(page.locator('body')).toContainText('Ban Reason');
  await expect(page.locator('body')).toContainText('Remaining Ban Duration');
});

test('TC8 - Edit ban reason', async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page.getByRole('link', { name: 'Sign out of Administration' })).toBeVisible();
  await page.getByRole('link', { name: 'Manage Users' }).click();
  await page.getByRole('row', { name: /test test@gmail.com/i }).click();
  await page.getByRole('textbox', { name: 'Ban Reason' }).fill('Updated Reason');
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await expect(page.getByText('Ban reason updated successfully')).toBeVisible();
});

test('TC9 - Edit ban duration', async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page.getByRole('link', { name: 'Sign out of Administration' })).toBeVisible();
  await page.getByRole('link', { name: 'Manage Users' }).click();
  await page.getByRole('row', { name: /test test@gmail.com/i }).click();
  await page.getByRole('textbox', { name: 'Ban Duration' }).fill('30'); // assuming days
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await expect(page.getByText('Ban duration updated successfully')).toBeVisible();
});
