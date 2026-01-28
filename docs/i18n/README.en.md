<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React 18" />
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="MIT License" />
</p>

<h1 align="center">🔐 FORMTION</h1>

<p align="center">
  <strong>The fastest way to turn your Notion pages into lead generation tools</strong>
</p>

<p align="center">
  You already have the content. Now just collect the leads.
</p>

<p align="center">
  <a href="https://github.com/Hyunki6040/formtion-lead-for-notion">GitHub</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-ec2-deployment-guide">EC2 Deployment</a> •
  <a href="#-user-guide">User Guide</a>
</p>

<p align="center">
  <a href="https://github.com/Hyunki6040/formtion-lead-for-notion/blob/main/README.md">한국어</a> •
  <strong>English</strong> •
  <a href="./README.ja.md">日本語</a> •
  <a href="./README.zh.md">中文</a> •
  <a href="./README.es.md">Español</a>
</p>

---

## 🎯 Why FORMTION?

> **"You created great content, but isn't it a waste to just give it away for free?"**

Blogs, guides, templates, research materials... Content you worked hard to create in Notion.
If you just publish it, you get traffic, but **you have no idea who's reading it.**

FORMTION adds a **"gate"** to your Notion pages.

```
📄 Notion Page → 🔒 Blur Effect → 📧 Email Input → ✨ Content Unlocked
```

**Build a lead capture page in 5 minutes.** No coding required.

---

## ✨ Key Features

### 🔒 Smart Blinding
Show part of your content and blur the rest. Spark your readers' curiosity.

- **Preview-then-Blur**: Show the top portion, blur the rest
- **Section Blur**: Blur specific sections only
- **Keyword Blackout**: Hide only key terms

### 📧 Flexible Lead Forms
Choose a form style that matches your brand.

| Pattern | Description | Best For |
|---------|-------------|----------|
| **Floating CTA** | Fixed bottom button | Long content, scroll engagement |
| **Entry Modal** | Modal on page load | High-value content |
| **Top/Bottom Form** | In-page form | Natural flow |

### 🔔 Real-time Notifications
Get notified instantly when leads come in.

- **Slack** webhook integration
- **Discord** webhook integration
- **Custom Webhook** support

### 📊 Dashboard
Manage collected leads at a glance.

- Project-based lead tracking
- CSV export
- Detailed information view

---

## 🚀 Quick Start

### Requirements

