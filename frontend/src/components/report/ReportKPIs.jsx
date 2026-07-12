import { motion } from "framer-motion";
import {
  Truck,
  DollarSign,
  Fuel,
  Wrench,
  Navigation,
  Users,
  CarFront,
  CheckCircle2,
  TrendingUp,
  TrendingDown
} from "lucide-react";

const kpis = [
  { label: "Fleet Utilization", value: "87.4%", delta: "+2.1%", up: true, icon: Truck, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/20", accent: "border-l-blue-500" },
  { label: "Revenue (MTD)", value: "$284,500", delta: "+12.3%", up: true, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/20", accent: "border-l-emerald-500" },
  { label: "Fuel Cost", value: "$15,800", delta: "-3.2%", up: false, icon: Fuel, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/20", accent: "border-l-amber-500" },
  { label: "Maintenance Cost", value: "$8,450", delta: "+5.8%", up: true, icon: Wrench, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/20", accent: "border-l-rose-500" },
  { label: "Active Trips", value: "14", delta: "+3", up: true, icon: Navigation, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/20", accent: "border-l-indigo-500" },
  { label: "Drivers On Duty", value: "18", delta: "of 24", up: null, icon: Users, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/20", accent: "border-l-violet-500" },
  { label: "Vehicles Available", value: "12", delta: "of 20", up: null, icon: CarFront, color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-950/20", accent: "border-l-cyan-500" },
  { label: "Delivery Success", value: "96.2%", delta: "+1.4%", up: true, icon: CheckCircle2, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-950/20", accent: "border-l-teal-500" }
];

export default function ReportKPIs() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-blue-500" />
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Executive Summary</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 border-l-[3px] ${kpi.accent} p-3.5 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
            >
              <div className={`w-7 h-7 ${kpi.bg} rounded-lg flex items-center justify-center mb-2`}>
                <Icon className={`h-3.5 w-3.5 ${kpi.color}`} />
              </div>
              <p className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">{kpi.value}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{kpi.label}</p>
              {kpi.delta && (
                <div className="mt-1.5 flex items-center gap-1">
                  {kpi.up === true && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                  {kpi.up === false && <TrendingDown className="h-3 w-3 text-emerald-500" />}
                  <span className={`text-[10px] font-bold ${kpi.up === true ? "text-emerald-600 dark:text-emerald-400" : kpi.up === false ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                    {kpi.delta}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
