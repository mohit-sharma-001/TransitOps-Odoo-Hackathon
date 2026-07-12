import { motion } from "framer-motion";
import {
  Fuel,
  Gauge,
  DollarSign,
  TrendingUp,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
  { month: "Jan", cost: 12400 },
  { month: "Feb", cost: 10800 },
  { month: "Mar", cost: 14200 },
  { month: "Apr", cost: 11600 },
  { month: "May", cost: 13100 },
  { month: "Jun", cost: 15800 },
  { month: "Jul", cost: 8200 }
];

const usageTrend = [
  { month: "Jan", gallons: 3400 },
  { month: "Feb", gallons: 2950 },
  { month: "Mar", gallons: 3800 },
  { month: "Apr", gallons: 3100 },
  { month: "May", gallons: 3500 },
  { month: "Jun", gallons: 4200 },
  { month: "Jul", gallons: 2100 }
];

const vehicleComparison = [
  { name: "TRK-102", consumption: 420 },
  { name: "TRK-105", consumption: 385 },
  { name: "TRK-109", consumption: 510 },
  { name: "TRK-101", consumption: 460 },
  { name: "TRK-108", consumption: 340 },
  { name: "VAN-201", consumption: 180 },
  { name: "TRK-302", consumption: 290 },
  { name: "EV-401", consumption: 0 }
];

const costDistribution = [
  { name: "Diesel", value: 62, color: "#3b82f6" },
  { name: "Gasoline", value: 22, color: "#6366f1" },
  { name: "CNG", value: 8, color: "#10b981" },
  { name: "Electric", value: 5, color: "#8b5cf6" },
  { name: "DEF Fluid", value: 3, color: "#f59e0b" }
];

export default function FuelDashboard() {
  const isDark = document.documentElement.classList.contains("dark");

  const kpis = [
    { label: "Total Consumption", value: "23,050 gal", sub: "This quarter", icon: Fuel, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/20", accent: "border-l-blue-500", trend: "+4.2%", trendUp: true },
    { label: "Avg Mileage", value: "7.4 mpg", sub: "Fleet average", icon: Gauge, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/20", accent: "border-l-indigo-500", trend: "+0.3", trendUp: true },
    { label: "Total Fuel Cost", value: "$86,100", sub: "This quarter", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/20", accent: "border-l-emerald-500", trend: "-2.1%", trendUp: false },
    { label: "Monthly Spending", value: "$15,800", sub: "June 2026", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/20", accent: "border-l-amber-500", trend: "+8.5%", trendUp: true },
    { label: "Highest Consumer", value: "TRK-109", sub: "510 gal/mo", icon: ArrowUp, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/20", accent: "border-l-rose-500", trend: null, trendUp: false },
    { label: "Lowest Consumer", value: "EV-401", sub: "0 gal (Electric)", icon: ArrowDown, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/20", accent: "border-l-violet-500", trend: null, trendUp: false }
  ];

  const tooltipStyle = {
    backgroundColor: isDark ? "#0f172a" : "#fff",
    border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "11px",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
  };
  const axTick = { fontSize: 10, fill: isDark ? "#94a3b8" : "#64748b" };

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
                {kpi.trend && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${kpi.trendUp ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400" : "text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400"}`}>
                    {kpi.trend}
                  </span>
                )}
              </div>
              <p className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">{kpi.value}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{kpi.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Fuel Cost */}
        <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Monthly Fuel Cost</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyCost} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#f1f5f9"} />
                <XAxis dataKey="month" tick={axTick} axisLine={false} tickLine={false} />
                <YAxis tick={axTick} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`$${v.toLocaleString()}`, "Cost"]} />
                <Bar dataKey="cost" fill="url(#fuelBarGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="fuelBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fuel Usage Trend */}
        <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Fuel Usage Trend</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#f1f5f9"} />
                <XAxis dataKey="month" tick={axTick} axisLine={false} tickLine={false} />
                <YAxis tick={axTick} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v.toLocaleString()} gal`, "Usage"]} />
                <defs>
                  <linearGradient id="fuelAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="gallons" stroke="#10b981" strokeWidth={2.5} fill="url(#fuelAreaGrad)" dot={{ fill: "#10b981", r: 4 }} activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Comparison */}
        <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Fuel className="h-4 w-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Vehicle Fuel Comparison (gal/mo)</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vehicleComparison} barSize={20} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#f1f5f9"} horizontal={false} />
                <XAxis type="number" tick={axTick} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={axTick} axisLine={false} tickLine={false} width={55} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} gal`, "Consumption"]} />
                <Bar dataKey="consumption" fill="url(#vehBarGrad)" radius={[0, 6, 6, 0]} />
                <defs>
                  <linearGradient id="vehBarGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Distribution */}
        <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Cost Distribution by Fuel Type</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={costDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {costDistribution.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v, name) => [`${v}%`, name]} />
                <Legend verticalAlign="bottom" iconSize={8} iconType="circle" formatter={(value) => <span className="text-[10px] text-slate-500 dark:text-slate-400">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Analytics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Avg Mileage", value: "7.4 mpg", sub: "Fleet-wide", color: "text-blue-500" },
          { label: "Efficiency Score", value: "82/100", sub: "Above average", color: "text-emerald-500" },
          { label: "Cost per Mile", value: "$0.52", sub: "Q3 Average", color: "text-amber-500" },
          { label: "Consumption Trend", value: "-3.1%", sub: "vs Last Quarter", color: "text-indigo-500" }
        ].map((a, idx) => (
          <motion.div
            key={a.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.05 }}
            className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-4 rounded-2xl shadow-xs text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <p className={`text-xl font-extrabold ${a.color}`}>{a.value}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{a.label}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{a.sub}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
