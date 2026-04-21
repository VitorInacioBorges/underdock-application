# Deploy and Operations Manual — FEA.dev

This document was written to help the student league perform future **FEA.dev** project deployments safely, even without strong experience in code, terminal, or servers.

The goal of this material is to explain:

- how to access the server
- how to clone and update the repository
- how to start the backend, frontend, and database
- how to keep the site running via IP or domain

---

# 1. Architecture Overview

Today the project works as follows:

## 1.1 Frontend

- built with **React + Vite**
- located in:

```txt
apps/frontend
```

- after the build, generates static files in:

```txt
apps/frontend/dist
```

These files are served by **Nginx**.

## 1.2 Backend

- built with **NestJS**
- located in:

```txt
apps/backend
```

- compiled to:

```txt
apps/backend/dist
```

- runs with **PM2**

## 1.3 Database

- database: **PostgreSQL**
- migrations run via the backend

## 1.4 Reverse Proxy

- **Nginx** delivers the frontend
- and forwards `/api/...` calls to the backend

---

# 2. Project Structure on the Server

On the server, the project was placed in:

```txt
/var/www/fea-dev/auto-improvement-application
```

## Important Directories

### Entire project

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

# 3. How to Access the Server

The server is hosted at **Contabo** and runs **Ubuntu**.

Access is made via **SSH**.

## 3.1 What is SSH

SSH is a secure way to open the terminal of another computer over the internet.

Example access:

```bash
ssh root@SERVER_IP
```

### Explanation

- `ssh` = opens the remote connection
- `root` = server administrator user
- `SERVER_IP` = public address of the VPS

## 3.2 Access Command

**Run on your local machine**:

```bash
ssh root@YOUR_CONTABO_IP
```

Example:

```bash
ssh root@5.189.180.87
```

---

# 4. How to Clone the Repository for the First Time

Repository access is via **SSH**.

## 4.1 Generate SSH Key on the Server

**Run on the server**:

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

When asked where to save, press **Enter**.

When asked for a passphrase, you may leave it blank to simplify server usage.

## 4.2 Load the Key into the SSH Agent

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

## 4.3 View the Public Key

```bash
cat ~/.ssh/id_ed25519.pub
```

Copy the entire line and add it to GitHub.

## 4.4 Where to Add on GitHub

There are two possible paths:

### Option A — Personal account key

GitHub → Settings → SSH and GPG keys

### Option B — Repository Deploy Key

GitHub → Repository → Settings → Deploy keys

For production, the ideal is to use a **Deploy Key**, because it grants access only to that repository.

## 4.5 Test Connection with GitHub

```bash
ssh -T git@github.com
```

If everything is correct, the authentication will be confirmed.

## 4.6 Clone the Project

First, navigate to the base directory:

```bash
cd /var/www/fea-dev
```

Then clone the repository:

```bash
git clone SSH_REPOSITORY_URL
```

---

# 5. How to Update the Project with git pull

## 5.1 Where to Run

**Always run inside the project folder**:

```bash
cd /var/www/fea-dev/auto-improvement-application
```

## 5.2 Command

```bash
git pull
```

---

# 6. Frontend Environment Variables

## 6.1 File

In the frontend, the file used for production is:

```txt
apps/frontend/.env.production
```

## 6.2 Value Used in This Project

```env
VITE_API_URL=/api
```

## 6.3 Why This is Better

The frontend will use the API on the same host it was opened from.

Example:

- if opened by IP: `http://IP/api`
- if opened by domain: `https://domain/api`

This way, there is no need to change the API URL when switching from IP to domain.

---

# 7. Dependency Organization

In this project, the frontend and backend have their own dependencies.

## 7.1 Frontend

Frontend dependencies must be in:

```txt
apps/frontend/package.json
```

## 7.2 Backend

Backend dependencies must be in:

```txt
apps/backend/package.json
```

## 7.3 Locks

It is ideal to keep the lock files separate:

```txt
/apps/frontend/package-lock.json
/apps/backend/package-lock.json
```

---

# 8. Frontend Deploy

## 8.1 Where to Run

**On the server**, inside the frontend folder:

```bash
cd /var/www/fea-dev/auto-improvement-application/apps/frontend
```

## 8.2 Install Dependencies

```bash
npm install
```

## 8.3 Build the Frontend

```bash
npm run build
```

## 8.4 Result

The final files of the React application will be generated in:

```txt
apps/frontend/dist
```

These files are what Nginx delivers to the browser.

---

# 9. Backend Deploy

## 9.1 Where to Run

**On the server**, inside the backend folder:

```bash
cd /var/www/fea-dev/auto-improvement-application/apps/backend
```

## 9.2 Install Dependencies

```bash
npm install
```

## 9.3 Build the Backend

```bash
npm run build
```

## 9.4 Run Migrations

