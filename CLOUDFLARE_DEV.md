# Cloudflare 本地开发说明

## 问题

Cloudflare 适配器 (`@astrojs/cloudflare`) 需要 `ASSETS` 绑定来提供静态文件服务。此绑定仅在 Cloudflare Pages 生产环境中可用，**无法通过 `wrangler dev` 在本地模拟**。

## 本地开发选项

### 1. 使用 `astro dev` (仅前端开发)

```bash
bun run dev
```

**限制**: API 路由 (`/api/*`) 不会工作，因为它们需要 Cloudflare Workers 运行时。

**适用场景**:
- 前端 UI 开发
- 样式调整
- 页面布局修改

### 2. 部署到 Cloudflare Pages 测试 (完整功能测试)

```bash
# 构建
bun run build

# 部署到 Cloudflare Pages
npx wrangler pages deploy dist

# 或使用预览分支
npx wrangler pages deploy dist --branch preview
```

**适用场景**:
- 完整功能测试
- API 路由测试
- 数据库集成测试

### 3. 使用 wrangler pages dev (有限支持)

```bash
# 构建
bun run build

# 本地 Pages 开发服务器
bun run dev:cloudflare
```

**限制**: 服务端路由可能不会正确处理。

## 部署到生产

### 1. 构建项目
```bash
bun run build
```

### 2. 部署到 Cloudflare Pages
```bash
# 首次部署
npx wrangler pages deploy dist

# 设置生产环境变量
npx wrangler pages secret put JWT_SECRET
npx wrangler pages secret put AI_GATEWAY_API_KEY
npx wrangler pages secret put UPLOADTHING_TOKEN
```

### 3. 配置域名 (可选)
在 Cloudflare Dashboard 中为你的 Pages 项目配置自定义域名。

## API 路由

部署后，以下 API 路由将可用：

- `/api/auth/register` - 用户注册
- `/api/auth/login` - 用户登录
- `/api/auth/logout` - 用户登出
- `/api/auth/me` - 获取当前用户
- `/api/blogs` - 博客列表/创建
- `/api/blogs/[id]` - 单个博客 CRUD
- `/api/upload` - R2 文件上传
- `/api/upload/[key]` - 删除文件

## 数据库迁移

### 本地开发
```bash
npx wrangler d1 execute wati-astro-db --local --file=migrations/0001_init.sql
```

### 生产环境
```bash
npx wrangler d1 execute wati-astro-db --remote --file=migrations/0001_init.sql
```

## 环境变量

生产环境在 Cloudflare Pages Dashboard 中设置：
- `JWT_SECRET` - JWT 密钥
- `AI_GATEWAY_API_KEY` - AI 网关密钥
- `UPLOADTHING_TOKEN` - UploadThing 令牌

## 绑定

生产环境自动配置以下绑定（在 wrangler.toml 中定义）：
- **DB**: D1 数据库
- **KV**: KV 命名空间（会话缓存）
- **SESSION**: KV 命名空间（Astro 会话）
- **R2**: R2 存储桶（文件上传）
