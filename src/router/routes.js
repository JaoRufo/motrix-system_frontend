const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/dashboard',
      },
      {
        path: '/dashboard',
        component: () => import('pages/DashboardPage.vue'),
      },
      {
        path: '/ordens',
        component: () => import('pages/ordens/OrdemConsulta.vue'),
      },
      {
        path: '/ordens/nova/:id?',
        component: () => import('pages/ordens/OrdemNova.vue'),
      },
      {
        path: '/clientes/cadastro/:id?',
        component: () => import('pages/clientes/ClientesCadastro.vue'),
      },
      {
        path: '/clientes/consulta',
        component: () => import('pages/clientes/ClientesConsulta.vue'),
      },
      {
        path: '/usuarios/cadastro/:id?',
        component: () => import('pages/usuarios/UsuariosCadastro.vue'),
      },
      {
        path: '/usuarios/consulta',
        component: () => import('pages/usuarios/UsuariosConsulta.vue'),
      },
      {
        path: '/configuracoes',
        component: () => import('pages/ConfiguracoesPage.vue'),
      },
      {
        path: '/configuracoes/oficina',
        component: () => import('pages/ConfiguracoesOficina.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },
  {
    path: '/forgot-password',
    component: () => import('pages/ForgotPasswordPage.vue'),
  },
  {
    path: '/reset-password',
    component: () => import('pages/ResetPasswordPage.vue'),
  },
]

export default routes
