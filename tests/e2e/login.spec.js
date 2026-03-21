import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('exibe a tela de login corretamente', async ({ page }) => {
    await expect(page.getByLabel('Usuário')).toBeVisible()
    await expect(page.getByLabel('Senha')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible()
    await expect(page.getByAltText('Motrix System')).toBeVisible()
  })

  test('exibe erro ao submeter campos vazios', async ({ page }) => {
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page.getByText('Preencha usuário e senha')).toBeVisible()
  })

  test('campos ficam vermelhos ao submeter com campos vazios', async ({ page }) => {
    await page.getByRole('button', { name: 'Entrar' }).click()

    const usernameInput = page.locator('.q-field').filter({ hasText: 'Usuário' })
    const passwordInput = page.locator('.q-field').filter({ hasText: 'Senha' })

    await expect(usernameInput).toHaveClass(/q-field--error/)
    await expect(passwordInput).toHaveClass(/q-field--error/)
  })

  test('erro some ao clicar no campo usuário', async ({ page }) => {
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page.getByText('Preencha usuário e senha')).toBeVisible()

    await page.getByLabel('Usuário').click()
    await expect(page.getByText('Preencha usuário e senha')).not.toBeVisible()
  })

  test('erro some ao clicar no campo senha', async ({ page }) => {
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page.getByText('Preencha usuário e senha')).toBeVisible()

    await page.getByLabel('Senha').click()
    await expect(page.getByText('Preencha usuário e senha')).not.toBeVisible()
  })

  test('erro some ao digitar na senha', async ({ page }) => {
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page.getByText('Preencha usuário e senha')).toBeVisible()

    await page.getByLabel('Senha').fill('qualquer')
    await expect(page.getByText('Preencha usuário e senha')).not.toBeVisible()
  })

  test('exibe erro de credenciais inválidas', async ({ page }) => {
    await page.getByLabel('Usuário').fill('usuario_invalido')
    await page.getByLabel('Senha').fill('senha_invalida')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(
      page.getByText(/usuário ou senha inválidos|inválidos|invalid/i),
    ).toBeVisible({ timeout: 10000 })
  })

  test('limpa o campo senha após erro de credenciais', async ({ page }) => {
    await page.getByLabel('Usuário').fill('usuario_invalido')
    await page.getByLabel('Senha').fill('senha_invalida')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(
      page.getByText(/usuário ou senha inválidos|inválidos|invalid/i),
    ).toBeVisible({ timeout: 10000 })

    await expect(page.getByLabel('Senha')).toHaveValue('')
  })

  test('toggle de visibilidade da senha funciona', async ({ page }) => {
    const senhaInput = page.getByLabel('Senha')
    await expect(senhaInput).toHaveAttribute('type', 'password')

    await page.locator('.q-field').filter({ hasText: 'Senha' }).getByRole('img').last().click()
    await expect(senhaInput).toHaveAttribute('type', 'text')

    await page.locator('.q-field').filter({ hasText: 'Senha' }).getByRole('img').last().click()
    await expect(senhaInput).toHaveAttribute('type', 'password')
  })

  test('botão Entrar fica desabilitado durante o loading', async ({ page }) => {
    await page.getByLabel('Usuário').fill('admin')
    await page.getByLabel('Senha').fill('qualquer')

    const btn = page.getByRole('button', { name: 'Entrar' })
    await btn.click()

    // Durante o loading o botão deve estar desabilitado
    await expect(btn).toBeDisabled()
  })

  test('submit funciona ao pressionar Enter no campo senha', async ({ page }) => {
    await page.getByLabel('Usuário').fill('usuario_invalido')
    await page.getByLabel('Senha').fill('senha_invalida')
    await page.getByLabel('Senha').press('Enter')

    await expect(
      page.getByText(/usuário ou senha inválidos|inválidos|invalid/i),
    ).toBeVisible({ timeout: 10000 })
  })
})
