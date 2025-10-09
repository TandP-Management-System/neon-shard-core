import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import DepartmentDashboard from "./pages/DepartmentDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Settings from "./pages/Settings";
import CollegeManagement from "./pages/CollegeManagement";
import DepartmentManagement from "./pages/DepartmentManagement";
import DepartmentDetail from "./pages/DepartmentDetail";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/department" 
                element={
                  <ProtectedRoute allowedRoles={['department']}>
                    <DepartmentDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/colleges" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <CollegeManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/departments" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DepartmentManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/departments/:id" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DepartmentDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/reports" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Reports />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/department/settings" 
                element={
                  <ProtectedRoute allowedRoles={['department']}>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student/settings" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
