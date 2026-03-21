import { test, expect } from '@playwright/test'
import { autenticar } from './helpers/auth.js'

test.describe('Configurações - Página Geral', () => {
  test.beforeEach(async ({ page }) => {
    await autenticar(page)
    await page.goto('/configuracoes')
  })

  test('exibe o título Configurações', async ({ page }) => {
    await expect(page.getByText('Configurações')).toBeVisible()
  })
})

test.describe('Configurações - Oficina', () => {
  test.beforeEach(async ({ page }) => {
    await autenticar(page)
    await page.goto('/configuracoes/oficina')
  })

  test('exibe o título Configurações da Oficina', async ({ page }) => {
    await expect(page.getByText('Configurações da Oficina')).toBeVisible()
  })

  test('exibe os campos do formulário', async ({ page }) => {
    await expect(page.getByLabel('Nome da Oficina *')).toBeVisible()
    await expect(page.getByLabel('CNPJ *')).toBeVisible()
    await expect(page.getByLabel('Telefone *')).toBeVisible()
    await expect(page.getByLabel('E-mail')).toBeVisible()
    await expect(page.getByLabel('Endereço Completo *')).toBeVisible()
  })

  test('exibe notificação ao salvar sem campos obrigatórios', async ({ page }) => {
    // Garante que os campos estão vazios
    await page.getByLabel('Nome da Oficina *').fill('')
    await page.getByRole('button', { name: 'Salvar' }).click()
    await expect(page.locator('.q-notification')).toBeVisible({ timeout: 5000 })
  })

  test('volta para /ordens ao clicar em Cancelar', async ({ page }) => {
    await page.getByRole('button', { name: 'Cancelar' }).click()
    await expect(page).toHaveURL('/ordens')
  })

  test('botão voltar navega para /ordens', async ({ page }) => {
    await page.locator('button[aria-label="arrow_back"], button:has([aria-label="arrow_back"])').first().click()
    await expect(page).toHaveURL('/ordens')
  })
})
