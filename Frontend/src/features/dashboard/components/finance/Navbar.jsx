import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/utils/auth";
import { Button } from "@/components/ui/Button";
import { Bell, Search } from "lucide-react";

export default function Navbar({ title }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <div className="w-full h-16 bg-white/80 backdrop-blur shadow flex items-center justify-between px-6 border-b border-gray-200">
      {/* Left - Title */}
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

      {/* Middle - Search */}
      <div className="flex-1 flex justify-center px-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search for mail, target group, people..."
            className="w-full bg-gray-100 text-sm text-gray-700 rounded-full pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Right - Profile */}
      <div className="flex items-center space-x-4">
        <button className="relative">
          <Bell className="w-5 h-5 text-gray-600 hover:text-gray-800 transition" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile */}
        <div className="flex items-center space-x-2">
          <img
            src="https://i.pravatar.cc/32?img=5"
            alt="profile"
            className="w-8 h-8 rounded-full border border-gray-300"
          />
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-medium text-gray-800">Alex Williamson</span>
            <span className="text-xs text-gray-500">Finance</span>
          </div>
        </div>

        {/* Logout */}
        <Button variant="destructive" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
