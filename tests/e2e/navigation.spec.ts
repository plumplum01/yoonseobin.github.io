import { expect, test } from '@playwright/test'

test('renders the home page and navigates to about', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: '메뉴 열기' }).click()
  await expect(page.getByRole('button', { name: 'About' })).toBeVisible()
  await page.getByRole('button', { name: 'About' }).click()

  await expect(page).toHaveURL(/\/about$/)
  await page.getByRole('button', { name: '메뉴 열기' }).click()
  await expect(page.getByRole('button', { name: 'Home' })).toBeVisible()
})
