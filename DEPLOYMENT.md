# 📦 部署指南

本指南介绍如何将网站部署到 Vercel + Cloudflare R2。

---

## 方案对比

| 服务 | 免费存储 | 免费流量 | 推荐度 |
|------|---------|---------|--------|
| **Cloudflare R2** | 10GB | 无限 | ⭐⭐⭐⭐⭐ |
| Supabase | 1GB | 2GB/月 | ⭐⭐ |
| Vercel Blob | 500MB | 有限 | ⭐ |

**推荐使用 Cloudflare R2**（零流量费 + 10GB 免费）

---

## 第一步：生成文件索引

在本地运行以下命令，扫描所有 PDF 文件并生成索引：

```bash
cd web
node scripts/generate-index.js
```

这会生成 `data/file-index.json` 文件。

---

## 第二步：上传文件到 Cloudflare R2

### 2.1 创建 Cloudflare 账号并开通 R2

1. 访问 [dash.cloudflare.com](https://dash.cloudflare.com) 并注册/登录
2. 左侧菜单选择 **R2**
3. 点击 **Purchase R2** 开通服务（需要绑定信用卡，但 10GB 内完全免费）

### 2.2 创建 R2 Bucket

1. 点击 **Create bucket**
2. Bucket 名称：`dse-papers`
3. 位置选择：**Asia Pacific (APAC)** （离香港最近）
4. 点击 **Create bucket**

### 2.3 设置公开访问

1. 进入 `dse-papers` bucket
2. 点击 **Settings** 标签
3. 找到 **Public Access** 部分
4. 点击 **Allow Access**
5. 复制生成的公开 URL（格式：`https://pub-xxxxx.r2.dev`）

### 2.4 上传文件

#### 方法一：使用 Wrangler CLI（推荐）

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 批量上传（在 web 目录执行）
wrangler r2 object put dse-papers/dse_past_papers --file=public/dse_past_papers --recursive
```

#### 方法二：使用 Rclone（适合超大文件，更稳定）

```bash
# 安装 rclone (macOS)
brew install rclone

# 配置 Cloudflare R2
rclone config
# 选择 "n" (New remote)
# 名称输入: r2
# 存储类型选择: s3
# Provider 选择: Cloudflare
# 按提示输入 Access Key ID 和 Secret (从 R2 Dashboard 获取)

# 上传文件
rclone copy public/dse_past_papers r2:dse-papers/dse_past_papers --progress
```

#### 方法三：使用 Web 界面（适合测试）

1. 在 R2 Dashboard 点击 `dse-papers`
2. 点击 **Upload**
3. 拖拽文件夹上传（注意：Web 界面对大量文件支持不好，建议用 CLI）

---

## 第三步：重新生成索引（使用 R2 CDN 地址）

使用您的 R2 公开 URL 重新生成索引：

```bash
cd web

# 替换为您的实际 R2 URL
CDN_URL=https://pub-xxxxx.r2.dev/dse_past_papers node scripts/generate-index.js
```

这会将 JSON 中的文件路径更新为 Cloudflare R2 的 CDN 地址。

---

## 第五步：部署到 Vercel

### 5.1 推送代码到 GitHub

```bash
git add .
git commit -m "Prepare for deployment with Supabase Storage"
git push origin main
```

### 5.2 部署到 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 点击 **Import Project**
3. 选择您的 GitHub 仓库 `dsepp`
4. **Root Directory**: 选择 `web`
5. 点击 **Deploy**（无需配置环境变量，因为 CDN URL 已经写入 JSON）

---

## 🎉 完成！

您的网站现在已经部署成功：
- **代码**：托管在 Vercel（免费）
- **文件**：托管在 Cloudflare R2（10GB 免费 + 零流量费）
- **CDN**：Cloudflare 全球加速

这是目前最先进、最经济的架构方案。

---

## 💰 成本估算

- **Vercel**: $0/月（Hobby 计划，完全免费）
- **Cloudflare R2**: 
  - 10GB 存储：**免费**
  - 无限流量：**免费**
  - 超出 10GB 后：$0.015/GB/月

**您的 8GB 文件完全在免费额度内，总成本 = $0/月** 🎉

---

## 🔧 故障排查

### 问题：文件无法下载

1. 检查 R2 Bucket 是否设置为公开访问
2. 检查 `data/file-index.json` 中的 URL 是否正确
3. 在浏览器直接访问 PDF URL 测试

### 问题：上传速度慢

使用 Rclone 并启用多线程：
```bash
rclone copy public/dse_past_papers r2:dse-papers/dse_past_papers --progress --transfers=8
```

