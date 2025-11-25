# 身份管理页面改造说明文档

## 📋 改造概述

本次改造将前端的身份管理页面（Identity & DID Management）与后端API集成，实现了真实数据的加载、显示和操作。

### 主要功能
- ✅ 左侧显示真实的用户身份信息
- ✅ 右侧显示用户创建的连接器列表
- ✅ 添加"创建连接器"功能
- ✅ 支持多个连接器的切换和查看
- ✅ 实时刷新数据

---

## 🗂️ 修改的文件清单

### 1. 新增文件

| 文件路径 | 描述 |
|---------|------|
| `lib/services/identity-service.ts` | 身份管理API服务，封装所有后端API调用 |
| `components/identity/CreateConnectorDialog.tsx` | 创建连接器对话框组件 |
| `components/identity/IdentityTab.tsx.backup` | 原IdentityTab组件的备份 |

### 2. 修改的文件

| 文件路径 | 修改内容 |
|---------|---------|
| `types/identity.ts` | 添加了User、Connector、GenerateDIDResponse等后端数据类型 |
| `components/identity/IdentityTab.tsx` | 完全重写，集成真实API数据 |
| `components/identity/index.ts` | 添加CreateConnectorDialog导出 |
| `.env.local` | 添加API基础URL配置 |

---

## 📁 详细修改说明

### 1. 类型定义 (`types/identity.ts`)

**新增类型：**

```typescript
// 用户信息
export interface User {
  id: string;
  did: string;
  username: string | null;
  email: string | null;
}

// DID生成响应
export interface GenerateDIDResponse {
  did: string;
  publicKey: string;
  privateKey: string;
  didDocument: BackendDIDDocument;
  createdAt: string;
}

// 连接器信息
export interface Connector {
  id: string;
  did: string;
  display_name: string;
  status: string;
  data_space_id: string;
  created_at: string;
  did_document?: BackendDIDDocument;
}

// 创建连接器请求
export interface CreateConnectorRequest {
  did: string;
  display_name: string;
  data_space_id: string;
  did_document: BackendDIDDocument;
}

// 数据空间
export interface DataSpace {
  id: string;
  code: string;
  name: string;
  description: string | null;
}
```

**修改位置：**
- 文件：`D:\wjh\tds-connector-ui\types\identity.ts`
- 行数：第3-67行（在原有代码前插入）

---

### 2. API服务 (`lib/services/identity-service.ts`)

**新增的API函数：**

```typescript
// 认证相关
- verifyToken(): 验证Token并获取用户信息
- login(): 用户登录
- register(): 用户注册

// DID管理
- generateDID(): 生成新DID
- registerConnector(): 注册连接器
- listConnectors(): 获取连接器列表
- getConnector(): 获取单个连接器详情

// 数据空间
- listDataSpaces(): 获取数据空间列表

// 辅助函数
- saveAuthToken(): 存储Token
- clearAuthToken(): 清除Token
- isAuthenticated(): 检查认证状态
```

**API配置：**
- 基础URL: `http://localhost:8085`（可通过环境变量配置）
- API前缀: `/api/v1`
- 认证方式: Bearer Token（从localStorage读取）

**修改位置：**
- 文件：`D:\wjh\tds-connector-ui\lib\services\identity-service.ts`（新建文件）
- 总行数：约180行

---

### 3. 创建连接器对话框 (`components/identity/CreateConnectorDialog.tsx`)

**功能特性：**
- 输入连接器显示名称
- 选择数据空间（Healthcare, Finance, Mobility, Energy）
- 一键生成DID（包含公钥和私钥）
- 显示私钥警告（提醒用户保存）
- 提交创建连接器
- 创建成功后刷新列表

**UI组件：**
- Dialog（对话框容器）
- Input（文本输入框）
- Select（下拉选择器）
- Button（按钮，带加载状态）
- 加载动画（Loader2图标）

