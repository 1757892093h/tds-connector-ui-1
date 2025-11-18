"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
  BarChart3,
  Code,
  Database,
  FileText,
  Network,
  Shield
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const router = useRouter();
  const t = useTranslations("Layout");
  const { isAuthenticated, isLoading } = useAuth();

  // 如果已认证，重定向到 dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/identity");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // 等待重定向
  }

  const features = [
    {
      icon: Shield,
      title: "Identity Management",
      description: "Manage your DID-based identity and connector credentials",
    },
    {
      icon: Database,
      title: "Data Offering",
      description: "Publish and manage your data resources",
    },
    {
      icon: Network,
      title: "Data Consumption",
      description: "Discover and access data from other connectors",
    },
    {
      icon: FileText,
      title: "Smart Contracts",
      description: "Create and manage data sharing contracts",
    },
    {
      icon: BarChart3,
      title: "Monitoring",
      description: "Monitor system health and security alerts",
    },
    {
      icon: Code,
      title: "Sandbox",
      description: "Run data processing jobs in isolated environments",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Trusted Data Space Connector
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Secure, decentralized data sharing platform based on IDS standards
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => router.push("/auth/register")}
          >
            Get Started
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => router.push("/auth/login")}
          >
            Sign In
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Platform Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <Icon className="h-8 w-8 mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}