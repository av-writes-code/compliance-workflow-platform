import { test, expect } from '@playwright/test';

test.describe('Chatbot Interactions E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/prototype');
  });

  // Test 1.1: FAB button renders with correct styles (DEMO.md lines 243-253)
  test('Test 1.1: Chatbot FAB button renders with correct styles', async ({ page }) => {
    const fab = page.locator('button[aria-label="Open chat assistant"]');
    await expect(fab).toBeVisible();

    // Check CSS properties
    await expect(fab).toHaveCSS('position', 'fixed');
    // Note: Exact pixel values may vary due to MUI styling, checking that they exist
    const styles = await fab.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        bottom: computed.bottom,
        right: computed.right,
        zIndex: computed.zIndex,
      };
    });

    expect(styles.bottom).toBeTruthy();
    expect(styles.right).toBeTruthy();
    expect(parseInt(styles.zIndex)).toBeGreaterThan(1000);
  });

  // Test 1.2: Returns workflow metadata on discovery query (DEMO.md lines 264-285)
  test('Test 1.2: Chatbot returns workflow metadata on discovery query', async ({ page }) => {
    await page.click('button[aria-label="Open chat assistant"]');

    const input = page.getByTestId('chatbot-input');
    await input.fill('improve claims detection with false positives');
    await input.press('Enter');

    await page.waitForTimeout(1600); // AI response delay

    const aiMsg = page.locator('[data-message-role="assistant"]').last();

    // CRITICAL ASSERTIONS - Implementation MUST provide these:
    await expect(aiMsg).toContainText('8 nodes'); // ← Must show node count
    await expect(aiMsg).toContainText('Claude Chat Model'); // ← Must show integrations
    await expect(aiMsg).toContainText('87'); // ← Must show baseline accuracy (87% or 87)
    await expect(aiMsg).toContainText('accuracy');

    const loadBtn = page.locator('button:has-text("Load this template")');
    await expect(loadBtn).toBeVisible(); // ← Quick action must exist
    await expect(loadBtn).toBeEnabled();
  });

  // Test 1.3: Shows confirmation after template loads (DEMO.md lines 308-324)
  test('Test 1.3: Chatbot shows confirmation after template loads', async ({ page }) => {
    await page.click('button[aria-label="Open chat assistant"]');

    const input = page.getByTestId('chatbot-input');
    await input.fill('improve claims detection');
    await input.press('Enter');

    await page.waitForTimeout(1600);

    await page.locator('button:has-text("Load this template")').click();
    await page.waitForTimeout(500);

    // Canvas should have 8 nodes
    const nodes = page.locator('.react-flow__node');
    await expect(nodes).toHaveCount(8);

    // Chatbot should auto-respond with confirmation
    await page.waitForTimeout(200);
    const confirmMsg = page.locator('[data-message-role="assistant"]').last();
    await expect(confirmMsg).toContainText('✓ Loaded');
    await expect(confirmMsg).toContainText('Claims Detection');
    await expect(confirmMsg).toContainText('8 nodes');
  });

  // Test 1.4: Provides Critic Agent guidance with steps (DEMO.md lines 341-360)
  test('Test 1.4: Chatbot provides Critic Agent guidance with steps', async ({ page }) => {
    await page.click('button[aria-label="Open chat assistant"]');

    const input = page.getByTestId('chatbot-input');
    await input.fill('How do I add validation step?');
    await input.press('Enter');

    await page.waitForTimeout(1600);

    const aiMsg = page.locator('[data-message-role="assistant"]').last();

    // MUST contain component name and explanation
    await expect(aiMsg).toContainText('Critic Agent');
    await expect(aiMsg).toContainText(/evaluates and critiques/i); // Case-insensitive

    // MUST contain numbered steps
    await expect(aiMsg).toContainText(/1\./); // Escape period
    await expect(aiMsg).toContainText(/drag/i); // Case-insensitive
    await expect(aiMsg).toContainText(/component/i); // Case-insensitive
    await expect(aiMsg).toContainText(/connect/i); // Case-insensitive
  });

  // Test 1.5: Quick action button triggers template loading
  test('Test 1.5: Quick action button triggers template loading', async ({ page }) => {
    await page.click('button[aria-label="Open chat assistant"]');

    const input = page.getByTestId('chatbot-input');
    await input.fill('improve claims detection');
    await input.press('Enter');

    await page.waitForTimeout(1600);

    // Click the quick action button
    const loadBtn = page.locator('button:has-text("Load this template")');
    await loadBtn.click();

    // Verify template loaded - canvas should have nodes
    await page.waitForTimeout(500);
    const nodes = page.locator('.react-flow__node');
    await expect(nodes).toHaveCount(8);
  });
});
