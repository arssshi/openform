import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('mobile layout, menu, filters, and identity page stay usable without overflow', async ({ page }, testInfo) => {
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('openform-mobile.png'), fullPage: true, scale: 'css' })
  await page.getByRole('button', { name: 'Open menu' }).click()
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: /Explore the library/ }).click()
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toHaveCount(0)
  await page.getByRole('button', { name: 'Filters', exact: true }).click()
  await page.getByLabel('Industry').selectOption('Finance')
  await expect(page.locator('.brand-card')).toHaveCount(1)
  await page.goto('/brands/modo/')
  await expect(page.getByRole('heading', { name: 'modo', exact: true })).toBeVisible()
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  await page.getByRole('tab', { name: 'Applications', exact: true }).click()
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  await page.getByRole('tab', { name: 'Assets 30' }).click()
  await expect(page.locator('.asset-card')).toHaveCount(30)
})

test('mobile home meets automated accessibility checks and respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.studio-hero-copy')).toBeVisible()
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(results.violations.map(item => ({ rule: item.id, targets: item.nodes.map(node => node.target) }))).toEqual([])
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto')
})

test('small phone, tablet, and laptop layouts preserve viewport boundaries', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
    await page.goto('/brands/offscript/')
    await expect(page.getByRole('heading', { name: 'OFFSCRIPT', exact: true })).toBeVisible()
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  }
})
