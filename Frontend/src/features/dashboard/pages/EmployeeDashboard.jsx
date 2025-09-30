import Sidebar from "@/features/dashboard/components/karyawan/Sidebar";
import Navbar from "@/features/dashboard/components/karyawan/Navbar";
import { Outlet, useLocation } from "react-router-dom";

export default function EmployeeDashboard() {
  const location = useLocation();

  // Daftar menu
  const menus = [
    { name: "Home", path: "/dashboard/employee/home" },
    { name: "Form Pengajuan", path: "/dashboard/employee/form" },
    { name: "Pengajuan Saya", path: "/dashboard/employee/myRequest" },
    { name: "Detail Request", path: "/dashboard/employee/myRequest/:id" },
  ];

  // Cari judul sesuai path aktif
  const currentMenu = menus.find((menu) => location.pathname === menu.path);
  const currentTitle = currentMenu ? currentMenu.name : "Dashboard Karyawan";

  return (
    <div className="h-screen w-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar title={currentTitle} />

        {/* Page Content */}
        <div className="flex-1 p-4 bg-gray-50 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
