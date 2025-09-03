import { SecurityAlert, SystemMetrics } from "@/types";
import { useState } from "react";

export interface UseMonitoringReturn {
  // System metrics
  systemMetrics: SystemMetrics[];
  setSystemMetrics: (metrics: SystemMetrics[]) => void;

  // Security alerts
  securityAlerts: SecurityAlert[];
  setSecurityAlerts: (alerts: SecurityAlert[]) => void;



  // Actions
  resolveAlert: (alertId: string) => Promise<void>;
  dismissAlert: (alertId: string) => Promise<void>;
  refreshMetrics: () => Promise<void>;

  // Computed values
  criticalAlerts: SecurityAlert[];
  unresolvedAlerts: SecurityAlert[];
  latestMetrics: SystemMetrics | null;
}

export function useMonitoring(): UseMonitoringReturn {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics[]>([
    {
      timestamp: "2024-01-15T10:30:00Z",
      cpuUsage: 45,
      memoryUsage: 62,
      diskUsage: 78,
      networkIn: 1250,
      networkOut: 890,
      activeConnections: 15,
      requestsPerMinute: 324,
    },
    {
      timestamp: "2024-01-15T10:25:00Z",
      cpuUsage: 42,
      memoryUsage: 58,
      diskUsage: 78,
      networkIn: 1180,
      networkOut: 845,
      activeConnections: 12,
      requestsPerMinute: 298,
    },
    {
      timestamp: "2024-01-15T10:20:00Z",
      cpuUsage: 38,
      memoryUsage: 61,
      diskUsage: 77,
      networkIn: 1320,
      networkOut: 920,
      activeConnections: 18,
      requestsPerMinute: 356,
    },
  ]);

  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([
    {
      id: "1",
      timestamp: "2024-01-15T10:15:00Z",
      severity: "high",
      type: "authentication",
      title: "Multiple Failed Login Attempts",
      description:
        "5 failed login attempts detected from IP 192.168.1.100 in the last 10 minutes",
      source: "Authentication Service",
      resolved: false,
    },
    {
      id: "2",
      timestamp: "2024-01-15T09:45:00Z",
      severity: "medium",
      type: "data_access",
      title: "Unusual Data Access Pattern",
      description:
        "Data access from new location detected for user did:example:user123",
      source: "Data Access Monitor",
      resolved: false,
    },
    {
      id: "3",
      timestamp: "2024-01-15T08:30:00Z",
      severity: "low",
      type: "system",
      title: "High Memory Usage",
      description: "Memory usage exceeded 80% threshold on sandbox environment",
      source: "System Monitor",
      resolved: true,
    },
    {
      id: "4",
      timestamp: "2024-01-15T07:20:00Z",
      severity: "critical",
      type: "policy_violation",
      title: "Data Retention Policy Violation",
      description:
        "Data older than retention period detected in contract C-001",
      source: "Policy Engine",
      resolved: false,
    },
  ]);



  // Actions
  const resolveAlert = async (alertId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSecurityAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    );
  };

  const dismissAlert = async (alertId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    setSecurityAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  const refreshMetrics = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate new metrics
    const newMetric: SystemMetrics = {
      timestamp: new Date().toISOString(),
      cpuUsage: Math.floor(Math.random() * 100),
      memoryUsage: Math.floor(Math.random() * 100),
      diskUsage: Math.floor(75 + Math.random() * 20), // Keep disk usage realistic
      networkIn: Math.floor(1000 + Math.random() * 500),
      networkOut: Math.floor(800 + Math.random() * 400),
      activeConnections: Math.floor(10 + Math.random() * 20),
      requestsPerMinute: Math.floor(250 + Math.random() * 200),
    };

    setSystemMetrics((prev) => [newMetric, ...prev.slice(0, 9)]); // Keep last 10 metrics
  };

  // Computed values
  const criticalAlerts = securityAlerts.filter(
    (alert) => alert.severity === "critical" && !alert.resolved
  );

  const unresolvedAlerts = securityAlerts.filter((alert) => !alert.resolved);

  const latestMetrics = systemMetrics.length > 0 ? systemMetrics[0] : null;

  return {
    systemMetrics,
    setSystemMetrics,
    securityAlerts,
    setSecurityAlerts,
    resolveAlert,
    dismissAlert,
    refreshMetrics,
    criticalAlerts,
    unresolvedAlerts,
    latestMetrics,
  };
}
