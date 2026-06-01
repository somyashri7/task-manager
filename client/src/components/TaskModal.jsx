import { useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { X, Sparkles } from "lucide-react";

const priorities = ["Low", "Medium", "High"];
const statuses = ["Pending", "In Progress", "Completed"];

export default function TaskModal({ onClose, onSave, existing }) {
  const [title, setTitle] = useState(existing?.title || "");
  const [description, setDescription] = useState(existing?.description || "");
  const [status, setStatus] = useState(existing?.status || "Pending");
  const [priority, setPriority] = useState(existing?.priority || "Medium");
  const [dueDate, setDueDate] = useState(existing?.dueDate || "");
  const [rawInput, setRawInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAI = async () => {
    if (!rawInput.trim()) return toast.error("Type something first");
    setAiLoading(true);
    try {
      const res = await api.post("/ai/enhance", { input: rawInput });
      setTitle(res.data.title || "");
      setDescription(res.data.description || "");
      toast.success("AI filled in the details ✨");
    } catch { toast.error("AI failed — fill manually"); }
    finally { setAiLoading(false); }
  };

  const handleSave = async () => {
    if (!title.trim()) return toast.error("Title is required");
    setSaving(true);
    try {
      const payload = { title, description, status, priority, dueDate };
      if (existing) await api.put(`/tasks/${existing._id}`, payload);
      else await api.post("/tasks", payload);
      toast.success(existing ? "Task updated" : "Task created");
      onSave();
      onClose();
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#13131f] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="font-semibold text-white">{existing ? "Edit Task" : "New Task"}</h2>
          <button onClick={onClose} className="text-gray-500 transition hover:text-white"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4">
          {!existing && (
            <div className="p-4 border bg-indigo-500/5 border-indigo-500/20 rounded-xl">
              <p className="flex items-center gap-1 mb-2 text-xs text-indigo-400"><Sparkles size={11} /> AI Quick Fill</p>
              <div className="flex gap-2">
                <input
                  value={rawInput}
                  onChange={e => setRawInput(e.target.value)}
                  placeholder='e.g. "follow up with designer about wireframes"'
                  className="flex-1 px-3 py-2 text-sm text-white placeholder-gray-600 border rounded-lg bg-black/30 border-white/10 focus:outline-none focus:border-indigo-500/50"
                />
                <button
                  onClick={handleAI}
                  disabled={aiLoading}
                  className="px-4 text-xs font-semibold text-white transition bg-indigo-500 rounded-lg hover:bg-indigo-600 disabled:opacity-50 whitespace-nowrap"
                >
                  {aiLoading ? "..." : "Generate"}
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block mb-1 text-xs text-gray-500">Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              className="w-full bg-[#0a0a15] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
              placeholder="Task title" />
          </div>

          <div>
            <label className="block mb-1 text-xs text-gray-500">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              className="w-full bg-[#0a0a15] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 resize-none"
              placeholder="What needs to be done?" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block mb-1 text-xs text-gray-500">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="w-full bg-[#0a0a15] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50">
                {statuses.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-xs text-gray-500">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)}
                className="w-full bg-[#0a0a15] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50">
                {priorities.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-xs text-gray-500">Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                className="w-full bg-[#0a0a15] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 border border-white/10 text-gray-400 hover:text-white py-2.5 rounded-lg text-sm transition">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-50">
            {saving ? "Saving..." : existing ? "Update" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}