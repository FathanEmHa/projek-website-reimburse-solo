import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Login from "@/features/auth/pages/Login";
import Unauthorized from "@/features/dashboard/pages/Unauthorized";
import ProtectedRoute from "@/routes/ProtectedRoute";

import EmployeeDashboard from "@/features/dashboard/pages/EmployeeDashboard";
import ManagerDashboard from "@/features/dashboard/pages/ManagerDashboard";
import FinanceDashboard from "@/features/dashboard/pages/FinanceDashboard";
import AdminDashboard from "@/features/dashboard/pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route 
          path="/dashboard/employee"
          element={
            <ProtectedRoute roles={["employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/dashboard/manager"
          element={
            <ProtectedRoute roles={["manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/dashboard/finance"
          element={
            <ProtectedRoute roles={["finance"]}>
              <FinanceDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route 
          path="/dashboard/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  )
}