```bash
npm run migration:run
```

## 9.5 Note on Migrations

The migration script must correctly point to `data-source.ts`.

The expected structure is:

```bash
typeorm-ts-node-commonjs -d ./src/infrastructure/database/typeorm/data-source.ts migration:run
```

---

# 10. How to Start and Keep the Backend Running with PM2

## 10.1 Start with PM2

**Run on the server**, inside the backend:

```bash
cd /var/www/fea-dev/auto-improvement-application/apps/backend
pm2 start dist/main.js --name fea-api
```

## 10.2 Save the Process

```bash
pm2 save
```

## 10.3 Configure Automatic Startup

```bash
pm2 startup
```

This command will return another command. You need to copy and execute that command as well.

Then run again:

```bash
pm2 save
```

## 10.4 Check Status

```bash
pm2 status
```

## 10.5 View Logs

```bash
pm2 logs fea-api
```

---

# 11. How to Test the Backend Locally on the Server

## 11.1 Simple Test

```bash
curl http://127.0.0.1:3000
```

## 11.2 Test a Specific Route

Example:

```bash
curl -i -X POST http://127.0.0.1:3000/api/users -H "Content-Type: application/json" -d '{}'
```

---

# 12. Nginx Configuration

## 12.1 Where the File Is Located

On the server:

```txt
/etc/nginx/sites-available/fea-dev
```

## 12.2 Configuration for Use Without a Domain

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

## 12.3 Important Note

In the `/api/` block, `proxy_pass` must look like this:

```nginx
proxy_pass http://127.0.0.1:3000;
```

---

# 13. How to Activate the Nginx Configuration

## 13.1 Create the Symbolic Link

```bash
ln -s /etc/nginx/sites-available/fea-dev /etc/nginx/sites-enabled/fea-dev
```

## 13.2 Test the Configuration

```bash
nginx -t
```

## 13.3 Reload Nginx

```bash
systemctl reload nginx
```

---

# 14. Firewall

## 14.1 Allow Nginx

```bash
ufw allow 'Nginx Full'
ufw status
```

## 14.2 Allow SSH

```bash
ufw allow OpenSSH
```

---

# 15. How to Test the Site Without a Domain

If DNS is not yet configured, the site can be accessed via the VPS public IP.

Example:

```txt
http://5.189.180.87
```

---

# 16. How to Switch to a Domain Later

When the domain is pointing to the VPS, change the `server_name` in Nginx.

## Before

```nginx
server_name _;
```

## After

```nginx
server_name feadev.com.br www.feadev.com.br;
```

Then run:

```bash
nginx -t
systemctl reload nginx
```

---

# 17. HTTPS with Certbot

Only do this after the domain is opening correctly over HTTP.

## Where to Run

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d feadev.com.br -d www.feadev.com.br
```

---

# 18. How to Perform a Routine Deploy Going Forward

## 18.1 Update Code

**On the server**, at the project root:

```bash
cd /var/www/fea-dev/auto-improvement-application
git pull
```

## 18.2 Update Backend

```bash
cd /var/www/fea-dev/auto-improvement-application/apps/backend
npm install
npm run build
npm run migration:run
pm2 restart fea-api
```

## 18.3 Update Frontend

```bash
cd /var/www/fea-dev/auto-improvement-application/apps/frontend
npm install
npm run build
systemctl reload nginx
```

---

# 19. Deploy Checklist

## Backend

- [ ] entered the correct backend folder
- [ ] ran `npm install`
- [ ] ran `npm run build`
- [ ] ran `npm run migration:run`
- [ ] `pm2 status` shows `fea-api` as online

## Frontend

- [ ] entered the correct frontend folder
- [ ] `.env.production` is correct
- [ ] ran `npm install`
- [ ] ran `npm run build`
- [ ] `dist` was generated

## Nginx

- [ ] `proxy_pass` has no trailing slash
- [ ] `nginx -t` passed
- [ ] `systemctl reload nginx` ran

## Tests

- [ ] site opens via IP or domain
- [ ] login works
- [ ] registration works
- [ ] route `/api/users` responds correctly

---

# 20. Operations Best Practices

To keep the deploy stable:

- always run commands in the correct directory
- always test `nginx -t` before reloading
- always check `pm2 status` after updating the backend
- keep `.env.production` aligned with the production environment
- always rebuild the frontend after changing Vite variables
- test the backend directly at `127.0.0.1:3000` when needed

---

# 21. Final Summary

The correct way to operate the project today is:

1. access the server via SSH
2. navigate to the project directory
3. run `git pull`
4. rebuild the backend
5. run migrations
6. restart the backend with PM2
7. rebuild the frontend
8. reload Nginx
9. test the site via IP or domain

Following this sequence, the project deploy remains organized, predictable, and easier to maintain.
