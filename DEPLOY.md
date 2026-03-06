# Guia de Deploy - Oficina System

## Pré-requisitos
- Node.js 18+ instalado
- Yarn ou NPM
- Acesso ao servidor de produção

## Configuração de Ambiente

### Desenvolvimento
O arquivo `.env` contém as configurações de desenvolvimento:
```
VITE_API_URL=http://localhost:3000/api
```

### Produção
O arquivo `.env.production` contém as configurações de produção:
```
VITE_API_URL=https://sua-api-producao.com/api
```

**IMPORTANTE:** Antes do deploy, edite `.env.production` e substitua `https://sua-api-producao.com/api` pela URL real da sua API em produção.

## Comandos

### Instalar dependências
```bash
npm install
# ou
yarn install
```

### Desenvolvimento
```bash
quasar dev
# ou
npm run dev
```

### Build para Produção
```bash
quasar build
# ou
npm run build
```

Os arquivos compilados estarão em `dist/spa/`

### Testar Build Localmente
```bash
cd dist/spa
npx serve
```

## Deploy

### Opção 1: Servidor Web (Nginx, Apache)
1. Execute `quasar build`
2. Copie o conteúdo de `dist/spa/` para o diretório do servidor web
3. Configure o servidor para servir o `index.html` para todas as rotas

### Opção 2: Vercel/Netlify
1. Conecte o repositório
2. Configure:
   - Build Command: `quasar build`
   - Output Directory: `dist/spa`
   - Environment Variables: `VITE_API_URL=https://sua-api-producao.com/api`

### Opção 3: AWS S3 + CloudFront
1. Execute `quasar build`
2. Faça upload de `dist/spa/` para o bucket S3
3. Configure CloudFront para servir o conteúdo

## Configuração do Backend

Certifique-se de que o backend em produção:
1. Aceita requisições do domínio do frontend (CORS)
2. Está rodando em HTTPS
3. Tem as variáveis de ambiente configuradas corretamente

## Checklist de Deploy

- [ ] Atualizar `.env.production` com URL da API de produção
- [ ] Executar `quasar build`
- [ ] Testar build localmente
- [ ] Verificar CORS no backend
- [ ] Fazer upload dos arquivos
- [ ] Testar em produção
- [ ] Verificar console do navegador por erros

## Troubleshooting

### Erro de CORS
- Verifique se o backend aceita requisições do domínio do frontend
- Adicione o domínio nas configurações de CORS do backend

### Página em branco
- Verifique o console do navegador
- Confirme que a URL da API está correta
- Verifique se o servidor está servindo o `index.html` corretamente

### Mudanças não aparecem
- Limpe o cache do navegador (Ctrl+Shift+R)
- Verifique se fez o build novamente
- Confirme que fez upload dos arquivos atualizados
