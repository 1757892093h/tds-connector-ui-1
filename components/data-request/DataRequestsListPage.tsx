"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/shared";
import {
  listDataRequests,
  approveDataRequest,
  rejectDataRequest,
} from "@/lib/services/data-request-service";
import { listConnectors } from "@/lib/services/identity-service";
import type { DataRequest } from "@/types/data-offering";
import type { Connector } from "@/types/identity";
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Database,
  User,
  FileText,
  Calendar,
} from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// 状态筛选选项
const statusFilters = [
  { value: "all", label: "All", icon: Database },
  { value: "pending", label: "Pending", icon: Clock },
  { value: "approved", label: "Approved", icon: CheckCircle },
  { value: "rejected", label: "Rejected", icon: XCircle },
];

export function DataRequestsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const connectorIdFromQuery = searchParams.get("connector_id") || undefined;
  const [dataRequests, setDataRequests] = useState<DataRequest[]>([]);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  // 加载数据请求列表（作为提供者）
  const loadDataRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const requests = await listDataRequests(
        connectorIdFromQuery,
        "provider",
        undefined
      );
      setDataRequests(requests);
    } catch (error: any) {
      console.error("Failed to load data requests:", error);
      toast.error("Failed to load data requests", {
        description: error?.message || "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  }, [connectorIdFromQuery]);

  // 加载连接器列表
  const loadConnectors = useCallback(async () => {
    try {
      const connectorList = await listConnectors();
      setConnectors(connectorList);
    } catch (error: any) {
      console.error("Failed to load connectors:", error);
    }
  }, []);

  useEffect(() => {
    loadDataRequests();
    loadConnectors();
  }, [loadDataRequests, loadConnectors]);

  // 批准请求
  const handleApprove = async (requestId: string) => {
    try {
      setProcessingIds((prev) => new Set(prev).add(requestId));
      await approveDataRequest(requestId);
      toast.success("Data request approved");
      await loadDataRequests();
    } catch (error: any) {
      console.error("Failed to approve request:", error);
      toast.error("Failed to approve request", {
        description: error?.message || "Please try again",
      });
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  };

  // 拒绝请求
  const handleReject = async (requestId: string) => {
    try {
      setProcessingIds((prev) => new Set(prev).add(requestId));
      await rejectDataRequest(requestId);
      toast.success("Data request rejected");
      await loadDataRequests();
    } catch (error: any) {
      console.error("Failed to reject request:", error);
      toast.error("Failed to reject request", {
        description: error?.message || "Please try again",
      });
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  };

  // 获取连接器显示名称
  const getConnectorDisplayName = (connectorId: string): string => {
    const connector = connectors.find((c) => c.id === connectorId);
    return connector?.display_name || connectorId;
  };

  // 过滤请求
  const filteredRequests =
    selectedStatus === "all"
      ? dataRequests
      : dataRequests.filter((req) => req.status === selectedStatus);

  // 统计信息
  const pendingCount = dataRequests.filter(
    (req) => req.status === "pending"
  ).length;
  const approvedCount = dataRequests.filter(
    (req) => req.status === "approved"
  ).length;
  const rejectedCount = dataRequests.filter(
    (req) => req.status === "rejected"
  ).length;

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
        <h1 className="text-3xl font-bold">Data Requests</h1>
        <p className="text-muted-foreground mt-1">
          Manage data access requests from consumers
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Requests</CardDescription>
            <CardTitle className="text-2xl">{dataRequests.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">
              {pendingCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {approvedCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rejected</CardDescription>
            <CardTitle className="text-2xl text-red-600">
              {rejectedCount}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* 状态筛选 */}
      <div className="flex gap-2 flex-wrap">
        {statusFilters.map((filter) => {
          const Icon = filter.icon;
          const isActive = selectedStatus === filter.value;
          return (
            <Button
              key={filter.value}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(filter.value)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              {filter.label}
            </Button>
          );
        })}
      </div>

      {/* 请求列表 */}
      <Card>
        <CardHeader>
          <CardTitle>Data Requests</CardTitle>
          <CardDescription>
            Review and manage data access requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-muted-foreground py-8 text-center">
              Loading...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              No data requests found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => {
                const isProcessing = processingIds.has(request.id);
                const isPending = request.status === "pending";

                return (
                  <div
                    key={request.id}
                    className="rounded-lg border p-4 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        {/* 请求ID和状态 */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <FileText className="text-muted-foreground h-4 w-4" />
                          <span className="font-mono text-sm">
                            {request.id.slice(0, 8)}...
                          </span>
                          <StatusBadge status={request.status} />
                        </div>

                        {/* 数据资源ID */}
                        <div className="flex items-center gap-2">
                          <Database className="text-muted-foreground h-4 w-4" />
                          <span className="text-sm">
                            <span className="text-muted-foreground">
                              Data Offering:
                            </span>{" "}
                            <span className="font-mono">
                              {request.dataOfferingId.slice(0, 8)}...
                            </span>
                          </span>
                        </div>

                        {/* 消费者连接器 */}
                        <div className="flex items-center gap-2">
                          <User className="text-muted-foreground h-4 w-4" />
                          <span className="text-sm">
                            <span className="text-muted-foreground">
                              Consumer:
                            </span>{" "}
                            {getConnectorDisplayName(request.consumerConnectorId)}
                          </span>
                        </div>

                        {/* 请求目的 */}
                        <div className="text-sm">
                          <span className="text-muted-foreground">Purpose:</span>{" "}
                          {request.purpose}
                        </div>

                        {/* 访问方式 */}
                        <div className="text-sm">
                          <span className="text-muted-foreground">
                            Access Mode:
                          </span>{" "}
                          <span className="font-medium uppercase">
                            {request.accessMode}
                          </span>
                        </div>

                        {/* 时间信息 */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              Created:{" "}
                              {new Date(request.createdAt).toLocaleString()}
                            </span>
                          </div>
                          {request.updatedAt && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Updated:{" "}
                                {new Date(request.updatedAt).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex gap-2 flex-shrink-0 flex-wrap">
                        {isPending ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(request.id)}
                              disabled={isProcessing}
                              className="gap-2"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(request.id)}
                              disabled={isProcessing}
                              className="gap-2"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Button>
                          </>
                        ) : (
                          <div className="text-xs text-muted-foreground flex items-center px-2 py-1">
                            Status: <span className="ml-1 font-medium capitalize">{request.status}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

