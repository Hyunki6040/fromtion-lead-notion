<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React 18" />
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="MIT License" />
</p>

<h1 align="center">🔐 FORMTION</h1>

<p align="center">
  <strong>Notionページをリード獲得ツールに変える最速の方法</strong>
</p>

<p align="center">
  コンテンツはもうあります。あとはリードを集めるだけ。
</p>

<p align="center">
  <a href="https://github.com/Hyunki6040/formtion-lead-for-notion">GitHub</a> •
  <a href="#-クイックスタート">クイックスタート</a> •
  <a href="#-ec2デプロイガイド">EC2デプロイ</a> •
  <a href="#-使用ガイド">使用ガイド</a>
</p>

<p align="center">
  <a href="https://github.com/Hyunki6040/formtion-lead-for-notion/blob/main/README.md">한국어</a> •
  <a href="./README.en.md">English</a> •
  <strong>日本語</strong> •
  <a href="./README.zh.md">中文</a> •
  <a href="./README.es.md">Español</a>
</p>

---

## 🎯 なぜFORMTIONなのか？

> **「せっかく作った良いコンテンツ、無料で公開するのはもったいなくないですか？」**

ブログ、ガイド、テンプレート、リサーチ資料... Notionで一生懸命作ったコンテンツ。
ただ公開するだけではトラフィックは来ますが、**誰が見ているかわかりません。**

FORMTIONはNotionページに**「ゲート」**を追加します。

```
📄 Notionページ → 🔒 ブラー処理 → 📧 メール入力 → ✨ コンテンツ公開
```

**5分で**リード獲得ページが完成。コーディング不要。

---

## ✨ 主な機能

### 🔒 スマートブラインド
コンテンツの一部だけを見せて、残りをブラー処理。読者の好奇心を刺激します。

- **Preview-then-Blur**: 上部を公開し、残りをブラー
- **Section Blur**: 特定のセクションだけブラー
- **Keyword Blackout**: キーワードだけを隠す

### 📧 柔軟なリードフォーム
ブランドに合ったフォームスタイルを選択。

| パターン | 説明 | 推奨シーン |
|----------|------|------------|
| **Floating CTA** | 下部固定ボタン | 長いコンテンツ、スクロール誘導 |
| **Entry Modal** | ページ読み込み時モーダル | 高価値コンテンツ |
| **Top/Bottom Form** | ページ内フォーム | 自然な流れ |

### 🔔 リアルタイム通知
リードが入ったらすぐに通知を受け取れます。

- **Slack** Webhook連携
- **Discord** Webhook連携
- **カスタムWebhook** サポート

### 📊 ダッシュボード
収集したリードを一目で管理。

- プロジェクト別リード現況
- CSVエクスポート
- 詳細情報確認

---

## 🚀 クイックスタート

### 必要条件

- Python 3.11+
- Node.js 18+
- [uv](https://github.com/astral-sh/uv) (Pythonパッケージマネージャー)

### インストール

```bash
# クローン
git clone https://github.com/Hyunki6040/formtion-lead-for-notion.git
cd formtion-lead-for-notion

# バックエンド設定
cd backend
cp env.template .env
uv sync

# フロントエンド設定
cd ../frontend
npm install
```

### 実行

```bash
# 開発モード（ホットリロード）
./start-dev.sh

# または本番モード
./start.sh
```

### アクセス

| サービス | URL |
|----------|-----|
| 🌐 Webアプリ | http://localhost:3000 |
| 📡 API | http://localhost:8000 |
| 📚 APIドキュメント | http://localhost:8000/docs |

---

## 📖 使用ガイド

### 1️⃣ プロジェクト作成

1. **会員登録/ログイン**後、ダッシュボードにアクセス
2. **「新規プロジェクト」**をクリック
3. **Notion公開リンク**を入力
   > ⚠️ Notionページが「Web公開」状態である必要があります

### 2️⃣ ゲート設定

```
┌─────────────────────────────────────┐
│  📝 UXパターン選択                  │
│  ├── Floating CTA（推奨）          │
│  ├── Entry Modal                    │
│  └── Top/Bottom Form               │
├─────────────────────────────────────┤
│  🔒 ブラインド設定                  │
│  ├── ブラー位置: 30%（上部公開）    │
│  └── ブラー強度: Medium             │
├─────────────────────────────────────┤
│  📧 収集フィールド                  │
│  ├── ✅ メール（必須）              │
│  ├── ☐ 名前                        │
│  ├── ☐ 会社名                      │
│  └── ☐ 役職                        │
└─────────────────────────────────────┘
```

### 3️⃣ 共有・配布

保存後に生成された**共有リンク**を配布：

```
https://your-domain.com/v/my-awesome-guide
```

SNS、ニュースレター、広告など、どこでも活用可能。

### 4️⃣ リード確認

ダッシュボードでリアルタイムにリードを確認し、CSVでエクスポート。

---

## 🔔 Webhook設定

### Slack

1. Slackで[Incoming Webhook](https://api.slack.com/messaging/webhooks)を作成
2. プロジェクト設定でWebhook URLを入力
3. リード収集時に自動通知

### Discord

1. チャンネル設定 → 連携 → Webhook作成
2. プロジェクト設定でDiscord Webhook URLを入力

---

## 🚢 EC2デプロイガイド

### ステップ1: サーバー準備（Ubuntu 22.04）

```bash
# SSH接続
ssh -i your-key.pem ubuntu@your-ec2-ip

# 必須パッケージインストール
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3.11 python3.11-venv python3-pip sqlite3

# Node.js 18インストール
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# uvインストール
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.bashrc
```

### ステップ2: クローンと設定

```bash
cd ~
git clone https://github.com/Hyunki6040/formtion-lead-for-notion.git
cd formtion-lead-for-notion

cd backend
cp env.template .env
nano .env  # JWT_SECRET_KEY変更必須！

uv sync
uv run python migrations.py

cd ../frontend
npm install
echo "VITE_API_URL=https://your-domain.com" > .env.production
npm run build
```

### ステップ3: Systemdサービス登録

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

### ステップ4: アップデートデプロイ

```bash
cd ~/formtion-lead-for-notion
./deploy.sh
```

---

## 📄 ライセンス

MIT License - 自由に使用可能。

---

<p align="center">
  <strong>コンテンツの価値をリードに変えましょう。</strong>
</p>

<p align="center">
  Made with ❤️ by <a href="https://github.com/Hyunki6040/formtion-lead-for-notion">FORMTION Team</a>
</p>
