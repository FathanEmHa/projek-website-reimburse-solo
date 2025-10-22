import Sidebar from "@/features/dashboard/components/manager/Sidebar";
import Navbar from "@/features/dashboard/components/manager/Navbar";
import { Outlet, useLocation } from "react-router-dom";

export default function ManagerDashboard() {
  const location = useLocation();

  // Daftar menu
  const menus = [
    { name: "Home", path: "/dashboard/manager/home" },
    { name: "Daftar Pengajuan", path: "/dashboard/manager/request"},
  ];

  // Cari judul sesuai path aktif
  const currentMenu = menus.find((menu) => location.pathname === menu.path);
  const currentTitle = currentMenu ? currentMenu.name : "Dashboard Manager";

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
