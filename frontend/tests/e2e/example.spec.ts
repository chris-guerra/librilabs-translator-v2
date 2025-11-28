import { test, expect } from '@playwright/test';

test('homepage loads and displays content', async ({ page }) => {
  await page.goto('/');
  
  // Check that the page title is correct
  await expect(page).toHaveTitle(/Librilabs Translator/);
  
  // Check that the main heading is visible
  const heading = page.getByRole('heading', { name: 'Librilabs Translator' });
  await expect(heading).toBeVisible();
  
  // Check that the welcome message is present
  const welcomeText = page.getByText('Welcome to the translation application');
  await expect(welcomeText).toBeVisible();
});

test('page has correct structure', async ({ page }) => {
  await page.goto('/');
  
  // Verify main element exists
  const main = page.locator('main');
  await expect(main).toBeVisible();
  
  // Verify heading is inside main
  const heading = main.getByRole('heading', { name: 'Librilabs Translator' });
  await expect(heading).toBeVisible();
});

