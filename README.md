# 智能购物系统（AI 导购全栈电商 Demo）

基于 **Vue 3 + Node.js/Express** 的前后端分离移动端电商应用，覆盖首页智能推荐、商品分类、商品详情、购物车、AI 购物助手、个人中心等核心模块。前端通过 Axios 与后端 RESTful API 交互，后端以规则引擎模拟 AI 导购；购物车与聊天记录通过 localStorage 持久化，并借助浏览器 CustomEvent 实现跨组件全局状态同步。

## ✨ 项目亮点

- **前后端真实交互**：摒弃本地假数据，首页与详情页通过 Axios 向后端 Express 服务请求商品数据渲染，并统一 try-catch 异常捕获。
- **Mock AI 智能导购**：后端用正则从用户输入中提取预算金额、匹配商品分类，筛选符合条件的商品后以 JSON 数组返回；前端聊天气泡之外动态渲染商品卡片，支持快捷加购。
- **低耦合跨组件通信**：底部 Tabbar 在 `App.vue`，加购按钮在子页面；通过 `window.dispatchEvent(new CustomEvent('cart-updated'))` 派发事件，`App.vue` 监听后重读 localStorage 并刷新购物车角标。
- **购物车本地封装**：`utils/cart.js` 统一封装 localStorage 的增删改查，多页面共享同一数据源；后续若切换到 Pinia 或后端接口只需改动这一层。
- **聊天记录持久化**：`watch` 深度监听消息数组变化并序列化存入 localStorage，切换页面或刷新不丢失；提供二次确认的清空记录功能。

## 🧰 技术栈

| 类别 | 技术 |
| :--- | :--- |
| 前端框架 | Vue 3 + Composition API |
| UI 组件库 | Vant 4 |
| 前端路由 | Vue Router 4 |
| 构建工具 | Vite |
| HTTP 请求 | Axios（封装超时控制、全局错误拦截） |
| 后端框架 | Node.js + Express 5 |
| 跨域处理 | CORS 中间件 + Vite devServer proxy |
| 状态 / 本地存储 | localStorage + 浏览器 CustomEvent 自定义事件 |
| AI 能力 | 后端规则引擎模拟 AI（正则提取预算与关键词），前端渲染富文本与商品卡片 |

## 🚀 功能模块

| 模块 | 说明 |
| :--- | :--- |
| 首页 | 请求后端商品数据渲染，提供预算 / 分类 / 数量表单校验，合法后跳转详情推荐 |
| 分类页 | 按分类浏览商品，点击跳转并传参 |
| 详情页 | 接收首页参数，对后端数据二次过滤，可加入购物车 |
| 购物车 | 商品增减、删除、总价计算，角标与全局状态联动 |
| AI 购物助手 | 上下文对话、聊天记录本地持久化与清空、商品卡片快捷加购 |
| 个人中心 | 模拟登录 / 登出并保持状态 |

## 📁 项目结构

```text
.
├── shop-server/               # 后端工程（Node.js + Express）
│   ├── data.js                # 模拟数据库（商品数据）
│   ├── server.js              # Express 入口与 API 接口定义
│   └── package.json
│
└── vite-project/              # 前端工程（Vue 3 + Vite）
    ├── public/                # 纯静态资源
    ├── src/
    │   ├── assets/            # 图片、字体等静态资源
    │   ├── components/        # 全局公共组件
    │   ├── router/index.js     # Vue Router 路由表
    │   ├── utils/
    │   │   ├── cart.js        # 购物车 localStorage 增删改查封装
    │   │   └── ai.js          # AI 请求：Axios 实例与错误拦截
    │   ├── views/
    │   │   ├── Home.vue        # 首页：请求后端数据、表单校验
    │   │   ├── Category.vue    # 分类页
    │   │   ├── Detail.vue      # 详情页：多条件过滤、加入购物车
    │   │   ├── Cart.vue        # 购物车：增减、删除、总价计算
    │   │   ├── AiChat.vue      # AI 购物助手：上下文交互、清空、快捷加购
    │   │   └── Profile.vue     # 个人中心：模拟登录状态
    │   ├── App.vue             # 根组件：底部 Tabbar、全局角标监听
    │   └── main.js            # 前端应用入口
    ├── .env.development
    ├── .env.production
    ├── index.html
    ├── vite.config.js         # 端口 5173 + /api 代理到 3000
    └── package.json
```

## 🏃 本地运行

前后端分离架构，请打开两个终端分别运行。

### 1. 启动后端（先启动）

```bash
cd shop-server
npm install
node server.js
# 看到 🚀 后端服务已启动：http://localhost:3000 即成功
```

### 2. 启动前端

```bash
cd vite-project
npm install
npm run dev
# 看到 Local: http://localhost:5173/ 即成功
```

浏览器访问 <http://localhost:5173/> 即可体验完整功能。

## 🔌 接口清单

| 方法 | 路径 | 说明 |
| :--- | :--- | :--- |
| GET | `/api/products` | 返回完整商品列表 |
| POST | `/api/chat` | 接收用户消息，提取预算与分类，返回回复文案与推荐商品数组 |

## 📌 实现边界与可扩展方向

- 项目中的「AI 导购」目前由后端规则 / 正则逻辑实现，未接入大模型 API；生产环境可平滑替换为向量检索 + 大模型对话接口。
- 商品数据内置在后端 `data.js`，可后续接入真实数据库与用户体系。

## 📄 License

MIT © 林昱宏
