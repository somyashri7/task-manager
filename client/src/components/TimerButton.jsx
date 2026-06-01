import { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import { formatClock } from "../utils/formatTime";
import toast from "react-hot-toast";
import { Play, Square } from "lucide-react";

export default function TimerButton({ taskId, onStop }) {
  const [running, setRunning] = useState(false);
  const [logId, setLogId] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(false);
  const interval = useRef(null);

  useEffect(() => {
    api.get(`/timelogs/task/${taskId}`).then(res => {
      const active = res.data.logs.find(l => !l.endTime);
      if (active) {
        setLogId(active._id);
        setRunning(true);
        const secs = Math.floor((Date.now() - new Date(active.startTime)) / 1000);
        setElapsed(secs);
      }
    }).catch(() => {});
    return () => clearInterval(interval.current);
  }, [taskId]);

  useEffect(() => {
    if (running) {
      interval.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(interval.current);
    }
    return () => clearInterval(interval.current);
  }, [running]);

  const start = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/timelogs/start/${taskId}`);
      setLogId(res.data._id);
      setElapsed(0);
      setRunning(true);
      toast.success("Timer started");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to start");
    } finally { setLoading(false); }
  };

  const stop = async () => {
    setLoading(true);
    try {
      await api.put(`/timelogs/stop/${logId}`);
      setRunning(false);
      setLogId(null);
      setElapsed(0);
      toast.success("Session saved");
      if (onStop) onStop();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to stop");
    } finally { setLoading(false); }
  };

  return (
    <div className="flex items-center gap-2">
      {running && (
        <span className="px-2 py-1 font-mono text-xs text-indigo-400 border rounded-md bg-indigo-500/10 border-indigo-500/20">
          {formatClock(elapsed)}
        </span>
      )}
      <button
        onClick={running ? stop : start}
        disabled={loading}
        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all disabled:opacity-40 ${
          running
            ? "bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25"
            : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25"
        }`}
      >
        {running ? <Square size={11} fill="currentColor" /> : <Play size={11} fill="currentColor" />}
        {running ? "Stop" : "Start"}
      </button>
    </div>
  );
}