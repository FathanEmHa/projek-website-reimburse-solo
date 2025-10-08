import { Home, FileText, ClipboardList, Receipt } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menus = [
    { name: "Home", icon: <Home size={20} />, path: "/dashboard/employee/home" },
    { name: "Form Pengajuan", icon: <FileText size={20} />, path: "/dashboard/employee/form" },
    { name: "Pengajuan Saya", icon: <ClipboardList size={20} />,  path:"/dashboard/employee/myRequest" },
    { name: "Draft Saya", icon: <Receipt size={20} />, path: "/dashboard/employee/myDrafts" },
  ];

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      <div className="px-4 py-6 text-xl font-bold border-b border-gray-700">
        Dashboard Karyawan
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-3 w-full px-3 py-2 rounded-lg transition 
              ${isActive ? "bg-gray-700 font-semibold" : "hover:bg-gray-700"}`
            }
          >
            {menu.icon}
            {menu.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
