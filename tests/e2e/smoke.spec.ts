import { test, expect } from '@playwright/test'

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/')
  
  // Verify page body is visible
  await expect(page.locator('body')).toBeVisible()
  
  // Verify navbar is present (stable element on all pages)
  await expect(page.locator('nav')).toBeVisible()
  
  // Verify page has Inkspire in title
  await expect(page).toHaveTitle(/Inkspire/i)
})

test('contact page loads successfully', async ({ page }) => {
  await page.goto('/contact')
  
  // Verify page loads without error
  await expect(page.locator('body')).toBeVisible()
  
  // Verify navbar is present
  await expect(page.locator('nav')).toBeVisible()
  
  // Verify at least one stable heading is visible
  await expect(page.locator('h1, h2').first()).toBeVisible()
})
