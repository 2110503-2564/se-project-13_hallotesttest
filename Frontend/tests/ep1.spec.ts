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
  await expect(page.getByText('Account Banned')).toBeVisible();
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
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByText('Account Banned')).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('link', { name: 'Sign out of test' })).toBeVisible();
});

test('TC4 - View list of banned users', async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page.getByRole('link', { name: 'Sign out of Administration' })).toBeVisible();
  await page.getByRole('link', { name: 'Manage Users' }).click();
  await expect(page.getByRole('table')).toBeVisible();
});

test('TC5 - View details of a banned user', async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page.getByRole('link', { name: 'Sign out of Administration' })).toBeVisible();
  await page.getByRole('link', { name: 'Manage Users' }).click();
  await page.getByRole('row', { name: /test test@gmail.com/i }).click(); // Click row
  await expect(page.getByText('Banned User Details')).toBeVisible();
  await expect(page.getByText('Test Banning')).toBeVisible();
});

test('TC6 - Edit ban reason', async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page.getByRole('link', { name: 'Sign out of Administration' })).toBeVisible();
  await page.getByRole('link', { name: 'Manage Users' }).click();
  await page.getByRole('row', { name: /test test@gmail.com/i }).click();
  await expect(page.getByText('Banned User Details')).toBeVisible();
  await page.getByRole('button', { name: 'Update Ban Detail' }).click();
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('Updated Reason');
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await expect(page.getByText('Updated Reason')).toBeVisible();

});

test('TC7 - Edit ban duration', async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page.getByRole('link', { name: 'Sign out of Administration' })).toBeVisible();
  await page.getByRole('link', { name: 'Manage Users' }).click();
  await page.getByRole('row', { name: /test test@gmail.com/i }).click();
  await expect(page.getByRole('button', { name: 'Update Ban Detail' })).toBeVisible();
  await page.getByRole('button', { name: 'Update Ban Detail' }).click();
  await page.getByRole('spinbutton', { name: 'Month' }).fill('05');
  await page.getByRole('spinbutton', { name: 'Day' }).fill('30');
  await page.getByRole('spinbutton', { name: 'Year' }).fill('2025');
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await expect(page.getByRole('main')).toContainText('30 May 2025, 00:00');
});

test('TC8 - Unban banned user', async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page.getByRole('link', { name: 'Sign out of Administration' })).toBeVisible();
  await page.getByRole('link', { name: 'Manage Users' }).click();
  await page.getByRole('row', { name: /test test@gmail.com/i }).getByRole('button', { name: 'Unban' }).click();
  await page.getByRole('button', { name: 'Unban', exact: true }).click();
  await expect(page.getByRole('row', { name: /test test@gmail.com/i })).toContainText('Active');
});

test('TC9 - Unbanned user makes reservation', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('test@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByRole('link', { name: 'Sign out of test' })).toBeVisible();
  await page.getByRole('link', { name: 'Book Co-Working Space' }).click();
  await page.getByRole('combobox', { name: 'Please select a Co-Working' }).click();
  await page.getByRole('option', { name: 'Samyan Op-Co' }).click();
  await page.getByRole('spinbutton', { name: 'Month' }).fill('05');
  await page.getByRole('spinbutton', { name: 'Day' }).fill('30');
  await page.getByRole('spinbutton', { name: 'Year' }).fill('2025');
  await page.getByRole('button', { name: 'Book Your Co-Working Space' }).click();
  page.once('dialog', dialog => {
    expect(dialog.message()).toContain('Booking was successful!');
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
});
