"use client";

import {
  ActionDialog,
  MetricCard,
  SearchFilter,
  SecurityRatingChart,
  StatusBadge,
} from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDataOfferings, useIdentity } from "@/hooks";
import { cn } from "@/lib/utils";
import type {
  ContractStatus,
  CrossBorderAuditStatus,
  DataContract,
  HostingStatus,
} from "@/types";
import {
  Activity,
  AlertTriangle,
  Ban,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Database,
  Download,
  ExternalLink,
  Eye,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Server,
  Shield,
  Users,
  XCircle,
  FileText,
  FileX,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "analytics", label: "Analytics" },
  { value: "research", label: "Research" },
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "iot", label: "IoT" },
];

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

export function DataConsumptionTab() {
  const { connectedConnectors } = useIdentity();

  const {
    externalOfferings,
    dataContracts,
    isRequestDataOpen,
    setIsRequestDataOpen,
    selectedOffering,
    newRequest,
    setNewRequest,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    requestData,
    filteredOfferings,
  } = useDataOfferings();

  const activeContractsCount = dataContracts.filter(
    (c: DataContract) => c.status === "active"
  ).length;

  // State to track downloading files
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(
    new Set()
  );

  // Handle file download
  const handleDownloadFile = async (contractId: string) => {
    // Prevent multiple downloads of the same file
    if (downloadingFiles.has(contractId)) {
      return;
    }

    try {
      // Set downloading state
      setDownloadingFiles((prev) => new Set(prev).add(contractId));

      // Create a temporary element to trigger download
      const downloadUrl = `/tdsc/api/v1/offering/${contractId}`;

      // Create a temporary link element and click it to trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "12121"; // This will use the filename from server
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message
      toast.success("Download started");

      // Simulate download completion after a short delay
      // In a real implementation, you might want to listen for actual download events
      setTimeout(() => {
        setDownloadingFiles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(contractId);
          return newSet;
        });
      }, 2000); // Remove loading state after 2 seconds
    } catch (error) {
      console.error("Failed to download file:", error);
      toast.error("Download failed");

      // Remove from downloading state on error
      setDownloadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(contractId);
        return newSet;
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Available Data"
          value={externalOfferings.length}
          description="External offerings"
          icon={Database}
          variant="primary"
        />
        <MetricCard
          title="Active Contracts"
          value={activeContractsCount}
          description="Active contracts"
          icon={Activity}
          variant="secondary"
        />
        <MetricCard
          title="Connected Partners"
          value={
            connectedConnectors.filter((c) => c.status === "connected").length
          }
          description="Trusted connectors"
          icon={Users}
        />
        <MetricCard
          title="Total Contracts"
          value={dataContracts.length}
          description="All time"
          icon={ExternalLink}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Data Catalog */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Data Catalog</CardTitle>
                <CardDescription>
                  Discover and request data from other connectors
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filter */}
            <SearchFilter
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              filterValue={categoryFilter}
              onFilterChange={setCategoryFilter}
              filterOptions={categoryOptions}
              searchPlaceholder="Search data offerings..."
            />

            {/* Offerings List */}
            <div className="max-h-96 space-y-3 overflow-y-auto">
              {filteredOfferings.map((offering) => {
                const HostingIcon = getHostingStatusIcon(
                  offering.hostingStatus
                );
                const CrossBorderIcon = getCrossBorderAuditIcon(
                  offering.crossBorderAuditStatus
                );

                return (
                  <div key={offering.id} className="rounded-lg border p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center space-x-2">
                          <h4 className="font-medium">{offering.title}</h4>
                          {/* Hosting Status Badge */}
                          <div
                            className={cn(
                              "flex items-center space-x-1 rounded-md px-2 py-1 text-xs",
                              offering.hostingStatus === "hosted" &&
                                "bg-blue-100 text-blue-800",
                              offering.hostingStatus === "self_managed" &&
                                "bg-purple-100 text-purple-800",
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
                          <span>Provider: {offering.provider}</span>
                          <span>Type: {offering.dataType}</span>
                          <span>Size: {offering.size}</span>
                          {offering.price && (
                            <span>Price: {offering.price}</span>
                          )}
                          <span>Zone: {offering.dataZoneCode}</span>
                        </div>
                        <div className="text-muted-foreground mt-1 text-xs">
                          <span>Location: {offering.storageLocation}</span>
                        </div>
                      </div>
                      {/* <Button
                        size="sm"
                        onClick={() => handleRequestData(offering)}
                      >
                        Request
                      </Button> */}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Data Contracts */}
        <Card>
          <CardHeader>
            <CardTitle>Data Contracts</CardTitle>
            <CardDescription>View your data contracts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 space-y-3 overflow-y-auto">
              {dataContracts.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center text-sm">
                  No data contracts yet. Request data access to create
                  contracts.
                </div>
              ) : (
                dataContracts.map((contract: DataContract) => {
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
                          {contract.status === "active" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Download Data"
                              onClick={() => handleDownloadFile(contract.id)}
                              disabled={downloadingFiles.has(contract.id)}
                            >
                              {downloadingFiles.has(contract.id) ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Contract Details */}
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

      {/* Connected Connectors */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Connectors</CardTitle>
          <CardDescription>
            Manage your trusted connector relationships with security
            assessments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {connectedConnectors.map((connector) => (
              <div
                key={connector.id}
                className="space-y-4 rounded-lg border p-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center space-x-2">
                      <h4 className="text-lg font-semibold">
                        {connector.name}
                      </h4>
                      <StatusBadge status={connector.status} />
                    </div>
                    {connector.organization && (
                      <div className="text-muted-foreground mb-1 flex items-center space-x-1 text-sm">
                        <Building className="h-3 w-3" />
                        <span>{connector.organization}</span>
                      </div>
                    )}
                    {connector.location && (
                      <div className="text-muted-foreground mb-1 flex items-center space-x-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        <span>{connector.location}</span>
                      </div>
                    )}
                    {connector.contactEmail && (
                      <div className="text-muted-foreground flex items-center space-x-1 text-sm">
                        <Mail className="h-3 w-3" />
                        <span>{connector.contactEmail}</span>
                      </div>
                    )}
                  </div>
                  {connector.securityAssessment && (
                    <div className="flex flex-col items-center space-y-2">
                      <SecurityRatingChart
                        assessment={connector.securityAssessment}
                        size="md"
                        showModal={true}
                      />
                      <Badge
                        className={cn(
                          "text-xs text-white",
                          connector.securityAssessment.rating === "S" &&
                            "bg-green-600",
                          connector.securityAssessment.rating === "A" &&
                            "bg-green-500",
                          connector.securityAssessment.rating === "B" &&
                            "bg-yellow-500",
                          connector.securityAssessment.rating === "C" &&
                            "bg-orange-500",
                          connector.securityAssessment.rating === "D" &&
                            "bg-red-500"
                        )}
                      >
                        Security Rating {connector.securityAssessment.rating}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Description */}
                {connector.description && (
                  <p className="text-muted-foreground text-sm">
                    {connector.description}
                  </p>
                )}

                {/* DID */}
                <div className="bg-muted rounded-md py-3">
                  <div className="text-muted-foreground mb-1 text-xs">DID:</div>
                  <p className="font-mono text-sm break-all">{connector.did}</p>
                </div>

                {/* Data Categories */}
                {connector.dataCategories &&
                  connector.dataCategories.length > 0 && (
                    <div>
                      <div className="text-muted-foreground mb-2 text-xs">
                        Data Categories:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {connector.dataCategories.map((category, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Certifications */}
                {connector.certifications &&
                  connector.certifications.length > 0 && (
                    <div>
                      <div className="text-muted-foreground mb-2 text-xs">
                        Certifications:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {connector.certifications.map((cert, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            <Shield className="mr-1 h-3 w-3" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4 border-t pt-3">
                  <div className="text-center">
                    <div className="text-sm font-medium">
                      {connector.offeringsCount}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Offerings
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">
                      {new Date(connector.lastSeen).toLocaleDateString()}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Last Seen
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      {connector.securityAssessment && (
                        <div className="text-sm font-medium">
                          {new Date(
                            connector.securityAssessment.lastAssessed
                          ).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Security Review
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Request Dialog */}
      <ActionDialog
        trigger={null}
        title="Request Data Access"
        description={
          selectedOffering
            ? `Request access to "${selectedOffering.title}" from ${selectedOffering.provider}`
            : undefined
        }
        open={isRequestDataOpen}
        onOpenChange={setIsRequestDataOpen}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="access-mode">Access Mode</Label>
            <Select
              value={newRequest.accessMode}
              onValueChange={(value: "api" | "download") =>
                setNewRequest({ ...newRequest, accessMode: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="api">API Access</SelectItem>
                <SelectItem value="download">Download</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea
              id="purpose"
              value={newRequest.purpose}
              onChange={(e) =>
                setNewRequest({ ...newRequest, purpose: e.target.value })
              }
              placeholder="Describe the intended use of this data..."
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsRequestDataOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={requestData}>Submit Request</Button>
          </div>
        </div>
      </ActionDialog>
    </div>
  );
}
