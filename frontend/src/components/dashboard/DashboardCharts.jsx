import { useTheme } from "../../context/ThemeContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";

// Custom premium tooltip component
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 rounded-xl shadow-lg z-50">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
          {label}
        </p>
        {payload.map((item, idx) => (
          <p key={idx} className="text-xs font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span>{item.name}:</span>
            <span className="text-blue-500 font-extrabold">
              {formatter ? formatter(item.value) : item.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardCharts({ isLoading = false }) {
  const { theme } = useTheme();
  
  // Theme dependent variables
  const isDark = theme === "dark";
  const gridStroke = isDark ? "rgba(51, 65, 85, 0.25)" : "rgba(241, 245, 249, 0.85)";
  const textFill = isDark ? "#94a3b8" : "#64748b";

  // Mock data
  const tripsData = [
    { month: "Jan", Trips: 120 },
    { month: "Feb", Trips: 150 },
    { month: "Mar", Trips: 190 },
    { month: "Apr", Trips: 240 },
    { month: "May", Trips: 310 },
    { month: "Jun", Trips: 380 },
  ];

  const statusData = [
    { name: "Active (On Trip)", value: 45, color: "#3b82f6" },
    { name: "Available", value: 30, color: "#10b981" },
    { name: "Maintenance", value: 12, color: "#f59e0b" },
    { name: "Out of Service", value: 5, color: "#ef4444" },
  ];

  const fuelData = [
    { week: "Wk 1", Cost: 1240 },
    { week: "Wk 2", Cost: 1450 },
    { week: "Wk 3", Cost: 1100 },
    { week: "Wk 4", Cost: 1650 },
    { week: "Wk 5", Cost: 1300 },
    { week: "Wk 6", Cost: 1840 },
  ];

  const maintenanceData = [
    { month: "Jan", Cost: 3200 },
    { month: "Feb", Cost: 4100 },
    { month: "Mar", Cost: 3600 },
    { month: "Apr", Cost: 5200 },
    { month: "May", Cost: 4800 },
    { month: "Jun", Cost: 6100 },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs h-80 flex flex-col gap-4 animate-pulse">
            <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="flex-1 bg-slate-100 dark:bg-slate-900/30 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* 1. Trips per Month (Bar Chart) */}
      <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Trips completed per Month</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tripsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
              <XAxis dataKey="month" stroke={textFill} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke={textFill} fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }} />
              <Bar dataKey="Trips" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={32}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Vehicle Status Distribution (Pie Chart) */}
      <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Vehicle Fleet Distribution</h3>
        <div className="h-64 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="h-full w-full sm:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip formatter={(v) => `${v} vehicles`} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Legend to look extremely clean */}
          <div className="w-full sm:w-1/2 flex flex-col gap-2">
            {statusData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Fuel Cost Trend (Line Chart) */}
      <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Weekly Fuel Cost Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fuelData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="week" stroke={textFill} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke={textFill} fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip formatter={(v) => `$${v}`} />} />
              <Line
                type="monotone"
                dataKey="Cost"
                stroke="#f43f5e"
                strokeWidth={3}
                dot={{ stroke: "#f43f5e", strokeWidth: 2, r: 4, fill: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#f43f5e" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Maintenance Cost Trend (Area Chart) */}
      <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Monthly Maintenance Expenses</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={maintenanceData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="month" stroke={textFill} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke={textFill} fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip formatter={(v) => `$${v}`} />} />
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="Cost"
                stroke="#f59e0b"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#areaGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
