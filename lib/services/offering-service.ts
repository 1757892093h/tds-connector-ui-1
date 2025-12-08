// 数据资源（Data Offering）API 服务
import type { DataOffering } from "@/types/data-offering";

const API_PREFIX = "/tdsc/api/v1";

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
    const error = await response.json().catch(() => ({ detail: "An error occurred" }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// 后端返回格式
interface BackendDataOffering {
  id: string;
  connector_id: string;
  title: string;
  description: string;
  data_type: string;
  access_policy: string;
  storage_meta: any;
  registration_status: string;
  created_at: string;
}

// 默认填充缺失字段
function transformOffering(backend: BackendDataOffering): DataOffering {
  return {
    id: backend.id,
    title: backend.title,
    description: backend.description,
    dataType: backend.data_type as DataOffering["dataType"],
    accessPolicy: backend.access_policy,
    status: "active",
    registrationStatus: backend.registration_status as DataOffering["registrationStatus"],
    createdAt: backend.created_at,
    hostingStatus: "self_managed",
    crossBorderAuditStatus: "not_required",
    dataZoneCode: "DEFAULT",
    storageLocation: "local",
    traceabilityInfo: {
      dataSource: backend.title,
      blockchainMainChainId: "chain-001",
      ownerDID: backend.connector_id,
      traceabilityHash: `hash-${backend.id}`,
    },
    sourceConfig: backend.storage_meta,
  };
}

/**
 * 列出数据资源
 * @param connectorId 可选，按连接器过滤
 */
export async function listOfferings(connectorId?: string): Promise<DataOffering[]> {
  const params = new URLSearchParams();
  if (connectorId) params.append("connector_id", connectorId);

  const query = params.toString();
  const results = await apiRequest<BackendDataOffering[]>(
    `/offerings${query ? `?${query}` : ""}`
  );
  return results.map(transformOffering);
}

