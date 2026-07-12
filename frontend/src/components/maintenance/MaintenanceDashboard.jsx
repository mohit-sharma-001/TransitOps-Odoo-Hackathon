import { motion } from "framer-motion";
import {
  Wrench,
  CalendarClock,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Clock,
  TrendingUp
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const monthlyCost = [
  { month: "Jan", cost: 8200 },
  { month: "Feb", cost: 6800 },
  { month: "Mar", cost: 12400 },
  { month: "Apr", cost: 9100 },
  { month: "May", cost: 7600 },
  { month: "Jun", cost: 11300 },
  { month: "Jul", cost: 4800 }
];

const downtimeData = [
  { month: "Jan", hours: 42 },
  { month: "Feb", hours: 28 },
  { month: "Mar", hours: 56 },
  { month: "Apr", hours: 35 },
  { month: "May", hours: 24 },
  { month: "Jun", hours: 48 },
  { month: "Jul", hours: 18 }
];

const typeDistribution = [
  { name: "Oil Change", value: 28, color: "#3b82f6" },
  { name: "Brake Service", value: 18, color: "#6366f1" },
  { name: "Tire Rotation", value: 22, color: "#8b5cf6" },
  { name: "Engine Repair", value: 12, color: "#f59e0b" },
  { name: "Transmission", value: 8, color: "#ef4444" },
  { name: "Inspection", value: 15, color: "#10b981" }
];

export default function MaintenanceDashboard() {
  const isDark = document.documentElement.classList.contains("dark");

  const kpis = [
    { label: "Under Maintenance", value: 4, icon: Wrench, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/20", accent: "border-l-blue-500" },
    { label: "Upcoming Services", value: 7, icon: CalendarClock, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/20", accent: "border-l-indigo-500" },
    { label: "Completed (MTD)", value: 12, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/20", accent: "border-l-emerald-500" },
    { label: "Critical Alerts", value: 2, icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/20", accent: "border-l-rose-500" },
    { label: "Cost This Month", value: "$4,800", icon: DollarSign, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/20", accent: "border-l-amber-500" },
    { label: "Avg Downtime", value: "6.2 hrs", icon: Clock, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/20", accent: "border-l-violet-500" }
  ];

  const tooltipStyle = {
    backgroundColor: isDark ? "#0f172a" : "#fff",
    border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "11px",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
  };

  const axisTickStyle = { fontSize: 10, fill: isDark ? "#94a3b8" : "#64748b" };

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 border-l-[3px] ${kpi.accent} p-4 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 ${kpi.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
              </div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">{kpi.value}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{kpi.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Maintenance Cost */}
        <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Monthly Maintenance Cost</h3>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyCost} barSize={22}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#f1f5f9"} />
                <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`$${v.toLocaleString()}`, "Cost"]} />
                <Bar dataKey="cost" fill="url(#mcBarGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="mcBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle Downtime */}
        <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-violet-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Vehicle Downtime (Hours)</h3>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={downtimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#f1f5f9"} />
                <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} hrs`, "Downtime"]} />
                <defs>
                  <linearGradient id="dtAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="hours" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#dtAreaGrad)" dot={{ fill: "#8b5cf6", r: 4 }} activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Maintenance Type Distribution */}
        <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Service Type Distribution</h3>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {typeDistribution.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v, name) => [`${v} services`, name]} />
                <Legend
                  verticalAlign="bottom"
                  iconSize={8}
                  iconType="circle"
                  formatter={(value) => <span className="text-[10px] text-slate-500 dark:text-slate-400">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
