import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import api from "../utils/api";
import { Plus } from "lucide-react";

const filters = ["All", "Pending", "In Progress", "Completed"];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("All");

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const filtered = filter === "All" ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="max-w-5xl px-4 pt-20 pb-8 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Tasks</h1>
            <p className="text-gray-600 text-xs mt-0.5">{tasks.length} total</p>
          </div>
          <button onClick={() => { setEditing(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition bg-indigo-500 rounded-lg hover:bg-indigo-600">
            <Plus size={15} /> New Task
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                filter === f ? "border-indigo-500/50 text-indigo-400 bg-indigo-500/10" : "border-white/8 text-gray-500 hover:border-white/15"
              }`}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-700">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-600">No tasks found</p>
            <button onClick={() => setShowModal(true)} className="mt-2 text-sm text-indigo-400 hover:underline">
              Create your first task →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map(task => (
              <TaskCard key={task._id} task={task}
                onEdit={t => { setEditing(t); setShowModal(true); }}
                onRefresh={fetchTasks} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <TaskModal existing={editing} onClose={() => { setShowModal(false); setEditing(null); }} onSave={fetchTasks} />
      )}
    </div>
  );
}