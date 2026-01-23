import { test, expect } from '@playwright/test'

// Home Page - Desktop (Cinematic Mode)
test('homepage loads successfully on desktop viewport', async ({ page }) => {
  // Set desktop viewport for cinematic mode
  await page.setViewportSize({ width: 1920, height: 1080 })
  
  await page.goto('/')
  
  // Verify page loads without error
  await expect(page.locator('body')).toBeVisible()
  
  // Verify navbar is present
  await expect(page.locator('nav')).toBeVisible()
})

// Home Page - Mobile (Native Scroll Mode)
test('homepage loads successfully on mobile viewport', async ({ page }) => {
  // Set mobile viewport for native scroll mode
  await page.setViewportSize({ width: 375, height: 667 })
  
  await page.goto('/')
  
  // Verify page loads without error
  await expect(page.locator('body')).toBeVisible()
  
  // Verify navbar is present
  await expect(page.locator('nav')).toBeVisible()
})

// Portfolio Page
test('portfolio page loads successfully', async ({ page }) => {
  await page.goto('/portfolio')
  
  // Verify page loads without error
  await expect(page.locator('body')).toBeVisible()
  
  // Verify navbar is present
  await expect(page.locator('nav')).toBeVisible()
  
  // Verify at least one stable heading is visible
  await expect(page.locator('h1, h2').first()).toBeVisible()
})

// Portfolio Detail Page - Dynamic Route
test('portfolio detail page loads successfully', async ({ page }) => {
  // Use stable slug from data/projects.ts
  await page.goto('/portfolio/neon-cybernetic')
  
  // Verify page loads without error
  await expect(page.locator('body')).toBeVisible()
  
  // Verify navbar is present
  await expect(page.locator('nav')).toBeVisible()
  
  // Verify project header section is visible
  await expect(page.locator('header')).toBeVisible()
})
