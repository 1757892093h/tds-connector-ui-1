// 合约 API 服务

import type { DataContract, ContractTemplate } from "@/types";

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

// ==================== 合约 API ====================

/**
 * 后端返回的合约格式（snake_case）
 */
interface BackendContract {
  id: string;
  name: string;
  status: string;
  provider_connector_id: string;
  consumer_connector_id: string;
  contract_template_id: string;
  data_offering_id: string;
  data_request_id: string | null;
  contract_address: string | null;
  blockchain_tx_id: string | null;
  blockchain_network: string;
  expires_at: string | null;
  created_at: string;
  updated_at: string | null;
}

/**
 * 转换后端格式到前端格式
 */
function transformContract(backend: BackendContract): DataContract {
  return {
    id: backend.id,
    name: backend.name,
    status: backend.status as DataContract["status"],
    providerConnectorId: backend.provider_connector_id,
    consumerConnectorId: backend.consumer_connector_id,
    contractTemplateId: backend.contract_template_id,
    dataOfferingId: backend.data_offering_id,
    dataRequestId: backend.data_request_id || undefined,
    contractAddress: backend.contract_address || undefined,
    blockchainTxId: backend.blockchain_tx_id || undefined,
    blockchainNetwork: backend.blockchain_network,
    expiresAt: backend.expires_at || undefined,
    createdAt: backend.created_at,
    updatedAt: backend.updated_at || undefined,
  };
}

/**
 * 创建数据合约（提供者）
 */
export interface CreateContractRequest {
  name: string;
  provider_connector_id: string;
  consumer_connector_id: string;
  contract_template_id: string;
  data_offering_id: string;
  data_request_id?: string;
  expires_at?: string;
}

export async function createContract(
  data: CreateContractRequest
): Promise<DataContract> {
  const result = await apiRequest<BackendContract>("/contracts", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return transformContract(result);
}

/**
 * 列出数据合约
 * @param connectorId 可选，连接器ID
 * @param role 可选，"provider" 或 "consumer"
 */
export async function listContracts(
  connectorId?: string,
  role?: "provider" | "consumer"
): Promise<DataContract[]> {
  const params = new URLSearchParams();
  if (connectorId) params.append("connector_id", connectorId);
  if (role) params.append("role", role);

  const query = params.toString();
  const results = await apiRequest<BackendContract[]>(
    `/contracts${query ? `?${query}` : ""}`
  );
  return results.map(transformContract);
}

/**
 * 获取合约详情
 * @param contractId 合约ID
 */
export async function getContract(contractId: string): Promise<DataContract> {
  const result = await apiRequest<BackendContract>(`/contracts/${contractId}`);
  return transformContract(result);
}

/**
 * 确认合约（消费者）
 */
export interface ConfirmContractRequest {
  action: "confirm" | "reject";
}

export async function confirmContract(
  contractId: string,
  data: ConfirmContractRequest
): Promise<DataContract> {
  const result = await apiRequest<BackendContract>(
    `/contracts/${contractId}/confirm`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
  return transformContract(result);
}

/**
 * 部署合约到区块链
 * @param contractId 合约ID
 */
export async function deployContract(contractId: string): Promise<{
  message: string;
  contract_address: string;
  blockchain_tx_id: string;
  blockchain_network: string;
}> {
  return apiRequest(`/contracts/${contractId}/deploy`, {
    method: "POST",
  });
}

// ==================== 合约模板 API ====================

/**
 * 列出合约模板
 * @param connectorId 可选，连接器ID
 * @param status 可选，状态过滤
 */
export async function listContractTemplates(
  connectorId?: string,
  status?: string
): Promise<ContractTemplate[]> {
  const params = new URLSearchParams();
  if (connectorId) params.append("connector_id", connectorId);
  if (status) params.append("status", status);

  const query = params.toString();
  return apiRequest<ContractTemplate[]>(
    `/contract-templates${query ? `?${query}` : ""}`
  );
}

/**
 * 获取合约模板详情
 * @param templateId 模板ID
 */
export async function getContractTemplate(
  templateId: string
): Promise<ContractTemplate> {
  return apiRequest<ContractTemplate>(`/contract-templates/${templateId}`);
}

