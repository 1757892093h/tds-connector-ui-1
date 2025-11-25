// 身份管理API服务

import type {
  User,
  GenerateDIDResponse,
  Connector,
  CreateConnectorRequest,
  DataSpace,
} from "@/types/identity";

// API基础URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8085";
const API_PREFIX = "/api/v1";

// 获取认证Token
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

// 通用请求函数
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

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: "An error occurred",
    }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// ==================== 认证相关 API ====================

/**
 * 验证当前Token并获取用户信息
 */
export async function verifyToken(): Promise<User> {
  return apiRequest<User>("/auth/verify");
}

/**
 * 用户登录
 */
export async function login(
  did: string,
  signature: string
): Promise<{ token: string; user: User }> {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ did, signature }),
  });
}

/**
 * 用户注册
 */
export async function register(
  did: string,
  signature: string,
  username?: string,
  email?: string
): Promise<{ token: string; user: User }> {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ did, signature, username, email }),
  });
}

// ==================== DID管理 API ====================

/**
 * 生成新的DID
 */
export async function generateDID(): Promise<GenerateDIDResponse> {
  return apiRequest<GenerateDIDResponse>("/identity/did/generate", {
    method: "POST",
  });
}

/**
 * 注册连接器
 */
export async function registerConnector(
  data: CreateConnectorRequest
): Promise<Connector> {
  return apiRequest<Connector>("/identity/did/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * 获取连接器列表
 * @param dataSpaceId 可选，按数据空间ID过滤
 */
export async function listConnectors(
  dataSpaceId?: string
): Promise<Connector[]> {
  const query = dataSpaceId ? `?data_space_id=${dataSpaceId}` : "";
  return apiRequest<Connector[]>(`/identity/connectors${query}`);
}

/**
 * 获取单个连接器详情
 * @param connectorId 连接器ID
 */
export async function getConnector(connectorId: string): Promise<Connector> {
  return apiRequest<Connector>(`/identity/connectors/${connectorId}`);
}

// ==================== 数据空间 API ====================

/**
 * 获取所有数据空间
 */
export async function listDataSpaces(): Promise<DataSpace[]> {
  // 注意：这个接口可能需要在后端实现，目前先返回模拟数据
  // 如果后端已实现，取消注释下面的代码
  // return apiRequest<DataSpace[]>("/data-spaces");

  // 临时方案：返回固定的数据空间列表
  return Promise.resolve([
    {
      id: "healthcare-space-id",
      code: "healthcare",
      name: "Healthcare Data Space",
      description: "Medical and healthcare data sharing",
    },
    {
      id: "finance-space-id",
      code: "finance",
      name: "Finance Data Space",
      description: "Financial data and transactions",
    },
    {
      id: "mobility-space-id",
      code: "mobility",
      name: "Mobility Data Space",
      description: "Transportation and logistics data",
    },
    {
      id: "energy-space-id",
      code: "energy",
      name: "Energy Data Space",
      description: "Energy consumption and grid data",
    },
  ]);
}

// ==================== 辅助函数 ====================

/**
 * 存储认证Token到LocalStorage
 */
export function saveAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
}

/**
 * 清除认证Token
 */
export function clearAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
}

/**
 * 检查用户是否已认证
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}
