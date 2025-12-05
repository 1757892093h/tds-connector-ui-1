"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ContractTemplate, PolicyTemplate } from "@/types";
import { AlertTriangle, CheckCircle, Shield } from "lucide-react";
import { useState } from "react";

interface CreateContractTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policyTemplates: PolicyTemplate[];
  onCreateContract: (
    contractTemplate: Omit<ContractTemplate, "id" | "createdAt" | "usageCount">
  ) => void;
}

export function CreateContractTemplateDialog({
  open,
  onOpenChange,
  policyTemplates,
  onCreateContract,
}: CreateContractTemplateDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contractType: "single_policy" as "single_policy" | "multi_policy",
    status: "draft" as "draft" | "active",
  });

  const [selectedPolicyIds, setSelectedPolicyIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = () => {
    const newErrors: string[] = [];

    // Validation
    if (!formData.name.trim()) {
      newErrors.push("Contract name is required");
    }

    if (!formData.description.trim()) {
      newErrors.push("Contract description is required");
    }

    if (selectedPolicyIds.length === 0) {
      newErrors.push("At least one policy must be selected");
    }

    if (
      formData.contractType === "single_policy" &&
      selectedPolicyIds.length > 1
    ) {
      newErrors.push("Single policy contract can only have one policy");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Get selected policy templates
    const selectedPolicies = policyTemplates.filter((policy) =>
      selectedPolicyIds.includes(policy.id)
    );

    // Create contract template
    const contractTemplate: Omit<
      ContractTemplate,
      "id" | "createdAt" | "usageCount"
    > = {
      name: formData.name,
      description: formData.description,
      connectorId: "default-connector", // TODO: Get from context
      policyTemplates: selectedPolicies,
      contractType: formData.contractType,
      status: formData.status,
      updatedAt: new Date().toISOString(),
    };

    onCreateContract(contractTemplate);

    // Reset form
    setFormData({
      name: "",
      description: "",
      contractType: "single_policy",
      status: "draft",
    });
    setSelectedPolicyIds([]);
    setErrors([]);
    onOpenChange(false);
  };

  const handlePolicyToggle = (policyId: string, checked: boolean) => {
    if (checked) {
      if (formData.contractType === "single_policy") {
        setSelectedPolicyIds([policyId]); // Replace for single policy
      } else {
        setSelectedPolicyIds((prev) => [...prev, policyId]); // Add for multi policy
      }
    } else {
      setSelectedPolicyIds((prev) => prev.filter((id) => id !== policyId));
    }

    // Clear errors when user makes changes
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Create Contract Template
          </DialogTitle>
          <DialogDescription>
            Create a new contract template by combining one or more policy
            templates.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Error Messages */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-inside list-disc space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Contract Template Name</Label>
              <Input
                id="name"
                className="border-border"
                placeholder="e.g., Standard Data Sharing Agreement"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                className="border-border"
                placeholder="Describe what this contract template is for and when it should be used..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Label>Contract Type</Label>
                <RadioGroup
                  className="flex rounded-md border p-2"
                  value={formData.contractType}
                  onValueChange={(value: "single_policy" | "multi_policy") => {
                    setFormData((prev) => ({ ...prev, contractType: value }));
                    // Clear selections when changing type
                    if (
                      value === "single_policy" &&
                      selectedPolicyIds.length > 1
                    ) {
                      setSelectedPolicyIds([selectedPolicyIds[0]]);
                    }
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="single_policy"
                      id="single"
                      className="border-border"
                    />
                    <Label
                      className="text-muted-foreground/80"
                      htmlFor="single"
                    >
                      Single Policy
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="multi_policy"
                      id="multi"
                      className="border-border"
                    />
                    <Label className="text-muted-foreground/80" htmlFor="multi">
                      Multi Policy
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Initial Status</Label>
                <RadioGroup
                  className="flex rounded-md border p-2"
                  value={formData.status}
                  onValueChange={(value: "draft" | "active") =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="draft"
                      id="draft"
                      className="border-border"
                    />
                    <Label className="text-muted-foreground/80" htmlFor="draft">
                      Draft
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="active"
                      id="active"
                      className="border-border"
                    />
                    <Label
                      className="text-muted-foreground/80"
                      htmlFor="active"
                    >
                      Active
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
          {/* Policy Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                Select Policies
                {formData.contractType === "single_policy" && (
                  <span className="text-muted-foreground ml-2 text-sm font-normal">
                    (Select one policy)
                  </span>
                )}
              </Label>
              {selectedPolicyIds.length > 0 && (
                <Badge variant="secondary">
                  {selectedPolicyIds.length} selected
                </Badge>
              )}
            </div>

            <div className="grid max-h-96 gap-3 overflow-y-auto">
              {policyTemplates.map((policy) => {
                const isSelected = selectedPolicyIds.includes(policy.id);
                const isDisabled =
                  formData.contractType === "single_policy" &&
                  selectedPolicyIds.length >= 1 &&
                  !isSelected;

                return (
                  <Card
                    key={policy.id}
                    className={`transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : isDisabled
                          ? "opacity-50"
                          : "hover:bg-muted/50"
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={policy.id}
                          className="border-border"
                          checked={isSelected}
                          disabled={isDisabled}
                          onCheckedChange={(checked) =>
                            handlePolicyToggle(policy.id, !!checked)
                          }
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <Shield className="text-primary h-4 w-4" />
                            <CardTitle className="line-clamp-1 text-sm">
                              {policy.name}
                            </CardTitle>
                            <Badge
                              variant={
                                policy.severity === "high"
                                  ? "destructive"
                                  : policy.severity === "medium"
                                    ? "default"
                                    : "secondary"
                              }
                              className="text-xs"
                            >
                              {policy.severity}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {policy.category}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-xs">
                            {policy.description}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="text-primary h-5 w-5" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <span>
                          {policy.rules.length} rule
                          {policy.rules.length !== 1 ? "s" : ""}
                        </span>
                        <span>•</span>
                        <span>{policy.enforcementType} enforcement</span>
                        <span>•</span>
                        <span>
                          Created{" "}
                          {new Date(policy.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Contract Template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