**修改位置：**
- 文件：`D:\wjh\tds-connector-ui\components\identity\CreateConnectorDialog.tsx`（新建文件）
- 总行数：约250行

---

### 4. 身份管理页面 (`components/identity/IdentityTab.tsx`)

**核心改动：**

#### 4.1 页面布局
```
┌─────────────────────────────────────────────────────┐
│  顶部操作栏（标题 + 刷新按钮）                         │
├──────────────────────┬──────────────────────────────┤
│  左侧：用户身份        │  右侧：连接器列表              │
│  - DID               │  - 创建按钮                   │
│  - Username          │  - 连接器切换按钮              │
│  - Email             │  - 选中的连接器详情            │
│  - 验证状态           │  - DID文档（可视化/JSON）      │
└──────────────────────┴──────────────────────────────┘
```

#### 4.2 数据加载流程
```
用户访问页面
    ↓
加载用户信息 (verifyToken)
    ↓
加载连接器列表 (listConnectors)
    ↓
自动选择第一个连接器
    ↓
显示选中连接器的DID文档
```

#### 4.3 主要功能

**左侧 - 用户身份：**
- 显示用户DID
- 显示用户名（如果有）
- 显示邮箱（如果有）
- 显示验证状态（已验证图标）
- 支持复制DID到剪贴板

**右侧 - 连接器列表：**
- 显示连接器数量
- "创建连接器"按钮
- 连接器切换按钮（多个连接器时显示）
- 选中连接器的详细信息：
  - DID
  - 状态（registered/pending）
  - 创建时间
  - DID文档（支持可视化和JSON视图切换）

**顶部操作：**
- 刷新按钮（重新加载用户和连接器数据）
- 加载动画（刷新时显示）

#### 4.4 状态管理
```typescript
const [user, setUser] = useState<UserType | null>(null);
const [connectors, setConnectors] = useState<Connector[]>([]);
const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
const [isLoadingUser, setIsLoadingUser] = useState(true);
const [isLoadingConnectors, setIsLoadingConnectors] = useState(true);
const [didViewMode, setDidViewMode] = useState<"visual" | "json">("visual");
const [createDialogOpen, setCreateDialogOpen] = useState(false);
```

**修改位置：**
- 文件：`D:\wjh\tds-connector-ui\components\identity\IdentityTab.tsx`（完全重写）
- 原文件备份：`D:\wjh\tds-connector-ui\components\identity\IdentityTab.tsx.backup`
- 总行数：约700行

---

### 5. 环境配置 (`.env.local`)

**添加的配置：**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8085
```

**说明：**
- `NEXT_PUBLIC_` 前缀使得该环境变量可以在客户端访问
- 默认值为 `http://localhost:8085`（后端服务地址）
- 修改此值可切换到不同的后端环境

**修改位置：**
- 文件：`D:\wjh\tds-connector-ui\.env.local`
- 新增：第2行

---

## 🚀 使用指南

### 1. 启动后端服务

```bash
# 进入后端项目目录
cd D:\wjh\tds-connector-ui-backend

# 激活虚拟环境
conda activate tds-backend

# 启动服务器
uvicorn app.main:app --reload --host 0.0.0.0 --port 8085
```

**确认后端运行：**
- 访问 http://localhost:8085/docs 查看API文档
- 确认状态码200

### 2. 启动前端服务

```bash
# 进入前端项目目录
cd D:\wjh\tds-connector-ui

# 安装依赖（如果还没安装）
pnpm install

# 启动开发服务器
pnpm dev
```

**访问前端：**
- 默认地址：http://localhost:3000

### 3. 使用流程

#### 3.1 用户注册/登录
1. 访问注册页面 (`/auth/register`)
2. 输入DID和签名（后端会生成Token）
3. 登录成功后自动跳转到身份管理页面 (`/identity`)

#### 3.2 查看用户身份
- 登录后自动加载用户DID信息
- 左侧卡片显示用户身份详情

