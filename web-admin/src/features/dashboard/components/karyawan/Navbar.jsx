import { useNavigate } from "react-router-dom";
import { getToken, logoutUser } from "@/utils/auth";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch ("http://localhost:8000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        const data = await res.json();
        setUser(data.data);
      } catch (err) {
        console.error(err);
      }
    };
      fetchUser();
  }, []);

  return (
    <div className="w-full h-16 bg-transparent backdrop-blur shadow flex items-center justify-between px-6">
      {/* Left - Title */}
      <h2 className="text-lg font-semibold text-white">Dashboard</h2>

      {/* Middle - Search */}
      <div className="relative w-full max-w-xl group">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 
                     transition-colors duration-300 group-hover:text-blue-300"
        />
        <input
          type="text"
          placeholder="Search for mail, target group, people..."
          className="w-full pl-9 pr-4 py-2 
                     bg-gradient-to-br from-blue-500/40 via-blue-400/20 to-blue-300/10 
                     backdrop-blur-xl border border-white/10 
                     shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-4xl 
                     focus:outline-none focus:ring-2 focus:ring-blue-400/40
                     transition-all duration-300 ease-out 
                     group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        />
      </div>

      {/* Right - Profile */}
      <div className="flex items-center space-x-5">
        {/* 🔔 Notifikasi */}
        <Button
          variant="ghost"
          className="relative flex items-center justify-center w-10 h-10
                    !bg-transparent !rounded-4xl bg-gradient-to-br from-[#0A1228] to-[#0C1A3A]
                    border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                    hover:bg-gradient-to-br hover:from-blue-600 hover:to-cyan-400 
                    hover:text-white hover:shadow-[0_0_15px_rgba(0,150,255,0.5)]
                    transition-all duration-300"
        >
          <i className="bi bi-bell-fill"></i>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </Button>

        {/* 👤 Profil */}
        <div
          className="flex items-center gap-3 px-3 py-2 rounded-2xl 
                    bg-white/5 backdrop-blur-md border border-white/10
                    hover:bg-gradient-to-br hover:from-blue-600 hover:to-cyan-400 
                    hover:text-white hover:shadow-[0_0_20px_rgba(0,150,255,0.4)] 
                    transition-all duration-300 cursor-pointer"
          onClick={() => navigate("/dashboard/employee/profile")}
        >
          <img
            src="https://i.pravatar.cc/40?img=5"
            alt="profile"
            className="w-9 h-9 rounded-xl border border-white/20 object-cover"
          />
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-medium text-white">{user.full_name}</span>
            <span className="text-xs text-gray-300">{user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
