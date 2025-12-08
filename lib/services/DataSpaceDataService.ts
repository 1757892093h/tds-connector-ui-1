// Data space based data service
//提供静态模拟数据
export interface DataSpaceDataConfig {
  [key: string]: {
    dataOfferings: any[];
    dataContracts: any[];
    connectedConnectors: any[];
    digitalContracts: any[];
    policyTemplates: any[];
    contractTemplates: any[];
    externalOfferings: any[];
    dataRequests: any[];
    blockchainNetworks: any[];
    blockchainTransactions: any[];
    auditLogs: any[];
  };
}

// Hosting status types
export type HostingStatus = 'hosted' | 'self_managed' | 'pending';

// Cross-border audit status types
export type CrossBorderAuditStatus = 'approved' | 'pending' | 'rejected' | 'not_required';

// Traceability information interface
export interface TraceabilityInfo {
  dataSource: string;
  blockchainMainChainId: string;
  ownerDID: string;
  traceabilityHash: string;
}

export const dataSpaceConfigs: DataSpaceDataConfig = {
  healthcare: {
    dataOfferings: [
      {
        id: "h1",
        title: "Patient Demographics Dataset",
        description:
          "Anonymized patient demographic data for healthcare analytics",
        dataType: "local_file",
        accessPolicy: "GDPR Compliant",
        status: "active",
        registrationStatus: "registered",
        createdAt: "2024-01-10T10:00:00Z",
        hostingStatus: "hosted" as HostingStatus,
        crossBorderAuditStatus: "approved" as CrossBorderAuditStatus,
        dataZoneCode: "DZ-H001-2024",
        storageLocation: "Trusted Healthcare Data Center",
        traceabilityInfo: {
          dataSource: "Regional Hospital Network",
          blockchainMainChainId: "healthcare-main-1001",
          ownerDID: "did:health:hospital-eu-123",
          traceabilityHash: "0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"
        },
        sourceConfig: {
          filePath: "/data/healthcare/patient_demographics.csv",
          format: "CSV",
          fileSize: "2.5 GB",
        },
      },
      {
        id: "h2",
        title: "Medical Imaging Archive",
        description: "De-identified medical imaging data for research",
        dataType: "s3",
        accessPolicy: "Research Only",
        status: "active",
        registrationStatus: "registered",
        createdAt: "2024-01-12T14:30:00Z",
        hostingStatus: "self_managed" as HostingStatus,
        crossBorderAuditStatus: "approved" as CrossBorderAuditStatus,
        dataZoneCode: "DZ-H002-2024",
        storageLocation: "Private Medical Cloud Storage",
        traceabilityInfo: {
          dataSource: "Medical Research Institute",
          blockchainMainChainId: "healthcare-main-1001",
          ownerDID: "did:health:research-inst-456",
          traceabilityHash: "0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567"
        },
        sourceConfig: {
          bucketName: "medical-imaging-archive",
          objectKey: "dicom/research-dataset",
          region: "us-east-1",
        },
      },
    ],
    dataContracts: [
      {
        id: "hc1",
        name: "Patient Data Access Contract",
        contractAddress: "0xhealth123456789abcdef123456789abcdef123456",
        providerDID: "did:health:provider123",
        consumerDID: "did:health:consumer456",
        policy: "GDPR Compliance",
        status: "active",
        createdAt: "2024-01-10T10:00:00Z",
        expiresAt: "2024-12-31T23:59:59Z",
        accessCount: 1523,
        dataVolume: "45.2 GB",
        maxAccessCount: 5000,
        violationCount: 0,
        isViolated: false,
        isExpired: false,
        accessMethods: ["download"],
      },
      {
        id: "hc2",
        name: "Medical Research Data Contract",
        contractAddress: "0xhealth987654321fedcba987654321fedcba987654",
        providerDID: "did:health:provider789",
        consumerDID: "did:health:consumer123",
        policy: "Medical Research",
        status: "in_use",
        createdAt: "2024-01-12T14:30:00Z",
        expiresAt: "2024-06-30T23:59:59Z",
        accessCount: 89,
        dataVolume: "12.7 GB",
        maxAccessCount: 1000,
        violationCount: 0,
        isViolated: false,
        isExpired: false,
      },
      {
        id: "hc3",
        name: "Expired Research Contract",
        contractAddress: "0xhealth111222333444555666777888999000aaabbb",
        providerDID: "did:health:provider999",
        consumerDID: "did:health:consumer999",
        policy: "Research Only",
        status: "expired",
        createdAt: "2023-01-15T10:00:00Z",
        expiresAt: "2024-01-15T23:59:59Z",
        accessCount: 2050,
        dataVolume: "78.3 GB",
        maxAccessCount: 2000,
        violationCount: 2,
        isViolated: true,
        isExpired: true,
        // Consumer perspective fields
        connectorId: "hconn1",
        connectorName: "Hospital Network EU",
        dataOfferingId: "h1",
        dataOfferingTitle: "Patient Demographics Dataset",
        accessMethods: ["download", "api"],
        lastAccessed: "2024-01-18T14:30:00Z",
      },
      {
        id: "hc4",
        name: "Research Data Access Contract",
        contractAddress: "0xhealth555666777888999000aaabbbcccddd",
        providerDID: "did:health:research-inst-456",
        consumerDID: "did:health:our-connector-123",
        policy: "Research License",
        status: "in_use",
        createdAt: "2024-01-20T09:00:00Z",
        expiresAt: "2024-07-20T23:59:59Z",
        accessCount: 245,
        dataVolume: "15.8 GB",
        maxAccessCount: 1000,
        violationCount: 0,
        isViolated: false,
        isExpired: false,
        // Consumer perspective fields
        connectorId: "hconn2",
        connectorName: "Research Institute",
        dataOfferingId: "h2",
        dataOfferingTitle: "Medical Imaging Archive",
        accessMethods: ["api"],
        lastAccessed: "2024-01-20T16:45:00Z",
      },
    ],
    connectedConnectors: [
      {
        id: "hconn1",
        name: "Hospital Network EU",
        did: "did:health:hospital-eu-123",
        status: "connected",
        lastSeen: "2024-01-15T08:30:00Z",
        offeringsCount: 15,
        description:
          "Leading European hospital network providing anonymized healthcare data for research and analytics",
        organization: "EuroHealth Consortium",
        location: "Brussels, Belgium",
        contactEmail: "data@eurohospitals.eu",
        dataCategories: [
          "Patient Demographics",
          "Medical Imaging",
          "Clinical Trials",
        ],
        certifications: ["ISO 27001", "GDPR Compliant", "HIPAA"],
        securityAssessment: {
          overallScore: 92.5,
          rating: "S",
          lastAssessed: "2024-01-10T00:00:00Z",
          assessor: "SecureAudit Corp",
          dimensions: [
            {
              name: "Identity & Trust Management",
              weight: 0.2,
              score: 1.0,
              status: "green",
              description:
                "Full mTLS implementation with certificate rotation and MFA for all access",
            },
            {
              name: "Security Communication & Encryption",
              weight: 0.15,
              score: 1.0,
              status: "green",
              description:
                "TLS 1.3 with forward secrecy and message integrity verification",
            },
            {
              name: "Access Control & Data Usage Control",
              weight: 0.25,
              score: 0.9,
              status: "green",
              description:
                "RBAC with policy engine and real-time monitoring with minor gaps in enforcement",
            },
            {
              name: "Platform & System Security",
              weight: 0.2,
              score: 0.95,
              status: "green",
              description:
                "Regular security audits, patching, and hardware-backed key protection",
            },
            {
              name: "Audit & Traceability",
              weight: 0.1,
              score: 1.0,
              status: "green",
              description:
                "Comprehensive logging with integrity protection and 12-month retention",
            },
            {
              name: "User Information & Privacy",
              weight: 0.1,
              score: 0.9,
              status: "green",
              description:
                "GDPR compliant with automated data lifecycle management",
            },
          ],
        },
      },
      {
        id: "hconn2",
        name: "Research Institute",
        did: "did:health:research-inst-456",
        status: "connected",
        lastSeen: "2024-01-14T16:45:00Z",
        offeringsCount: 8,
        description:
          "Medical research institute specializing in AI-driven healthcare analytics",
        organization: "MedTech Research Foundation",
        location: "Boston, MA, USA",
        contactEmail: "partnerships@medtechrf.org",
        dataCategories: ["Clinical Research", "AI Models", "Genomics"],
        certifications: ["ISO 27001", "SOC 2 Type II"],
        securityAssessment: {
          overallScore: 78.5,
          rating: "B",
          lastAssessed: "2024-01-08T00:00:00Z",
          assessor: "CyberSec Validators",
          dimensions: [
            {
              name: "Identity & Trust Management",
              weight: 0.2,
              score: 0.8,
              status: "yellow",
              description:
                "mTLS partially implemented, some certificate management gaps",
            },
            {
              name: "Security Communication & Encryption",
              weight: 0.15,
              score: 0.9,
              status: "green",
              description:
                "TLS 1.2/1.3 with strong ciphers and message signing",
            },
            {
              name: "Access Control & Data Usage Control",
              weight: 0.25,
              score: 0.7,
              status: "yellow",
              description:
                "Basic RBAC implemented but usage control policies need enhancement",
            },
            {
              name: "Platform & System Security",
              weight: 0.2,
              score: 0.75,
              status: "yellow",
              description:
                "Regular audits but patch management could be more systematic",
            },
            {
              name: "Audit & Traceability",
              weight: 0.1,
              score: 0.8,
              status: "yellow",
              description:
                "Good logging but integrity protection needs improvement",
            },
            {
              name: "User Information & Privacy",
              weight: 0.1,
              score: 0.85,
              status: "green",
              description: "Good privacy controls with automated anonymization",
            },
          ],
        },
      },
    ],
    digitalContracts: [],
    policyTemplates: [
      {
        id: "hp1",
        name: "Access Period Limitation",
        description: "Maximum access period for patient data - 30 days",
        rules: [
          {
            id: "hr1",
            type: "access_period",
            name: "Access Period Limitation",
            description: "Maximum access period for patient data",
            value: 30,
            unit: "days",
            isActive: true,
          },
        ],
        category: "access",
        severity: "high",
        enforcementType: "automatic",
        createdAt: "2024-01-10T10:00:00Z",
      },
      {
        id: "hp2",
        name: "Access Count Limitation",
        description:
          "Maximum number of data access requests per month - 100 requests",
        rules: [
          {
            id: "hr2",
            type: "access_count",
            name: "Access Count Limit",
            description: "Maximum number of data access requests per month",
            value: 100,
            unit: "requests/month",
            isActive: true,
          },
        ],
        category: "usage",
        severity: "medium",
        enforcementType: "automatic",
        createdAt: "2024-01-10T11:00:00Z",
      },
      {
        id: "hp3",
        name: "Identity Restriction",
        description: "Only verified medical professionals can access",
        rules: [
          {
            id: "hr3",
            type: "identity_restriction",
            name: "Medical Professional Only",
            description: "Only verified medical professionals can access",
            value: "medical_professional",
            isActive: true,
          },
        ],
        category: "compliance",
        severity: "high",
        enforcementType: "manual",
        createdAt: "2024-01-10T12:00:00Z",
      },
      {
        id: "hp4",
        name: "Encryption & Transmission Protection",
        description: "All data must be encrypted with AES-256",
        rules: [
          {
            id: "hr4",
            type: "encryption",
            name: "End-to-End Encryption",
            description: "All data must be encrypted with AES-256",
            value: "AES-256",
            isActive: true,
          },
        ],
        category: "compliance",
        severity: "high",
        enforcementType: "automatic",
        createdAt: "2024-01-10T13:00:00Z",
      },
      {
        id: "hp5",
        name: "Access IP Restriction",
        description: "Only specified IP addresses can access healthcare data",
        rules: [
          {
            id: "hr5",
            type: "ip_restriction",
            name: "IP Whitelist",
            description:
              "Only specified IP addresses can access healthcare data",
            value: "192.168.100.0/24,10.20.0.0/16",
            isActive: true,
          },
        ],
        category: "access",
        severity: "medium",
        enforcementType: "automatic",
        createdAt: "2024-01-10T14:00:00Z",
      },
      {
        id: "hp6",
        name: "Single Transfer Limit",
        description: "Maximum data transfer per session - 1000 records",
        rules: [
          {
            id: "hr6",
            type: "transfer_limit",
            name: "Transfer Volume Limit",
            description: "Maximum data transfer per session",
            value: 1000,
            unit: "records",
            isActive: true,
          },
        ],
        category: "usage",
        severity: "medium",
        enforcementType: "automatic",
        createdAt: "2024-01-10T15:00:00Z",
      },
      {
        id: "hp7",
        name: "Data Transmission QPS Limit",
        description: "Maximum queries per second for healthcare APIs - 5 QPS",
        rules: [
          {
            id: "hr7",
            type: "qps_limit",
            name: "Query Rate Limit",
            description: "Maximum queries per second for healthcare APIs",
            value: 5,
            unit: "queries/second",
            isActive: true,
          },
        ],
        category: "usage",
        severity: "medium",
        enforcementType: "automatic",
        createdAt: "2024-01-10T16:00:00Z",
      },
    ],
    contractTemplates: [
      {
        id: "hc1",
        name: "Basic Healthcare Access Contract",
        description:
          "Basic contract with access period and encryption requirements",
        policyIds: ["hp1", "hp4"],
        policies: [],
        contractType: "multi_policy",
        status: "active",
        createdAt: "2024-01-10T10:00:00Z",
        usageCount: 15,
      },
      {
        id: "hc2",
        name: "Medical Research Contract",
        description:
          "Comprehensive contract for medical research with full restrictions",
        policyIds: ["hp1", "hp2", "hp3", "hp4", "hp6"],
        policies: [],
        contractType: "multi_policy",
        status: "active",
        createdAt: "2024-01-15T09:00:00Z",
        usageCount: 8,
      },
      {
        id: "hc3",
        name: "Secure Access Contract",
        description: "High-security contract with all access controls",
        policyIds: ["hp1", "hp3", "hp4", "hp5", "hp7"],
        policies: [],
        contractType: "multi_policy",
        status: "active",
        createdAt: "2024-01-18T14:00:00Z",
        usageCount: 12,
      },
    ],
    externalOfferings: [
      {
        id: "he1",
        title: "Clinical Trial Data",
        description: "Phase III clinical trial datasets",
        dataType: "JSON/CSV",
        provider: "Pharma Research Corp",
        providerDID: "did:health:pharma123",
        accessPolicy: "Research License",
        category: "research",
        lastUpdated: "2024-01-15T08:00:00Z",
        size: "5.2 GB",
        price: "$2000/month",
        hostingStatus: "hosted" as HostingStatus,
        crossBorderAuditStatus: "approved" as CrossBorderAuditStatus,
        dataZoneCode: "DZ-HE001-2024",
        storageLocation: "International Pharma Data Center",
        traceabilityInfo: {
          dataSource: "Global Clinical Trial Network",
          blockchainMainChainId: "healthcare-main-1001",
          ownerDID: "did:health:pharma123",
          traceabilityHash: "0xhe1a2b3c4d5e6789012345678901234567890abcdef1234567890abcdef123456"
        },
      },
    ],
    dataRequests: [
      {
        id: "hdr1",
        offeringId: "he1",
        offeringTitle: "Clinical Trial Data",
        provider: "Pharma Research Corp",
        requestedAt: "2024-01-18T09:00:00Z",
        status: "approved",
        accessMode: "api",
        purpose: "Medical research for drug efficacy analysis",
      },
      {
        id: "hdr2",
        offeringId: "he2",
        offeringTitle: "Medical Imaging Archive",
        provider: "Imaging Research Center",
        requestedAt: "2024-01-19T14:30:00Z",
        status: "pending",
        accessMode: "download",
        purpose: "AI model training for diagnostic assistance",
      },
      {
        id: "hdr3",
        offeringId: "he3",
        offeringTitle: "Patient Demographics Dataset",
        provider: "Healthcare Analytics Inc",
        requestedAt: "2024-01-17T11:15:00Z",
        status: "completed",
        accessMode: "api",
        purpose: "Population health study",
      },
    ],
    blockchainNetworks: [
      {
        id: "healthcare-main",
        name: "Healthcare Identity Chain",
        type: "ZLTC",
        chainType: "main",
        chainId: 1001,
        status: "connected",
        curveAlgorithm: "Secp256k1",
        witnessNodes: 7,
        consensusNodes: 4,
        blockHeight: 2456789,
        purpose: "Identity Management",
        description:
          "Main chain for DID registration and identity verification in healthcare sector",
      },
      {
        id: "healthcare-sub",
        name: "Healthcare Business Chain",
        type: "ZLTC",
        chainType: "sub",
        chainId: 1002,
        status: "connected",
        curveAlgorithm: "Sm2p256v1",
        witnessNodes: 5,
        consensusNodes: 3,
        blockHeight: 1234567,
        purpose: "Business Operations",
        description:
          "Sub chain for audit logs and business transactions in healthcare data exchange",
      },
    ],
    blockchainTransactions: [
      // Main chain transactions
      {
        id: "htx1",
        hash: "0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
        type: "did_registration",
        from: "did:healthcare:hospital1",
        to: "IdentityRegistry",
        status: "confirmed",
        timestamp: "2024-01-20T10:30:00Z",
        blockNumber: 2456789,
        chainType: "main",
      },
      // Catalog chain transactions
      {
        id: "htx2",
        hash: "0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567",
        type: "catalog_query",
        from: "did:healthcare:researcher1",
        to: "CatalogContract",
        status: "confirmed",
        timestamp: "2024-01-20T09:15:00Z",
        blockNumber: 1234566,
        chainType: "sub",
        subChainType: "catalog",
      },
      {
        id: "htx3",
        hash: "0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678",
        type: "catalog_query",
        from: "did:healthcare:analyzer1",
        to: "DataDirectoryContract",
        status: "confirmed",
        timestamp: "2024-01-20T11:45:00Z",
        blockNumber: 1234567,
        chainType: "sub",
        subChainType: "catalog",
      },
      // Audit chain transactions
      {
        id: "htx4",
        hash: "0xd4e5f6789012345678901234567890abcdef1234567890abcdef123456789abc",
        type: "connector_operation",
        from: "did:healthcare:connector1",
        to: "AuditContract",
        status: "confirmed",
        timestamp: "2024-01-20T08:30:00Z",
        blockNumber: 1234568,
        chainType: "sub",
        subChainType: "audit",
      },
      {
        id: "htx5",
        hash: "0xe5f6789012345678901234567890abcdef1234567890abcdef123456789abcd",
        type: "connector_operation",
        from: "did:healthcare:dataProvider",
        to: "ComplianceContract",
        status: "confirmed",
        timestamp: "2024-01-20T07:45:00Z",
        blockNumber: 1234569,
        chainType: "sub",
        subChainType: "audit",
      },
      // Business chain transactions
      {
        id: "htx6",
        hash: "0xf6789012345678901234567890abcdef1234567890abcdef123456789abcde",
        type: "business_contract",
        from: "did:healthcare:hospital1",
        to: "DataSharingContract",
        status: "confirmed",
        timestamp: "2024-01-20T06:20:00Z",
        blockNumber: 1234570,
        chainType: "sub",
        subChainType: "business",
      },
      {
        id: "htx7",
        hash: "0x6789012345678901234567890abcdef1234567890abcdef123456789abcdef",
        type: "business_contract",
        from: "did:healthcare:researcher1",
        to: "ResearchContract",
        status: "pending",
        timestamp: "2024-01-20T12:15:00Z",
        blockNumber: 1234571,
        chainType: "sub",
        subChainType: "business",
      },
      // Lineage chain transactions
      {
        id: "htx8",
        hash: "0x789012345678901234567890abcdef1234567890abcdef123456789abcdef1",
        type: "lineage_trace",
        from: "did:healthcare:etlService",
        to: "LineageContract",
        status: "confirmed",
        timestamp: "2024-01-20T05:30:00Z",
        blockNumber: 1234572,
        chainType: "sub",
        subChainType: "lineage",
      },
      {
        id: "htx9",
        hash: "0x89012345678901234567890abcdef1234567890abcdef123456789abcdef12",
        type: "lineage_trace",
        from: "did:healthcare:dataProcessor",
        to: "DataTransformContract",
        status: "confirmed",
        timestamp: "2024-01-20T04:45:00Z",
        blockNumber: 1234573,
        chainType: "sub",
        subChainType: "lineage",
      },
    ],
    auditLogs: [
      {
        id: "hal1",
        timestamp: "2024-01-20T10:30:00Z",
        action: "did_registration",
        actor: "did:healthcare:hospital1",
        target: "IdentityRegistry",
        details: "Registered new healthcare provider identity",
        blockchainTxId: "htx1",
        status: "success",
      },
      {
        id: "hal2",
        timestamp: "2024-01-20T09:15:00Z",
        action: "data_transfer",
        actor: "did:healthcare:researcher1",
        target: "PatientDataset:123",
        details: "Transferred patient data for research analysis",
        blockchainTxId: "htx2",
        status: "success",
      },
    ],
  },

  finance: {
    dataOfferings: [
      {
        id: "f1",
        title: "Market Analytics Dataset",
        description: "Real-time financial market data and analytics",
        dataType: "restful",
        accessPolicy: "Commercial License",
        status: "active",
        registrationStatus: "registered",
        createdAt: "2024-01-10T10:00:00Z",
        hostingStatus: "hosted" as HostingStatus,
        crossBorderAuditStatus: "approved" as CrossBorderAuditStatus,
        dataZoneCode: "DZ-F001-2024",
        storageLocation: "Financial Data Hosting Center",
        traceabilityInfo: {
          dataSource: "Market Data Providers Network",
          blockchainMainChainId: "finance-main-2001",
          ownerDID: "did:finance:bank123",
          traceabilityHash: "0xf1a2b3c4d5e6789012345678901234567890abcdef1234567890abcdef123456"
        },
        sourceConfig: {
          apiEndpoint: "https://api.market-data.com/v1/analytics",
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      },
      {
        id: "f2",
        title: "Credit Risk Models",
        description: "Machine learning models for credit risk assessment",
        dataType: "nas",
        accessPolicy: "Partner Only",
        status: "active",
        registrationStatus: "unregistered",
        createdAt: "2024-01-12T14:30:00Z",
        hostingStatus: "pending" as HostingStatus,
        crossBorderAuditStatus: "pending" as CrossBorderAuditStatus,
        dataZoneCode: "DZ-F002-2024",
        storageLocation: "Pending Hosting Assignment",
        traceabilityInfo: {
          dataSource: "Credit Analytics Institute",
          blockchainMainChainId: "finance-main-2001",
          ownerDID: "did:finance:fintech456",
          traceabilityHash: "0xf2b3c4d5e6789012345678901234567890abcdef1234567890abcdef1234567"
        },
        sourceConfig: {
          serverAddress: "192.168.100.50",
          sharePath: "/models/credit-risk",
          protocol: "smb",
        },
      },
    ],
    dataContracts: [
      {
        id: "fc1",
        name: "Financial Market Data Contract",
        contractAddress: "0xfinance123456789abcdef123456789abcdef123456",
        providerDID: "did:finance:bank123",
        consumerDID: "did:finance:fintech456",
        policy: "Commercial License",
        status: "active",
        createdAt: "2024-01-10T10:00:00Z",
        expiresAt: "2024-12-31T23:59:59Z",
        accessCount: 8750,
        dataVolume: "125.8 GB",
        maxAccessCount: 10000,
        violationCount: 0,
        isViolated: false,
        isExpired: false,
      },
    ],
    connectedConnectors: [
      {
        id: "fconn1",
        name: "Central Bank",
        did: "did:finance:central-bank-eu-123",
        status: "connected",
        lastSeen: "2024-01-15T09:00:00Z",
        offeringsCount: 25,
        description:
          "European Central Bank providing regulatory and market data",
        organization: "European Central Bank",
        location: "Frankfurt, Germany",
        contactEmail: "data-sharing@ecb.europa.eu",
        dataCategories: [
          "Market Data",
          "Regulatory Reports",
          "Economic Indicators",
        ],
        certifications: ["ISO 27001", "SOC 2", "PCI DSS"],
        securityAssessment: {
          overallScore: 96.0,
          rating: "S",
          lastAssessed: "2024-01-05T00:00:00Z",
          assessor: "Elite Security Auditors",
          dimensions: [
            {
              name: "Identity & Trust Management",
              weight: 0.2,
              score: 1.0,
              status: "green",
              description:
                "Banking-grade identity management with hardware security modules",
            },
            {
              name: "Security Communication & Encryption",
              weight: 0.15,
              score: 1.0,
              status: "green",
              description:
                "Military-grade encryption with quantum-resistant algorithms",
            },
            {
              name: "Access Control & Data Usage Control",
              weight: 0.25,
              score: 0.95,
              status: "green",
              description:
                "Advanced ABAC with real-time policy enforcement and monitoring",
            },
            {
              name: "Platform & System Security",
              weight: 0.2,
              score: 1.0,
              status: "green",
              description:
                "Continuous security monitoring with zero-trust architecture",
            },
            {
              name: "Audit & Traceability",
              weight: 0.1,
              score: 1.0,
              status: "green",
              description:
                "Immutable audit logs with blockchain-based integrity",
            },
            {
              name: "User Information & Privacy",
              weight: 0.1,
              score: 0.8,
              status: "yellow",
              description:
                "Strong privacy controls with minor data retention optimization needed",
            },
          ],
        },
      },
      {
        id: "fconn2",
        name: "FinTech Alliance",
        did: "did:finance:fintech-alliance-456",
        status: "connected",
        lastSeen: "2024-01-14T18:30:00Z",
        offeringsCount: 12,
        description:
          "Consortium of leading fintech companies sharing innovation data",
        organization: "European FinTech Alliance",
        location: "London, UK",
        contactEmail: "partnerships@fintechalliance.eu",
        dataCategories: [
          "Innovation Metrics",
          "Market Analytics",
          "Risk Models",
        ],
        certifications: ["ISO 27001", "FCA Regulated"],
        securityAssessment: {
          overallScore: 82.5,
          rating: "A",
          lastAssessed: "2024-01-12T00:00:00Z",
          assessor: "Financial Security Corp",
          dimensions: [
            {
              name: "Identity & Trust Management",
              weight: 0.2,
              score: 0.85,
              status: "green",
              description:
                "Strong identity controls with multi-factor authentication",
            },
            {
              name: "Security Communication & Encryption",
              weight: 0.15,
              score: 0.9,
              status: "green",
              description:
                "TLS 1.3 with strong cipher suites and certificate pinning",
            },
            {
              name: "Access Control & Data Usage Control",
              weight: 0.25,
              score: 0.8,
              status: "yellow",
              description: "Good RBAC but usage policies need strengthening",
            },
            {
              name: "Platform & System Security",
              weight: 0.2,
              score: 0.8,
              status: "yellow",
              description:
                "Regular security updates with good vulnerability management",
            },
            {
              name: "Audit & Traceability",
              weight: 0.1,
              score: 0.85,
              status: "green",
              description: "Comprehensive logging with good retention policies",
            },
            {
              name: "User Information & Privacy",
              weight: 0.1,
              score: 0.9,
              status: "green",
              description: "GDPR compliant with strong privacy by design",
            },
          ],
        },
      },
    ],
    digitalContracts: [],
    policyTemplates: [
      {
        id: "fp1",
        name: "Access Period Limitation",
        description:
          "Maximum session duration for financial data access - 4 hours",
        rules: [
          {
            id: "fr1",
            type: "access_period",
            name: "Session Timeout",
            description: "Maximum session duration for financial data access",
            value: 4,
            unit: "hours",
            isActive: true,
          },
        ],
        category: "access",
        severity: "high",
        enforcementType: "automatic",
        createdAt: "2024-01-08T10:00:00Z",
      },
      {
        id: "fp2",
        name: "Access Count Limitation",
        description: "Maximum data access requests per day - 1000 requests",
        rules: [
          {
            id: "fr2",
            type: "access_count",
            name: "Daily Access Limit",
            description: "Maximum data access requests per day",
            value: 1000,
            unit: "requests/day",
            isActive: true,
          },
        ],
        category: "usage",
        severity: "high",
        enforcementType: "automatic",
        createdAt: "2024-01-08T11:00:00Z",
      },
      {
        id: "fp3",
        name: "Identity Restriction",
        description: "Only authorized financial institutions can access",
        rules: [
          {
            id: "fr3",
            type: "identity_restriction",
            name: "Financial Institution Only",
            description: "Only authorized financial institutions can access",
            value: "financial_institution",
            isActive: true,
          },
        ],
        category: "compliance",
        severity: "high",
        enforcementType: "manual",
        createdAt: "2024-01-08T12:00:00Z",
      },
      {
        id: "fp4",
        name: "Encryption & Transmission Protection",
        description: "All financial data must use TLS 1.3 encryption",
        rules: [
          {
            id: "fr4",
            type: "encryption",
            name: "TLS 1.3 Encryption",
            description: "All financial data must use TLS 1.3 encryption",
            value: "TLS-1.3",
            isActive: true,
          },
        ],
        category: "compliance",
        severity: "high",
        enforcementType: "automatic",
        createdAt: "2024-01-08T13:00:00Z",
      },
      {
        id: "fp5",
        name: "Access IP Restriction",
        description: "Only specified IP addresses can access financial data",
        rules: [
          {
            id: "fr5",
            type: "ip_restriction",
            name: "IP Whitelist",
            description:
              "Only specified IP addresses can access financial data",
            value: "192.168.1.0/24,10.0.0.0/8",
            isActive: true,
          },
        ],
        category: "access",
        severity: "medium",
        enforcementType: "automatic",
        createdAt: "2024-01-08T14:00:00Z",
      },
      {
        id: "fp6",
        name: "Single Transfer Limit",
        description: "Maximum records per bulk transfer - 50000 records",
        rules: [
          {
            id: "fr6",
            type: "transfer_limit",
            name: "Bulk Transfer Limit",
            description: "Maximum records per bulk transfer",
            value: 50000,
            unit: "records",
            isActive: true,
          },
        ],
        category: "usage",
        severity: "medium",
        enforcementType: "automatic",
        createdAt: "2024-01-08T15:00:00Z",
      },
      {
        id: "fp7",
        name: "Data Transmission QPS Limit",
        description: "Maximum queries per second for financial APIs - 10 QPS",
        rules: [
          {
            id: "fr7",
            type: "qps_limit",
            name: "Query Rate Limit",
            description: "Maximum queries per second for financial APIs",
            value: 10,
            unit: "queries/second",
            isActive: true,
          },
        ],
        category: "usage",
        severity: "high",
        enforcementType: "automatic",
        createdAt: "2024-01-08T16:00:00Z",
      },
    ],
    contractTemplates: [
      {
        id: "fc1",
        name: "Basic Financial Access Contract",
        description: "Basic contract with session timeout and encryption",
        policyIds: ["fp1", "fp4"],
        policies: [],
        contractType: "multi_policy",
        status: "active",
        createdAt: "2024-01-08T10:00:00Z",
        usageCount: 25,
      },
      {
        id: "fc2",
        name: "High-Frequency Trading Contract",
        description: "Enhanced contract for trading data with all restrictions",
        policyIds: ["fp1", "fp2", "fp3", "fp4", "fp7"],
        policies: [],
        contractType: "multi_policy",
        status: "active",
        createdAt: "2024-01-10T11:00:00Z",
        usageCount: 12,
      },
      {
        id: "fc3",
        name: "Secure Financial Data Contract",
        description: "Maximum security contract with all access controls",
        policyIds: ["fp1", "fp3", "fp4", "fp5", "fp6", "fp7"],
        policies: [],
        contractType: "multi_policy",
        status: "active",
        createdAt: "2024-01-12T15:00:00Z",
        usageCount: 8,
      },
    ],
    externalOfferings: [
      {
        id: "fe1",
        title: "ESG Ratings Database",
        description:
          "Environmental, Social, and Governance ratings for listed companies",
        dataType: "JSON/XML",
        provider: "ESG Analytics Inc",
        providerDID: "did:finance:esg123",
        accessPolicy: "Subscription",
        category: "analytics",
        lastUpdated: "2024-01-15T10:00:00Z",
        size: "1.8 GB",
        price: "$5000/month",
        hostingStatus: "hosted" as HostingStatus,
        crossBorderAuditStatus: "approved" as CrossBorderAuditStatus,
        dataZoneCode: "DZ-FE001-2024",
        storageLocation: "Financial Analytics Cloud",
        traceabilityInfo: {
          dataSource: "Global ESG Rating Agencies",
          blockchainMainChainId: "finance-main-2001",
          ownerDID: "did:finance:esg123",
          traceabilityHash: "0xfe1a2b3c4d5e6789012345678901234567890abcdef1234567890abcdef123456"
        },
      },
    ],
    dataRequests: [
      {
        id: "fdr1",
        offeringId: "fe1",
        offeringTitle: "ESG Ratings Database",
        provider: "ESG Analytics Inc",
        requestedAt: "2024-01-19T10:00:00Z",
        status: "approved",
        accessMode: "api",
        purpose: "ESG investment analysis and portfolio optimization",
      },
      {
        id: "fdr2",
        offeringId: "fe2",
        offeringTitle: "Financial Market Data",
        provider: "Market Data Corp",
        requestedAt: "2024-01-20T08:30:00Z",
        status: "pending",
        accessMode: "download",
        purpose: "Risk assessment and algorithmic trading",
      },
    ],
    blockchainNetworks: [
      {
        id: "finance-main",
        name: "Financial Identity Chain",
        type: "ZLTC",
        chainType: "main",
        chainId: 2001,
        status: "connected",
        curveAlgorithm: "Secp256k1",
        witnessNodes: 9,
        consensusNodes: 5,
        blockHeight: 3567890,
        purpose: "Identity Management",
        description:
          "Main chain for financial institution identity verification and KYC processes",
      },
      {
        id: "finance-sub",
        name: "Financial Business Chain",
        type: "ZLTC",
        chainType: "sub",
        chainId: 2002,
        status: "connected",
        curveAlgorithm: "Sm2p256v1",
        witnessNodes: 7,
        consensusNodes: 4,
        blockHeight: 2345678,
        purpose: "Business Operations",
        description:
          "Sub chain for transaction audit logs and compliance monitoring",
      },
    ],
    blockchainTransactions: [
      // Main chain transactions
      {
        id: "ftx1",
        hash: "0xf1a2b3c4d5e6789012345678901234567890abcdef1234567890abcdef123456",
        type: "did_registration",
        from: "did:finance:bank1",
        to: "FinancialRegistry",
        status: "confirmed",
        timestamp: "2024-01-20T14:20:00Z",
        blockNumber: 3567890,
        chainType: "main",
      },
      // Catalog chain transactions
      {
        id: "ftx2",
        hash: "0xf2b3c4d5e6789012345678901234567890abcdef1234567890abcdef1234567",
        type: "catalog_query",
        from: "did:finance:trader1",
        to: "MarketDataCatalog",
        status: "confirmed",
        timestamp: "2024-01-20T13:45:00Z",
        blockNumber: 2345677,
        chainType: "sub",
        subChainType: "catalog",
      },
      {
        id: "ftx3",
        hash: "0xf3c4d5e6789012345678901234567890abcdef1234567890abcdef12345678",
        type: "catalog_query",
        from: "did:finance:analyst1",
        to: "ESGDataDirectory",
        status: "confirmed",
        timestamp: "2024-01-20T12:30:00Z",
        blockNumber: 2345678,
        chainType: "sub",
        subChainType: "catalog",
      },
      // Audit chain transactions
      {
        id: "ftx4",
        hash: "0xf4d5e6789012345678901234567890abcdef1234567890abcdef123456789a",
        type: "connector_operation",
        from: "did:finance:regulator1",
        to: "ComplianceAudit",
        status: "confirmed",
        timestamp: "2024-01-20T11:15:00Z",
        blockNumber: 2345679,
        chainType: "sub",
        subChainType: "audit",
      },
      {
        id: "ftx5",
        hash: "0xf5e6789012345678901234567890abcdef1234567890abcdef123456789ab",
        type: "connector_operation",
        from: "did:finance:bank1",
        to: "KYCAuditContract",
        status: "confirmed",
        timestamp: "2024-01-20T10:00:00Z",
        blockNumber: 2345680,
        chainType: "sub",
        subChainType: "audit",
      },
      // Business chain transactions
      {
        id: "ftx6",
        hash: "0xf6789012345678901234567890abcdef1234567890abcdef123456789abc",
        type: "business_contract",
        from: "did:finance:bank1",
        to: "TradingLicenseContract",
        status: "confirmed",
        timestamp: "2024-01-20T09:30:00Z",
        blockNumber: 2345681,
        chainType: "sub",
        subChainType: "business",
      },
      {
        id: "ftx7",
        hash: "0xf789012345678901234567890abcdef1234567890abcdef123456789abcd",
        type: "business_contract",
        from: "did:finance:fintech456",
        to: "PaymentServiceContract",
        status: "pending",
        timestamp: "2024-01-20T15:45:00Z",
        blockNumber: 2345682,
        chainType: "sub",
        subChainType: "business",
      },
      // Lineage chain transactions
      {
        id: "ftx8",
        hash: "0xf89012345678901234567890abcdef1234567890abcdef123456789abcde",
        type: "lineage_trace",
        from: "did:finance:dataProcessor",
        to: "RiskModelLineage",
        status: "confirmed",
        timestamp: "2024-01-20T08:20:00Z",
        blockNumber: 2345683,
        chainType: "sub",
        subChainType: "lineage",
      },
      {
        id: "ftx9",
        hash: "0xf9012345678901234567890abcdef1234567890abcdef123456789abcdef",
        type: "lineage_trace",
        from: "did:finance:aggregator",
        to: "MarketDataLineage",
        status: "confirmed",
        timestamp: "2024-01-20T07:45:00Z",
        blockNumber: 2345684,
        chainType: "sub",
        subChainType: "lineage",
      },
    ],
    auditLogs: [
      {
        id: "fal1",
        timestamp: "2024-01-20T14:20:00Z",
        action: "did_registration",
        actor: "did:finance:bank1",
        target: "FinancialRegistry",
        details: "Registered new financial institution identity",
        blockchainTxId: "ftx1",
        status: "success",
      },
      {
        id: "fal2",
        timestamp: "2024-01-20T13:45:00Z",
        action: "data_transfer",
        actor: "did:finance:trader1",
        target: "TradingData:456",
        details: "High-frequency trading data transfer",
        blockchainTxId: "ftx2",
        status: "success",
      },
    ],
  },

  mobility: {
    dataOfferings: [
      {
        id: "m1",
        title: "Traffic Flow Data",
        description: "Real-time traffic flow and congestion data",
        dataType: "restful",
        accessPolicy: "Open Data",
        status: "active",
        registrationStatus: "registered",
        createdAt: "2024-01-10T10:00:00Z",
        hostingStatus: "hosted" as HostingStatus,
        crossBorderAuditStatus: "not_required" as CrossBorderAuditStatus,
        dataZoneCode: "DZ-M001-2024",
        storageLocation: "Smart City Data Hub",
        traceabilityInfo: {
          dataSource: "City Traffic Management System",
          blockchainMainChainId: "mobility-main-3001",
          ownerDID: "did:mobility:smart-city-123",
          traceabilityHash: "0xm1a2b3c4d5e6789012345678901234567890abcdef1234567890abcdef123456"
        },
        sourceConfig: {
          apiEndpoint: "https://api.city-traffic.gov/v1/flow",
          method: "GET",
        },
      },
      {
        id: "m2",
        title: "Public Transport Schedule",
        description: "Dynamic public transportation schedules and delays",
        dataType: "local_file",
        accessPolicy: "Municipal License",
        status: "active",
        registrationStatus: "registering",
        createdAt: "2024-01-12T14:30:00Z",
        hostingStatus: "self_managed" as HostingStatus,
        crossBorderAuditStatus: "not_required" as CrossBorderAuditStatus,
        dataZoneCode: "DZ-M002-2024",
        storageLocation: "Municipal Transport Authority",
        traceabilityInfo: {
          dataSource: "Public Transport Network",
          blockchainMainChainId: "mobility-main-3001",
          ownerDID: "did:mobility:transport-hub-456",
          traceabilityHash: "0xm2b3c4d5e6789012345678901234567890abcdef1234567890abcdef1234567"
        },
        sourceConfig: {
          filePath: "/data/transport/gtfs-realtime.json",
          format: "JSON",
          fileSize: "850 MB",
        },
      },
    ],
    dataContracts: [
      {
        id: "mc1",
        name: "City Traffic Data Contract",
        contractAddress: "0xmobility123456789abcdef123456789abcdef12345",
        providerDID: "did:mobility:city123",
        consumerDID: "did:mobility:transport456",
        policy: "Open Access",
        status: "transferring",
        createdAt: "2024-01-10T10:00:00Z",
        accessCount: 567,
        dataVolume: "23.4 GB",
        maxAccessCount: 1000,
        violationCount: 0,
        isViolated: false,
        isExpired: false,
        // Consumer perspective fields
        connectorId: "mconn1",
        connectorName: "Smart City Platform",
        dataOfferingId: "m1",
        dataOfferingTitle: "Traffic Flow Data",
        accessMethods: ["api"],
        lastAccessed: "2024-01-19T11:30:00Z",
      },
      {
        id: "mc2",
        name: "Public Transport Data Contract",
        contractAddress: "0xmobility789abc123def456ghi789jkl012mno345pqr",
        providerDID: "did:mobility:transport-hub-456",
        consumerDID: "did:mobility:our-connector-789",
        policy: "Municipal License",
        status: "active",
        createdAt: "2024-01-18T15:00:00Z",
        expiresAt: "2024-06-18T23:59:59Z",
        accessCount: 156,
        dataVolume: "8.2 GB",
        maxAccessCount: 500,
        violationCount: 0,
        isViolated: false,
        isExpired: false,
        // Consumer perspective fields
        connectorId: "mconn2",
        connectorName: "Transport Analytics Hub",
        dataOfferingId: "m2",
        dataOfferingTitle: "Public Transport Schedule",
        accessMethods: ["download", "api"],
        lastAccessed: "2024-01-20T09:15:00Z",
      },
    ],
    connectedConnectors: [
      {
        id: "mconn1",
        name: "Smart City Platform",
        did: "did:mobility:smart-city-123",
        status: "connected",
        lastSeen: "2024-01-15T07:45:00Z",
        offeringsCount: 20,
        description:
          "Comprehensive smart city platform providing real-time urban mobility data and analytics",
        organization: "Metropolitan Smart City Alliance",
        location: "Amsterdam, Netherlands",
        contactEmail: "data@smartcity-amsterdam.eu",
        dataCategories: [
          "Traffic Data",
          "Public Transport",
          "Bike Sharing",
          "Parking",
        ],
        certifications: ["ISO 27001", "Smart City Certified", "GDPR Compliant"],
        securityAssessment: {
          overallScore: 85.5,
          rating: "A",
          lastAssessed: "2024-01-12T00:00:00Z",
          assessor: "Urban Security Solutions",
          dimensions: [
            {
              name: "Identity & Trust Management",
              weight: 0.2,
              score: 0.85,
              status: "green",
              description:
                "Strong IoT device identity management with certificate-based authentication",
            },
            {
              name: "Security Communication & Encryption",
              weight: 0.15,
              score: 0.9,
              status: "green",
              description:
                "TLS 1.3 for API communications with IoT security protocols",
            },
            {
              name: "Access Control & Data Usage Control",
              weight: 0.25,
              score: 0.8,
              status: "yellow",
              description:
                "Good RBAC implementation but real-time policy enforcement needs improvement",
            },
            {
              name: "Platform & System Security",
              weight: 0.2,
              score: 0.85,
              status: "green",
              description:
                "Regular security updates with IoT device management and monitoring",
            },
            {
              name: "Audit & Traceability",
              weight: 0.1,
              score: 0.9,
              status: "green",
              description:
                "Comprehensive logging with smart city data provenance tracking",
            },
            {
              name: "User Information & Privacy",
              weight: 0.1,
              score: 0.9,
              status: "green",
              description:
                "Privacy-preserving data collection with citizen consent management",
            },
          ],
        },
      },
      {
        id: "mconn2",
        name: "Transport Analytics Hub",
        did: "did:mobility:transport-hub-456",
        status: "connected",
        lastSeen: "2024-01-14T19:20:00Z",
        offeringsCount: 12,
        description:
          "Advanced transportation analytics and optimization platform for multi-modal urban mobility",
        organization: "European Transport Research Institute",
        location: "Berlin, Germany",
        contactEmail: "partnerships@etri.eu",
        dataCategories: [
          "Route Optimization",
          "Mobility Patterns",
          "Carbon Footprint",
        ],
        certifications: ["ISO 14001", "Carbon Trust Standard"],
        securityAssessment: {
          overallScore: 76.0,
          rating: "B",
          lastAssessed: "2024-01-09T00:00:00Z",
          assessor: "Transport Security Group",
          dimensions: [
            {
              name: "Identity & Trust Management",
              weight: 0.2,
              score: 0.75,
              status: "yellow",
              description:
                "Basic identity management with some gaps in multi-modal authentication",
            },
            {
              name: "Security Communication & Encryption",
              weight: 0.15,
              score: 0.8,
              status: "yellow",
              description:
                "Good encryption but some legacy transport protocols need updating",
            },
            {
              name: "Access Control & Data Usage Control",
              weight: 0.25,
              score: 0.7,
              status: "yellow",
              description:
                "Basic access controls with limited data usage policy enforcement",
            },
            {
              name: "Platform & System Security",
              weight: 0.2,
              score: 0.8,
              status: "yellow",
              description:
                "Regular updates but vulnerability management could be more proactive",
            },
            {
              name: "Audit & Traceability",
              weight: 0.1,
              score: 0.75,
              status: "yellow",
              description:
                "Good logging but cross-system traceability needs improvement",
            },
            {
              name: "User Information & Privacy",
              weight: 0.1,
              score: 0.8,
              status: "yellow",
              description:
                "GDPR compliant with room for improvement in anonymization techniques",
            },
          ],
        },
      },
    ],
    digitalContracts: [],
    policyTemplates: [
      {
        id: "mp1",
        name: "Access Period Limitation",
        description:
          "Maximum time window for real-time mobility data - 24 hours",
        rules: [
          {
            id: "mr1",
            type: "access_period",
            name: "Real-time Access Window",
            description: "Maximum time window for real-time mobility data",
            value: 24,
            unit: "hours",
            isActive: true,
          },
        ],
        category: "access",
        severity: "medium",
        enforcementType: "automatic",
        createdAt: "2024-01-09T08:00:00Z",
      },
      {
        id: "mp2",
        name: "Access Count Limitation",
        description:
          "Maximum API calls per day for mobility data - 5000 requests",
        rules: [
          {
            id: "mr2",
            type: "access_count",
            name: "Daily API Limit",
            description: "Maximum API calls per day for mobility data",
            value: 5000,
            unit: "requests/day",
            isActive: true,
          },
        ],
        category: "usage",
        severity: "medium",
        enforcementType: "automatic",
        createdAt: "2024-01-09T09:00:00Z",
      },
      {
        id: "mp3",
        name: "Identity Restriction",
        description: "Only registered mobility service providers can access",
        rules: [
          {
            id: "mr3",
            type: "identity_restriction",
            name: "Mobility Service Provider",
            description:
              "Only registered mobility service providers can access",
            value: "mobility_provider",
            isActive: true,
          },
        ],
        category: "compliance",
        severity: "medium",
        enforcementType: "manual",
        createdAt: "2024-01-09T10:00:00Z",
      },
      {
        id: "mp4",
        name: "Data Transmission QPS Limit",
        description:
          "Maximum API calls per second for mobility services - 50 QPS",
        rules: [
          {
            id: "mr4",
            type: "qps_limit",
            name: "API Rate Limit",
            description: "Maximum API calls per second for mobility services",
            value: 50,
            unit: "calls/second",
            isActive: true,
          },
        ],
        category: "usage",
        severity: "medium",
        enforcementType: "automatic",
        createdAt: "2024-01-09T11:00:00Z",
      },
    ],
    contractTemplates: [
      {
        id: "mc1",
        name: "Basic Mobility Data Contract",
        description: "Basic contract for mobility data access with time limits",
        policyIds: ["mp1", "mp2"],
        policies: [],
        contractType: "multi_policy",
        status: "active",
        createdAt: "2024-01-09T08:00:00Z",
        usageCount: 18,
      },
      {
        id: "mc2",
        name: "Professional Mobility Service Contract",
        description:
          "Comprehensive contract for registered mobility service providers",
        policyIds: ["mp1", "mp2", "mp3", "mp4"],
        policies: [],
        contractType: "multi_policy",
        status: "active",
        createdAt: "2024-01-12T10:00:00Z",
        usageCount: 7,
      },
    ],
    externalOfferings: [
      {
        id: "me1",
        title: "Weather Impact on Transport",
        description: "Weather data correlated with transportation disruptions",
        dataType: "JSON",
        provider: "Weather & Transport Analytics",
        providerDID: "did:mobility:weather123",
        accessPolicy: "Open Access",
        category: "analytics",
        lastUpdated: "2024-01-15T06:00:00Z",
        size: "3.1 GB",
        hostingStatus: "hosted" as HostingStatus,
        crossBorderAuditStatus: "not_required" as CrossBorderAuditStatus,
        dataZoneCode: "DZ-ME001-2024",
        storageLocation: "Weather Analytics Hub",
        traceabilityInfo: {
          dataSource: "Meteorological Services Network",
          blockchainMainChainId: "mobility-main-3001",
          ownerDID: "did:mobility:weather123",
          traceabilityHash: "0xme1a2b3c4d5e6789012345678901234567890abcdef1234567890abcdef123456"
        },
      },
    ],
    dataRequests: [
      {
        id: "mdr1",
        offeringId: "me1",
        offeringTitle: "Weather Impact on Transport",
        provider: "Weather & Transport Analytics",
        requestedAt: "2024-01-20T12:00:00Z",
        status: "approved",
        accessMode: "api",
        purpose: "Smart city traffic optimization and route planning",
      },
      {
        id: "mdr2",
        offeringId: "me2",
        offeringTitle: "Public Transport Data",
        provider: "City Transport Authority",
        requestedAt: "2024-01-18T16:45:00Z",
        status: "completed",
        accessMode: "download",
        purpose: "Urban mobility analysis and service improvement",
      },
    ],
    blockchainNetworks: [
      {
        id: "mobility-main",
        name: "Mobility Identity Chain",
        type: "ZLTC",
        chainType: "main",
        chainId: 3001,
        status: "connected",
        curveAlgorithm: "Secp256k1",
        witnessNodes: 5,
        consensusNodes: 3,
        blockHeight: 1789012,
        purpose: "Identity Management",
        description:
          "Main chain for mobility service provider identity verification",
      },
      {
        id: "mobility-sub",
        name: "Mobility Business Chain",
        type: "ZLTC",
        chainType: "sub",
        chainId: 3002,
        status: "connected",
        curveAlgorithm: "Sm2p256v1",
        witnessNodes: 3,
        consensusNodes: 2,
        blockHeight: 987654,
        purpose: "Business Operations",
        description:
          "Sub chain for transportation data audit and smart city operations",
      },
    ],
    blockchainTransactions: [
      // Main chain transactions
      {
        id: "mtx1",
        hash: "0xm1a2b3c4d5e6789012345678901234567890abcdef1234567890abcdef123456",
        type: "did_registration",
        from: "did:mobility:transport1",
        to: "MobilityRegistry",
        status: "confirmed",
        timestamp: "2024-01-20T16:10:00Z",
        blockNumber: 1789012,
        chainType: "main",
      },
      // Catalog chain transactions
      {
        id: "mtx2",
        hash: "0xm2b3c4d5e6789012345678901234567890abcdef1234567890abcdef1234567",
        type: "catalog_query",
        from: "did:mobility:city1",
        to: "TrafficDataCatalog",
        status: "confirmed",
        timestamp: "2024-01-20T15:30:00Z",
        blockNumber: 987653,
        chainType: "sub",
        subChainType: "catalog",
      },
      {
        id: "mtx3",
        hash: "0xm3c4d5e6789012345678901234567890abcdef1234567890abcdef12345678",
        type: "catalog_query",
        from: "did:mobility:scheduler1",
        to: "TransportScheduleDirectory",
        status: "confirmed",
        timestamp: "2024-01-20T14:45:00Z",
        blockNumber: 987654,
        chainType: "sub",
        subChainType: "catalog",
      },
      // Audit chain transactions
      {
        id: "mtx4",
        hash: "0xm4d5e6789012345678901234567890abcdef1234567890abcdef123456789a",
        type: "connector_operation",
        from: "did:mobility:regulator1",
        to: "TransportComplianceAudit",
        status: "confirmed",
        timestamp: "2024-01-20T13:20:00Z",
        blockNumber: 987655,
        chainType: "sub",
        subChainType: "audit",
      },
      {
        id: "mtx5",
        hash: "0xm5e6789012345678901234567890abcdef1234567890abcdef123456789ab",
        type: "connector_operation",
        from: "did:mobility:smartCity1",
        to: "UrbanMobilityAudit",
        status: "confirmed",
        timestamp: "2024-01-20T12:15:00Z",
        blockNumber: 987656,
        chainType: "sub",
        subChainType: "audit",
      },
      // Business chain transactions
      {
        id: "mtx6",
        hash: "0xm6789012345678901234567890abcdef1234567890abcdef123456789abc",
        type: "business_contract",
        from: "did:mobility:transport1",
        to: "RouteOptimizationContract",
        status: "confirmed",
        timestamp: "2024-01-20T11:30:00Z",
        blockNumber: 987657,
        chainType: "sub",
        subChainType: "business",
      },
      {
        id: "mtx7",
        hash: "0xm789012345678901234567890abcdef1234567890abcdef123456789abcd",
        type: "business_contract",
        from: "did:mobility:rideshare1",
        to: "DynamicPricingContract",
        status: "pending",
        timestamp: "2024-01-20T17:00:00Z",
        blockNumber: 987658,
        chainType: "sub",
        subChainType: "business",
      },
      // Lineage chain transactions
      {
        id: "mtx8",
        hash: "0xm89012345678901234567890abcdef1234567890abcdef123456789abcde",
        type: "lineage_trace",
        from: "did:mobility:aggregator1",
        to: "TrafficPatternLineage",
        status: "confirmed",
        timestamp: "2024-01-20T10:45:00Z",
        blockNumber: 987659,
        chainType: "sub",
        subChainType: "lineage",
      },
      {
        id: "mtx9",
        hash: "0xm9012345678901234567890abcdef1234567890abcdef123456789abcdef",
        type: "lineage_trace",
        from: "did:mobility:predictor1",
        to: "RouteOptimizationLineage",
        status: "confirmed",
        timestamp: "2024-01-20T09:30:00Z",
        blockNumber: 987660,
        chainType: "sub",
        subChainType: "lineage",
      },
    ],
    auditLogs: [
      {
        id: "mal1",
        timestamp: "2024-01-20T16:10:00Z",
        action: "did_registration",
        actor: "did:mobility:transport1",
        target: "MobilityRegistry",
        details: "Registered new transport service provider",
        blockchainTxId: "mtx1",
        status: "success",
      },
      {
        id: "mal2",
        timestamp: "2024-01-20T15:30:00Z",
        action: "data_transfer",
        actor: "did:mobility:city1",
        target: "TrafficData:789",
        details: "Real-time traffic data update",
        blockchainTxId: "mtx2",
        status: "success",
      },
    ],
  },

  energy: {
    dataOfferings: [
      {
        id: "e1",
        title: "Grid Load Forecasting",
        description:
          "Electrical grid load prediction models and historical data",
        dataType: "s3",
        accessPolicy: "Utility Partners",
        status: "inactive",
        registrationStatus: "failed",
        createdAt: "2024-01-10T10:00:00Z",
        hostingStatus: "pending" as HostingStatus,
        crossBorderAuditStatus: "rejected" as CrossBorderAuditStatus,
        dataZoneCode: "DZ-E001-2024",
        storageLocation: "Critical Infrastructure Center (Pending)",
        traceabilityInfo: {
          dataSource: "National Grid System",
          blockchainMainChainId: "energy-main-4001",
          ownerDID: "did:energy:grid-op-123",
          traceabilityHash: "0xe1a2b3c4d5e6789012345678901234567890abcdef1234567890abcdef123456"
        },
        sourceConfig: {
          bucketName: "energy-grid-data",
          objectKey: "forecasting/load-models",
          region: "eu-central-1",
        },
      },
    ],
    dataContracts: [
      {
        id: "ec1",
        name: "Critical Infrastructure Data Contract",
        contractAddress: "0xenergy000111222333444555666777888999aaabbb",
        providerDID: "did:energy:grid123",
        consumerDID: "did:energy:operator456",
        policy: "Critical Infrastructure",
        status: "data_unavailable",
        createdAt: "2024-01-05T10:00:00Z",
        expiresAt: "2024-07-05T23:59:59Z",
        accessCount: 0,
        dataVolume: "0 GB",
        maxAccessCount: 50,
        violationCount: 0,
        isViolated: false,
        isExpired: false,
        // Consumer perspective fields
        connectorId: "econn1",
        connectorName: "Energy Grid Operator",
        dataOfferingId: "e1",
        dataOfferingTitle: "Grid Load Forecasting",
        accessMethods: ["api"],
        lastAccessed: undefined, // Never accessed due to data unavailable status
      },
    ],
    connectedConnectors: [
      {
        id: "econn1",
        name: "Energy Grid Operator",
        did: "did:energy:grid-op-123",
        status: "pending",
        lastSeen: "2024-01-10T12:00:00Z",
        offeringsCount: 5,
        description:
          "Critical infrastructure operator managing national electrical grid data and renewable energy integration",
        organization: "National Grid Energy Corp",
        location: "Frankfurt, Germany",
        contactEmail: "security@nationalgrid.de",
        dataCategories: [
          "Grid Load",
          "Renewable Sources",
          "Critical Infrastructure",
        ],
        certifications: ["IEC 62443", "ISO 27019", "NERC CIP"],
        securityAssessment: {
          overallScore: 58.5,
          rating: "C",
          lastAssessed: "2024-01-05T00:00:00Z",
          assessor: "Critical Infrastructure Security",
          dimensions: [
            {
              name: "Identity & Trust Management",
              weight: 0.2,
              score: 0.6,
              status: "yellow",
              description:
                "Basic SCADA authentication but lacks modern identity federation",
            },
            {
              name: "Security Communication & Encryption",
              weight: 0.15,
              score: 0.7,
              status: "yellow",
              description:
                "Some encrypted channels but legacy industrial protocols present",
            },
            {
              name: "Access Control & Data Usage Control",
              weight: 0.25,
              score: 0.5,
              status: "red",
              description:
                "Limited access controls with insufficient data usage monitoring",
            },
            {
              name: "Platform & System Security",
              weight: 0.2,
              score: 0.6,
              status: "yellow",
              description:
                "Critical infrastructure protection but patch management is slow",
            },
            {
              name: "Audit & Traceability",
              weight: 0.1,
              score: 0.4,
              status: "red",
              description:
                "Basic logging but insufficient for comprehensive audit trails",
            },
            {
              name: "User Information & Privacy",
              weight: 0.1,
              score: 0.8,
              status: "yellow",
              description:
                "Good privacy controls but data retention policies need updates",
            },
          ],
        },
      },
      {
        id: "econn2",
        name: "Renewable Energy Cooperative",
        did: "did:energy:renewable-coop-789",
        status: "disconnected",
        lastSeen: "2024-01-05T16:30:00Z",
        offeringsCount: 3,
        description:
          "Community-based renewable energy network providing distributed generation data and smart grid analytics",
        organization: "European Renewable Energy Alliance",
        location: "Copenhagen, Denmark",
        contactEmail: "data@renewablealliance.eu",
        dataCategories: ["Solar Generation", "Wind Data", "Smart Grid"],
        certifications: ["Green Energy Certified", "Smart Grid Ready"],
        securityAssessment: {
          overallScore: 42.0,
          rating: "D",
          lastAssessed: "2023-12-20T00:00:00Z",
          assessor: "GreenTech Security Audit",
          dimensions: [
            {
              name: "Identity & Trust Management",
              weight: 0.2,
              score: 0.3,
              status: "red",
              description: "Weak identity management with shared credentials",
            },
            {
              name: "Security Communication & Encryption",
              weight: 0.15,
              score: 0.5,
              status: "red",
              description: "Inconsistent encryption across distributed systems",
            },
            {
              name: "Access Control & Data Usage Control",
              weight: 0.25,
              score: 0.4,
              status: "red",
              description: "Basic access controls with no data usage policies",
            },
            {
              name: "Platform & System Security",
              weight: 0.2,
              score: 0.3,
              status: "red",
              description: "Outdated systems with known vulnerabilities",
            },
            {
              name: "Audit & Traceability",
              weight: 0.1,
              score: 0.6,
              status: "yellow",
              description:
                "Some logging capabilities but inconsistent across the network",
            },
            {
              name: "User Information & Privacy",
              weight: 0.1,
              score: 0.7,
              status: "yellow",
              description: "Basic privacy protection but needs improvement",
            },
          ],
        },
      },
    ],
    digitalContracts: [],
    policyTemplates: [
      {
        id: "ep1",
        name: "Access Period Limitation",
        description: "Critical infrastructure access window - 2 hours",
        rules: [
          {
            id: "er1",
            type: "access_period",
            name: "Critical Access Window",
            description:
              "Maximum access period for critical infrastructure data",
            value: 2,
            unit: "hours",
            isActive: true,
          },
        ],
        category: "access",
        severity: "high",
        enforcementType: "automatic",
        createdAt: "2024-01-05T10:00:00Z",
      },
      {
        id: "ep2",
        name: "Access Count Limitation",
        description: "Very limited access requests per month - 10 requests",
        rules: [
          {
            id: "er2",
            type: "access_count",
            name: "Strict Access Limit",
            description: "Very limited access requests per month",
            value: 10,
            unit: "requests/month",
            isActive: true,
          },
        ],
        category: "compliance",
        severity: "high",
        enforcementType: "manual",
        createdAt: "2024-01-05T11:00:00Z",
      },
      {
        id: "ep3",
        name: "Identity Restriction",
        description: "Requires government security clearance",
        rules: [
          {
            id: "er3",
            type: "identity_restriction",
            name: "Government Authorization",
            description: "Requires government security clearance",
            value: "security_clearance_required",
            isActive: true,
          },
        ],
        category: "compliance",
        severity: "high",
        enforcementType: "manual",
        createdAt: "2024-01-05T12:00:00Z",
      },
      {
        id: "ep4",
        name: "Encryption & Transmission Protection",
        description: "All data must use military-grade encryption",
        rules: [
          {
            id: "er4",
            type: "encryption",
            name: "Military-Grade Encryption",
            description: "All data must use military-grade encryption",
            value: "AES-256-GCM",
            isActive: true,
          },
        ],
        category: "compliance",
        severity: "high",
        enforcementType: "automatic",
        createdAt: "2024-01-05T13:00:00Z",
      },
    ],
    contractTemplates: [
      {
        id: "ec1",
        name: "Critical Infrastructure Contract",
        description:
          "Maximum security contract for critical energy infrastructure data",
        policyIds: ["ep1", "ep2", "ep3", "ep4"],
        policies: [],
        contractType: "multi_policy",
        status: "draft",
        createdAt: "2024-01-05T10:00:00Z",
        usageCount: 2,
      },
    ],
    externalOfferings: [],
    dataRequests: [
      {
        id: "edr1",
        offeringId: "ee1",
        offeringTitle: "Grid Load Forecasting",
        provider: "Energy Analytics Corp",
        requestedAt: "2024-01-19T15:00:00Z",
        status: "pending",
        accessMode: "api",
        purpose: "Critical infrastructure monitoring and load balancing",
      },
    ],
    blockchainNetworks: [
      {
        id: "energy-main",
        name: "Energy Identity Chain",
        type: "ZLTC",
        chainType: "main",
        chainId: 4001,
        status: "connected",
        curveAlgorithm: "Sm2p256v1",
        witnessNodes: 11,
        consensusNodes: 7,
        blockHeight: 4567890,
        purpose: "Identity Management",
        description:
          "Main chain for critical energy infrastructure identity verification",
      },
      {
        id: "energy-sub",
        name: "Energy Business Chain",
        type: "ZLTC",
        chainType: "sub",
        chainId: 4002,
        status: "connected",
        curveAlgorithm: "Sm2p256v1",
        witnessNodes: 9,
        consensusNodes: 5,
        blockHeight: 3456789,
        purpose: "Business Operations",
        description:
          "Sub chain for energy grid operations and critical infrastructure audit logs",
      },
    ],
    blockchainTransactions: [
      // Main chain transactions
      {
        id: "etx1",
        hash: "0xe1a2b3c4d5e6789012345678901234567890abcdef1234567890abcdef123456",
        type: "did_registration",
        from: "did:energy:grid1",
        to: "EnergyRegistry",
        status: "confirmed",
        timestamp: "2024-01-20T18:00:00Z",
        blockNumber: 4567890,
        chainType: "main",
      },
      // Catalog chain transactions
      {
        id: "etx2",
        hash: "0xe2b3c4d5e6789012345678901234567890abcdef1234567890abcdef1234567",
        type: "catalog_query",
        from: "did:energy:operator1",
        to: "GridDataCatalog",
        status: "confirmed",
        timestamp: "2024-01-20T17:30:00Z",
        blockNumber: 3456788,
        chainType: "sub",
        subChainType: "catalog",
      },
      {
        id: "etx3",
        hash: "0xe3c4d5e6789012345678901234567890abcdef1234567890abcdef12345678",
        type: "catalog_query",
        from: "did:energy:forecaster1",
        to: "LoadForecastDirectory",
        status: "confirmed",
        timestamp: "2024-01-20T16:45:00Z",
        blockNumber: 3456789,
        chainType: "sub",
        subChainType: "catalog",
      },
      // Audit chain transactions
      {
        id: "etx4",
        hash: "0xe4d5e6789012345678901234567890abcdef1234567890abcdef123456789a",
        type: "connector_operation",
        from: "did:energy:regulator1",
        to: "CriticalInfrastructureAudit",
        status: "confirmed",
        timestamp: "2024-01-20T15:20:00Z",
        blockNumber: 3456790,
        chainType: "sub",
        subChainType: "audit",
      },
      {
        id: "etx5",
        hash: "0xe5e6789012345678901234567890abcdef1234567890abcdef123456789ab",
        type: "connector_operation",
        from: "did:energy:grid1",
        to: "GridSecurityAudit",
        status: "confirmed",
        timestamp: "2024-01-20T14:15:00Z",
        blockNumber: 3456791,
        chainType: "sub",
        subChainType: "audit",
      },
      // Business chain transactions
      {
        id: "etx6",
        hash: "0xe6789012345678901234567890abcdef1234567890abcdef123456789abc",
        type: "business_contract",
        from: "did:energy:utility1",
        to: "EnergyTradingContract",
        status: "confirmed",
        timestamp: "2024-01-20T13:30:00Z",
        blockNumber: 3456792,
        chainType: "sub",
        subChainType: "business",
      },
      {
        id: "etx7",
        hash: "0xe789012345678901234567890abcdef1234567890abcdef123456789abcd",
        type: "business_contract",
        from: "did:energy:renewable1",
        to: "GreenEnergyContract",
        status: "pending",
        timestamp: "2024-01-20T19:15:00Z",
        blockNumber: 3456793,
        chainType: "sub",
        subChainType: "business",
      },
      // Lineage chain transactions
      {
        id: "etx8",
        hash: "0xe89012345678901234567890abcdef1234567890abcdef123456789abcde",
        type: "lineage_trace",
        from: "did:energy:smartMeter1",
        to: "ConsumptionDataLineage",
        status: "confirmed",
        timestamp: "2024-01-20T12:45:00Z",
        blockNumber: 3456794,
        chainType: "sub",
        subChainType: "lineage",
      },
      {
        id: "etx9",
        hash: "0xe9012345678901234567890abcdef1234567890abcdef123456789abcdef",
        type: "lineage_trace",
        from: "did:energy:forecaster1",
        to: "PredictionModelLineage",
        status: "confirmed",
        timestamp: "2024-01-20T11:30:00Z",
        blockNumber: 3456795,
        chainType: "sub",
        subChainType: "lineage",
      },
    ],
    auditLogs: [
      {
        id: "eal1",
        timestamp: "2024-01-20T18:00:00Z",
        action: "did_registration",
        actor: "did:energy:grid1",
        target: "EnergyRegistry",
        details: "Registered new energy grid operator",
        blockchainTxId: "etx1",
        status: "success",
      },
      {
        id: "eal2",
        timestamp: "2024-01-20T17:30:00Z",
        action: "data_transfer",
        actor: "did:energy:operator1",
        target: "GridData:101",
        details: "Critical grid load data transfer",
        blockchainTxId: "etx2",
        status: "success",
      },
    ],
  },
};

// Helper function to transform DataRequests from old format to new format
function transformDataRequests(dataRequests: any[]) {
  return dataRequests.map((request) => ({
    id: request.id,
    dataOfferingId: request.offeringId || request.dataOfferingId,
    consumerConnectorId: request.consumerConnectorId || "default-consumer",
    purpose: request.purpose,
    accessMode: request.accessMode,
    status: request.status,
    createdAt: request.requestedAt || request.createdAt,
    updatedAt: request.updatedAt,
    // Remove old fields: offeringTitle, provider
  }));
}

// Helper function to transform DataContracts from old format to new format
function transformDataContracts(dataContracts: any[]) {
  return dataContracts.map((contract) => {
    // Map old status values to new ones
    let newStatus = contract.status;
    if (newStatus === "in_use") newStatus = "active";
    if (newStatus === "transferring") newStatus = "active";
    if (newStatus === "suspended") newStatus = "terminated";
    if (newStatus === "data_unavailable") newStatus = "terminated";

    return {
      id: contract.id,
      name: contract.name,
      status: newStatus,
      providerConnectorId: contract.providerDID || contract.providerConnectorId || "unknown-provider",
      consumerConnectorId: contract.consumerDID || contract.consumerConnectorId || "unknown-consumer",
      contractTemplateId: contract.policy || contract.contractTemplateId || "default-template",
      dataOfferingId: contract.dataOfferingId || "unknown-offering",
      dataRequestId: contract.dataRequestId,
      contractAddress: contract.contractAddress,
      blockchainTxId: contract.blockchainTxId,
      blockchainNetwork: contract.blockchainNetwork || "ethereum-testnet",
      expiresAt: contract.expiresAt,
      createdAt: contract.createdAt,
      updatedAt: contract.updatedAt,
      // Remove old fields by not including them
    };
  });
}

// Helper function to transform old data format to new format
function transformContractTemplates(contractTemplates: any[], policyTemplates: any[]) {
  return contractTemplates.map((template) => {
    // Get policy templates from policyIds
    const selectedPolicies = policyTemplates.filter((policy) =>
      template.policyIds?.includes(policy.id)
    );

    return {
      ...template,
      connectorId: template.connectorId || "default-connector",
      policyTemplates: selectedPolicies,
      // Remove old fields
      policyIds: undefined,
      policies: undefined,
    };
  });
}

// Helper function to ensure policyTemplates have connectorId
function transformPolicyTemplates(policyTemplates: any[]) {
  return policyTemplates.map((policy) => ({
    ...policy,
    connectorId: policy.connectorId || "default-connector",
    rules: policy.rules.map((rule: any) => ({
      ...rule,
      value: String(rule.value), // Convert to string
      createdAt: rule.createdAt || policy.createdAt,
    })),
  }));
}

export function getDataForSpace(dataSpaceId: string) {
  const spaceData = dataSpaceConfigs[dataSpaceId] || dataSpaceConfigs.healthcare;

  // Transform all data to match new schema
  const transformedDataRequests = transformDataRequests(
    spaceData.dataRequests
  );
  const transformedDataContracts = transformDataContracts(
    spaceData.dataContracts
  );
  const transformedPolicyTemplates = transformPolicyTemplates(
    spaceData.policyTemplates
  );
  const transformedContractTemplates = transformContractTemplates(
    spaceData.contractTemplates,
    transformedPolicyTemplates
  );

  return {
    ...spaceData,
    dataRequests: transformedDataRequests,
    dataContracts: transformedDataContracts,
    policyTemplates: transformedPolicyTemplates,
    contractTemplates: transformedContractTemplates,
  };
}
