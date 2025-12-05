"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/navigation";//用于处理页面跳转
import { useAuth } from "@/lib/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";//用来显示弹窗通知

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [did, setDid] = useState("");
  const [signature, setSignature] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();//阻止浏览器执行默认的 HTML 表单提交（这会导致整个页面刷新）。希望用 JavaScript 在后台处理登录，而不刷新页面。
    
    if (!did || !signature) {
      toast.error("Please enter DID and signature");
      return;
    }

    try {//处理异步操作的成功、失败和收尾
      setIsLoading(true);
      await login(did, signature);
      toast.success("Login successful");
      router.push("/identity");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Sign in with your DID-based identity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="did">DID</Label>
              <Input
                id="did"
                placeholder="did:example:user123"
                value={did}
                onChange={(e) => setDid(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signature">Signature</Label>
              <Input
                id="signature"
                type="password"
                placeholder="Enter your signature"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Sign a challenge message with your private key
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Button
              variant="link"
              className="p-0"
              onClick={() => router.push("/auth/register")}
            >
              Register
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}