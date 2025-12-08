// 数据请求 API 服务

import type { DataRequest } from "@/types/data-offering";

// API基础URL - 使用 Next.js rewrite 代理路径，避免 CORS 问题
const API_PREFIX = "/tdsc/api/v1";

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

  const response = await fetch(`${API_PREFIX}${endpoint}`, {
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

// ==================== 数据请求 API ====================

/**
 * 后端返回的数据请求格式（snake_case）
 */
interface BackendDataRequest {
  id: string;
  data_offering_id: string;
  consumer_connector_id: string;
  purpose: string;
  access_mode: "api" | "download";
  status: string;
  created_at: string;
  updated_at: string | null;
}

/**
 * 转换后端格式到前端格式
 */
function transformDataRequest(backend: BackendDataRequest): DataRequest {
  return {
    id: backend.id,
    dataOfferingId: backend.data_offering_id,
    consumerConnectorId: backend.consumer_connector_id,
    purpose: backend.purpose,
    accessMode: backend.access_mode,
    status: backend.status as DataRequest["status"],
    createdAt: backend.created_at,
    updatedAt: backend.updated_at || undefined,
  };
}

/**
 * 创建数据访问请求（消费者发起）
 */
export interface CreateDataRequestRequest {
  data_offering_id: string;
  consumer_connector_id: string;
  purpose: string;
  access_mode: "api" | "download";
}

export async function createDataRequest(
  data: CreateDataRequestRequest
): Promise<DataRequest> {
  const result = await apiRequest<BackendDataRequest>("/data-requests", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return transformDataRequest(result);
}

/**
 * 列出数据请求
 * @param connectorId 可选，连接器ID
 * @param role 可选，"consumer" 或 "provider"
 * @param status 可选，状态过滤
 */
export async function listDataRequests(
  connectorId?: string,
  role?: "consumer" | "provider",
  status?: string
): Promise<DataRequest[]> {
  const params = new URLSearchParams();
  if (connectorId) params.append("connector_id", connectorId);
  if (role) params.append("role", role);
  if (status) params.append("status", status);

  const query = params.toString();
  const results = await apiRequest<BackendDataRequest[]>(
    `/data-requests${query ? `?${query}` : ""}`
  );
  return results.map(transformDataRequest);
}

/**
 * 获取数据请求详情
 * @param requestId 请求ID
 */
export async function getDataRequest(
  requestId: string
): Promise<DataRequest> {
  const result = await apiRequest<BackendDataRequest>(
    `/data-requests/${requestId}`
  );
  return transformDataRequest(result);
}

/**
 * 批准数据请求（提供者）
 * @param requestId 请求ID
 */
export async function approveDataRequest(
  requestId: string
): Promise<DataRequest> {
  const result = await apiRequest<BackendDataRequest>(
    `/data-requests/${requestId}/approve`,
    {
      method: "PUT",
    }
  );
  return transformDataRequest(result);
}

/**
 * 拒绝数据请求（提供者）
 * @param requestId 请求ID
 */
export async function rejectDataRequest(
  requestId: string
): Promise<DataRequest> {
  const result = await apiRequest<BackendDataRequest>(
    `/data-requests/${requestId}/reject`,
    {
      method: "PUT",
    }
  );
  return transformDataRequest(result);
}

