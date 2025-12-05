// Contract and policy related types

export interface PolicyRule {
  id: string;
  type:
    | "access_period"
    | "access_count"
    | "identity_restriction"
    | "encryption"
    | "ip_restriction"
    | "transfer_limit"
    | "qps_limit";
  name: string;
  description: string;
  value: string;
  unit?: string;
  isActive: boolean;
  createdAt: string;
}

export interface PolicyTemplate {
  id: string;
  connectorId: string;
  name: string;
  description: string;
  category: "access" | "usage" | "retention" | "compliance";
  severity: "low" | "medium" | "high";
  enforcementType: "automatic" | "manual" | "hybrid";
  rules: PolicyRule[];
  createdAt: string;
  updatedAt?: string;
}

export interface ContractTemplate {
  id: string;
  connectorId: string;
  name: string;
  description: string;
  contractType: "single_policy" | "multi_policy";
  status: "draft" | "active" | "deprecated";
  usageCount: number;
  policyTemplates: PolicyTemplate[];
  createdAt: string;
  updatedAt?: string;
}

export interface SmartContractTemplate {
  id: string;
  name: string;
  description: string;
  category: "data_sharing" | "payment" | "compliance" | "access_control";
  code: string;
  parameters: ContractParameter[];
  deploymentCost: string;
}

export interface ContractParameter {
  name: string;
  type: "string" | "number" | "boolean" | "address";
  description: string;
  required: boolean;
  defaultValue?: string;
}
