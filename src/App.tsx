
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";

import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import LeadList from "./components/LeadList";
import LeadDetail from "./components/LeadDetail";
import CalendarView from "./components/CalendarView";
import Settings from "./components/Settings";
import NotFound from "./components/NotFound";
import ClientDashboard from "./components/ClientDashboard";
import ClientAccessCode from "./components/ClientAccessCode";
import ClientConnect from "./components/ClientConnect";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected admin routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="leads" element={<LeadList />} />
                <Route path="leads/:id" element={<LeadDetail />} />
                <Route path="calendar" element={<CalendarView />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
            
            {/* Client routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="client-dashboard" element={<ClientDashboard />} />
              <Route path="client-access" element={<ClientAccessCode />} />
              <Route path="client-connect" element={<ClientConnect />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
