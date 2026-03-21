# 部署说明

## 当前推荐结构

- 前端主工程：`aether-workspace-ai/`
- 新前端构建产物：`aether-workspace-ai/dist/`
- 旧前端回滚备份：`ai/`
- 后端与静态资源服务：`server.mjs`
- 线上访问链路：`Nginx -> Node(server.mjs) -> /api + 前端静态资源`

当前建议不再把前端单独部署到 Vercel，而是让现有 Node 统一提供：

- React 新前端静态页面
- 登录、声音克隆、豆包助手接口

这样浏览器访问、Cookie 登录态、`/api/*` 同源调用都会更稳定。

---

## 一、前端模式切换

`server.mjs` 现在支持两套前端目录：

- 新前端：`aether-workspace-ai/dist`
- 旧前端：`ai/`

通过环境变量控制：

```bash
FRONTEND_MODE=react
```

或：

```bash
FRONTEND_MODE=legacy
```

说明：

- `react`：优先提供 React 构建产物
- `legacy`：继续提供旧 `ai/` 页面
- 如果指定的目录不存在，`server.mjs` 会自动回退到另一套可用前端

推荐策略：

- 本地迁移验证阶段：先用 `legacy`
- 确认 React 前端可用后：线上改成 `react`
- 如果线上临时回滚：把 `FRONTEND_MODE` 改回 `legacy`，重启 PM2 即可

---

## 二、本地开发方式

### 1. 双进程开发

适合日常改 UI 和联调：

启动后端：

```bash
HOST=127.0.0.1 npm start
```

启动 React 前端：

```bash
cd aether-workspace-ai
npm install
npm run dev
```

打开：

```text
http://127.0.0.1:5173
```

说明：

- React 开发环境会把 `/api/*` 代理到本地 Node
- 这样不用改后端接口路径

### 2. 本地预发布验证

适合验证“真实部署形态”：

先在根目录执行：

```bash
npm run build
```

然后设置：

```bash
FRONTEND_MODE=react
HOST=127.0.0.1 npm start
```

打开：

```text
http://127.0.0.1:3000
```

这时就是：

- Node 提供 React `dist`
- Node 提供 `/api/*`

和线上结构一致。

---

## 三、服务器部署方式

### 1. 服务器准备

- Node.js 18+，建议 Node.js 20+
- Nginx
- PM2

### 2. 代码部署后安装依赖

根目录安装后端依赖：

```bash
npm install
```

前端目录安装依赖：

```bash
cd aether-workspace-ai
npm install
cd ..
```

### 3. 构建新前端

在根目录执行：

```bash
npm run build
```

该命令会执行：

- `aether-workspace-ai` 的 `vite build`
- 产出 `aether-workspace-ai/dist`

### 4. 配置环境变量

至少需要这些：

- `PORT`
- `HOST`
- `FRONTEND_MODE=react`
- `CORS_ALLOW_ORIGIN`
- `APP_LOGIN_PASSWORD`
- `ARK_API_KEY`
- `ALIYUN_API_KEY`
- `VOLCENGINE_APP_KEY`
- `VOLCENGINE_ACCESS_KEY`
- `VOLCENGINE_SPEAKER_ID` 可选

### 5. 启动 Node

```bash
npm start
```

建议用 PM2：

```bash
pm2 start "npm start" --name liangsousou
```

---

## 四、Nginx 结构

Nginx 不再直接提供前端文件，只做反向代理：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

说明：

- 页面静态资源由 Node 提供
- `/api/*` 也由 Node 提供
- 登录 Cookie、前端路由 fallback 都由同一个 Node 服务统一处理

---

## 五、回滚方式

如果新前端上线后需要回滚，不用删 React 工程，也不用恢复旧代码。

只需要：

1. 把环境变量改成：

```bash
FRONTEND_MODE=legacy
```

2. 重启 PM2 / Node

这样服务就会重新从 `ai/` 提供旧前端。

---

## 六、当前状态

当前仓库已经形成：

- React 新前端：`aether-workspace-ai/`
- 旧前端备份：`ai/`
- Node 后端：`server.mjs`

推荐上线步骤：

1. 本地 `npm run build`
2. 本地 `FRONTEND_MODE=react npm start` 验证
3. 服务器构建前端
4. 服务器设置 `FRONTEND_MODE=react`
5. PM2 重启
6. 如有异常，切回 `FRONTEND_MODE=legacy`
