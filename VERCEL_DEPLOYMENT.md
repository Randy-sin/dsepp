# 🚀 Vercel 部署清单

## ⚠️ 部署前必须完成的步骤

### 1. ✅ 确认 R2 文件上传完成
```bash
# 检查上传进度
tail -f /Users/randy/DSEPPWEB/web/scripts/upload-progress.log

# 应该看到类似：
# =========================================
# 上传完成！
# 总计: 2329 个文件
# 成功: 2329 个
# 失败: 0 个
# =========================================
```

### 2. ✅ 重新生成索引文件（使用 R2 CDN URL）
```bash
cd /Users/randy/DSEPPWEB/web

# 使用您的 R2 公开 URL
CDN_URL=https://pub-bff98d8c588c415787d802617e94efc7.r2.dev node scripts/generate-index.js
```

**重要**：这一步会将 `data/file-index.json` 中的所有文件路径从本地路径改为 R2 CDN 地址。

### 3. ✅ 提交更新后的索引文件
```bash
git add data/file-index.json
git commit -m "Update file index with R2 CDN URLs"
git push origin main
```

---

## 🎯 Vercel 部署步骤

### 方法一：通过 Vercel Dashboard（推荐）

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 **"Add New..."** → **"Project"**
   - 选择您的 GitHub 仓库：`Randy-sin/dsepp`

3. **配置项目**
   ```
   Framework Preset: Next.js
   Root Directory: web
   Build Command: npm run build (自动检测)
   Output Directory: .next (自动检测)
   Install Command: npm install (自动检测)
   ```

4. **环境变量**（可选）
   - 不需要配置任何环境变量
   - CDN URL 已经写入 `file-index.json`

5. **部署**
   - 点击 **"Deploy"**
   - 等待 2-3 分钟

---

### 方法二：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 在 web 目录部署
cd /Users/randy/DSEPPWEB/web
vercel --prod
```

---

## 📋 部署后检查清单

### 1. ✅ 测试首页
- 访问您的 Vercel 域名（如 `dsepp.vercel.app`）
- 确认 Landing Page 正常显示
- 点击 "View Interactive Demo" 进入 `/app`

### 2. ✅ 测试文件下载
- 在 `/app` 页面选择任意科目
- 点击任意年份
- 尝试下载一个 PDF 文件
- 确认文件可以正常下载

### 3. ✅ 测试语言切换
- 切换中英文
- 确认界面文字正确切换

### 4. ✅ 测试响应式设计
- 在手机/平板上访问
- 确认布局正常

---

## ⚙️ Vercel 项目设置

### 自动部署
- ✅ 每次 `git push` 到 `main` 分支会自动重新部署
- ✅ Pull Request 会创建预览部署

### 自定义域名（可选）
1. 在 Vercel Dashboard → **Settings** → **Domains**
2. 添加您的域名（如 `dsepp.com`）
3. 按照提示配置 DNS

### 性能优化
Vercel 会自动优化：
- ✅ 图片优化
- ✅ 代码压缩
- ✅ 全球 CDN
- ✅ 自动 HTTPS

---

## 🔍 常见问题

### Q1: 部署失败 - "Build failed"
**原因**：可能是依赖安装失败
**解决**：
```bash
# 本地测试构建
cd /Users/randy/DSEPPWEB/web
npm run build

# 如果本地成功，检查 package.json 是否正确提交
```

### Q2: 文件无法下载 - 404 错误
**原因**：R2 URL 不正确或文件未上传
**解决**：
1. 检查 R2 Bucket 是否设置为公开访问
2. 直接在浏览器访问 R2 URL 测试：
   ```
   https://pub-bff98d8c588c415787d802617e94efc7.r2.dev/dse_past_papers/中國語文/中文/DSE/2024/卷一.pdf
   ```
3. 如果无法访问，重新设置 R2 公开访问

### Q3: 页面显示空白
**原因**：`file-index.json` 路径错误
**解决**：
```bash
# 检查文件是否存在
ls -la /Users/randy/DSEPPWEB/web/data/file-index.json

# 检查内容
head -20 /Users/randy/DSEPPWEB/web/data/file-index.json
```

### Q4: 构建时间过长
**原因**：Next.js 正在优化
**正常**：首次部署需要 2-5 分钟，后续更新 1-2 分钟

---

## 📊 部署后的架构

```
用户浏览器
    ↓
Vercel CDN (全球)
    ↓
Next.js 应用 (Vercel)
    ↓
file-index.json (静态文件)
    ↓
PDF 文件 → Cloudflare R2 (全球 CDN)
```

**优势**：
- ✅ 网站代码：Vercel 全球 CDN
- ✅ PDF 文件：Cloudflare R2 全球 CDN
- ✅ 零流量费用
- ✅ 自动 HTTPS
- ✅ 自动扩展

---

## 🎉 完成！

部署完成后，您将获得：
- 🌐 免费域名：`https://dsepp.vercel.app`
- 🚀 全球 CDN 加速
- 🔒 自动 HTTPS
- 📱 完美响应式设计
- 💰 完全免费（在额度内）

**下一步**：
1. 分享您的网站链接
2. 监控访问量（Vercel Analytics）
3. 根据用户反馈优化