#### 3.3 创建连接器
1. 点击右侧"Create"按钮
2. 输入连接器显示名称（如：`My Healthcare Connector`）
3. 选择数据空间（如：`Healthcare Data Space`）
4. 点击"Generate DID"生成新DID
5. **重要**：复制并保存显示的私钥
6. 点击"Create Connector"完成创建
7. 创建成功后，连接器自动出现在列表中

#### 3.4 查看连接器详情
- 点击连接器按钮切换选中的连接器
- 查看连接器的DID、状态、创建时间
- 切换"可视化"和"JSON"视图查看DID文档

#### 3.5 刷新数据
- 点击右上角"Refresh"按钮重新加载所有数据

---

## 🎨 UI/UX改进

### 1. 加载状态
- 数据加载时显示骨架屏（Skeleton）
- 按钮操作时显示加载动画
- 刷新按钮旋转动画

### 2. 空状态处理
- 无连接器时显示空状态提示
- 提供"创建第一个连接器"快捷按钮

### 3. 错误处理
- API调用失败时显示Toast错误提示
- 表单验证（必填项检查）
- 网络错误友好提示

### 4. 交互优化
- 复制DID到剪贴板（带成功提示）
- 连接器切换平滑过渡
- 对话框打开/关闭动画
- 按钮禁用状态（避免重复提交）

---

## 🔧 技术细节

### 1. API调用封装

**通用请求函数：**
```typescript
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${API_PREFIX}${endpoint}`, {
    ...options,
    headers,
  });

  // 错误处理
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: "An error occurred",
    }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}
```

**优点：**
- 统一的错误处理
- 自动附加Authorization头
- TypeScript类型安全
- 可复用

### 2. 状态管理策略

**数据流：**
```
API Service → Component State → UI Render
     ↑              ↓
     └──────── User Action
```

**特点：**
- 使用React Hooks（useState, useEffect）
- 本地状态管理（不使用全局状态）
- 数据缓存在组件内
- 手动刷新机制

### 3. 组件设计模式

**IdentityTab（容器组件）：**
- 负责数据获取
- 管理状态
- 处理用户交互
- 渲染子组件

**CreateConnectorDialog（展示组件）：**
- 受控组件（通过props控制）
- 回调函数通知父组件
- 内部状态独立
- 关闭时重置状态

**DIDDocumentVisualView（纯展示组件）：**
- 接收数据props
- 无内部状态
- 可复用

---

## 🐛 常见问题与解决

### 1. 无法加载用户数据

**症状：**
- 页面显示"Failed to load user data"
- 控制台显示401错误

**原因：**
- Token无效或过期
- 未登录

**解决方案：**
```bash
# 重新登录
# 清除浏览器LocalStorage中的auth_token
localStorage.removeItem('auth_token');
# 跳转到登录页
```

### 2. 创建连接器失败

**症状：**
- 点击"Create Connector"后显示错误
- 控制台显示404或400错误

**原因：**
- 数据空间ID不存在
- 必填字段未填写
- 后端服务未启动

**解决方案：**
```bash
# 1. 确认后端服务正常运行
curl http://localhost:8085/api/v1/identity/did/generate

# 2. 检查控制台错误信息
# 3. 确认所有表单字段已填写
```

### 3. CORS跨域错误

**症状：**
- 控制台显示"CORS policy"错误
- API请求被浏览器拦截

**原因：**
- 后端未配置CORS
- 前后端端口不同

**解决方案：**
后端添加CORS配置（后端代码）：
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 4. 环境变量未生效

**症状：**
- API请求发送到错误的URL
- 显示undefined

**原因：**
- 环境变量未设置NEXT_PUBLIC_前缀
- 修改.env.local后未重启服务

**解决方案：**
```bash
# 1. 确认.env.local中有正确的配置
cat .env.local

