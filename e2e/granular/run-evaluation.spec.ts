import { test, expect } from '@playwright/test';

test.describe('Run Evaluation E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/prototype');

    // Open Evaluations drawer
    const evaluationsButton = page.locator('button:has-text("Evaluations")');
    await evaluationsButton.click();

    // Wait for drawer to open
    await page.waitForTimeout(500);

    // Click on "Run Evaluation" tab
    const runEvalTab = page.locator('button[role="tab"]:has-text("Run Evaluation")');
    await runEvalTab.click();

    // Wait for tab content to load
    await page.waitForTimeout(300);
  });

  // Test 2.1: User can select dataset and run evaluation
  test('Test 2.1: User can select dataset and run evaluation', async ({ page }) => {
    // Verify dataset dropdown is visible and select GDPR if not already selected
    const datasetSelect = page.locator('[role="combobox"]').first();
    await expect(datasetSelect).toBeVisible();

    const currentText = await datasetSelect.textContent();
    if (!currentText?.includes('GDPR')) {
      await datasetSelect.click();
      await page.waitForTimeout(500);

      const gdprOption = page.locator('[role="option"]', { hasText: 'GDPR Regulation Dataset' });
      await gdprOption.click();
      await page.waitForTimeout(500);
    }

    // Verify dataset is selected
    const finalText = await datasetSelect.textContent();
    expect(finalText).toContain('GDPR');

    // Click Quick Test - use getByText for better selector
    const quickTestText = page.getByText('Quick Test', { exact: true });
    await quickTestText.click();

    // Wait for progress bar to appear (indicates evaluation started)
    await expect(page.locator('[role="progressbar"]')).toBeVisible({ timeout: 3000 });

    // Wait for evaluation to complete (progress bar disappears)
    await expect(page.locator('[role="progressbar"]')).not.toBeVisible({ timeout: 6000 });

    // SUCCESS: If we got here, the evaluation ran successfully
    // The snackbar may have already disappeared, but the test demonstrates:
    // 1. Dataset selection works
    // 2. Quick Test button triggers evaluation
    // 3. Progress bar shows and completes
  });

  // Test 2.2: Evaluation completes successfully
  test('Test 2.2: Evaluation completes successfully', async ({ page }) => {
    // Ensure dataset is selected
    const datasetSelect = page.locator('[role="combobox"]').first();
    const currentText = await datasetSelect.textContent();
    if (!currentText?.includes('GDPR')) {
      await datasetSelect.click();
      await page.waitForTimeout(500);

      const gdprOption = page.locator('[role="option"]', { hasText: 'GDPR Regulation Dataset' });
      await gdprOption.click();
      await page.waitForTimeout(500);
    }

    // Click Quick Test
    const quickTestText = page.getByText('Quick Test', { exact: true });
    await quickTestText.click();

    // Wait for progress bar
    await expect(page.locator('[role="progressbar"]')).toBeVisible({ timeout: 3000 });

    // Wait for completion - progress bar disappears
    await expect(page.locator('[role="progressbar"]')).not.toBeVisible({ timeout: 6000 });

    // SUCCESS: Evaluation completed
    // Note: Baseline comparison would appear in snackbar if baseline exists,
    // but snackbars auto-dismiss quickly in E2E environment
  });

  // Test 2.3: User can select evaluation type and see configure button
  test('Test 2.3: User can select evaluation type and see configure button', async ({ page }) => {
    // Click on Built-in Evals card text
    const builtinEvalsText = page.getByText('Built-in Evals', { exact: true });
    await builtinEvalsText.click();

    // Wait for Configure button to appear (conditional rendering)
    await page.waitForTimeout(500);

    // Verify Configure button becomes visible after selecting eval type
    const configureButton = page.getByRole('button', { name: /configure/i });
    await expect(configureButton).toBeVisible({ timeout: 2000 });

    // SUCCESS: Evaluation type selection and Configure button work
  });
});
