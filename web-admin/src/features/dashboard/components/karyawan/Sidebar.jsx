import { Home, FileText, ClipboardList, Receipt, LogOut, Settings, UserRoundPen } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/utils/auth";
import { Button } from "@/components/ui/Button";

export default function Sidebar() {
  const navigate = useNavigate();

  const menus = [
  { icon: "bi bi-house-door-fill", path: "/dashboard/employee/home" },
  { icon: "bi bi-file-text-fill", path: "/dashboard/employee/form" },
  { icon: "bi bi-clipboard2-check-fill", path: "/dashboard/employee/myRequest" },
  { icon: "bi bi-receipt-cutoff", path: "/dashboard/employee/myDrafts" },
  { icon: "bi bi-person-circle", path: "/dashboard/employee/profile" },
  { icon: "bi bi-gear-fill", path: "/dashboard/employee/settings" },
  ];

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <div
      className="h-screen w-20 flex flex-col items-center 
                 bg-transparent backdrop-blur-md text-gray-300 
                 rounded-r-2xl shadow-xl overflow-y-auto relative"
    >
      {/* Wrapper biar bisa scroll */}
      <div className="flex flex-col items-center gap-8 mt-6">
        {/* Logo / Home */}
        <div className="bg-gradient-to-br from-blue-600 to-cyan-400 p-3 rounded-4xl shadow-[0_0_15px_rgba(0,150,255,0.4)]">
          <Home className="text-white" size={22} />
        </div>

        {/* Menu Items */}
        <div className="flex flex-col items-center gap-4 justify-center mt-35">
          {menus.map((menu) => {
            const Icon = menu.icon;
            return (
              <NavLink
                key={menu.path}
                to={menu.path}
                className={({ isActive }) =>
                  `flex items-center justify-center w-10 h-10 bg-transparent !rounded-4xl 
                  !text-white hover:bg-gradient-to-br hover:from-blue-600 hover:to-cyan-400 
                  hover:text-white hover:shadow-[0_0_15px_rgba(0,150,255,0.5)]
                  transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-[0_0_15px_rgba(0,150,255,0.5)]"
                      : "hover:from-blue-600 hover:to-cyan-400 hover:text-white hover:shadow-[0_0_15px_rgba(0,150,255,0.5)] text-white/70"
                  }`
                }
              >
                <i className={`${menu.icon} text-[20px]`}></i>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Logout button sticky di bawah */}
      <div
        className="mt-auto w-full flex justify-center p-4"
      >
        <Button
          className="relative flex items-center justify-center w-10 h-10
                    !bg-transparent !rounded-4xl bg-gradient-to-br from-[#0A1228] to-[#0C1A3A]
                    border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                    hover:bg-gradient-to-br hover:from-blue-600 hover:to-cyan-400 
                    hover:text-white hover:shadow-[0_0_15px_rgba(0,150,255,0.5)]
                    transition-all duration-300"
          onClick={handleLogout}
        >
          <LogOut size={20} />
        </Button>
      </div>
    </div>
  );
}