# 2. 重启开发服务器
# 按 Ctrl+C 停止
pnpm dev
```

---

## 📊 API端点映射表

| 前端功能 | API端点 | 方法 | 说明 |
|---------|---------|------|------|
| 加载用户信息 | `/api/v1/auth/verify` | GET | 验证Token并返回用户信息 |
| 生成DID | `/api/v1/identity/did/generate` | POST | 生成新的DID和密钥对 |
| 创建连接器 | `/api/v1/identity/did/register` | POST | 注册新连接器 |
| 获取连接器列表 | `/api/v1/identity/connectors` | GET | 获取当前用户的所有连接器 |
| 获取数据空间列表 | (前端模拟数据) | - | 临时返回固定列表 |

---

## 🔐 安全注意事项

### 1. 私钥管理
- ⚠️ 私钥在创建连接器时显示一次
- ⚠️ 用户必须手动保存私钥
- ⚠️ 前端不会存储私钥
- ⚠️ 丢失私钥将无法恢复

**建议：**
- 提示用户将私钥保存到安全位置
- 可以添加"下载私钥"功能
- 考虑使用加密存储

### 2. Token存储
- 当前存储在LocalStorage
- 浏览器关闭后不会清除
- 有XSS风险

**建议：**
- 生产环境考虑使用HttpOnly Cookie
- 实现Token刷新机制
- 添加Token过期时间显示

### 3. API调用安全
- 所有需要认证的请求都附带Token
- Token格式：`Bearer {token}`
- 401错误时自动跳转登录

---

## 📈 性能优化

### 1. 已实现的优化
- 懒加载组件（Suspense）
- 骨架屏占位
- 防止重复请求（isLoading标志）
- 条件渲染（避免无用渲染）

### 2. 可进一步优化
- 添加数据缓存（React Query）
- 实现虚拟列表（大量连接器时）
- 图片懒加载
- 代码分割

---

## 🧪 测试建议

### 1. 功能测试
- [ ] 用户登录后能看到真实DID
- [ ] 创建连接器流程完整
- [ ] 连接器列表正确显示
- [ ] 切换连接器功能正常
- [ ] DID文档可视化/JSON切换
- [ ] 复制功能正常
- [ ] 刷新功能正常

### 2. 边界测试
- [ ] 无连接器时显示空状态
- [ ] 只有一个连接器时正常显示
- [ ] 多个连接器切换正常
- [ ] API失败时错误提示
- [ ] 网络断开时的处理

### 3. UI测试
- [ ] 响应式布局（手机/平板/桌面）
- [ ] 加载动画显示
- [ ] 按钮禁用状态
- [ ] Toast提示显示
- [ ] 对话框打开/关闭动画

---

## 📝 后续改进建议

### 1. 功能增强
- [ ] 编辑连接器信息
- [ ] 删除连接器
- [ ] 导出DID文档（PDF/JSON）
- [ ] 连接器状态切换
- [ ] 批量操作

### 2. 用户体验
- [ ] 搜索和过滤连接器
- [ ] 连接器排序
- [ ] 数据导出功能
- [ ] 操作历史记录
- [ ] 快捷键支持

### 3. 数据管理
- [ ] 接入React Query（缓存、自动刷新）
- [ ] 实现乐观更新
- [ ] 离线支持
- [ ] 数据同步状态显示

### 4. 安全性
- [ ] 实现Token自动刷新
- [ ] 添加二次确认（删除操作）
- [ ] 私钥加密存储方案
- [ ] 操作审计日志

---

## 📚 相关文档

- [后端API文档](http://localhost:8085/docs)
- [Next.js文档](https://nextjs.org/docs)
- [shadcn/ui组件](https://ui.shadcn.com)
- [React Hook文档](https://react.dev/reference/react)

---

## 👥 联系方式

如有问题或建议，请联系开发团队。

---

**最后更新时间**: 2025-11-25
**版本**: v1.0.0
