# Manual de Deploy e Operação — FEA.dev

Este documento foi escrito para a liga estudantil conseguir fazer os próximos deploys do projeto **FEA.dev** com segurança, mesmo sem experiência forte com código, terminal ou servidor.

O objetivo deste material é explicar:

- como acessar o servidor
- como clonar e atualizar o repositório
- como subir backend, frontend e banco
- como manter o site no ar pelo IP ou domínio

---

# 1. Visão geral da arquitetura

Hoje o projeto funciona assim:

## 1.1 Frontend

- feito em **React + Vite**
- fica em:

```txt
apps/frontend
```

- após o build, gera arquivos estáticos em:

```txt
apps/frontend/dist
```

Esses arquivos são servidos pelo **Nginx**.

## 1.2 Backend

- feito em **NestJS**
- fica em:

```txt
apps/backend
```

- é compilado para:

```txt
apps/backend/dist
```

- roda com **PM2**

## 1.3 Banco de dados

- banco: **PostgreSQL**
- migrations rodam pelo backend

## 1.4 Proxy reverso

- o **Nginx** entrega o frontend
- e repassa chamadas de `/api/...` para o backend

---

# 2. Estrutura do projeto no servidor

No servidor, o projeto foi colocado em:

```txt
/var/www/fea-dev/auto-improvement-application
```

## Pastas importantes

### Projeto inteiro

```txt
/var/www/fea-dev/auto-improvement-application
```

### Frontend

```txt
/var/www/fea-dev/auto-improvement-application/apps/frontend
```

### Backend

```txt
/var/www/fea-dev/auto-improvement-application/apps/backend
```

---

# 3. Como acessar o servidor

O servidor está na **Contabo** e roda **Ubuntu**.

O acesso é feito por **SSH**.

## 3.1 O que é SSH

SSH é uma forma segura de abrir o terminal de outro computador pela internet.

Exemplo de acesso:

```bash
ssh root@IP_DO_SERVIDOR
```

### Explicação

- `ssh` = abre a conexão remota
- `root` = usuário administrador do servidor
- `IP_DO_SERVIDOR` = endereço público da VPS

## 3.2 Comando de acesso

**Rodar no computador local**:

```bash
ssh root@SEU_IP_DA_CONTABO
```

Exemplo:

```bash
ssh root@5.189.180.87
```

---

# 4. Como clonar o repositório pela primeira vez

A forma de acesso ao repositório é por **SSH**.

## 4.1 Gerar chave SSH no servidor

**Rodar no servidor**:

```bash
ssh-keygen -t ed25519 -C "seu-email@exemplo.com"
```

Ao pedir onde salvar, apertar **Enter**.

Ao pedir passphrase, pode deixar em branco para simplificar o uso no servidor.

## 4.2 Carregar a chave no agente SSH

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

## 4.3 Ver a chave pública

```bash
cat ~/.ssh/id_ed25519.pub
```

Copiar a linha inteira e adicionar no GitHub.

## 4.4 Onde adicionar no GitHub

Há dois caminhos possíveis:

### Opção A — chave da conta pessoal

GitHub → Settings → SSH and GPG keys

### Opção B — Deploy key do repositório

GitHub → Repositório → Settings → Deploy keys

Para produção, o ideal é usar **Deploy Key**, porque dá acesso só a esse repositório.

## 4.5 Testar conexão com GitHub

```bash
ssh -T git@github.com
```

Se estiver tudo certo, a autenticação será confirmada.

## 4.6 Clonar o projeto

Primeiro, entrar na pasta base:

```bash
cd /var/www/fea-dev
```

Depois clonar o repositório:

```bash
git clone URL_SSH_DO_REPOSITORIO
```

---

# 5. Como atualizar o projeto com git pull

## 5.1 Onde rodar

**Sempre rodar dentro da pasta do projeto**:

```bash
cd /var/www/fea-dev/auto-improvement-application
```

## 5.2 Comando

```bash
git pull
```

---

# 6. Variáveis de ambiente do frontend

## 6.1 Arquivo

No frontend, o arquivo usado para produção é:

```txt
apps/frontend/.env.production
```

## 6.2 Valor utilizado neste projeto

```env
VITE_API_URL=/api
```

## 6.3 Por que isso é melhor

O frontend passa a usar a API no mesmo host em que foi aberto.

Exemplo:

- se abrir por IP: `http://IP/api`
- se abrir por domínio: `https://dominio/api`

Assim, não é necessário alterar a URL da API ao trocar de IP para domínio.

---

# 7. Organização das dependências

Neste projeto, frontend e backend possuem dependências próprias.

## 7.1 Frontend

As dependências do frontend devem estar em:

```txt
apps/frontend/package.json
```

## 7.2 Backend

As dependências do backend devem estar em:

```txt
apps/backend/package.json
```

## 7.3 Locks

O ideal é manter os arquivos de lock separados:

```txt
/apps/frontend/package-lock.json
/apps/backend/package-lock.json
```

---

# 8. Deploy do frontend

## 8.1 Onde rodar

**No servidor**, dentro da pasta do frontend:

```bash
cd /var/www/fea-dev/auto-improvement-application/apps/frontend
```

## 8.2 Instalar dependências

```bash
npm install
```

## 8.3 Buildar o frontend

```bash
npm run build
```

## 8.4 Resultado

Os arquivos finais da aplicação React serão gerados em:

```txt
apps/frontend/dist
```

Esses arquivos são os que o Nginx entrega ao navegador.

---

# 9. Deploy do backend

## 9.1 Onde rodar

**No servidor**, dentro da pasta do backend:

