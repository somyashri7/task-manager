import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { formatSeconds } from "../utils/formatTime";
import { CheckCircle2, Clock, ListTodo, Zap } from "lucide-react";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get("/tasks").then(r => setTasks(r.data)).catch(() => {});
    api.get("/timelogs/summary/daily").then(r => setSummary(r.data)).catch(() => {});
  }, []);

  const pending = tasks.filter(t => t.status === "Pending").length;
  const inProgress = tasks.filter(t => t.status === "In Progress").length;
  const completed = tasks.filter(t => t.status === "Completed").length;

  const stats = [
    { label: "Total Tasks", value: tasks.length, icon: ListTodo, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
    { label: "In Progress", value: inProgress, icon: Zap, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { label: "Completed", value: completed, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { label: "Time Today", value: summary ? formatSeconds(summary.totalTrackedSeconds) : "0s", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="max-w-5xl px-4 pt-20 pb-8 mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">{greeting}, {currentUser?.name?.split(" ")[0]} 👋</h1>
          <p className="mt-1 text-sm text-gray-600">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8 md:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={`bg-[#13131f] border rounded-xl p-4 ${bg}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-600">{label}</span>
                <Icon size={14} className={color} />
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {pending > 0 && (
          <div className="flex items-center justify-between px-5 py-4 mb-6 border bg-amber-500/5 border-amber-500/15 rounded-xl">
            <div>
              <p className="text-sm font-medium text-amber-400">{pending} task{pending > 1 ? "s" : ""} pending</p>
              <p className="text-gray-600 text-xs mt-0.5">You have work waiting to be started</p>
            </div>
            <Link to="/tasks" className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-lg hover:bg-amber-500/30 transition">
              View Tasks →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Link to="/tasks" className="bg-[#13131f] border border-white/8 hover:border-indigo-500/30 rounded-xl p-5 transition group">
            <p className="font-medium text-white transition group-hover:text-indigo-400">Manage Tasks →</p>
            <p className="mt-1 text-xs text-gray-600">Create, edit, and track your tasks</p>
          </Link>
          <Link to="/chat" className="bg-[#13131f] border border-white/8 hover:border-indigo-500/30 rounded-xl p-5 transition group">
            <p className="font-medium text-white transition group-hover:text-indigo-400">AI Assistant →</p>
            <p className="mt-1 text-xs text-gray-600">Ask anything about your tasks and productivity</p>
          </Link>
          <Link to="/summary" className="bg-[#13131f] border border-white/8 hover:border-indigo-500/30 rounded-xl p-5 transition group">
            <p className="font-medium text-white transition group-hover:text-indigo-400">Daily Summary →</p>
            <p className="mt-1 text-xs text-gray-600">See today's productivity breakdown</p>
          </Link>
        </div>
      </div>
    </div>
  );
}