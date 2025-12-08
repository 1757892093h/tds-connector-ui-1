"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  listDataRequests,
  getDataRequest,
} from "@/lib/services/data-request-service";
import {
  listContractTemplates,
  createContract,
} from "@/lib/services/contract-service";
import { listConnectors } from "@/lib/services/identity-service";
import type { DataRequest } from "@/types/data-offering";
import type { ContractTemplate } from "@/types/contracts";
import type { Connector } from "@/types/identity";
import {
  ArrowLeft,
  Save,
  FileText,
  Database,
  User,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

// 表单验证Schema
const contractFormSchema = z.object({
  name: z.string().min(1, "Contract name is required"),
  description: z.string().optional(),
  dataRequestId: z.string().min(1, "Please select a data request"),
  contractTemplateId: z.string().min(1, "Please select a contract template"),
  providerConnectorId: z.string().min(1, "Please select a provider connector"),
  expiresAt: z.string().optional(),
});

type ContractFormValues = z.infer<typeof contractFormSchema>;

export function CreateContractPage() {
  const router = useRouter();
  const [approvedRequests, setApprovedRequests] = useState<DataRequest[]>([]);
  const [contractTemplates, setContractTemplates] = useState<
    ContractTemplate[]
  >([]);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<
    DataRequest | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedTemplate =
    contractTemplates.find((t) => t.id === form.watch("contractTemplateId")) ||
    null;
  const selectedTemplatePoliciesCount =
    selectedTemplate?.policyTemplates?.length ?? 0;

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      name: "",
      description: "",
      dataRequestId: "",
      contractTemplateId: "",
      providerConnectorId: "",
      expiresAt: "",
    },
  });

  // 加载已批准的数据请求
  const loadApprovedRequests = useCallback(async () => {
    try {
      const requests = await listDataRequests(
        undefined,
        "provider",
        "approved"
      );
      setApprovedRequests(requests);
    } catch (error: any) {
      console.error("Failed to load approved requests:", error);
      toast.error("Failed to load approved requests", {
        description: error?.message || "Please try again later",
      });
    }
  }, []);

  // 加载合约模板
  const loadContractTemplates = useCallback(
    async (connectorId?: string) => {
      try {
        const templates = await listContractTemplates(connectorId, "active");
        setContractTemplates(templates);
      } catch (error: any) {
        console.error("Failed to load contract templates:", error);
        toast.error("Failed to load contract templates", {
          description: error?.message || "Please try again later",
        });
      }
    },
    []
  );

  // 加载连接器列表
  const loadConnectors = useCallback(async () => {
    try {
      const connectorList = await listConnectors();
      setConnectors(connectorList);
      // 如果只有一个连接器，自动选择
      if (connectorList.length === 1) {
        form.setValue("providerConnectorId", connectorList[0].id);
        loadContractTemplates(connectorList[0].id);
      }
    } catch (error: any) {
      console.error("Failed to load connectors:", error);
    }
  }, [form, loadContractTemplates]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        loadApprovedRequests(),
        loadConnectors(),
      ]);
      setIsLoading(false);
    };
    loadData();
  }, [loadApprovedRequests, loadConnectors]);

  // 当选择提供者连接器时，加载该连接器的合约模板
  const handleProviderConnectorChange = (connectorId: string) => {
    form.setValue("providerConnectorId", connectorId);
    loadContractTemplates(connectorId);
  };

  // 当选择数据请求时，加载详细信息并自动填充表单
  const handleDataRequestChange = async (requestId: string) => {
    try {
      const request = await getDataRequest(requestId);
      setSelectedRequest(request);
      form.setValue("dataRequestId", requestId);
      // 自动填充合约名称（可选）
      if (!form.getValues("name")) {
        form.setValue(
          "name",
          `Contract for Request ${requestId.slice(0, 8)}`
        );
      }
    } catch (error: any) {
      console.error("Failed to load data request:", error);
      toast.error("Failed to load data request details");
    }
  };

  // 提交表单
  const onSubmit = async (values: ContractFormValues) => {
    if (!selectedRequest) {
      toast.error("Please select a data request");
      return;
    }

    try {
      setIsSubmitting(true);

      // 构建创建合约的请求
      const contractData = {
        name: values.name,
        provider_connector_id: values.providerConnectorId,
        consumer_connector_id: selectedRequest.consumerConnectorId,
        contract_template_id: values.contractTemplateId,
        data_offering_id: selectedRequest.dataOfferingId,
        data_request_id: selectedRequest.id,
        expires_at: values.expiresAt
          ? new Date(values.expiresAt).toISOString()
          : undefined,
      };

      await createContract(contractData);
      toast.success("Contract created successfully");
      router.push("/data-offering");
    } catch (error: any) {
      console.error("Failed to create contract:", error);
      toast.error("Failed to create contract", {
        description: error?.message || "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 获取连接器显示名称
  const getConnectorDisplayName = (connectorId: string): string => {
    const connector = connectors.find((c) => c.id === connectorId);
    return connector?.display_name || connectorId;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-muted-foreground py-8 text-center">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* 标题 */}
      <div>
        <h1 className="text-3xl font-bold">Create Data Contract</h1>
        <p className="text-muted-foreground mt-1">
          Create a contract based on an approved data request
        </p>
      </div>

      {/* 警告：如果没有已批准的请求 */}
      {approvedRequests.length === 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-yellow-600 h-5 w-5 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900">
                  No approved data requests
                </p>
                <p className="text-yellow-700 text-sm mt-1">
                  You need to approve at least one data request before creating
                  a contract.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 左侧：基本信息 */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Information</CardTitle>
                  <CardDescription>
                    Basic information about the contract
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 提供者连接器 */}
                  <FormField
                    control={form.control}
                    name="providerConnectorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provider Connector *</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleProviderConnectorChange(value);
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select provider connector" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {connectors.map((connector) => (
                              <SelectItem key={connector.id} value={connector.id}>
                                {connector.display_name} ({connector.did.slice(0, 20)}...)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select your connector as the data provider
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 数据请求 */}
                  <FormField
                    control={form.control}
                    name="dataRequestId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Request *</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleDataRequestChange(value);
                          }}
                          value={field.value}
                          disabled={approvedRequests.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an approved data request" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {approvedRequests.map((request) => (
                              <SelectItem key={request.id} value={request.id}>
                                Request {request.id.slice(0, 8)}... -{" "}
                                {getConnectorDisplayName(request.consumerConnectorId)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select an approved data request to create contract
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 合约名称 */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contract Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter contract name"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A descriptive name for this contract
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 合约描述 */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter contract description (optional)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 过期时间 */}
                  <FormField
                    control={form.control}
                    name="expiresAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiration Date</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional expiration date for the contract
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* 右侧：合约模板和请求详情 */}
            <div className="space-y-6">
              {/* 合约模板选择 */}
              <Card>
                <CardHeader>
                  <CardTitle>Contract Template *</CardTitle>
                  <CardDescription>
                    Select a contract template to use
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="contractTemplateId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={
                            !form.watch("providerConnectorId") ||
                            contractTemplates.length === 0
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a contract template" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {contractTemplates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name} (
                                {template.contractType === "single_policy"
                                  ? "Single Policy"
                                  : "Multi Policy"}
                                )
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {contractTemplates.length === 0
                            ? "No active contract templates found for the selected connector"
                            : "Choose a template that defines the contract policies"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 显示选中的模板信息 */}
                  {selectedTemplate && (
                    <div className="rounded-lg border p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">
                          {selectedTemplate.name}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {selectedTemplate.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">
                          {selectedTemplate.contractType === "single_policy"
                            ? "Single Policy"
                            : "Multi Policy"}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          Policies: {selectedTemplatePoliciesCount}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 选中的数据请求详情 */}
              {selectedRequest && (
                <Card>
                  <CardHeader>
                    <CardTitle>Selected Request Details</CardTitle>
                    <CardDescription>
                      Information about the selected data request
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Database className="text-muted-foreground h-4 w-4" />
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          Data Offering:
                        </span>{" "}
                        <span className="font-mono">
                          {selectedRequest.dataOfferingId.slice(0, 16)}...
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="text-muted-foreground h-4 w-4" />
                      <div className="text-sm">
                        <span className="text-muted-foreground">Consumer:</span>{" "}
                        {getConnectorDisplayName(selectedRequest.consumerConnectorId)}
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Purpose:</span>{" "}
                      {selectedRequest.purpose}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        Access Mode:
                      </span>{" "}
                      <span className="font-medium uppercase">
                        {selectedRequest.accessMode}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Created:{" "}
                        {new Date(selectedRequest.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                approvedRequests.length === 0 ||
                !form.watch("providerConnectorId") ||
                contractTemplates.length === 0
              }
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Creating..." : "Create Contract"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

