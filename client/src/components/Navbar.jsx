import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { LayoutDashboard, CheckSquare, BarChart2, MessageSquare, LogOut } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/summary", label: "Summary", icon: BarChart2 },
  { to: "/chat", label: "AI Chat", icon: MessageSquare },
];

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d18]/90 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center justify-between max-w-6xl px-4 mx-auto h-14">
        <Link to="/dashboard" className="text-lg font-bold text-white">
          task<span className="text-indigo-400">app</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                location.pathname === to
                  ? "bg-indigo-500/20 text-indigo-400"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
          <div className="w-px h-4 mx-1 bg-white/10" />
          <span className="hidden mr-2 text-xs text-gray-600 md:block">{currentUser?.name}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </nav>
  );
}