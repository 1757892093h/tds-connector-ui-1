"use client";

import { DataOfferingDetailsDialog } from "@/components/data-offering/DataOfferingDetailsDialog";
import { CreateDataOfferingDialog } from "@/components/data-offering/CreateDataOfferingDialog";
import { MetricCard, StatusBadge } from "@/components/shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDataOfferings } from "@/hooks";
import { cn } from "@/lib/utils";
import {
  ContractStatus,
  CrossBorderAuditStatus,
  DataSourceType,
  HostingStatus,
} from "@/types";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cloud,
  Database,
  Edit,
  Eye,
  File,
  FileText,
  Globe,
  Link,
  MoreHorizontal,
  Server,
  Shield,
  Trash2,
  XCircle,
  Ban,
  FileX,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Data source type icon mapping
const getDataSourceIcon = (type: DataSourceType) => {
  switch (type) {
    case "local_file":
      return File;
    case "s3":
      return Cloud;
    case "nas":
      return Server;
    case "restful":
      return Link;
    default:
      return Database;
  }
};

// Registration status icon mapping
const getRegistrationIcon = (status: string) => {
  switch (status) {
    case "registered":
      return CheckCircle;
    case "registering":
      return Clock;
    case "failed":
      return XCircle;
    default:
      return AlertTriangle;
  }
};

// Contract status icon mapping
const getContractStatusIcon = (status: ContractStatus) => {
  switch (status) {
    case "active":
      return CheckCircle;
    case "pending_consumer":
      return Clock;
    case "draft":
      return FileText;
    case "rejected":
      return XCircle;
    case "terminated":
      return FileX;
    case "expired":
      return AlertCircle;
    case "violated":
      return Ban;
    default:
      return AlertTriangle;
  }
};

// Data source type label mapping
const getDataSourceLabel = (type: DataSourceType) => {
  switch (type) {
    case "local_file":
      return "Local File";
    case "s3":
      return "S3 Storage";
    case "nas":
      return "NAS Storage";
    case "restful":
      return "RESTful API";
    default:
      return "Unknown";
  }
};

// Contract status label mapping
const getContractStatusLabel = (status: ContractStatus) => {
  switch (status) {
    case "active":
      return "Active";
    case "pending_consumer":
      return "Pending Consumer";
    case "draft":
      return "Draft";
    case "rejected":
      return "Rejected";
    case "terminated":
      return "Terminated";
    case "expired":
      return "Expired";
    case "violated":
      return "Violated";
    default:
      return "Unknown";
  }
};

// Hosting status icon mapping
const getHostingStatusIcon = (status: HostingStatus) => {
  switch (status) {
    case "hosted":
      return Shield;
    case "self_managed":
      return Server;
    case "pending":
      return Clock;
    default:
      return AlertTriangle;
  }
};

// Hosting status label mapping
const getHostingStatusLabel = (status: HostingStatus) => {
  switch (status) {
    case "hosted":
      return "Hosted";
    case "self_managed":
      return "Self Managed";
    case "pending":
      return "Pending";
    default:
      return "Unknown";
  }
};

// Cross-border audit status icon mapping
const getCrossBorderAuditIcon = (status: CrossBorderAuditStatus) => {
  switch (status) {
    case "approved":
      return CheckCircle;
    case "pending":
      return Clock;
    case "rejected":
      return XCircle;
    case "not_required":
      return Shield;
    default:
      return AlertTriangle;
  }
};

// Cross-border audit status label mapping
const getCrossBorderAuditLabel = (status: CrossBorderAuditStatus) => {
  switch (status) {
    case "approved":
      return "Approved";
    case "pending":
      return "Pending";
    case "rejected":
      return "Rejected";
    case "not_required":
      return "Not Required";
    default:
      return "Unknown";
  }
};

