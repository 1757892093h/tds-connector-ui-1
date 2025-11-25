"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  generateDID,
  registerConnector,
  listDataSpaces,
} from "@/lib/services/identity-service";
import type { DataSpace, GenerateDIDResponse } from "@/types/identity";
import { useEffect } from "react";

interface CreateConnectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateConnectorDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateConnectorDialogProps) {
  const [displayName, setDisplayName] = useState("");
  const [dataSpaceId, setDataSpaceId] = useState("");
  const [dataSpaces, setDataSpaces] = useState<DataSpace[]>([]);
  const [generatedDID, setGeneratedDID] = useState<GenerateDIDResponse | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(false);

  // 加载数据空间列表
  useEffect(() => {
    if (open) {
      loadDataSpaces();
    }
  }, [open]);

  const loadDataSpaces = async () => {
    try {
      setIsLoadingSpaces(true);
      const spaces = await listDataSpaces();
      setDataSpaces(spaces);
      if (spaces.length > 0 && !dataSpaceId) {
        setDataSpaceId(spaces[0].id);
      }
    } catch (error) {
      toast.error("Failed to load data spaces");
      console.error(error);
    } finally {
      setIsLoadingSpaces(false);
    }
  };

  // 生成DID
  const handleGenerateDID = async () => {
    try {
      setIsGenerating(true);
      const result = await generateDID();
      setGeneratedDID(result);
      toast.success("DID generated successfully");
    } catch (error) {
      toast.error("Failed to generate DID");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  // 创建连接器
  const handleCreate = async () => {
    if (!displayName.trim()) {
      toast.error("Please enter a display name");
      return;
    }

    if (!dataSpaceId) {
      toast.error("Please select a data space");
      return;
    }

    if (!generatedDID) {
      toast.error("Please generate a DID first");
      return;
    }

    try {
      setIsCreating(true);
      await registerConnector({
        did: generatedDID.did,
        display_name: displayName,
        data_space_id: dataSpaceId,
        did_document: generatedDID.didDocument,
      });

      toast.success("Connector created successfully");
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to create connector");
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  // 关闭对话框并重置状态
  const handleClose = () => {
    setDisplayName("");
    setDataSpaceId("");
    setGeneratedDID(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Connector
          </DialogTitle>
          <DialogDescription>
            Generate a new DID and register a connector in the selected data
            space.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 显示名称 */}
          <div className="space-y-2">
            <Label htmlFor="display-name">Display Name *</Label>
            <Input
              id="display-name"
              placeholder="e.g., My Healthcare Connector"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={isCreating}
            />
            <p className="text-sm text-muted-foreground">
              A human-readable name for your connector
            </p>
          </div>

          {/* 数据空间选择 */}
          <div className="space-y-2">
            <Label htmlFor="data-space">Data Space *</Label>
            <Select
              value={dataSpaceId}
              onValueChange={setDataSpaceId}
              disabled={isLoadingSpaces || isCreating}
            >
              <SelectTrigger id="data-space">
                <SelectValue placeholder="Select a data space" />
              </SelectTrigger>
              <SelectContent>
                {dataSpaces.map((space) => (
                  <SelectItem key={space.id} value={space.id}>
                    {space.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              The data space where this connector will operate
            </p>
          </div>

          {/* DID生成区域 */}
          <div className="space-y-2">
            <Label>Decentralized Identifier (DID)</Label>
            {generatedDID ? (
              <div className="space-y-2">
                <div className="rounded-md border bg-muted p-3">
                  <p className="text-sm font-mono break-all">
                    {generatedDID.did}
                  </p>
                </div>
                <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-950">
                  <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
                    ⚠️ Important: Save your private key securely
                  </p>
                  <p className="mt-1 text-xs font-mono text-yellow-700 dark:text-yellow-300 break-all">
                    {generatedDID.privateKey}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateDID}
                  disabled={isGenerating || isCreating}
                >
                  Regenerate DID
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={handleGenerateDID}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating DID...
                  </>
                ) : (
                  "Generate DID"
                )}
              </Button>
            )}
            <p className="text-sm text-muted-foreground">
              A unique identifier for your connector
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isCreating}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!generatedDID || !displayName || !dataSpaceId || isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Connector"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
