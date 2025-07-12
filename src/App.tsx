import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { OfficeProvider } from "@/contexts/OfficeContext";
import { GraphProvider } from "@/contexts/GraphContext";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { Layout } from "@/components/common/Layout";
import { LoginScreen } from "@/components/screens/LoginScreen";
import { DashboardScreen } from "@/components/screens/DashboardScreen";
import { AgoraCalendar } from "@/components/AgoraCalendar";
import { AnalyticsScreen } from "@/components/screens/AnalyticsScreen";
import { EventManagementScreen } from "@/components/screens/EventManagementScreen";
import { useAuth } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

// Office.js configuration
const officeConfig = {
  clientId: import.meta.env.VITE_OFFICE_CLIENT_ID || 'your-client-id',
  redirectUri: import.meta.env.VITE_OFFICE_REDIRECT_URI || 'http://localhost:3000'
};

const AppRoutes = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading AgoraCalendar...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/calendar" element={<AgoraCalendar />} />
        <Route path="/events" element={<EventManagementScreen />} />
        <Route path="/analytics" element={<AnalyticsScreen />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <OfficeProvider config={officeConfig}>
        <AuthProvider>
          <GraphProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </GraphProvider>
        </AuthProvider>
      </OfficeProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
