import { test, expect } from '@playwright/test'
import { autenticar } from './helpers/auth.js'

test.describe('Ordens de Serviço - Consulta', () => {
  test.beforeEach(async ({ page }) => {
    await autenticar(page)
    await page.goto('/ordens')
  })

  test('exibe o título da página', async ({ page }) => {
    await expect(page.getByText('Ordens de Serviço')).toBeVisible()
  })

  test('exibe o botão Nova Ordem', async ({ page }) => {
    await expect(page.getByRole('link', { name: /nova ordem/i })).toBeVisible()
  })

  test('exibe o botão de Filtros', async ({ page }) => {
    await expect(page.getByRole('button', { name: /filtros/i })).toBeVisible()
  })

  test('abre o dialog de filtros ao clicar em Filtros', async ({ page }) => {
    await page.getByRole('button', { name: /filtros/i }).click()
    await expect(page.getByText('Filtros').last()).toBeVisible()
    await expect(page.getByLabel('Placa')).toBeVisible()
    await expect(page.getByLabel('Nº O.S')).toBeVisible()
  })

  test('limpa os filtros ao clicar em Limpar', async ({ page }) => {
    await page.getByRole('button', { name: /filtros/i }).click()
    await page.getByLabel('Placa').fill('ABC-1234')
    await page.getByRole('button', { name: 'Limpar' }).click()
    await expect(page.getByLabel('Placa')).toHaveValue('')
  })

  test('fecha o dialog de filtros ao clicar em Aplicar', async ({ page }) => {
    await page.getByRole('button', { name: /filtros/i }).click()
    await page.getByRole('button', { name: 'Aplicar' }).click()
    await expect(page.locator('.q-dialog').first()).not.toBeVisible()
  })

  test('exibe a tabela de ordens', async ({ page }) => {
    await expect(page.locator('.q-table')).toBeVisible()
  })

  test('navega para Nova Ordem ao clicar no botão', async ({ page }) => {
    await page.getByRole('link', { name: /nova ordem/i }).click()
    await expect(page).toHaveURL(/\/ordens\/nova/)
  })
})

test.describe('Ordens de Serviço - Nova Ordem', () => {
  test.beforeEach(async ({ page }) => {
    await autenticar(page)
    await page.goto('/ordens/nova')
  })

  test('exibe o título Nova Ordem de Serviço', async ({ page }) => {
    await expect(page.getByText('Nova Ordem de Serviço')).toBeVisible()
  })

  test('exibe todos os campos obrigatórios', async ({ page }) => {
    await expect(page.getByLabel('Cliente *')).toBeVisible()
    await expect(page.getByLabel('KM Atual *')).toBeVisible()
    await expect(page.getByLabel('Status *')).toBeVisible()
    await expect(page.getByLabel('Descrição do Problema *')).toBeVisible()
  })

  test('exibe botões Adicionar Peça e Adicionar Serviço', async ({ page }) => {
    await expect(page.getByRole('button', { name: /adicionar peça/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /adicionar serviço/i })).toBeVisible()
  })

  test('adiciona linha de peça ao clicar em Adicionar Peça', async ({ page }) => {
    await page.getByRole('button', { name: /adicionar peça/i }).click()
    await expect(page.getByLabel('Peça')).toBeVisible()
  })

  test('adiciona linha de mão de obra ao clicar em Adicionar Serviço', async ({ page }) => {
    await page.getByRole('button', { name: /adicionar serviço/i }).click()
    await expect(page.getByLabel('Descrição')).toBeVisible()
  })

  test('exibe campo Motivo do Cancelamento ao selecionar status Cancelada', async ({ page }) => {
    await page.getByLabel('Status *').click()
    await page.getByRole('option', { name: 'Cancelada' }).click()
    await expect(page.getByLabel('Motivo do Cancelamento *')).toBeVisible()
  })

  test('campo Motivo do Cancelamento some ao trocar status', async ({ page }) => {
    await page.getByLabel('Status *').click()
    await page.getByRole('option', { name: 'Cancelada' }).click()
    await expect(page.getByLabel('Motivo do Cancelamento *')).toBeVisible()

    await page.getByLabel('Status *').click()
    await page.getByRole('option', { name: 'Aberta' }).click()
    await expect(page.getByLabel('Motivo do Cancelamento *')).not.toBeVisible()
  })

  test('exibe total R$ 0.00 inicialmente', async ({ page }) => {
    await expect(page.getByText(/total: r\$ 0\.00/i)).toBeVisible()
  })

  test('volta para /ordens ao clicar em Cancelar', async ({ page }) => {
    await page.getByRole('button', { name: 'Cancelar' }).click()
    await expect(page).toHaveURL('/ordens')
  })

  test('botão voltar navega para /ordens', async ({ page }) => {
    await page.locator('button').filter({ has: page.locator('[aria-label="arrow_back"]') }).first().click()
    await expect(page).toHaveURL('/ordens')
  })
})
