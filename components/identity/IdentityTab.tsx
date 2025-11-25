"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  CheckCircle,
  Code,
  Copy,
  Eye,
  FileText,
  IdCard,
  Key,
  Lock,
  Plus,
  RefreshCw,
  Shield,
  Tag,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { CreateConnectorDialog } from "./CreateConnectorDialog";
import {
  verifyToken,
  listConnectors,
} from "@/lib/services/identity-service";
import type { User as UserType, Connector, BackendDIDDocument } from "@/types/identity";

export function IdentityTab() {
  const { toast } = useToast();
  const t = useTranslations("Identity");

  // 状态管理
  const [user, setUser] = useState<UserType | null>(null);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingConnectors, setIsLoadingConnectors] = useState(true);
  const [didViewMode, setDidViewMode] = useState<"visual" | "json">("visual");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // 加载用户信息
  useEffect(() => {
    loadUserData();
  }, []);

  // 加载连接器列表
  useEffect(() => {
    if (user) {
      loadConnectors();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setIsLoadingUser(true);
      const userData = await verifyToken();
      setUser(userData);
    } catch (error) {
      toast({
        title: "Failed to load user data",
        description: "Please try logging in again",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const loadConnectors = async () => {
    try {
      setIsLoadingConnectors(true);
      const connectorList = await listConnectors();
      setConnectors(connectorList);
      // 自动选择第一个连接器
      if (connectorList.length > 0 && !selectedConnector) {
        setSelectedConnector(connectorList[0]);
      }
    } catch (error) {
      toast({
        title: "Failed to load connectors",
        description: "Please try again later",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoadingConnectors(false);
    }
  };

  const handleRefresh = () => {
    loadUserData();
    loadConnectors();
  };

  const handleCreateSuccess = () => {
    loadConnectors();
    toast({
      title: "Connector created successfully",
      description: "Your new connector is now available",
    });
  };

  const copyToClipboard = async (text: string, description: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: t("copySuccess"),
        description: `${description} ${t("copiedToClipboard")}`,
      });
    } catch (err) {
      toast({
        title: t("copyFailed"),
        description: t("failedToCopy"),
        variant: "destructive",
      });
    }
  };

  // DID文档可视化视图
  const DIDDocumentVisualView = ({
    didDocument,
  }: {
    didDocument: BackendDIDDocument;
  }) => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* 标识符卡片 */}
      <Card className="border-border border">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <IdCard className="text-primary h-5 w-5" />
              </div>
              <CardTitle className="text-lg">{t("identifier")}</CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs">
              {t("uniqueIdentifier")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-muted-foreground mb-2 text-sm">
              {t("didSubjectIdentifier")}
            </p>
            <div className="flex items-center gap-2">
              <code className="bg-muted flex-1 rounded font-mono text-sm break-all p-2">
                {didDocument.id}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(didDocument.id, "DID")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 认证方式卡片 */}
      <Card className="border-border border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <Lock className="text-primary h-5 w-5" />
              </div>
              <CardTitle className="text-lg">{t("authentication")}</CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs">
              {t("authMethod")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-muted-foreground mb-2 text-sm">
              {t("publicKeyAuth")}
            </p>
            <code className="bg-muted block rounded font-mono text-sm break-all p-2">
              {didDocument.authentication[0]}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* 公钥信息卡片 */}
      <Card className="border-border border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <Key className="text-primary h-5 w-5" />
              </div>
              <CardTitle className="text-lg">{t("publicKeyInfo")}</CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs">
              {didDocument.verificationMethod.length} key(s)
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-muted-foreground mb-2 text-sm">
              {t("verificationKey")}
            </p>
            <code className="mb-3 block font-mono text-sm">
              {didDocument.verificationMethod[0].id}
            </code>
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-2">
                <span className="text-muted-foreground text-sm">
                  {t("algorithmType")}
                </span>
                <span className="text-sm font-medium">
                  {didDocument.verificationMethod[0].type}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground mb-1 block text-sm">
                  Public Key
                </span>
                <div className="flex items-center gap-2">
                  <code className="bg-muted flex-1 truncate rounded font-mono text-sm break-all p-2">
                    {didDocument.verificationMethod[0].publicKeyMultibase}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        didDocument.verificationMethod[0].publicKeyMultibase,
                        "Public Key"
                      )
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 服务信息卡片 */}
      <Card className="border-border border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <Shield className="text-primary h-5 w-5" />
              </div>
              <CardTitle className="text-lg">{t("serviceEndpoints")}</CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs">
              {didDocument.service.length} service(s)
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-muted-foreground mb-2 text-sm">
              {t("connectorServiceInterface")}
            </p>
            <code className="mb-3 block truncate font-mono text-xs">
              {didDocument.service[0].id}
            </code>
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-2">
                <span className="text-muted-foreground text-sm">
                  {t("serviceType")}
                </span>
                <span className="text-sm font-medium">
                  {didDocument.service[0].type}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground mb-1 block text-sm">
                  {t("serviceAddress")}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={didDocument.service[0].serviceEndpoint}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-muted text-primary flex-1 truncate rounded font-mono text-sm break-all p-2 hover:underline"
                  >
                    {didDocument.service[0].serviceEndpoint}
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        didDocument.service[0].serviceEndpoint,
                        "Service Endpoint"
                      )
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // 加载骨架
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Identity & DID Management</h2>
          <p className="text-muted-foreground">
            Manage your identity and connectors
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoadingUser || isLoadingConnectors}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${
              isLoadingUser || isLoadingConnectors ? "animate-spin" : ""
            }`}
          />
          Refresh
        </Button>
      </div>

      {/* 两列布局 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 左侧：User Identity */}
        <div className="space-y-6">
          <Card className="border-border border">
            <CardHeader className="border-b border-gray-200 pb-6">
              <CardTitle className="text-xl font-bold md:text-2xl">
                {t("userIdentity")}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {t("userDescription")}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pt-6">
              {isLoadingUser ? (
                <LoadingSkeleton />
              ) : user ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm">
                      {t("didIdentifier")}
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted flex-grow rounded-lg font-mono text-sm break-all p-2">
                        {user.did}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(user.did, t("didIdentifier"))
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-muted-foreground mb-1 text-sm">
                      {t("userType")}
                    </p>
                    <div className="bg-muted rounded-lg py-1 px-2">
                      <span className="font-medium">Individual</span>
                    </div>
                  </div>

                  {user.username && (
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm">
                        Username
                      </p>
                      <div className="bg-muted rounded-lg py-1 px-2">
                        <span className="font-medium">{user.username}</span>
                      </div>
                    </div>
                  )}

                  {user.email && (
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm">
                        Email
                      </p>
                      <div className="bg-muted rounded-lg py-1 px-2">
                        <span className="font-medium">{user.email}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-muted-foreground mb-1 text-sm">
                      {t("identityStatus")}
                    </p>
                    <div className="bg-muted rounded-lg py-1 px-2">
                      <span className="flex items-center gap-1 font-medium text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        {t("verified")}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  No user data available
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 右侧：Connectors */}
        <div className="space-y-6">
          <Card className="border-border border">
            <CardHeader className="border-b border-gray-200 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold md:text-2xl">
                    Connector Identity
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {connectors.length} connector(s) registered
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => setCreateDialogOpen(true)}
                  disabled={isLoadingConnectors}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </Button>
              </div>
            </CardHeader>

            <CardContent className="px-6 pt-6">
              {isLoadingConnectors ? (
                <LoadingSkeleton />
              ) : connectors.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No connectors yet
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Connector
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 连接器选择器 */}
                  <div className="flex gap-2 flex-wrap">
                    {connectors.map((connector) => (
                      <Button
                        key={connector.id}
                        variant={
                          selectedConnector?.id === connector.id
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedConnector(connector)}
                      >
                        {connector.display_name}
                      </Button>
                    ))}
                  </div>

                  {/* 选中的连接器详情 */}
                  {selectedConnector && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-muted-foreground mb-1 text-sm">
                            {t("didIdentifier")}
                          </p>
                          <div className="flex items-center gap-2">
                            <code className="bg-muted flex-grow rounded-lg font-mono text-sm break-all p-2">
                              {selectedConnector.did}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  selectedConnector.did,
                                  "Connector DID"
                                )
                              }
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <p className="text-muted-foreground mb-1 text-sm">
                            Status
                          </p>
                          <div className="bg-muted rounded-lg py-1 px-2">
                            <Badge variant="secondary">
                              {selectedConnector.status}
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <p className="text-muted-foreground mb-1 text-sm">
                            Created At
                          </p>
                          <div className="bg-muted rounded-lg py-1 px-2">
                            <span className="font-medium text-sm">
                              {new Date(
                                selectedConnector.created_at
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* DID Document */}
                      {selectedConnector.did_document && (
                        <div className="border-t border-gray-100 pt-4">
                          <div className="flex flex-col justify-between gap-4 mb-4 sm:flex-row sm:items-center">
                            <div>
                              <h3 className="flex items-center gap-2 text-xl font-bold">
                                <FileText className="text-primary h-5 w-5" />
                                <span>{t("didDocument")}</span>
                              </h3>
                              <p className="text-muted-foreground mt-1">
                                {t("viewDetailContent")}
                              </p>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                variant={
                                  didViewMode === "visual"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setDidViewMode("visual")}
                                className="flex items-center gap-2"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant={
                                  didViewMode === "json" ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setDidViewMode("json")}
                                className="flex items-center gap-2"
                              >
                                <Code className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {didViewMode === "visual" ? (
                            <DIDDocumentVisualView
                              didDocument={selectedConnector.did_document}
                            />
                          ) : (
                            <div className="space-y-4">
                              <pre className="bg-muted overflow-x-auto rounded-lg p-6 font-mono text-sm leading-relaxed">
                                {JSON.stringify(
                                  selectedConnector.did_document,
                                  null,
                                  2
                                )}
                              </pre>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full"
                                onClick={() =>
                                  copyToClipboard(
                                    JSON.stringify(
                                      selectedConnector.did_document,
                                      null,
                                      2
                                    ),
                                    `${t("didDocument")} JSON`
                                  )
                                }
                              >
                                <Copy className="mr-2 h-4 w-4" />
                                {t("copyJson")}
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 创建连接器对话框 */}
      <CreateConnectorDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
