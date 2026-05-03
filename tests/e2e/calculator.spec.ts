import { test, expect } from '@playwright/test';

test.describe('Cogs Calculator Full Flow', () => {
  test('should complete a full fabrication estimation journey', async ({ page }) => {
    // 1. Landing Page: Create Project
    await page.goto('/');
    const projectName = `Fabrication ${Date.now()}`;
    await page.getByPlaceholder('New Project Name').fill(projectName);
    await page.getByRole('button', { name: 'New Project' }).click();

    // 2. Project Page: Verify Redirection
    await expect(page).toHaveURL(/\/projects\/.+/);
    await expect(page.locator('h1')).toContainText(projectName);

    // 3. Material Tab: Add Plate
    await page.getByRole('tab', { name: 'Material' }).click();
    
    // Wait for the material tab content to be visible
    await expect(page.getByText('Add New Material')).toBeVisible();
    
    await page.getByPlaceholder('Length').fill('2000');
    await page.getByPlaceholder('Width').fill('1000');
    await page.getByPlaceholder('Thickness').fill('10');
    
    // Take a screenshot of the form before clicking add
    await page.screenshot({ path: 'tests/e2e/before-add-material.png' });
    
    await page.getByRole('button', { name: 'Add' }).click();

    // Verify item in list
    const materialTable = page.getByTestId('material-table');
    await expect(materialTable).toBeVisible();
    await expect(materialTable).toContainText('PLATE');
    
    // 4. Labor Tab: Add Staffing
    await page.getByRole('tab', { name: 'Labor' }).click();
    await page.getByRole('button', { name: 'Quick Add' }).click();
    
    // Check if the labor subtotal updated (it was IDR 0)
    await expect(page.locator('p:has-text("IDR")').last()).not.toHaveText('IDR 0');

    // 5. Manufacturing Tab: Assign Processes
    await page.getByRole('tab', { name: 'Manufacturing' }).click();
    // Use a more robust selector for the checkbox
    const firstCheckbox = page.getByRole('checkbox').first();
    await expect(firstCheckbox).toBeVisible();
    await firstCheckbox.check();

    // 6. Summary Tab: Verify COGM
    await page.getByRole('tab', { name: 'Summary' }).click();
    
    // Verify results are visible
    await expect(page.getByText('Direct Material (DM)')).toBeVisible();
    await expect(page.getByText('Direct Labor (DL)')).toBeVisible();
    await expect(page.getByText('COGM', { exact: true })).toBeVisible();

    // The subtotal should be non-zero
    const summaryTable = page.locator('table').first();
    await expect(summaryTable).not.toContainText('Amount0');

    // 7. Save Project
    await page.getByRole('button', { name: 'Save Project' }).click();
    
    // Check for either 'Saving...' or a successful return to 'Save Project'
    await expect(page.getByRole('button')).toContainText(/Saving...|Save Project/);
    
    // Ensure the button is back to enabled state eventually
    await expect(page.getByRole('button', { name: 'Save Project' })).toBeEnabled();
  });
});
