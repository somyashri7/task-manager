import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import { Send, Bot, User } from "lucide-react";

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your task assistant. I can see all your current tasks and help you prioritize, plan your day, or answer any questions about your work. What do you need?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const history = messages.slice(1); // exclude the initial greeting from history
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/ai/chat", {
        message: input,
        history: history,
      });
      setMessages(prev => [...prev, { role: "assistant", content: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't respond right now. Try again." }]);
    } finally { setLoading(false); }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const suggestions = [
    "What should I work on first?",
    "How many tasks do I have pending?",
    "Help me plan my day",
    "Which tasks are high priority?",
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Navbar />
      <div className="flex flex-col flex-1 w-full max-w-3xl px-4 pt-20 pb-4 mx-auto">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-white">AI Assistant</h1>
          <p className="text-gray-600 text-xs mt-0.5">Knows your tasks. Here to help.</p>
        </div>

        <div className="flex-1 min-h-0 mb-4 space-y-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 260px)" }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "user" ? "bg-indigo-500" : "bg-[#1e1e2e] border border-white/10"
              }`}>
                {msg.role === "user" ? <User size={14} className="text-white" /> : <Bot size={14} className="text-indigo-400" />}
              </div>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-indigo-500 text-white rounded-tr-sm"
                  : "bg-[#13131f] border border-white/8 text-gray-300 rounded-tl-sm"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-[#1e1e2e] border border-white/10 flex items-center justify-center">
                <Bot size={14} className="text-indigo-400" />
              </div>
              <div className="bg-[#13131f] border border-white/8 px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.map(s => (
              <button key={s} onClick={() => setInput(s)}
                className="text-xs text-gray-500 border border-white/8 hover:border-indigo-500/40 hover:text-indigo-400 px-3 py-1.5 rounded-full transition">
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about your tasks..."
            className="flex-1 bg-[#13131f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition"
          />
          <button onClick={send} disabled={loading || !input.trim()}
            className="p-3 text-white transition bg-indigo-500 hover:bg-indigo-600 rounded-xl disabled:opacity-40">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}