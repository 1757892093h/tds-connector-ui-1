"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIdentity } from "@/hooks/useIdentity";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { generateDID, connectorId, didDocument, isGenerating } = useIdentity();
  const [signature, setSignature] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleGenerateDID = async () => {
    try {
      await generateDID();
      toast.success("DID generated successfully");
    } catch (error) {
      toast.error("Failed to generate DID");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connectorId || !didDocument || !signature) {
      toast.error("Please generate DID and provide signature");
      return;
    }

    try {
      setIsRegistering(true);
      await register(connectorId, didDocument, signature);
      toast.success("Registration successful");
      router.push("/identity");
    } catch (error) {
      toast.error("Registration failed");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Register with a new DID-based identity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {!connectorId ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Generate a new DID for your identity
                </p>
                <Button
                  type="button"
                  onClick={handleGenerateDID}
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? "Generating..." : "Generate DID"}
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your DID</label>
                  <div className="p-3 bg-muted rounded-md text-sm font-mono break-all">
                    {connectorId}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Signature</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Sign DID with your private key"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Sign your DID with your private key to prove ownership
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isRegistering}
                >
                  {isRegistering ? "Registering..." : "Register"}
                </Button>
              </>
            )}
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Button
              variant="link"
              className="p-0"
              onClick={() => router.push("/auth/login")}
            >
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}