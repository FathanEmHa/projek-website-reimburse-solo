import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/utils/auth";
import { Button } from "@/components/ui/Button";

export default function Navbar({ title }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();  // hapus token + hit endpoint backend
    navigate("/login");  // redirect ke login
  };

  return (
    <div className="w-full h-16 bg-white shadow flex items-center justify-between px-6 flex-shrink-0">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600 text-sm">Hi, Finance 👋</span>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
