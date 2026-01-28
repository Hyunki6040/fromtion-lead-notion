<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React 18" />
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="MIT License" />
</p>

<h1 align="center">🔐 FORMTION</h1>

<p align="center">
  <strong>La forma más rápida de convertir tus páginas de Notion en herramientas de captación de leads</strong>
</p>

<p align="center">
  Ya tienes el contenido. Ahora solo captura los leads.
</p>

<p align="center">
  <a href="https://github.com/Hyunki6040/formtion-lead-for-notion">GitHub</a> •
  <a href="#-inicio-rápido">Inicio Rápido</a> •
  <a href="#-guía-de-despliegue-en-ec2">Despliegue EC2</a> •
  <a href="#-guía-de-uso">Guía de Uso</a>
</p>

<p align="center">
  <a href="https://github.com/Hyunki6040/formtion-lead-for-notion/blob/main/README.md">한국어</a> •
  <a href="./README.en.md">English</a> •
  <a href="./README.ja.md">日本語</a> •
  <a href="./README.zh.md">中文</a> •
  <strong>Español</strong>
</p>

---

## 🎯 ¿Por qué FORMTION?

> **"¿Creaste contenido increíble y lo vas a regalar así nomás?"**

Blogs, guías, plantillas, materiales de investigación... Contenido que creaste con esfuerzo en Notion.
Si solo lo publicas, obtienes tráfico, pero **no sabes quién lo está leyendo.**

FORMTION añade una **"puerta"** a tus páginas de Notion.

```
📄 Página Notion → 🔒 Efecto Blur → 📧 Ingreso Email → ✨ Contenido Desbloqueado
```

**Crea una página de captación de leads en 5 minutos.** Sin código.

---

## ✨ Características Principales

### 🔒 Bloqueo Inteligente
Muestra parte del contenido y difumina el resto. Despierta la curiosidad de tus lectores.

- **Preview-then-Blur**: Muestra la parte superior, difumina el resto
- **Section Blur**: Difumina solo secciones específicas
- **Keyword Blackout**: Oculta solo palabras clave

### 📧 Formularios Flexibles
Elige un estilo de formulario que se adapte a tu marca.

| Patrón | Descripción | Mejor Para |
|--------|-------------|------------|
| **Floating CTA** | Botón fijo inferior | Contenido largo, engagement |
| **Entry Modal** | Modal al cargar | Contenido de alto valor |
| **Top/Bottom Form** | Formulario en página | Flujo natural |

### 🔔 Notificaciones en Tiempo Real
Recibe notificaciones instantáneas cuando lleguen leads.

- Integración con **Slack** webhook
- Integración con **Discord** webhook
- Soporte para **Webhook personalizado**

### 📊 Panel de Control
Gestiona los leads recopilados de un vistazo.

- Seguimiento de leads por proyecto
- Exportación a CSV
- Vista de información detallada

---

## 🚀 Inicio Rápido

### Requisitos

- Python 3.11+
- Node.js 18+
- [uv](https://github.com/astral-sh/uv) (gestor de paquetes Python)

### Instalación

```bash
# Clonar
git clone https://github.com/Hyunki6040/formtion-lead-for-notion.git
cd formtion-lead-for-notion

# Configuración del backend
cd backend
cp env.template .env
uv sync

# Configuración del frontend
cd ../frontend
npm install
```

### Ejecutar

```bash
# Modo desarrollo (hot reload)
./start-dev.sh

# O modo producción
./start.sh
```

### Acceso

| Servicio | URL |
|----------|-----|
| 🌐 App Web | http://localhost:3000 |
| 📡 API | http://localhost:8000 |
| 📚 Docs API | http://localhost:8000/docs |

---

## 📖 Guía de Uso

### 1️⃣ Crear un Proyecto

1. **Regístrate/Inicia sesión** y accede al panel
2. Haz clic en **"Nuevo Proyecto"**
3. Ingresa tu **enlace público de Notion**
   > ⚠️ La página de Notion debe estar "Publicada en la web"

### 2️⃣ Configurar la Puerta

```
┌─────────────────────────────────────┐
│  📝 Seleccionar Patrón UX           │
│  ├── Floating CTA (Recomendado)     │
│  ├── Entry Modal                    │
│  └── Top/Bottom Form                │
├─────────────────────────────────────┤
│  🔒 Configuración de Blur           │
│  ├── Posición: 30% (arriba visible) │
│  └── Intensidad: Media              │
├─────────────────────────────────────┤
│  📧 Campos a Recopilar              │
│  ├── ✅ Email (requerido)           │
│  ├── ☐ Nombre                       │
│  ├── ☐ Empresa                      │
│  └── ☐ Cargo                        │
└─────────────────────────────────────┘
```

### 3️⃣ Compartir y Distribuir

Comparte el **enlace público** generado después de guardar:

```
https://tu-dominio.com/v/mi-guia-increible
```

Úsalo en cualquier lugar: redes sociales, newsletters, anuncios.

### 4️⃣ Revisar Leads

Ve los leads en tiempo real en el panel y expórtalos a CSV.

---

## 🔔 Configuración de Webhooks

### Slack

1. Crea un [Incoming Webhook](https://api.slack.com/messaging/webhooks) en Slack
2. Ingresa la URL del Webhook en la configuración del proyecto
3. Recibe notificaciones automáticas cuando se capturen leads

### Discord

1. Configuración del Canal → Integraciones → Crear Webhook
2. Ingresa la URL del Webhook de Discord en la configuración del proyecto

---

## 🚢 Guía de Despliegue en EC2

### Paso 1: Preparar el Servidor (Ubuntu 22.04)

```bash
# Conexión SSH
ssh -i tu-clave.pem ubuntu@tu-ip-ec2

# Instalar paquetes requeridos
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3.11 python3.11-venv python3-pip sqlite3

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar uv
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.bashrc
```

### Paso 2: Clonar y Configurar

```bash
cd ~
git clone https://github.com/Hyunki6040/formtion-lead-for-notion.git
cd formtion-lead-for-notion

cd backend
cp env.template .env
nano .env  # ¡Cambiar JWT_SECRET_KEY!

uv sync
uv run python migrations.py

cd ../frontend
npm install
echo "VITE_API_URL=https://tu-dominio.com" > .env.production
npm run build
```

### Paso 3: Registrar Servicio Systemd

```bash
sudo nano /etc/systemd/system/formtion-api.service
```

```ini
[Unit]
Description=FORMTION API
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/formtion-lead-for-notion/backend
Environment="PATH=/home/ubuntu/.local/bin:/usr/bin"
ExecStart=/home/ubuntu/.local/bin/uv run uvicorn app.main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable formtion-api
sudo systemctl start formtion-api
```

### Paso 4: Desplegar Actualizaciones

```bash
cd ~/formtion-lead-for-notion
./deploy.sh
```

---

## 📄 Licencia

MIT License - Úsalo libremente.

---

<p align="center">
  <strong>Convierte el valor de tu contenido en leads.</strong>
</p>

<p align="center">
  Hecho con ❤️ por <a href="https://github.com/Hyunki6040/formtion-lead-for-notion">FORMTION Team</a>
</p>
