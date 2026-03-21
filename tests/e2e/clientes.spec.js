import { test, expect } from '@playwright/test'
import { autenticar } from './helpers/auth.js'

test.describe('Clientes - Consulta', () => {
  test.beforeEach(async ({ page }) => {
    await autenticar(page)
    await page.goto('/clientes/consulta')
  })

  test('exibe o título Consulta de Clientes', async ({ page }) => {
    await expect(page.getByText('Consulta de Clientes')).toBeVisible()
  })

  test('exibe o botão Novo Cliente', async ({ page }) => {
    await expect(page.getByRole('link', { name: /novo cliente/i })).toBeVisible()
  })

  test('exibe o botão de Filtros', async ({ page }) => {
    await expect(page.getByRole('button', { name: /filtros/i })).toBeVisible()
  })

  test('abre o dialog de filtros com campos Nome, CPF e Placa', async ({ page }) => {
    await page.getByRole('button', { name: /filtros/i }).click()
    await expect(page.getByLabel('Nome')).toBeVisible()
    await expect(page.getByLabel('CPF')).toBeVisible()
    await expect(page.getByLabel('Placa')).toBeVisible()
  })

  test('limpa os filtros ao clicar em Limpar', async ({ page }) => {
    await page.getByRole('button', { name: /filtros/i }).click()
    await page.getByLabel('Nome').fill('João')
    await page.getByRole('button', { name: 'Limpar' }).click()
    await expect(page.getByLabel('Nome')).toHaveValue('')
  })

  test('fecha o dialog ao clicar em Aplicar', async ({ page }) => {
    await page.getByRole('button', { name: /filtros/i }).click()
    await page.getByRole('button', { name: 'Aplicar' }).click()
    await expect(page.locator('.q-dialog').first()).not.toBeVisible()
  })

  test('exibe a tabela de clientes', async ({ page }) => {
    await expect(page.locator('.q-table')).toBeVisible()
  })

  test('navega para cadastro ao clicar em Novo Cliente', async ({ page }) => {
    await page.getByRole('link', { name: /novo cliente/i }).click()
    await expect(page).toHaveURL('/clientes/cadastro')
  })
})

test.describe('Clientes - Cadastro', () => {
  test.beforeEach(async ({ page }) => {
    await autenticar(page)
    await page.goto('/clientes/cadastro')
  })

  test('exibe o título Cadastro de Clientes', async ({ page }) => {
    await expect(page.getByText('Cadastro de Clientes')).toBeVisible()
  })

  test('exibe os campos do formulário', async ({ page }) => {
    await expect(page.getByLabel('Nome *')).toBeVisible()
    await expect(page.getByLabel('CPF')).toBeVisible()
    await expect(page.getByLabel('Telefone *')).toBeVisible()
    await expect(page.getByLabel('E-mail')).toBeVisible()
    await expect(page.getByLabel('Endereço')).toBeVisible()
  })

  test('exibe seção de Veículos com campos obrigatórios', async ({ page }) => {
    await expect(page.getByText('Veículos')).toBeVisible()
    await expect(page.getByLabel('Placa *').first()).toBeVisible()
    await expect(page.getByLabel('Modelo *').first()).toBeVisible()
  })

  test('adiciona novo veículo ao clicar em Adicionar Veículo', async ({ page }) => {
    const antes = await page.getByLabel('Placa *').count()
    await page.getByRole('button', { name: /adicionar veículo/i }).click()
    await expect(page.getByLabel('Placa *')).toHaveCount(antes + 1)
  })

  test('exibe notificação ao salvar sem campos obrigatórios', async ({ page }) => {
    await page.getByRole('button', { name: 'Salvar' }).click()
    await expect(page.locator('.q-notification')).toBeVisible({ timeout: 5000 })
  })

  test('volta para /ordens ao clicar em Cancelar', async ({ page }) => {
    await page.getByRole('button', { name: 'Cancelar' }).click()
    await expect(page).toHaveURL('/ordens')
  })
})
