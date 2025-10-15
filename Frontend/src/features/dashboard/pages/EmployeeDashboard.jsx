import Sidebar from "@/features/dashboard/components/karyawan/Sidebar";
import Navbar from "@/features/dashboard/components/karyawan/Navbar";
import { Outlet, useLocation } from "react-router-dom";

export default function EmployeeDashboard() {
  const location = useLocation();

  const menus = [
    { name: "Home", path: "/dashboard/employee/home" },
    { name: "Form Pengajuan", path: "/dashboard/employee/form" },
    { name: "Pengajuan Saya", path: "/dashboard/employee/myRequest" },
    { name: "Detail Request", path: "/dashboard/employee/myRequest/:id" },
    { name: "Draft Saya", path: "/dashboard/employee/myDrafts" },
    { name: "Detail Draft", path: "/dashboard/employee/myDraft/:id" },
  ];

  const currentMenu = menus.find((menu) => location.pathname === menu.path);
  const currentTitle = currentMenu ? currentMenu.name : "Dashboard Karyawan";
  
  return (
    <div className="bg-body-gradient h-screen w-screen overflow-hidden flex bg-[#050A18] text-white font-manrope">
      {/* Sidebar - fixed biar gak ke-scroll */}
      <div className="fixed top-0 left-20 right-0 z-30 bg-transparent backdrop-blur-[1px]">
          <Navbar title={currentTitle} />
        </div>

      {/* Main Area */}
      <div className="flex-1 ml-20 flex flex-col relative">
        {/* Navbar - fixed biar gak ke-scroll */}
        
        <div className="fixed top-0 left-0 h-screen w-20 z-40">
        <Sidebar />
      </div>

        {/* Page Content */}
        <div
          className="flex-1 overflow-y-auto px-8 py-6 mt-[4.5rem]
          bg-transparent backdrop-blur-sm"
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
