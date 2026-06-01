import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import { formatSeconds } from "../utils/formatTime";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const statusColor = { "Pending": "#f59e0b", "In Progress": "#60a5fa", "Completed": "#34d399" };

export default function Summary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/timelogs/summary/daily")
      .then(r => setSummary(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const chartData = summary?.tasks?.map(t => ({
    name: t.title?.length > 12 ? t.title.slice(0, 12) + "…" : t.title,
    mins: Math.round((t.totalSeconds || 0) / 60),
    status: t.status,
  })) || [];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="max-w-4xl px-4 pt-20 pb-8 mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white">Daily Summary</h1>
          <p className="text-gray-600 text-xs mt-0.5">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-700">Loading...</div>
        ) : !summary || summary.tasks.length === 0 ? (
          <div className="py-20 text-center text-gray-600">No activity tracked today yet.</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 mb-6 md:grid-cols-4">
              {[
                { label: "Time Tracked", value: formatSeconds(summary.totalTrackedSeconds), color: "text-indigo-400" },
                { label: "Tasks Worked On", value: summary.tasks.length, color: "text-white" },
                { label: "Completed", value: summary.completed.length, color: "text-emerald-400" },
                { label: "Pending", value: summary.pending.length, color: "text-amber-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-[#13131f] border border-white/8 rounded-xl p-4">
                  <p className="mb-2 text-xs text-gray-600">{label}</p>
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {chartData.length > 0 && (
              <div className="bg-[#13131f] border border-white/8 rounded-xl p-5 mb-6">
                <p className="mb-4 text-sm font-medium text-white">Time per Task (minutes)</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" tick={{ fill: "#4b5563", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#4b5563", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#fff" }} />
                    <Bar dataKey="mins" radius={[4, 4, 0, 0]}>
                      {chartData.map((e, i) => <Cell key={i} fill={statusColor[e.status] || "#6366f1"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-3">
                  {Object.entries(statusColor).map(([label, color]) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                      <span className="text-xs text-gray-600">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              {summary.tasks.map(task => (
                <div key={task._id} className="bg-[#13131f] border border-white/8 rounded-xl px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">{task.title}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{task.status}</p>
                  </div>
                  <span className="font-mono text-sm text-indigo-400">{formatSeconds(task.totalSeconds)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}