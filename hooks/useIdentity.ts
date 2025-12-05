import { useDataSpace } from "@/lib/contexts/DataSpaceContext";
import { getDataForSpace } from "@/lib/services/DataSpaceDataService";
import { ConnectedConnector, ConnectorHealth } from "@/types";
import { useEffect, useState } from "react";

export interface UseIdentityReturn {
  // Identity state
  connectorId: string;
  setConnectorId: (id: string) => void;
  didDocument: string;
  setDidDocument: (document: string) => void;
  isRegistered: boolean;
  setIsRegistered: (registered: boolean) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;

  // Connected connectors
  connectedConnectors: ConnectedConnector[];
  setConnectedConnectors: (connectors: ConnectedConnector[]) => void;

  // Connector health
  connectorHealth: ConnectorHealth[];
  setConnectorHealth: (health: ConnectorHealth[]) => void;

  // Dialog states
  isConnectConnectorOpen: boolean;
  setIsConnectConnectorOpen: (open: boolean) => void;

  // Form states
  newConnector: {
    did: string;
    name: string;
  };
  setNewConnector: (connector: { did: string; name: string }) => void;

  // Actions
  generateDID: () => Promise<void>;
  registerDID: () => Promise<void>;
  connectConnector: () => Promise<void>;
}

export function useIdentity(): UseIdentityReturn {
  const { currentDataSpace } = useDataSpace();
  const [connectorId, setConnectorId] = useState("");
  const [didDocument, setDidDocument] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [connectedConnectors, setConnectedConnectors] = useState<
    ConnectedConnector[]
  >([]);

  // 当数据空间切换时，更新连接的连接器数据
  useEffect(() => {
    const spaceData = getDataForSpace(currentDataSpace.id);
    setConnectedConnectors(spaceData.connectedConnectors);
  }, [currentDataSpace.id]);

  const [connectorHealth, setConnectorHealth] = useState<ConnectorHealth[]>([
    {
      id: "1",
      name: "Main Connector",
      status: "healthy",
      lastHeartbeat: "2024-01-15T10:30:00Z",
      responseTime: 120,
      uptime: "99.9%",
      version: "v1.2.3",
    },
    {
      id: "2",
      name: "Backup Connector",
      status: "healthy",
      lastHeartbeat: "2024-01-15T10:29:00Z",
      responseTime: 150,
      uptime: "99.7%",
      version: "v1.2.2",
    },
  ]);

  const [isConnectConnectorOpen, setIsConnectConnectorOpen] = useState(false);
  const [newConnector, setNewConnector] = useState({
    did: "",
    name: "",
  });

  // 在 useIdentity 函数中修改 generateDID
  const generateDID = async () => {
    setIsGenerating(true);
    try {
      // 调用后端 API 生成 DID
      const response = await fetch("/tdsc/api/v1/identity/did/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to generate DID");
      }
  
      const data = await response.json();
      const { did, didDocument, publicKey, privateKey } = data;
  
      // 存储私钥到 localStorage（实际应用中应该更安全地存储）
      localStorage.setItem(`did_private_key_${did}`, privateKey);
  
      setConnectorId(did);
      setDidDocument(JSON.stringify(didDocument, null, 2));
    } catch (error) {
      console.error("DID generation error:", error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const registerDID = async (displayName: string, dataSpaceId: string) => {
    if (!connectorId || !didDocument) {
      throw new Error("DID not generated");
    }

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Authentication required. Please login first.");
      }

      const response = await fetch("/tdsc/api/v1/identity/did/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          did: connectorId,
          display_name: displayName,
          data_space_id: dataSpaceId,
          did_document: JSON.parse(didDocument),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Failed to register DID" }));
        throw new Error(errorData.detail || "Failed to register DID");
      }

      setIsRegistered(true);
    } catch (error) {
      console.error("DID registration error:", error);
      throw error;
    }
  };

  const connectConnector = async () => {
    // Simulate connector connection
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newConnection: ConnectedConnector = {
      id: Date.now().toString(),
      name: newConnector.name,
      did: newConnector.did,
      status: "pending",
      lastSeen: new Date().toISOString(),
      offeringsCount: 0,
    };
    setConnectedConnectors((prev) => [...prev, newConnection]);
    setNewConnector({ did: "", name: "" });
    setIsConnectConnectorOpen(false);
  };

  return {
    connectorId,
    setConnectorId,
    didDocument,
    setDidDocument,
    isRegistered,
    setIsRegistered,
    isGenerating,
    setIsGenerating,
    connectedConnectors,
    setConnectedConnectors,
    connectorHealth,
    setConnectorHealth,
    isConnectConnectorOpen,
    setIsConnectConnectorOpen,
    newConnector,
    setNewConnector,
    generateDID,
    registerDID,
    connectConnector,
  };
}
