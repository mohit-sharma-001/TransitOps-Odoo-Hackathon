import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, ArrowRight, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address", {
        style: { borderRadius: "12px", background: "#0d1527", color: "#fff" }
      });
      return;
    }

    setIsLoading(true);
    // Simulate reset request
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      toast.success("Password reset instructions sent!", {
        style: { borderRadius: "12px", background: "#0d1527", color: "#fff" }
      });
    }, 1200);
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
        {/* Back Link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Login</span>
        </Link>

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
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Reset Password</h2>
          <p className="text-xs text-slate-400 mt-1.5">
            {isSent 
              ? "We've sent recovery details to your inbox"
              : "Enter your email address to receive password recovery instructions"
            }
          </p>
        </div>

        {/* Content */}
        {!isSent ? (
          <form onSubmit={handleReset} className="space-y-4">
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

            {/* Reset Button */}
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
                  <span>Send Reset Instructions</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
              <Check className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-200">Email Dispatch Successful</p>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                We sent a secure link to <strong className="text-white">{email}</strong>. Check your spam folder if it doesn't appear in 5 minutes.
              </p>
            </div>
            <button
              onClick={() => setIsSent(false)}
              className="w-full py-2.5 rounded-xl border border-slate-200/10 bg-slate-950/20 hover:bg-slate-900/40 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              Try Another Email
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
