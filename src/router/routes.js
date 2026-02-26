const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/ordens',
      },
      {
        path: '/ordens',
        component: () => import('pages/ordens/OrdemConsulta.vue'),
      },
      {
        path: '/ordens/nova',
        component: () => import('pages/ordens/OrdemNova.vue'),
      },
      {
        path: '/clientes/cadastro',
        component: () => import('pages/clientes/ClientesCadastro.vue'),
      },
      {
        path: '/clientes/consulta',
        component: () => import('pages/clientes/ClientesConsulta.vue'),
      },
      {
        path: '/configuracoes',
        component: () => import('pages/ConfiguracoesPage.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },
]

export default routes
