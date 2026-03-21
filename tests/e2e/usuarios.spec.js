import { test, expect } from '@playwright/test'
import { autenticar } from './helpers/auth.js'

test.describe('Usuários - Consulta', () => {
  test.beforeEach(async ({ page }) => {
    await autenticar(page)
    await page.goto('/usuarios/consulta')
  })

  test('exibe o título Gerenciar Usuários', async ({ page }) => {
    await expect(page.getByText('Gerenciar Usuários')).toBeVisible()
  })

  test('exibe o botão Novo Usuário', async ({ page }) => {
    await expect(page.getByRole('link', { name: /novo usuário/i })).toBeVisible()
  })

  test('exibe o botão de Filtros', async ({ page }) => {
    await expect(page.getByRole('button', { name: /filtros/i })).toBeVisible()
  })

  test('abre o dialog de filtros com campos Nome, E-mail, Usuário e Status', async ({ page }) => {
    await page.getByRole('button', { name: /filtros/i }).click()
    await expect(page.getByLabel('Nome')).toBeVisible()
    await expect(page.getByLabel('E-mail')).toBeVisible()
    await expect(page.getByLabel('Usuário')).toBeVisible()
    await expect(page.getByLabel('Status')).toBeVisible()
  })

  test('limpa os filtros ao clicar em Limpar', async ({ page }) => {
    await page.getByRole('button', { name: /filtros/i }).click()
    await page.getByLabel('Nome').fill('Admin')
    await page.getByRole('button', { name: 'Limpar' }).click()
    await expect(page.getByLabel('Nome')).toHaveValue('')
  })

  test('fecha o dialog ao clicar em Aplicar', async ({ page }) => {
    await page.getByRole('button', { name: /filtros/i }).click()
    await page.getByRole('button', { name: 'Aplicar' }).click()
    await expect(page.locator('.q-dialog').first()).not.toBeVisible()
  })

  test('exibe a tabela de usuários', async ({ page }) => {
    await expect(page.locator('.q-table')).toBeVisible()
  })

  test('navega para cadastro ao clicar em Novo Usuário', async ({ page }) => {
    await page.getByRole('link', { name: /novo usuário/i }).click()
    await expect(page).toHaveURL('/usuarios/cadastro')
  })
})

test.describe('Usuários - Cadastro', () => {
  test.beforeEach(async ({ page }) => {
    await autenticar(page)
    await page.goto('/usuarios/cadastro')
  })

  test('exibe o título Cadastro de Usuários', async ({ page }) => {
    await expect(page.getByText('Cadastro de Usuários')).toBeVisible()
  })

  test('exibe os campos do formulário', async ({ page }) => {
    await expect(page.getByLabel('Nome *')).toBeVisible()
    await expect(page.getByLabel('Usuário *')).toBeVisible()
    await expect(page.getByLabel('E-mail *')).toBeVisible()
    await expect(page.getByLabel(/senha/i)).toBeVisible()
    await expect(page.getByLabel('Tipo de Usuário *')).toBeVisible()
  })

  test('exibe campos de oficina quando tipo é user', async ({ page }) => {
    // role padrão já é 'user', então os campos devem aparecer
    await expect(page.getByText('Informações da Oficina')).toBeVisible()
    await expect(page.getByLabel('Nome da Oficina *')).toBeVisible()
    await expect(page.getByLabel('Nome do Mecânico *')).toBeVisible()
  })

  test('oculta campos de oficina ao selecionar tipo admin', async ({ page }) => {
    await page.getByLabel('Tipo de Usuário *').click()
    await page.getByRole('option', { name: 'admin' }).click()
    await expect(page.getByText('Informações da Oficina')).not.toBeVisible()
  })

  test('toggle de senha funciona', async ({ page }) => {
    const senhaInput = page.getByLabel(/senha/i).first()
    await expect(senhaInput).toHaveAttribute('type', 'password')
    await page.locator('.q-field').filter({ hasText: /senha/i }).getByRole('img').last().click()
    await expect(senhaInput).toHaveAttribute('type', 'text')
  })

  test('exibe notificação ao salvar sem campos obrigatórios', async ({ page }) => {
    await page.getByRole('button', { name: 'Salvar' }).click()
    await expect(page.locator('.q-notification')).toBeVisible({ timeout: 5000 })
  })

  test('volta para /usuarios/consulta ao clicar em Cancelar', async ({ page }) => {
    await page.getByRole('button', { name: 'Cancelar' }).click()
    await expect(page).toHaveURL('/usuarios/consulta')
  })
})
