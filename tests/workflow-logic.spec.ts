import { test, expect } from '@playwright/test';

test.describe('Agnostic Workflow Logic Gates', () => {
  
  test('should lock the Diagnosis step until Vitals are completed', async ({ page }) => {
    await page.goto('/workflow/test-instance');

    // Diagnosis (Final Diagnosis) is LOCKED: no EXECUTE button, other steps have it
    const executeButtons = page.getByRole('button', { name: /EXECUTE/i });
    await expect(executeButtons).toHaveCount(2); // Vitals + Tech Check only
    await expect(page.getByText(/Final Diagnosis/i)).toBeVisible();
  });

  test('should unlock Diagnosis after Support Actor completes prerequisite', async ({ page, browser }) => {
    const nurseContext = await browser.newContext();
    const nursePage = await nurseContext.newPage();
    await nursePage.goto('/workflow/test-instance');

    // Nurse completes "Patient Vitals"
    await nursePage.getByRole('button', { name: /EXECUTE/i }).first().click();
    await expect(nursePage.getByText(/✓ Verified/i)).toBeVisible();

    await page.goto('/workflow/test-instance');

    // After Vitals, Diagnosis unlocks. Complete Tech Check then Diagnosis
    const executeButtons = page.getByRole('button', { name: /EXECUTE/i });
    await expect(executeButtons).toHaveCount(2);
    await executeButtons.nth(0).click(); // Tech Check
    await expect(page.getByText(/✓ Verified/i)).toHaveCount(2);
    await page.getByRole('button', { name: /EXECUTE/i }).first().click(); // Diagnosis (only one left)
    await expect(page.getByText(/✓ Verified/i)).toHaveCount(3);
  });
});