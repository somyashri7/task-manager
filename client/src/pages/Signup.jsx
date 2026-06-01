import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be 6+ characters");
    setLoading(true);
    try {
      await signup(name, email, password);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">task<span className="text-indigo-400">app</span></h1>
          <p className="mt-2 text-sm text-gray-600">Create your account</p>
        </div>
        <div className="bg-[#13131f] border border-white/8 rounded-2xl p-6">
          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1.5">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} required
                className="w-full bg-[#0a0a15] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-indigo-500/60 transition"
                placeholder="Your name" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full bg-[#0a0a15] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-indigo-500/60 transition"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full bg-[#0a0a15] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-indigo-500/60 transition"
                placeholder="Min. 6 characters" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-50">
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
          <p className="mt-4 text-xs text-center text-gray-600">
            Have an account? <Link to="/login" className="text-indigo-400 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}