import Navigation from "@/components/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-6">
        <Navigation />
        {children}
      </div>
    </ProtectedRoute>
  );
}
