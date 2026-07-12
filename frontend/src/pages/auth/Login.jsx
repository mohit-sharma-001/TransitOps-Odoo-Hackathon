import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, Check, AlertCircle, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("john@transitops.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      // Legacy compatibility for any other checks
      localStorage.setItem("isAuthenticated", "true");
      toast.success("Welcome back to TransitOps!", {
        style: { borderRadius: "12px", background: "#0d1527", color: "#fff" }
      });
      navigate("/dashboard");
    } catch (error) {
      console.error('Login failed:', error);
      const errMsg = error.response?.data?.error || "Invalid email or password";
      setErrorMessage(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const fillMockCredentials = (role) => {
    if (role === "manager") {
      setEmail("john@transitops.com");
      setPassword("password123");
    } else if (role === "dispatcher") {
      setEmail("dave@transitops.com");
      setPassword("password123");
    } else if (role === "analyst") {
      setEmail("alice@transitops.com");
      setPassword("password123");
    }
    toast.success(`Loaded credentials for ${role}`, {
      style: { borderRadius: "8px", background: "#0f172a", color: "#e2e8f0" }
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#070b13] overflow-hidden px-4 py-12">
      {/* Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-600/20 to-indigo-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-600/20 to-indigo-500/20 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5, ease: "easeOut" }}
         className="w-full max-w-md bg-white/5 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/10 dark:border-slate-800/40 p-8 rounded-3xl shadow-2xl relative z-10 space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-xl shadow-blue-500/20 mb-4">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome to TransitOps</h2>
          <p className="text-xs text-slate-400 mt-1.5">
            Enterprise Logistics & Fleet Management Intelligence
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {/* Email Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-200/10 bg-slate-950/40 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[10px] font-semibold text-blue-500 hover:text-blue-400 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200/10 bg-slate-950/40 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Toggle */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950/40 text-blue-600 focus:ring-blue-500/20 focus:ring-offset-slate-900"
              />
              Remember me
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Mock Credentials Section */}
        <div className="pt-4 border-t border-slate-200/10 space-y-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase text-center">
            Quick Sandbox Access
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillMockCredentials("manager")}
                className="flex-1 py-1.5 rounded-lg border border-slate-200/5 bg-slate-900/60 hover:bg-slate-800/40 text-[11px] font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                Fleet Manager
              </button>
              <button
                type="button"
                onClick={() => fillMockCredentials("dispatcher")}
                className="flex-1 py-1.5 rounded-lg border border-slate-200/5 bg-slate-900/60 hover:bg-slate-800/40 text-[11px] font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                Dispatcher
              </button>
            </div>
            <button
              type="button"
              onClick={() => fillMockCredentials("analyst")}
              className="w-full py-1.5 rounded-lg border border-slate-200/5 bg-slate-900/60 hover:bg-slate-800/40 text-[11px] font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              Financial Analyst
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