export function DataOfferingTab() {
  const {
    dataOfferings,
    dataContracts,
    isAddOfferingOpen,
    setIsAddOfferingOpen,
  } = useDataOfferings();

  // State for data details dialog
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOffering, setSelectedOffering] = useState<any>(null);

  const activeOfferingsCount = dataOfferings.filter(
    (o) => o.status === "active"
  ).length;

  // Handle view details click
  const handleViewDetails = (offering: any) => {
    setSelectedOffering(offering);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Active Offerings"
          value={activeOfferingsCount}
          description="Available for consumption"
          icon={Database}
          variant="primary"
        />
        <MetricCard
          title="Data Contracts"
          value={dataContracts.length}
          description="Signed data usage contracts"
          icon={FileText}
          variant="secondary"
        />
        <MetricCard
          title="Total Offerings"
          value={dataOfferings.length}
          description="All data offerings"
          icon={Globe}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Data Offerings Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Data Offerings</CardTitle>
                <CardDescription>
                  Manage your published data resources
                </CardDescription>
              </div>
              <CreateDataOfferingDialog
                open={isAddOfferingOpen}
                onOpenChange={setIsAddOfferingOpen}
                onSuccess={() => {
                  // 刷新数据列表，这里可以调用API重新获取数据
                  toast.success("数据资源创建成功");
                }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dataOfferings.map((offering) => {
                const DataSourceIcon = getDataSourceIcon(offering.dataType);
                const RegistrationIcon = getRegistrationIcon(
                  offering.registrationStatus
                );
                const HostingIcon = getHostingStatusIcon(
                  offering.hostingStatus
                );
                const CrossBorderIcon = getCrossBorderAuditIcon(
                  offering.crossBorderAuditStatus
                );

                return (
                  <div
                    key={offering.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <DataSourceIcon className="text-muted-foreground h-4 w-4" />
                        <h4 className="font-medium whitespace-nowrap">
                          {offering.title}
                        </h4>
                        <StatusBadge status={offering.status} />
                        <div
                          className={cn(
                            "flex items-center space-x-1 rounded-md px-2 py-1 text-xs",
                            offering.registrationStatus === "registered" &&
                              "bg-green-100 text-green-800",
                            offering.registrationStatus === "registering" &&
                              "bg-yellow-100 text-yellow-800",
                            offering.registrationStatus === "unregistered" &&
                              "bg-gray-100 text-gray-800",
                            offering.registrationStatus === "failed" &&
                              "bg-red-100 text-red-800"
                          )}
                        >
                          <RegistrationIcon className="h-3 w-3" />
                          <span>
                            {offering.registrationStatus === "registered" &&
                              "Registered"}
                            {offering.registrationStatus === "registering" &&
                              "Registering"}
                            {offering.registrationStatus === "unregistered" &&
                              "Unregistered"}
                            {offering.registrationStatus === "failed" &&
                              "Failed"}
                          </span>
                        </div>
                        {/* Hosting Status Badge */}
                        <div
                          className={cn(
                            "flex items-center space-x-1 rounded-md px-2 py-1 text-xs",
                            offering.hostingStatus === "hosted" &&
                              "bg-blue-100 text-blue-800",
                            offering.hostingStatus === "self_managed" &&
                              "bg-purple-100 whitespace-nowrap text-purple-800",
                            offering.hostingStatus === "pending" &&
                              "bg-orange-100 text-orange-800"
                          )}
                        >
                          <HostingIcon className="h-3 w-3" />
                          <span>
                            {getHostingStatusLabel(offering.hostingStatus)}
                          </span>
                        </div>
                        {/* Cross-border Audit Status Badge */}
                        <div
                          className={cn(
                            "flex items-center space-x-1 rounded-md px-2 py-1 text-xs",
                            offering.crossBorderAuditStatus === "approved" &&
                              "bg-green-100 text-green-800",
                            offering.crossBorderAuditStatus === "pending" &&
                              "bg-yellow-100 text-yellow-800",
                            offering.crossBorderAuditStatus === "rejected" &&
                              "bg-red-100 text-red-800",
                            offering.crossBorderAuditStatus ===
                              "not_required" && "bg-gray-100 text-gray-800"
                          )}
                        >
                          <CrossBorderIcon className="h-3 w-3" />
                          <span>
                            {getCrossBorderAuditLabel(
                              offering.crossBorderAuditStatus
                            )}
                          </span>
                        </div>
                      </div>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {offering.description}
                      </p>
                      <div className="text-muted-foreground mt-2 flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <span>Type:</span>
                          <span className="font-medium">
                            {getDataSourceLabel(offering.dataType)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>Policy:</span>
                          <span className="font-medium">
                            {offering.accessPolicy}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>Zone Code:</span>
                          <span className="font-mono text-xs">
                            {offering.dataZoneCode}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>Created:</span>
                          <span>
                            {new Date(offering.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Action Buttons */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(offering)}
                        >
                          <Eye className="mr-2 size-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Data Contract Display (Read-only) */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Data Contracts</CardTitle>
                <CardDescription>
                  View active data usage contracts
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dataContracts.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center text-sm">
                  No data contracts yet. Contracts are created when data
                  requests are approved.
                </div>
              ) : (
                dataContracts.map((contract) => {
                  const ContractStatusIcon = getContractStatusIcon(
                    contract.status
                  );

                  return (
                    <div key={contract.id} className="rounded-lg border p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center space-x-2">
                            <ContractStatusIcon className="text-muted-foreground h-4 w-4" />
                            <h4 className="text-sm font-medium">
                              {contract.name}
                            </h4>
                            <div
                              className={cn(
                                "flex items-center space-x-1 rounded-md px-2 py-1 text-xs",
                                contract.status === "active" &&
                                  "bg-green-100 text-green-800",
                                contract.status === "pending_consumer" &&
                                  "bg-yellow-100 text-yellow-800",
                                contract.status === "draft" &&
                                  "bg-gray-100 text-gray-800",
                                contract.status === "rejected" &&
                                  "bg-red-100 text-red-800",
                                contract.status === "terminated" &&
                                  "bg-orange-100 text-orange-800",
                                contract.status === "expired" &&
                                  "bg-orange-100 text-orange-800",
                                contract.status === "violated" &&
                                  "bg-red-100 text-red-800"
                              )}
                            >
                              <span>
                                {getContractStatusLabel(contract.status)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Contract Information */}
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 gap-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Provider Connector:
                            </span>
                            <span className="ml-2 truncate font-mono">
                              {contract.providerConnectorId}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Consumer Connector:
                            </span>
                            <span className="ml-2 truncate font-mono">
                              {contract.consumerConnectorId}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Contract Template:
                            </span>
                            <span className="ml-2 truncate font-mono">
                              {contract.contractTemplateId}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Data Offering:
                            </span>
                            <span className="ml-2 truncate font-mono">
                              {contract.dataOfferingId}
                            </span>
                          </div>
                          {contract.contractAddress && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Blockchain Address:
                              </span>
                              <span className="ml-2 truncate font-mono text-blue-600">
                                {contract.contractAddress}
                              </span>
                            </div>
                          )}
                          {contract.blockchainTxId && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Transaction ID:
                              </span>
                              <span className="ml-2 truncate font-mono text-blue-600">
                                {contract.blockchainTxId}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Blockchain Network:
                            </span>
                            <span className="font-medium">
                              {contract.blockchainNetwork}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Created:
                            </span>
                            <span>
                              {new Date(contract.createdAt).toLocaleString()}
                            </span>
                          </div>
                          {contract.expiresAt && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Expires:
                              </span>
                              <span
                                className={cn(
                                  contract.status === "expired" &&
                                    "text-red-600 font-medium"
                                )}
                              >
                                {new Date(contract.expiresAt).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Details Dialog */}
      <DataOfferingDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        selectedOffering={selectedOffering}
      />
    </div>
  );
}
