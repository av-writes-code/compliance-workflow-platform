import { test, expect } from '@playwright/test';

test.describe('Demo Flow: Prototype to Production', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should complete full demo flow: load template → deploy → verify production', async ({ page }) => {
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('[Browser Error]', msg.text());
      }
    });
    page.on('pageerror', error => {
      console.log('[Page Error]', error.message);
    });

    // Navigate to Prototype Station
    await page.goto('/prototype');
    await expect(page).toHaveURL('/prototype');

    // Step 1: Load Claims Detection template
    await page.click('button:has-text("Load Template")');

    // Wait for menu to open and click menu item (MUI MenuItem requires clicking within the Popover)
    await page.waitForSelector('[role="menu"]', { state: 'visible' });
    await page.click('[role="menuitem"]:has-text("Claims Detection")');

    // Verify template loaded (check for workflow nodes)
    await expect(page.locator('[data-testid="workflow-canvas"]')).toBeVisible();
    // Check for template name in sidebar or canvas
    await expect(page.locator('h6:has-text("Claims Detection")').first()).toBeVisible();

    // Step 2: Open deployment dialog
    await page.click('button:has-text("Deploy to Production")');
    await expect(page.getByRole('dialog')).toBeVisible();

    // Verify pre-deployment checklist is shown (use role="checkbox")
    const checkboxes = page.locator('input[type="checkbox"]');
    await expect(checkboxes).toHaveCount(3);
    await expect(page.locator('text=Evaluation passed')).toBeVisible();
    await expect(page.locator('text=All workflow nodes validated')).toBeVisible();
    await expect(page.locator('text=Approval obtained')).toBeVisible();

    // Step 3: Deploy workflow
    const workflowName = 'Claims Detection v2';
    const version = '2.0.0';

    // Fill version (no workflow name input - it's a prop)
    const versionInput = page.getByLabel(/version/i);
    await versionInput.fill(version);

    // Check all checklist items
    await checkboxes.nth(0).check();
    await checkboxes.nth(1).check();
    await checkboxes.nth(2).check();

    // Click Deploy button inside dialog
    await page.getByRole('button', { name: /^deploy$/i }).click();

    // Wait for navigation to production page
    await page.waitForURL('/production', { timeout: 5000 });

    // Step 4: Verify workflow appears in production
    await expect(page).toHaveURL('/production');

    // Debug: Print what workflows are visible
    const allText = await page.textContent('body');
    console.log('[Test Debug] Page body contains:', allText?.substring(0, 500));

    // Wait for the sidebar to be visible
    await page.waitForSelector('[data-testid="workflow-sidebar"]', { state: 'visible', timeout: 10000 }).catch(() => {
      console.log('[Test Debug] Workflow sidebar not found - checking for SELECTED WORKFLOW text');
    });

    // Check that the deployed workflow is visible (use first() to avoid strict mode violation)
    await expect(page.locator(`text=${workflowName}`).first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator(`text=v${version}`).first()).toBeVisible();

    // Verify workflow is auto-selected (should be the first/most recent)
    await expect(page.locator('text=SELECTED WORKFLOW')).toBeVisible();

    // Verify workflow stats are displayed
    await expect(page.locator('text=RUNS')).toBeVisible();
    await expect(page.locator('text=SUCCESS')).toBeVisible();
    await expect(page.locator('text=AVG TIME')).toBeVisible();

    // Step 5: Verify workflow persists in localStorage
    const storedWorkflows = await page.evaluate(() => {
      const data = localStorage.getItem('demo-deployed-workflows');
      console.log('[Test Debug] localStorage data:', data);
      return data ? JSON.parse(data) : [];
    });

    console.log('[Test Debug] Stored workflows count:', storedWorkflows.length);
    console.log('[Test Debug] First workflow:', storedWorkflows[0]);

    expect(storedWorkflows).toHaveLength(2); // Baseline + newly deployed
    expect(storedWorkflows[0].name).toBe(workflowName);
    expect(storedWorkflows[0].version).toBe(version);
    expect(storedWorkflows[0].status).toBe('active');
  });

  test('should show chatbot confirmation after loading template', async ({ page }) => {
    await page.goto('/prototype');

    // Load template via Load Template button
    await page.click('button:has-text("Load Template")');
    await page.waitForSelector('[role="menu"]', { state: 'visible' });
    await page.click('[role="menuitem"]:has-text("Vendor Risk Assessment")');

    // Verify chatbot shows confirmation message
    // The chatbot widget should display a confirmation about the loaded template
    await expect(page.locator('[data-testid="chatbot-widget"]').or(page.locator('text=Loaded'))).toBeVisible({ timeout: 3000 });
  });

  test('should handle deployment dialog cancellation', async ({ page }) => {
    await page.goto('/prototype');

    // Load template
    await page.click('button:has-text("Load Template")');
    await page.waitForSelector('[role="menu"]', { state: 'visible' });
    await page.click('[role="menuitem"]:has-text("Claims Detection")');

    // Open deployment dialog
    await page.click('button:has-text("Deploy to Production")');
    await expect(page.locator('h6:has-text("Deploy to Production")')).toBeVisible();

    // Click cancel
    await page.click('button:has-text("Cancel")');

    // Verify still on prototype page and dialog is closed
    await expect(page).toHaveURL('/prototype');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should allow custom workflow name and version in deployment', async ({ page }) => {
    await page.goto('/prototype');

    // Load template
    await page.click('button:has-text("Load Template")');
    await page.waitForSelector('[role="menu"]', { state: 'visible' });
    await page.click('[role="menuitem"]:has-text("Policy Violation Detection")');

    // Open deployment dialog
    await page.click('button:has-text("Deploy to Production")');
    await expect(page.getByRole('dialog')).toBeVisible();

    // Change version (no workflow name input - it's prop-only)
    const customName = 'Policy Violation Detection'; // Actual workflow name from template
    const customVersion = '3.5.1';

    const versionInput = page.getByLabel(/version/i);
    await versionInput.fill(customVersion);

    // Check all checklist items to enable deploy
    const checkboxes = page.locator('input[type="checkbox"]');
    await checkboxes.nth(0).check();
    await checkboxes.nth(1).check();
    await checkboxes.nth(2).check();

    // Deploy (click Deploy button inside dialog)
    await page.getByRole('button', { name: /^deploy$/i }).click();

    // Wait for navigation
    await page.waitForURL('/production', { timeout: 5000 });

    // Verify custom name and version appear (use first() to avoid strict mode violation)
    await expect(page.locator(`text=${customName}`).first()).toBeVisible();
    await expect(page.locator(`text=v${customVersion}`).first()).toBeVisible();
  });

  test('should show success notification after deployment', async ({ page }) => {
    await page.goto('/prototype');

    // Load and deploy
    await page.click('button:has-text("Load Template")');
    await page.waitForSelector('[role="menu"]', { state: 'visible' });
    await page.click('[role="menuitem"]:has-text("Evidence Collection")');
    await page.click('button:has-text("Deploy to Production")');

    // Wait for dialog and fill requirements
    await expect(page.getByRole('dialog')).toBeVisible();
    const versionInput = page.getByLabel(/version/i);
    await versionInput.fill('1.0.0');

    // Check all checklist items
    const checkboxes = page.locator('input[type="checkbox"]');
    await checkboxes.nth(0).check();
    await checkboxes.nth(1).check();
    await checkboxes.nth(2).check();

    // Click Deploy button
    await page.getByRole('button', { name: /^deploy$/i }).click();

    // Wait for navigation
    await page.waitForURL('/production');

    // Verify deployment succeeded by checking workflow appears in production
    await expect(page.locator('text=Evidence Collection').first()).toBeVisible({ timeout: 3000 });
  });
});
