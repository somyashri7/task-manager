import { useState } from "react";
import api from "../utils/api";
import TimerButton from "./TimerButton";
import toast from "react-hot-toast";
import { Pencil, Trash2, Flag } from "lucide-react";

const statusStyle = {
  "Pending": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "In Progress": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "Completed": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

const priorityColor = { Low: "text-gray-500", Medium: "text-amber-400", High: "text-red-400" };

export default function TaskCard({ task, onEdit, onRefresh }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    setDeleting(true);
    try {
      await api.delete(`/tasks/${task._id}`);
      toast.success("Deleted");
      onRefresh();
    } catch { toast.error("Failed to delete"); }
    finally { setDeleting(false); }
  };

  return (
    <div className="bg-[#13131f] border border-white/8 rounded-xl p-4 hover:border-white/15 transition-all group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="flex-1 text-sm font-medium leading-snug text-white">{task.title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${statusStyle[task.status]}`}>
          {task.status}
        </span>
      </div>

      {task.description && (
        <p className="mb-3 text-xs leading-relaxed text-gray-600 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-3 mb-3">
        <span className={`flex items-center gap-1 text-xs ${priorityColor[task.priority]}`}>
          <Flag size={10} /> {task.priority}
        </span>
        {task.dueDate && (
          <span className="text-xs text-gray-600">Due {task.dueDate}</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <TimerButton taskId={task._id} onStop={onRefresh} />
        <div className="flex gap-1 transition-opacity opacity-0 group-hover:opacity-100">
          <button onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-white/5 transition">
            <Pencil size={13} />
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}