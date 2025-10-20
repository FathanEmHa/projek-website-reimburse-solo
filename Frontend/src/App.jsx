import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Login from "@/features/auth/pages/Login";
import Unauthorized from "@/features/dashboard/pages/Unauthorized";
import ProtectedRoute from "@/routes/ProtectedRoute";

import EmployeeDashboard from "@/features/dashboard/pages/EmployeeDashboard";
import HomeKaryawan from "@/features/dashboard/components/karyawan/HomeKaryawan";
import FormPengajuan from "@/features/dashboard/components/karyawan/FormPengajuan";
import RequestSaya from "@/features/dashboard/components/karyawan/RequestSaya";
import DraftDetail from "@/features/dashboard/components/karyawan/DraftDetail";
import RequestDetail from "./features/dashboard/components/karyawan/RequestDetail";
import DraftSaya from "./features/dashboard/components/karyawan/DraftSaya";
import FormEditPengajuan from "./features/dashboard/components/karyawan/FormEditPengajuan";

import ManagerDashboard from "@/features/dashboard/pages/ManagerDashboard";
import HomeManager from "@/features/dashboard/components/manager/HomeManager";
import DaftarPengajuanManager from "@/features/dashboard/components/manager/DaftarPengajuan";
import DetailPageManager from "@/features/dashboard/components/manager/DetailPageManager";

import FinanceDashboard from "@/features/dashboard/pages/FinanceDashboard";
import HomeFinance from "@/features/dashboard/components/finance/HomeFinance";
import DaftarPengajuanFinance from "@/features/dashboard/components/finance/DaftarPengajuan";

import AdminDashboard from "@/features/dashboard/pages/AdminDashboard";
import DetailPageFinance from "./features/dashboard/components/finance/DetailPageFinance";

import ProfilePage from "./features/profile/ProfilePage";

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
          <Route path="myRequest/:id" element={<RequestDetail />} />
          <Route path="myDrafts" element={<DraftSaya />} />
          <Route path="myDraft/:id" element={<DraftDetail/>} />
          <Route path="form/:id" element={<FormEditPengajuan />} />
          <Route path="profile" element={<ProfilePage />} />
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
          <Route path="request" element={<DaftarPengajuanManager />} />
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
          <Route path="request" element={<DaftarPengajuanFinance />} />
          <Route path="request/:id" element={<DetailPageFinance />} />
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