```bash
cd /var/www/fea-dev/auto-improvement-application/apps/backend
```

## 9.2 Instalar dependências

```bash
npm install
```

## 9.3 Buildar o backend

```bash
npm run build
```

## 9.4 Rodar migrations

```bash
npm run migration:run
```

## 9.5 Observação sobre migrations

O script de migration deve apontar corretamente para o `data-source.ts`.

A estrutura esperada é:

```bash
typeorm-ts-node-commonjs -d ./src/infrastructure/database/typeorm/data-source.ts migration:run
```

---

# 10. Como subir e manter o backend no ar com PM2

## 10.1 Subir com PM2

**Rodar no servidor**, dentro do backend:

```bash
cd /var/www/fea-dev/auto-improvement-application/apps/backend
pm2 start dist/main.js --name fea-api
```

## 10.2 Salvar o processo

```bash
pm2 save
```

## 10.3 Configurar startup automático

```bash
pm2 startup
```

Esse comando devolverá outro comando. É necessário copiar e executar esse comando também.

Depois, rodar novamente:

```bash
pm2 save
```

## 10.4 Ver status

```bash
pm2 status
```

## 10.5 Ver logs

```bash
pm2 logs fea-api
```

---

# 11. Como testar o backend localmente no servidor

## 11.1 Teste simples

```bash
curl http://127.0.0.1:3000
```

## 11.2 Testar rota específica

Exemplo:

```bash
curl -i -X POST http://127.0.0.1:3000/api/users -H "Content-Type: application/json" -d '{}'
```

---

# 12. Configuração do Nginx

## 12.1 Onde fica o arquivo

No servidor:

```txt
/etc/nginx/sites-available/fea-dev
```

## 12.2 Configuração para uso sem domínio

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    root /var/www/fea-dev/auto-improvement-application/apps/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 12.3 Observação importante

No bloco `/api/`, o `proxy_pass` deve ficar assim:

```nginx
proxy_pass http://127.0.0.1:3000;
```

---

# 13. Como ativar a configuração do Nginx

## 13.1 Criar o link simbólico

```bash
ln -s /etc/nginx/sites-available/fea-dev /etc/nginx/sites-enabled/fea-dev
```

## 13.2 Testar a configuração

```bash
nginx -t
```

## 13.3 Recarregar o Nginx

```bash
systemctl reload nginx
```

---

# 14. Firewall

## 14.1 Liberar Nginx

```bash
ufw allow 'Nginx Full'
ufw status
```

## 14.2 Liberar SSH

```bash
ufw allow OpenSSH
```

---

# 15. Como testar o site sem domínio

Se o DNS ainda não estiver configurado, o site pode ser acessado pelo IP público da VPS.

Exemplo:

```txt
http://5.189.180.87
```

---

# 16. Como mudar para domínio depois

Quando o domínio estiver apontando para a VPS, alterar o `server_name` do Nginx.

## Antes

```nginx
server_name _;
```

## Depois

```nginx
server_name feadev.com.br www.feadev.com.br;
```

Depois rodar:

```bash
nginx -t
systemctl reload nginx
```

---

# 17. HTTPS com Certbot

Só fazer isso depois que o domínio estiver abrindo por HTTP corretamente.

## Onde rodar

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d feadev.com.br -d www.feadev.com.br
```

---

# 18. Como fazer um deploy de rotina daqui para frente

## 18.1 Atualizar código

**No servidor**, na raiz do projeto:

```bash
cd /var/www/fea-dev/auto-improvement-application
git pull
```

## 18.2 Atualizar backend

```bash
cd /var/www/fea-dev/auto-improvement-application/apps/backend
npm install
npm run build
npm run migration:run
pm2 restart fea-api
```

## 18.3 Atualizar frontend

```bash
cd /var/www/fea-dev/auto-improvement-application/apps/frontend
npm install
npm run build
systemctl reload nginx
```

---

# 19. Checklist de deploy

## Backend

- [ ] entrou na pasta correta do backend
- [ ] rodou `npm install`
- [ ] rodou `npm run build`
- [ ] rodou `npm run migration:run`
- [ ] `pm2 status` mostra `fea-api` online

## Frontend

- [ ] entrou na pasta correta do frontend
- [ ] `.env.production` está certo
- [ ] rodou `npm install`
- [ ] rodou `npm run build`
- [ ] `dist` foi gerado

## Nginx

- [ ] `proxy_pass` está sem barra final
- [ ] `nginx -t` passou
- [ ] `systemctl reload nginx` rodou

## Testes

- [ ] site abre pelo IP ou domínio
- [ ] login funciona
- [ ] cadastro funciona
- [ ] rota `/api/users` responde corretamente

---

# 20. Boas práticas de operação

Para manter o deploy estável:

- sempre rodar comandos no diretório correto
- sempre testar `nginx -t` antes de recarregar
- sempre verificar `pm2 status` depois de atualizar o backend
- manter o `.env.production` alinhado com o ambiente de produção
- sempre fazer build do frontend depois de alterar variáveis do Vite
- testar o backend diretamente em `127.0.0.1:3000` quando necessário

---

# 21. Resumo final

Hoje a forma correta de operar o projeto é:

1. entrar no servidor por SSH
2. entrar na pasta do projeto
3. rodar `git pull`
4. rebuildar backend
5. rodar migrations
6. reiniciar backend com PM2
7. rebuildar frontend
8. recarregar Nginx
9. testar site pelo IP ou domínio

Seguindo essa sequência, o deploy do projeto permanece organizado, previsível e mais fácil de manter.
