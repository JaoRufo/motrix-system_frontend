/**
 * Faz login real com admin/123456 e aguarda redirecionamento para /ordens.
 * Use em testes que precisam acessar rotas protegidas.
 */
export async function autenticar(page) {
  await page.goto('/login')
  await page.getByLabel('Usuário').fill('admin')
  await page.getByLabel('Senha').fill('123456')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await page.waitForURL('/ordens', { timeout: 10000 })
}
