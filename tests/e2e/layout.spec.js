import { test, expect } from '@playwright/test'
import { autenticar } from './helpers/auth.js'

test.describe('Layout Principal - Navegação', () => {
  test.beforeEach(async ({ page }) => {
    await autenticar(page)
    await page.goto('/ordens')
  })

  test('exibe o menu lateral', async ({ page }) => {
    await expect(page.locator('.q-drawer, .q-layout-drawer, nav').first()).toBeVisible()
  })

  test('navega para Ordens de Serviço pelo menu', async ({ page }) => {
    await page.getByRole('link', { name: /ordens/i }).first().click()
    await expect(page).toHaveURL('/ordens')
  })

  test('navega para Consulta de Clientes pelo menu', async ({ page }) => {
    await page.getByRole('link', { name: /clientes/i }).first().click()
    await expect(page).toHaveURL(/clientes/)
  })

  test('navega para Usuários pelo menu', async ({ page }) => {
    await page.getByRole('link', { name: /usuários/i }).first().click()
    await expect(page).toHaveURL(/usuarios/)
  })

  test('navega para Configurações pelo menu', async ({ page }) => {
    await page.getByRole('link', { name: /configurações/i }).first().click()
    await expect(page).toHaveURL(/configuracoes/)
  })
})

test.describe('Proteção de Rotas', () => {
  test('redireciona para /login ao acessar /ordens sem autenticação', async ({ page }) => {
    await page.goto('/login')
    await page.evaluate(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    })
    await page.goto('/ordens')
    await expect(page).toHaveURL(/login/)
  })

  test('redireciona para /login ao acessar /clientes/consulta sem autenticação', async ({ page }) => {
    await page.goto('/login')
    await page.evaluate(() => localStorage.clear())
    await page.goto('/clientes/consulta')
    await expect(page).toHaveURL(/login/)
  })

  test('redireciona para /login ao acessar /usuarios/consulta sem autenticação', async ({ page }) => {
    await page.goto('/login')
    await page.evaluate(() => localStorage.clear())
    await page.goto('/usuarios/consulta')
    await expect(page).toHaveURL(/login/)
  })
})

test.describe('Página 404', () => {
  test('exibe página de erro ao acessar rota inexistente', async ({ page }) => {
    await autenticar(page)
    await page.goto('/rota-que-nao-existe')
    await expect(page.getByText(/404|não encontrada|not found/i)).toBeVisible()
  })
})
