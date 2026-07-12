import { Truck, Users, MapPin, Wrench, Fuel, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function QuickActions({ isLoading = false }) {
  const actions = [
    { name: "Add Vehicle", icon: Truck, color: "from-blue-500 to-indigo-600 shadow-blue-500/10", label: "Register fleet assets" },
    { name: "Add Driver", icon: Users, color: "from-indigo-500 to-purple-600 shadow-indigo-500/10", label: "Onboard operators" },
    { name: "Create Trip", icon: MapPin, color: "from-emerald-500 to-teal-600 shadow-emerald-500/10", label: "Dispatch cargo shipments" },
    { name: "Schedule Maintenance", icon: Wrench, color: "from-amber-500 to-orange-600 shadow-amber-500/10", label: "Plan repair logs" },
    { name: "Fuel Entry", icon: Fuel, color: "from-rose-500 to-pink-600 shadow-rose-500/10", label: "Refuel records" },
    { name: "Generate Report", icon: BarChart3, color: "from-violet-500 to-fuchsia-600 shadow-violet-500/10", label: "Download metrics" },
  ];

  const handleActionClick = (actionName) => {
    toast.success(`${actionName} modal opened (demo)`, {
      style: {
        borderRadius: '16px',
        background: '#0d1527',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '500',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      },
      iconTheme: {
        primary: '#3b82f6',
        secondary: '#fff',
      },
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs animate-pulse">
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-md mb-4" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 dark:bg-slate-900/30 border border-slate-200/40 dark:border-slate-800/40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs transition-colors duration-200">
      <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <motion.button
              key={act.name}
              onClick={() => handleActionClick(act.name)}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-start p-4 rounded-xl text-left bg-slate-50/50 hover:bg-slate-100 dark:bg-slate-900/20 dark:hover:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/60 hover:border-slate-350 dark:hover:border-slate-700 transition-all duration-200 w-full cursor-pointer group"
            >
              <div className={`p-2 rounded-lg bg-gradient-to-tr ${act.color} text-white mb-3 shadow-md group-hover:scale-105 transition-transform duration-200`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{act.name}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 line-clamp-1">{act.label}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
