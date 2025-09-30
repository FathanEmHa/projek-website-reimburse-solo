import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Login from "@/features/auth/pages/Login";
import Unauthorized from "@/features/dashboard/pages/Unauthorized";
import ProtectedRoute from "@/routes/ProtectedRoute";

import EmployeeDashboard from "@/features/dashboard/pages/EmployeeDashboard";
import HomeKaryawan from "@/features/dashboard/components/karyawan/HomeKaryawan";
import FormPengajuan from "@/features/dashboard/components/karyawan/FormPengajuan";
import RequestSaya from "@/features/dashboard/components/karyawan/RequestSaya";
import DetailPageKaryawan from "@/features/dashboard/components/karyawan/DetailPageKaryawan";

import ManagerDashboard from "@/features/dashboard/pages/ManagerDashboard";
import HomeManager from "@/features/dashboard/components/manager/HomeManager";
import DaftarPengajuan from "@/features/dashboard/components/manager/DaftarPengajuan";
import DetailPageManager from "@/features/dashboard/components/manager/DetailPageManager";

import FinanceDashboard from "@/features/dashboard/pages/FinanceDashboard";
import HomeFinance from "@/features/dashboard/components/finance/HomeFinance";

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
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomeKaryawan />} />
          <Route path="form" element={<FormPengajuan />} />
          <Route path="myRequest" element={<RequestSaya />} />
          <Route path="myRequest/:id" element={<DetailPageKaryawan />} />
        </Route>

        <Route 
          path="/dashboard/manager"
          element={
            <ProtectedRoute roles={["manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomeManager />} />
          <Route path="request" element={<DaftarPengajuan />} />
          <Route path="request/:id" element={<DetailPageManager />} />
        </Route>

        <Route 
          path="/dashboard/finance"
          element={
            <ProtectedRoute roles={["finance"]}>
              <FinanceDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomeFinance /> } />
        </Route>
        
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
