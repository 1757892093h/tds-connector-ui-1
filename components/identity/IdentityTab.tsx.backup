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
  Shield,
  Tag,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function IdentityTab() {
  const { toast } = useToast();
  const t = useTranslations("Identity");
  const [didViewMode, setDidViewMode] = useState<"visual" | "json">("visual");
  const [vcViewMode, setVcViewMode] = useState<"visual" | "json">("visual");

  // Mock data based on HTML content
  const connectorData = {
    didIdentifier: "did:jg:0df1zlohf",
    name: "Example Connector v2.1",
    version: "v0.0.1",
    creationDate: "2025-01-15 10:30:21",
  };

  const didDocumentData = {
    "@context": ["https://www.w3.org/ns/did/v1"],
    id: "did:jg:0df1zlohf",
    publicKey: [
      {
        id: "did:jg:0df1zlohf#keys-1",
        type: "Ed25519VerificationKey2018",
        controller: "did:jg:0df1zlohf",
        publicKeyBase58: "H3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV",
      },
    ],
    authentication: ["did:jg:0df1zlohf#keys-1"],
    service: [
      {
        id: "did:jg:0df1zlohf#connector-endpoint",
        type: "ConnectorService",
        serviceEndpoint: "https://connector.jg.com/api",
      },
    ],
  };

  const userData = {
    didIdentifier: "did:jg:user:87654321",
    userType: "Individual",
    lastAuthenticated: "2025-08-14 14:22:36",
    status: "已验证",
  };

  const vcData = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://schema.org/",
      "https://example.com/schemas/user-identity-v1.json",
    ],
    id: "did:jg:vc:8f7e6d5c4b3a210",
    type: ["VerifiableCredential", "IdentityCredential"],
    issuer: {
      id: "did:jg:issuer:123456",
      name: "Example Corp",
      url: "https://www.example.com",
    },
    issuanceDate: "2025-08-10 08:30:00",
    expirationDate: "2026-08-10 08:30:00",
    credentialSubject: {
      id: "did:jg:user:87654321",
      name: "John Doe",
      type: "Individual",
      email: "john.doe@example.com",
      memberOf: {
        id: "did:jg:issuer:123456",
        name: "Example Corp",
        type: "Organization",
      },
      authenticationDate: "2025-08-14 14:22:36",
    },
    proof: {
      type: "Ed25519Signature2018",
      created: "2025-08-15 10:05:30",
      verificationMethod: "did:jg:issuer:123456#key-1",
      proofPurpose: "assertionMethod",
      jws: "z5T7a......f8K3p",
    },
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

  const DIDDocumentVisualView = () => (
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
              <code className="bg-muted flex-1 rounded font-mono text-sm break-all">
                {didDocumentData.id}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  copyToClipboard(didDocumentData.id, t("didIdentifier"))
                }
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
            <code className="bg-muted block rounded font-mono text-sm break-all">
              {didDocumentData.authentication[0]}
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
              {t("oneKey")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-muted-foreground mb-2 text-sm">
              {t("verificationKey")}
            </p>
            <code className="mb-3 block font-mono text-sm">
              {didDocumentData.publicKey[0].id}
            </code>
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-2">
                <span className="text-muted-foreground text-sm">
                  {t("algorithmType")}
                </span>
                <span className="text-sm font-medium">
                  {didDocumentData.publicKey[0].type}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground mb-1 block text-sm">
                  {t("publicKeyBase58")}
                </span>
                <div className="flex items-center gap-2">
                  <code className="bg-muted flex-1 truncate rounded font-mono text-sm break-all">
                    {didDocumentData.publicKey[0].publicKeyBase58}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        didDocumentData.publicKey[0].publicKeyBase58,
                        t("publicKeyBase58")
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
              {t("oneService")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-muted-foreground mb-2 text-sm">
              {t("connectorServiceInterface")}
            </p>
            <code className="mb-3 block truncate font-mono text-xs">
              {didDocumentData.service[0].id}
            </code>
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-2">
                <span className="text-muted-foreground text-sm">
                  {t("serviceType")}
                </span>
                <span className="text-sm font-medium">
                  {didDocumentData.service[0].type}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground mb-1 block text-sm">
                  {t("serviceAddress")}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={didDocumentData.service[0].serviceEndpoint}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-muted text-primary flex-1 truncate rounded font-mono text-sm break-all hover:underline"
                  >
                    {didDocumentData.service[0].serviceEndpoint}
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        didDocumentData.service[0].serviceEndpoint,
                        t("serviceAddress")
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

  const VCVisualView = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* VC标识符卡片 */}
      <Card className="border-border border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <IdCard className="text-primary h-5 w-5" />
              </div>
              <CardTitle className="text-lg">{t("vcIdentifier")}</CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs">
              {t("uniqueIdentifier")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-muted-foreground mb-2 text-sm">
              {t("credentialId")}
            </p>
            <div className="flex items-center gap-2">
              <code className="bg-muted flex-1 truncate rounded font-mono text-sm break-all">
                {vcData.id}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(vcData.id, t("vcIdentifier"))}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 发行者卡片 */}
      <Card className="border-border border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <User className="text-primary h-5 w-5" />
              </div>
              <CardTitle className="text-lg">{t("issuerInfo")}</CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs">
              {t("authority")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-muted-foreground mb-2 text-sm">
              {t("issuerDid")}
            </p>
            <code className="bg-muted block rounded font-mono text-sm break-all">
              {vcData.issuer.id}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* 发行信息卡片 */}
      <Card className="border-border border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <Calendar className="text-primary h-5 w-5" />
              </div>
              <CardTitle className="text-lg whitespace-nowrap">
                {t("issuanceInfo")}
              </CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs">
              {t("timeInfo")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-muted-foreground mb-2 text-sm">
                {t("issuanceDate")}
              </p>
              <code className="bg-muted block rounded font-mono text-sm">
                {vcData.issuanceDate}
              </code>
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm">
                {t("expirationDate")}
              </p>
              <code className="bg-muted block rounded font-mono text-sm">
                {vcData.expirationDate}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 凭证类型卡片 */}
      <Card className="border-border border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <Tag className="text-primary h-5 w-5" />
              </div>
              <CardTitle className="text-lg">{t("credentialType")}</CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs">
              {t("twoTypes")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vcData.type.map((type, index) => (
              <div key={index} className="bg-muted rounded-lg">
                <p className="text-muted-foreground mb-2 text-sm">
                  {index === 0 ? t("baseType") : t("specificType")}
                </p>
                <code className="bg-muted block rounded font-mono text-sm">
                  {type}
                </code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 凭证主题卡片 */}
      <Card className="border-border col-span-full border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <User className="text-primary h-5 w-5" />
              </div>
              <CardTitle className="text-lg">
                {t("credentialSubject")}
              </CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs">
              {t("subjectInfo")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground mb-2 text-sm">
                {t("subjectDid")}
              </p>
              <code className="bg-muted mb-4 block rounded font-mono text-sm break-all">
                {vcData.credentialSubject.id}
              </code>
            </div>
            <div>
              <p className="text-muted-foreground mb-3 text-sm">
                {t("proofInfo")}
              </p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-muted rounded-lg">
                  <p className="text-muted-foreground text-sm">{t("name")}</p>
                  <p className="font-medium">{vcData.credentialSubject.name}</p>
                </div>
                <div className="bg-muted rounded-lg">
                  <p className="text-muted-foreground text-sm">
                    {t("identityType")}
                  </p>
                  <p className="font-medium">{vcData.credentialSubject.type}</p>
                </div>
                <div className="bg-muted rounded-lg">
                  <p className="text-muted-foreground text-sm">
                    {t("organization")}
                  </p>
                  <p className="font-medium">
                    {vcData.credentialSubject.memberOf.name}
                  </p>
                </div>
                <div className="bg-muted rounded-lg">
                  <p className="text-muted-foreground text-sm whitespace-nowrap">
                    {t("authStatus")}
                  </p>
                  <p className="flex items-center gap-1 font-medium text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    {t("verified")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 数字签名卡片 */}
      <Card className="border-border col-span-full border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <Lock className="text-primary h-5 w-5" />
              </div>
              <CardTitle className="text-lg">{t("digitalSignature")}</CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs">
              {t("verificationInfo")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-muted-foreground mb-4 text-sm">
                {t("signatureAlgorithm")}
              </p>
              <code className="bg-muted block rounded font-mono text-sm">
                {vcData.proof.type}
              </code>
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm">
                {t("verificationMethod")}
              </p>
              <div className="flex items-center gap-2">
                <code className="bg-muted flex-1 truncate rounded font-mono text-sm break-all">
                  {vcData.proof.verificationMethod}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      vcData.proof.verificationMethod,
                      t("verificationMethod")
                    )
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm">
                {t("signatureValue")}
              </p>
              <div className="flex items-center gap-2">
                <code className="bg-muted flex-1 rounded font-mono text-sm break-all">
                  {vcData.proof.jws}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(vcData.proof.jws, t("signatureValue"))
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 两列布局 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 左侧：Connector Identity */}
        <div className="space-y-6">
          <Card className="border-border border">
            <CardHeader className="border-b border-gray-200 pb-6">
              <CardTitle className="text-xl font-bold md:text-2xl">
                {t("connectorIdentity")}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {t("connectorDescription")}
              </CardDescription>
            </CardHeader>

            {/* 基本信息部分 */}
            <CardContent className="px-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">
                    {t("didIdentifier")}
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted flex-grow rounded-lg font-mono text-sm break-all">
                      {connectorData.didIdentifier}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          connectorData.didIdentifier,
                          t("didIdentifier")
                        )
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1 text-sm">
                    {t("connectorName")}
                  </p>
                  <div className="bg-muted rounded-lg py-1">
                    <span className="font-medium">{connectorData.name}</span>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1 text-sm">
                    {t("connectorVersion")}
                  </p>
                  <div className="bg-muted rounded-lg">
                    <span className="font-medium">{connectorData.version}</span>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1 text-sm">
                    {t("creationTime")}
                  </p>
                  <div className="bg-muted rounded-lg">
                    <span className="font-medium">
                      {connectorData.creationDate}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>

            {/* DID文档子部分 */}
            <div className="border-t border-gray-100">
              <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-6 pb-2 sm:flex-row sm:items-center">
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-bold">
                    <FileText className="text-primary h-5 w-5" />
                    <span>{t("didDocument")}</span>
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    {t("viewDetailContent")}
                  </p>
                </div>

                {/* 视图切换按钮组 */}
                <div className="flex gap-2">
                  <Button
                    variant={didViewMode === "visual" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDidViewMode("visual")}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    {/* <span>Visual View</span> */}
                  </Button>
                  <Button
                    variant={didViewMode === "json" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDidViewMode("json")}
                    className="flex items-center gap-2"
                  >
                    <Code className="h-4 w-4" />
                    {/* <span>Raw JSON</span> */}
                  </Button>
                </div>
              </div>

              <CardContent className="p-6">
                {didViewMode === "visual" ? (
                  <DIDDocumentVisualView />
                ) : (
                  <div className="space-y-4">
                    <pre className="bg-muted overflow-x-auto rounded-lg p-6 font-mono text-sm leading-relaxed">
                      {JSON.stringify(didDocumentData, null, 2)}
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        copyToClipboard(
                          JSON.stringify(didDocumentData, null, 2),
                          `${t("didDocument")} JSON`
                        )
                      }
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      {t("copyJson")}
                    </Button>
                  </div>
                )}
              </CardContent>
            </div>
          </Card>
        </div>

        {/* 右侧：User Identity */}
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

            {/* 基本信息部分 */}
            <CardContent className="px-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">
                    {t("didIdentifier")}
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted flex-grow rounded-lg font-mono text-sm break-all">
                      {userData.didIdentifier}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          userData.didIdentifier,
                          t("didIdentifier")
                        )
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
                  <div className="bg-muted rounded-lg py-1">
                    <span className="font-medium">{userData.userType}</span>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1 text-sm">
                    {t("lastAuthTime")}
                  </p>
                  <div className="bg-muted rounded-lg">
                    <span className="font-medium">
                      {userData.lastAuthenticated}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1 text-sm">
                    {t("identityStatus")}
                  </p>
                  <div className="bg-muted rounded-lg">
                    <span className="flex items-center gap-1 font-medium text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      {t("verified")}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>

            {/* Verifiable Credential子部分 */}
            <div className="border-t border-gray-100">
              <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-6 pb-2 sm:flex-row sm:items-center">
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-bold">
                    <FileText className="text-primary h-5 w-5" />
                    <span>{t("verifiableCredential")}</span>
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    {t("viewVcDetailContent")}
                  </p>
                </div>

                {/* 视图切换按钮组 */}
                <div className="flex gap-2">
                  <Button
                    variant={vcViewMode === "visual" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setVcViewMode("visual")}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    {/* <span>Visual View</span> */}
                  </Button>
                  <Button
                    variant={vcViewMode === "json" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setVcViewMode("json")}
                    className="flex items-center gap-2"
                  >
                    <Code className="h-4 w-4" />
                    {/* <span>Raw JSON</span> */}
                  </Button>
                </div>
              </div>

              <CardContent className="p-6">
                {vcViewMode === "visual" ? (
                  <VCVisualView />
                ) : (
                  <div className="space-y-4">
                    <pre className="bg-muted overflow-x-auto rounded-lg p-6 font-mono text-sm leading-relaxed">
                      {JSON.stringify(vcData, null, 2)}
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        copyToClipboard(
                          JSON.stringify(vcData, null, 2),
                          `${t("verifiableCredential")} JSON`
                        )
                      }
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      {t("copyJson")}
                    </Button>
                  </div>
                )}
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
