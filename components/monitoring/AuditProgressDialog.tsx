"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Clock, Loader2, Pause, Play, X } from "lucide-react";
import { useEffect, useState } from "react";

export interface AuditStage {
  id: string;
  name: string;
  description: string;
  status: "pending" | "running" | "completed" | "error";
  progress: number;
}

interface AuditProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

const AUDIT_STAGES: AuditStage[] = [
  {
    id: "sensitivity",
    name: "Sensitivity Check",
    description: "Check sensitive information and classification in data",
    status: "pending",
    progress: 0,
  },
  {
    id: "privacy",
    name: "Personal Information Check",
    description: "Identify and verify personal privacy data",
    status: "pending",
    progress: 0,
  },
  {
    id: "compliance",
    name: "Compliance Check",
    description: "Verify regulatory and policy compliance",
    status: "pending",
    progress: 0,
  },
];

export function AuditProgressDialog({
  open,
  onOpenChange,
  onComplete,
}: AuditProgressDialogProps) {
  const [stages, setStages] = useState<AuditStage[]>(AUDIT_STAGES);
  const [currentStageIndex, setCurrentStageIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);

  const startAudit = () => {
    setIsRunning(true);
    setCurrentStageIndex(0);
    setStages(
      AUDIT_STAGES.map((stage) => ({
        ...stage,
        status: "pending",
        progress: 0,
      }))
    );
  };

  const stopAudit = () => {
    setIsRunning(false);
    setCurrentStageIndex(-1);
    setStages((prev) =>
      prev.map((stage) => ({ ...stage, status: "pending", progress: 0 }))
    );
  };

  // Simulate audit process
  useEffect(() => {
    if (
      !isRunning ||
      currentStageIndex === -1 ||
      currentStageIndex >= stages.length
    ) {
      return;
    }

    const currentStage = stages[currentStageIndex];
    if (currentStage.status === "completed") {
      // Move to next stage
      const nextIndex = currentStageIndex + 1;
      if (nextIndex < stages.length) {
        setCurrentStageIndex(nextIndex);
        setStages((prev) =>
          prev.map((stage, index) =>
            index === nextIndex
              ? { ...stage, status: "running", progress: 0 }
              : stage
          )
        );
      } else {
        // All stages completed
        setIsRunning(false);
        setTimeout(() => {
          onComplete?.();
        }, 1000);
      }
      return;
    }

    // Set current stage to running status
    if (currentStage.status === "pending") {
      setStages((prev) =>
        prev.map((stage, index) =>
          index === currentStageIndex ? { ...stage, status: "running" } : stage
        )
      );
    }

    // Simulate progress update
    const interval = setInterval(
      () => {
        setStages((prev) => {
          const newStages = [...prev];
          const stage = newStages[currentStageIndex];

          if (stage.status === "running") {
            // Random progress increase to simulate real audit process
            const increment = Math.random() * 15 + 5; // 5-20% increase
            const newProgress = Math.min(100, stage.progress + increment);

            stage.progress = newProgress;

            if (newProgress >= 100) {
              stage.status = "completed";
              stage.progress = 100;
            }
          }

          return newStages;
        });
      },
      500 + Math.random() * 1000
    ); // Random interval for realism

    return () => clearInterval(interval);
  }, [isRunning, currentStageIndex, stages, onComplete]);

  const getStageIcon = (stage: AuditStage) => {
    switch (stage.status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "running":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Data Audit</DialogTitle>
          <DialogDescription>
            Performing comprehensive audit checks on system data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Segmented Progress Display */}
          <div className="space-y-4">
            {stages.map((stage, index) => (
              <div key={stage.id} className="space-y-3">
                {/* Stage Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStageIcon(stage)}
                    <div>
                      <h4
                        className={cn(
                          "text-sm font-medium",
                          stage.status === "running" && "text-blue-600",
                          stage.status === "completed" && "text-green-600",
                          stage.status === "error" && "text-red-600"
                        )}
                      >
                        {stage.name}
                      </h4>
                      <p className="text-muted-foreground text-xs">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {stage.status === "running" && (
                      <div className="text-muted-foreground text-xs">
                        {Math.round(stage.progress)}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Stage Progress Bar */}
                <Progress
                  value={stage.progress}
                  className={cn(
                    "h-2 transition-all duration-500",
                    stage.status === "running" &&
                      "ring-1 ring-primary/60 ring-offset-1"
                  )}
                />
              </div>
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            {!isRunning ? (
              <>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  <X className="size-4" />
                  Close
                </Button>
                <Button onClick={startAudit}>
                  <Play className="size-4" />
                  Start
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={stopAudit}>
                  <Pause className="size-4" />
                  Stop
                </Button>
                <Button variant="secondary" disabled>
                  <Loader2 className="size-4 animate-spin" />
                  Auditing
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
