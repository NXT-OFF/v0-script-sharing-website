#!/bin/bash

# ============================================
# FiveM Hub - Installation Script for Debian 12
# ============================================

set -e

echo "========================================"
echo "FiveM Hub - Installation sur Debian 12"
echo "========================================"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Ce script doit etre execute en tant que root"
    echo "Utilisez: sudo bash install.sh"
    exit 1
fi

# Update system
echo ""
echo "[1/8] Mise a jour du systeme..."
apt update && apt upgrade -y

# Install required packages
echo ""
echo "[2/8] Installation des paquets requis..."
apt install -y curl wget git nginx mariadb-server mariadb-client \
    certbot python3-certbot-nginx ufw

# Install Node.js 20 LTS
echo ""
echo "[3/8] Installation de Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify Node.js installation
node -v
npm -v

# Install PM2 globally
echo ""
echo "[4/8] Installation de PM2..."
npm install -g pm2

# Configure MariaDB
echo ""
echo "[5/8] Configuration de MariaDB..."
systemctl start mariadb
systemctl enable mariadb

# Secure MariaDB installation
echo ""
echo "Configuration de la securite MariaDB..."
echo "Appuyez sur Entree pour le mot de passe root actuel (vide par defaut)"
mysql_secure_installation

# Create database and user
echo ""
echo "Creation de la base de donnees..."
read -p "Nom de la base de donnees [fivem_hub]: " DB_NAME
DB_NAME=${DB_NAME:-fivem_hub}

read -p "Nom d'utilisateur MySQL [fivem_user]: " DB_USER
DB_USER=${DB_USER:-fivem_user}

read -sp "Mot de passe MySQL: " DB_PASS
echo ""

mysql -u root -p <<EOF
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
EOF

echo "Base de donnees creee avec succes!"

# Create application directory
echo ""
echo "[6/8] Configuration du repertoire de l'application..."
APP_DIR="/var/www/fivem-hub"
mkdir -p $APP_DIR
mkdir -p $APP_DIR/uploads
mkdir -p $APP_DIR/uploads/resources
mkdir -p $APP_DIR/uploads/thumbnails

# Clone or copy application files
echo ""
echo "Copiez vos fichiers dans $APP_DIR"
echo "Ou clonez depuis votre repository Git"

# Configure Nginx
echo ""
echo "[7/8] Configuration de Nginx..."
read -p "Nom de domaine (ex: fivemhub.com): " DOMAIN

cat > /etc/nginx/sites-available/fivem-hub <<EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /uploads {
        alias ${APP_DIR}/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    client_max_body_size 100M;
}
EOF

ln -sf /etc/nginx/sites-available/fivem-hub /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx

# Configure firewall
echo ""
echo "[8/8] Configuration du pare-feu..."
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

echo ""
echo "========================================"
echo "Installation terminee!"
echo "========================================"
echo ""
echo "Prochaines etapes:"
echo ""
echo "1. Copiez vos fichiers dans $APP_DIR"
echo ""
echo "2. Creez le fichier .env.local dans $APP_DIR:"
echo "   DATABASE_URL=mysql://${DB_USER}:VOTRE_MOT_DE_PASSE@localhost:3306/${DB_NAME}"
echo "   DISCORD_CLIENT_ID=votre_client_id"
echo "   DISCORD_CLIENT_SECRET=votre_client_secret"
echo "   NEXTAUTH_SECRET=une_cle_secrete_aleatoire"
echo "   NEXTAUTH_URL=https://${DOMAIN}"
echo "   UPLOAD_DIR=${APP_DIR}/uploads"
echo ""
echo "3. Importez le schema de base de donnees:"
echo "   mysql -u ${DB_USER} -p ${DB_NAME} < scripts/database-schema.sql"
echo ""
echo "4. Installez les dependances et buildez:"
echo "   cd $APP_DIR"
echo "   npm install"
echo "   npm run build"
echo ""
echo "5. Demarrez l'application avec PM2:"
echo "   pm2 start npm --name 'fivem-hub' -- start"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "6. Configurez SSL avec Let's Encrypt:"
echo "   certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
echo ""
echo "7. (Optionnel) Installez phpMyAdmin:"
echo "   apt install phpmyadmin"
echo ""
echo "========================================"
