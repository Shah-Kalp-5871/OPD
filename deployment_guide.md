# MedFlow OPD System: Complete Deployment Guide

This guide documents the exact steps taken to deploy the MedFlow OPD System onto an AlmaLinux VPS. If you ever need to manually set up a server from scratch, follow these instructions step by step.

---

## Phase 1: Server Preparation (Root User)

First, log into your server as the `root` user via SSH.

**1. Create a dedicated deployment user:**
This keeps the app isolated from other services.
```bash
useradd -m -s /bin/bash opd_deploy
passwd opd_deploy
# (Enter a secure password when prompted)
```

**2. Open the firewall for port 8080 (where Nginx will listen):**
```bash
firewall-cmd --zone=public --add-port=8080/tcp --permanent
firewall-cmd --reload
```

**3. Configure SELinux to allow Nginx to act as a reverse proxy:**
*(If this is off, you will get 502 Bad Gateway errors)*
```bash
setsebool -P httpd_can_network_connect 1
```

---

## Phase 2: Database Setup (Root User)

**1. Log into the PostgreSQL console:**
```bash
sudo -u postgres psql
```

**2. Create the production database and user:**
```sql
CREATE DATABASE opd_prod_db;
CREATE USER opd_db_user WITH ENCRYPTED PASSWORD 'kalp.5871';
GRANT ALL PRIVILEGES ON DATABASE opd_prod_db TO opd_db_user;
ALTER DATABASE opd_prod_db OWNER TO opd_db_user;
\q
```

---

## Phase 3: Backend Deployment (Deploy User)

Switch to the newly created deployment user:
```bash
su - opd_deploy
```

**1. Set up SSH Keys for GitHub:**
```bash
ssh-keygen -t ed25519 -C "deploy-key"
# Press Enter for all prompts to use default path and no passphrase

cat ~/.ssh/id_ed25519.pub
```
*(Copy this key and add it to your GitHub Repository Settings -> Deploy Keys)*

**2. Clone the code:**
```bash
git clone git@github.com:Shah-Kalp-5871/OPD.git opd-system
cd opd-system
```

**3. Setup Backend:**
```bash
cd backend
npm install
```

**4. Create Backend `.env` file:**
```bash
nano .env
```
Paste the following:
```env
DATABASE_URL="postgresql://opd_db_user:kalp.5871@localhost:5432/opd_prod_db?schema=public"
JWT_SECRET="YOUR_SUPER_SECRET_KEY"
PORT=5005
```

**5. Database Push, Seed & Build:**
```bash
npx prisma db push
npx prisma db seed
npm run build
```

**6. Start with PM2:**
```bash
pm2 start npm --name "opd-backend" -- run start:prod
```

---

## Phase 4: Frontend Deployment (Deploy User)

**1. Setup Frontend:**
```bash
cd ../frontend
npm install
```

**2. Create Frontend `.env` file:**
```bash
nano .env
```
Paste the following:
```env
NEXT_PUBLIC_API_URL="/api"
PORT=3005
```

**3. Build and Start:**
```bash
npm run build
PORT=3005 pm2 start npm --name "opd-frontend" -- run start
pm2 save
```

---

## Phase 5: Nginx Configuration (Root User)

Switch back to the root user (`exit` out of `opd_deploy`).

**1. Create the Nginx config file:**
```bash
nano /etc/nginx/conf.d/opd.conf
```

**2. Paste the Reverse Proxy configuration:**
```nginx
server {
    listen 8080;
    server_name _;

    # Route /api to the backend
    location /api/ {
        proxy_pass http://localhost:5005/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Route everything else to the frontend
    location / {
        proxy_pass http://localhost:3005;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**3. Restart Nginx:**
```bash
systemctl restart nginx
```

---

## Phase 6: GitHub Actions (CI/CD)

To allow GitHub to automatically SSH into the server and deploy:

**1. Trust the SSH Key (Run as `opd_deploy`):**
```bash
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

**2. Grab the Private Key:**
```bash
cat ~/.ssh/id_ed25519
```

**3. Add Secrets to GitHub:**
Go to GitHub Repository -> Settings -> Secrets and variables -> Actions
- `SERVER_IP`: `187.127.131.26`
- `SERVER_USERNAME`: `opd_deploy`
- `SERVER_SSH_KEY`: *(Paste the private key you just copied)*

**4. Push `.github/workflows/deploy.yml`**
The deployment is now fully automated!
