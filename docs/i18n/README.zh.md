<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React 18" />
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="MIT License" />
</p>

<h1 align="center">🔐 FORMTION</h1>

<p align="center">
  <strong>将Notion页面转变为潜在客户收集工具的最快方式</strong>
</p>

<p align="center">
  内容已经准备好了，现在只需收集潜在客户。
</p>

<p align="center">
  <a href="https://github.com/Hyunki6040/formtion-lead-for-notion">GitHub</a> •
  <a href="#-快速开始">快速开始</a> •
  <a href="#-ec2部署指南">EC2部署</a> •
  <a href="#-使用指南">使用指南</a>
</p>

<p align="center">
  <a href="https://github.com/Hyunki6040/formtion-lead-for-notion/blob/main/README.md">한국어</a> •
  <a href="./README.en.md">English</a> •
  <a href="./README.ja.md">日本語</a> •
  <strong>中文</strong> •
  <a href="./README.es.md">Español</a>
</p>

---

## 🎯 为什么选择FORMTION？

> **「辛苦创作的优质内容，免费公开不觉得可惜吗？」**

博客、指南、模板、研究资料... 在Notion上精心制作的内容。
直接公开虽然能带来流量，但**无法知道谁在阅读。**

FORMTION为你的Notion页面添加**「门禁」**。

```
📄 Notion页面 → 🔒 模糊处理 → 📧 输入邮箱 → ✨ 解锁内容
```

**5分钟**完成潜在客户收集页面，无需编程。

---

## ✨ 主要功能

### 🔒 智能遮罩
只展示部分内容，其余部分模糊处理，激发读者的好奇心。

- **Preview-then-Blur**: 显示顶部内容，模糊其余部分
- **Section Blur**: 仅模糊特定区域
- **Keyword Blackout**: 只隐藏关键词

### 📧 灵活的表单
选择适合你品牌的表单样式。

| 模式 | 描述 | 推荐场景 |
|------|------|----------|
| **Floating CTA** | 底部固定按钮 | 长内容，引导滚动 |
| **Entry Modal** | 页面加载时弹窗 | 高价值内容 |
| **Top/Bottom Form** | 页面内表单 | 自然流程 |

### 🔔 实时通知
潜在客户提交后立即收到通知。

- **Slack** Webhook集成
- **Discord** Webhook集成
- **自定义Webhook** 支持

### 📊 仪表板
一目了然地管理收集的潜在客户。

- 按项目查看潜在客户
- CSV导出
- 详细信息查看

---

## 🚀 快速开始

### 环境要求

- Python 3.11+
- Node.js 18+
- [uv](https://github.com/astral-sh/uv) (Python包管理器)

### 安装

```bash
# 克隆
git clone https://github.com/Hyunki6040/formtion-lead-for-notion.git
cd formtion-lead-for-notion

# 后端设置
cd backend
cp env.template .env
uv sync

# 前端设置
cd ../frontend
npm install
```

### 运行

```bash
# 开发模式（热重载）
./start-dev.sh

# 或生产模式
./start.sh
```

### 访问

| 服务 | URL |
|------|-----|
| 🌐 Web应用 | http://localhost:3000 |
| 📡 API | http://localhost:8000 |
| 📚 API文档 | http://localhost:8000/docs |

---

## 📖 使用指南

### 1️⃣ 创建项目

1. **注册/登录**后进入仪表板
2. 点击**「新建项目」**
3. 输入**Notion公开链接**
   > ⚠️ Notion页面必须处于「发布到网络」状态

### 2️⃣ 配置门禁

```
┌─────────────────────────────────────┐
│  📝 选择UX模式                      │
│  ├── Floating CTA（推荐）          │
│  ├── Entry Modal                    │
│  └── Top/Bottom Form               │
├─────────────────────────────────────┤
│  🔒 遮罩设置                        │
│  ├── 模糊位置: 30%（顶部可见）      │
│  └── 模糊强度: 中等                 │
├─────────────────────────────────────┤
│  📧 收集字段                        │
│  ├── ✅ 邮箱（必填）                │
│  ├── ☐ 姓名                        │
│  ├── ☐ 公司                        │
│  └── ☐ 职位                        │
└─────────────────────────────────────┘
```

### 3️⃣ 分享与发布

保存后分发生成的**分享链接**：

```
https://your-domain.com/v/my-awesome-guide
```

可用于社交媒体、新闻通讯、广告等任何地方。

### 4️⃣ 查看潜在客户

在仪表板实时查看潜在客户，导出为CSV。

---

## 🔔 Webhook设置

### Slack

1. 在Slack创建[Incoming Webhook](https://api.slack.com/messaging/webhooks)
2. 在项目设置中输入Webhook URL
3. 收集潜在客户时自动通知

### Discord

1. 频道设置 → 集成 → 创建Webhook
2. 在项目设置中输入Discord Webhook URL

---

## 🚢 EC2部署指南

### 步骤1: 服务器准备（Ubuntu 22.04）

```bash
# SSH连接
ssh -i your-key.pem ubuntu@your-ec2-ip

# 安装必要软件包
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3.11 python3.11-venv python3-pip sqlite3

# 安装Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装uv
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.bashrc
```

### 步骤2: 克隆与配置

```bash
cd ~
git clone https://github.com/Hyunki6040/formtion-lead-for-notion.git
cd formtion-lead-for-notion

cd backend
cp env.template .env
nano .env  # 必须修改JWT_SECRET_KEY！

uv sync
uv run python migrations.py

cd ../frontend
npm install
echo "VITE_API_URL=https://your-domain.com" > .env.production
npm run build
```

### 步骤3: 注册Systemd服务

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

### 步骤4: 更新部署

```bash
cd ~/formtion-lead-for-notion
./deploy.sh
```

---

## 📄 许可证

MIT License - 自由使用。

---

<p align="center">
  <strong>将内容的价值转化为潜在客户。</strong>
</p>

<p align="center">
  Made with ❤️ by <a href="https://github.com/Hyunki6040/formtion-lead-for-notion">FORMTION Team</a>
</p>