- Python 3.11+
- Node.js 18+
- [uv](https://github.com/astral-sh/uv) (Python package manager)

### Installation

```bash
# Clone
git clone https://github.com/Hyunki6040/formtion-lead-for-notion.git
cd formtion-lead-for-notion

# Backend setup
cd backend
cp env.template .env
uv sync

# Frontend setup
cd ../frontend
npm install
```

### Run

```bash
# Development mode (hot reload)
./start-dev.sh

# Or production mode
./start.sh
```

### Access

| Service | URL |
|---------|-----|
| 🌐 Web App | http://localhost:3000 |
| 📡 API | http://localhost:8000 |
| 📚 API Docs | http://localhost:8000/docs |

---

## 📖 User Guide

### 1️⃣ Create a Project

1. **Sign up/Login** and access the dashboard
2. Click **"New Project"**
3. Enter your **Notion public link**
   > ⚠️ The Notion page must be "Published to web"

### 2️⃣ Configure the Gate

```
┌─────────────────────────────────────┐
│  📝 Select UX Pattern               │
│  ├── Floating CTA (Recommended)     │
│  ├── Entry Modal                    │
│  └── Top/Bottom Form                │
├─────────────────────────────────────┤
│  🔒 Blind Settings                  │
│  ├── Blur Position: 30% (top open)  │
│  └── Blur Intensity: Medium         │
├─────────────────────────────────────┤
│  📧 Collection Fields               │
│  ├── ✅ Email (required)            │
│  ├── ☐ Name                         │
│  ├── ☐ Company                      │
│  └── ☐ Role                         │
└─────────────────────────────────────┘
```

### 3️⃣ Share & Distribute

Share the generated **public link** after saving:

```
https://your-domain.com/v/my-awesome-guide
```

Use it anywhere - social media, newsletters, ads.

### 4️⃣ Check Leads

View leads in real-time on the dashboard and export to CSV.

---

## 🔔 Webhook Setup

### Slack

1. Create an [Incoming Webhook](https://api.slack.com/messaging/webhooks) in Slack
2. Enter the Webhook URL in project settings
3. Get automatic notifications when leads are captured

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "company": "Startup Inc",
  "project": "Marketing Guide"
}
```

### Discord

1. Channel Settings → Integrations → Create Webhook
2. Enter the Discord Webhook URL in project settings

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                        Frontend                          │
│   React 18 + TypeScript + Tailwind CSS + Vite           │
└──────────────────────────┬───────────────────────────────┘
                           │ REST API
┌──────────────────────────▼───────────────────────────────┐
│                        Backend                           │
│   FastAPI + SQLAlchemy + JWT Auth                       │
└──────────────────────────┬───────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────┐
│                       Database                           │
│   SQLite (dev) / PostgreSQL (production recommended)    │
└──────────────────────────────────────────────────────────┘
```

### Project Structure

```
formtion-lead-for-notion/
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Config, security, DB
│   │   ├── models/       # Data models
│   │   ├── schemas/      # Request/response schemas
│   │   └── services/     # Business logic
│   └── migrations.py     # DB migrations
│
├── frontend/
│   └── src/
│       ├── components/   # UI components
│       ├── pages/        # Pages
│       ├── contexts/     # State management
│       └── lib/          # Utilities
│
├── deploy.sh             # Deployment script
└── docs/prd/             # Product docs
```

---

## 🚢 EC2 Deployment Guide

### Step 1: Server Setup (Ubuntu 22.04)

```bash
# SSH connection
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install required packages
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3.11 python3.11-venv python3-pip sqlite3

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install uv (Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.bashrc
```

### Step 2: Clone and Configure

```bash
cd ~
git clone https://github.com/Hyunki6040/formtion-lead-for-notion.git
cd formtion-lead-for-notion

# Backend setup
cd backend
cp env.template .env
nano .env  # Change JWT_SECRET_KEY!
```

**.env configuration:**
```env
JWT_SECRET_KEY=your-super-secret-key-change-this
DATABASE_URL=sqlite+aiosqlite:///./formtion.db
CORS_ORIGINS=["https://your-domain.com"]
```

```bash
# Install dependencies and run migrations
uv sync
uv run python migrations.py

# Build frontend
cd ../frontend
npm install
echo "VITE_API_URL=https://your-domain.com" > .env.production
npm run build
```

### Step 3: Register Systemd Service

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

# Check status
sudo systemctl status formtion-api
```

### Step 4: Setup deploy.sh

```bash
cd ~/formtion-lead-for-notion
chmod +x deploy.sh
```

### Step 5: Deploy Updates

After code changes:

```bash
cd ~/formtion-lead-for-notion
./deploy.sh
```

### Step 6: Nginx Integration (Optional)

If you have a separate Nginx server, configure proxy:

```nginx
# API proxy
location /api {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

# Frontend static files
location / {
    root /home/ubuntu/formtion-lead-for-notion/frontend/dist;
    try_files $uri $uri/ /index.html;
}
```

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

```env
# Required - must change!
JWT_SECRET_KEY=your-super-secret-key-change-this

# Database
DATABASE_URL=sqlite+aiosqlite:///./formtion.db

# CORS (frontend domains)
CORS_ORIGINS=["http://localhost:3000","https://your-domain.com"]
```

### Frontend (`frontend/.env.production`)

```env
VITE_API_URL=https://your-domain.com
```

---

## 📦 DB Migrations

Use the migration script for schema changes:

```bash
cd backend
uv run python migrations.py
```

**Example output:**
```
[DB] /path/to/formtion.db
[TIME] 2024-01-15T10:30:00
--------------------------------------------------
[RUN] 001_add_bookmarks_name_column - Add custom name column to bookmarks
[OK] 001_add_bookmarks_name_column - Complete
--------------------------------------------------
[DONE] Applied: 1, Skipped: 0
```

**Adding new migrations:**

Add to the `MIGRATIONS` array in `backend/migrations.py`:

```python
{
    "name": "002_add_new_column",
    "description": "Add new column",
    "sql": "ALTER TABLE table_name ADD COLUMN column_name VARCHAR(100)",
    "check": lambda conn: column_exists(conn, "table_name", "column_name"),
},
```

---

## 🤝 Contributing

Issues and PRs are welcome!

1. Fork
2. Feature branch (`git checkout -b feature/amazing`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Pull Request

---

## 📄 License

MIT License - Use freely.

---

<p align="center">
  <strong>Turn your content's value into leads.</strong>
</p>

<p align="center">
  Made with ❤️ by <a href="https://github.com/Hyunki6040/formtion-lead-for-notion">FORMTION Team</a>
</p>
