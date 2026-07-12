import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Navigation, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#070b13] overflow-hidden px-4">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-600/10 to-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-600/10 to-indigo-500/10 blur-[120px] pointer-events-none" />

      <div className="text-center relative z-10 space-y-6 max-w-md">
        {/* Animated Icon */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-slate-800/40 text-blue-500 shadow-2xl mb-2"
        >
          <Navigation className="h-12 w-12 rotate-45 animate-pulse" />
        </motion.div>

        {/* Text Details */}
        <div className="space-y-2">
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400 leading-none">
            404
          </h1>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Off-Route: Destination Unknown
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            The page you are looking for has been moved, re-routed, or decommissioned from the fleet log.
          </p>
        </div>

        {/* CTA Button */}
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-lg shadow-blue-500/10 transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Base</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
