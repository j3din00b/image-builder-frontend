import { expect, type Page } from '@playwright/test';

export const togglePreview = async (page: Page) => {
  const toggleSwitch = page.locator('#preview-toggle');

  if (!(await toggleSwitch.isChecked())) {
    await toggleSwitch.click();
  }

  const turnOnButton = page.getByRole('button', { name: 'Turn on' });
  if (await turnOnButton.isVisible()) {
    await turnOnButton.click();
  }

  await expect(toggleSwitch).toBeChecked();
};

export const isHosted = (): boolean => {
  return process.env.BASE_URL?.includes('redhat.com') || false;
};

export const closePopupsIfExist = async (page: Page) => {
  const locatorsToCheck = [
    page.locator('.pf-v6-c-alert.notification-item button'), // This closes all toast pop-ups
    page.locator(`button[id^="pendo-close-guide-"]`), // This closes the pendo guide pop-up
    page.locator(`button[id="truste-consent-button"]`), // This closes the trusted consent pop-up
    page.getByLabel('close-notification'), // This closes a one off info notification (May be covered by the toast above, needs recheck.)
    page
      .locator('iframe[name="intercom-modal-frame"]')
      .contentFrame()
      .getByRole('button', { name: 'Close' }), // This closes the intercom pop-up
    page
      .locator('iframe[name="intercom-notifications-frame"]')
      .contentFrame()
      .getByRole('button', { name: 'Profile image for Rob Rob' })
      .last(), // This closes the intercom pop-up notification at the bottom of the screen, the last notification is displayed first if stacked (different from the modal popup handled above)
  ];

  for (const locator of locatorsToCheck) {
    await page.addLocatorHandler(locator, async () => {
      await locator.first().click({ timeout: 10_000, noWaitAfter: true }); // There can be multiple toast pop-ups
    });
  }
};
