// Identity & DID related types

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

// 后端返回的DID文档格式
export interface BackendDIDDocument {
  "@context": string[];
  id: string;
  verificationMethod: BackendVerificationMethod[];
  authentication: string[];
  service: BackendServiceEndpoint[];
}

export interface BackendVerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyMultibase: string;
}

export interface BackendServiceEndpoint {
  id: string;
  type: string;
  serviceEndpoint: string;
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

// 前端使用的DID文档格式（保留原有格式）
export interface DIDDocument {
  id: string;
  context: string[];
  verificationMethod: VerificationMethod[];
  authentication: string[];
  assertionMethod: string[];
  keyAgreement: string[];
  capabilityInvocation: string[];
  capabilityDelegation: string[];
  service: ServiceEndpoint[];
}

export interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyJwk?: JsonWebKey;
  publicKeyMultibase?: string;
}

export interface ServiceEndpoint {
  id: string;
  type: string;
  serviceEndpoint: string;
}

export type SecurityRating = "S" | "A" | "B" | "C" | "D";

export interface SecurityDimension {
  name: string;
  weight: number;
  score: number; // 0.0 to 1.0
  status: "green" | "yellow" | "red"; // Mapped from score
  description: string;
}

export interface SecurityAssessment {
  overallScore: number; // 0 to 100
  rating: SecurityRating;
  dimensions: SecurityDimension[];
  lastAssessed: string;
  assessor: string;
}

export interface ConnectedConnector {
  id: string;
  name: string;
  did: string;
  status: "connected" | "disconnected" | "pending";
  lastSeen: string;
  offeringsCount: number;
  // Enhanced information
  description?: string;
  location?: string;
  organization?: string;
  contactEmail?: string;
  securityAssessment?: SecurityAssessment;
  certifications?: string[];
  dataCategories?: string[];
}

export interface ConnectorHealth {
  id: string;
  name: string;
  status: "healthy" | "warning" | "critical" | "offline";
  lastHeartbeat: string;
  responseTime: number;
  uptime: string;
  version: string;
}
