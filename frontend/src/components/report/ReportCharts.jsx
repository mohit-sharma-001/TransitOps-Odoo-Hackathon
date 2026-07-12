import {
  DollarSign,
  Navigation,
  Fuel,
  Wrench,
  Users,
  Truck,
  BarChart3,
  Activity,
  CheckCircle2
} from "lucide-react";
import {
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const revenueTrend = [
  { month: "Jan", revenue: 210000, target: 200000 },
  { month: "Feb", revenue: 225000, target: 215000 },
  { month: "Mar", revenue: 198000, target: 220000 },
  { month: "Apr", revenue: 248000, target: 230000 },
  { month: "May", revenue: 262000, target: 240000 },
  { month: "Jun", revenue: 278000, target: 250000 },
  { month: "Jul", revenue: 284500, target: 260000 }
];

const tripsTrend = [
  { month: "Jan", completed: 142, delayed: 8, cancelled: 3 },
  { month: "Feb", completed: 156, delayed: 12, cancelled: 2 },
  { month: "Mar", completed: 138, delayed: 6, cancelled: 5 },
  { month: "Apr", completed: 168, delayed: 10, cancelled: 4 },
  { month: "May", completed: 175, delayed: 9, cancelled: 1 },
  { month: "Jun", completed: 184, delayed: 14, cancelled: 3 },
  { month: "Jul", completed: 92, delayed: 4, cancelled: 1 }
];

const fuelTrend = [
  { month: "Jan", cost: 12400, gallons: 3400 },
  { month: "Feb", cost: 10800, gallons: 2950 },
  { month: "Mar", cost: 14200, gallons: 3800 },
  { month: "Apr", cost: 11600, gallons: 3100 },
  { month: "May", cost: 13100, gallons: 3500 },
  { month: "Jun", cost: 15800, gallons: 4200 },
  { month: "Jul", cost: 8200, gallons: 2100 }
];

const maintenanceTrend = [
  { month: "Jan", preventive: 3200, corrective: 5000 },
  { month: "Feb", preventive: 2800, corrective: 4000 },
  { month: "Mar", preventive: 4500, corrective: 7900 },
  { month: "Apr", preventive: 3100, corrective: 6000 },
  { month: "May", preventive: 2600, corrective: 5000 },
  { month: "Jun", preventive: 4200, corrective: 7100 },
  { month: "Jul", preventive: 1800, corrective: 3000 }
];

const driverPerformance = [
  { name: "Alex R.", trips: 42, rating: 4.9, safety: 97, onTime: 95 },
  { name: "Sarah J.", trips: 38, rating: 4.8, safety: 95, onTime: 92 },
  { name: "Marcus B.", trips: 35, rating: 4.6, safety: 92, onTime: 88 },
  { name: "David M.", trips: 32, rating: 4.7, safety: 94, onTime: 90 },
  { name: "James C.", trips: 28, rating: 4.4, safety: 96, onTime: 94 },
  { name: "Elena R.", trips: 0, rating: 4.5, safety: 93, onTime: 91 }
];

const fleetUtilization = [
  { name: "Active", value: 14, color: "#3b82f6" },
  { name: "Available", value: 3, color: "#10b981" },
  { name: "Maintenance", value: 2, color: "#f59e0b" },
  { name: "Offline", value: 1, color: "#64748b" }
];

const monthlyComparison = [
  { metric: "Revenue", current: 284500, previous: 278000 },
  { metric: "Trips", current: 92, previous: 184 },
  { metric: "Fuel $", current: 8200, previous: 15800 },
  { metric: "Maint $", current: 4800, previous: 11300 },
  { metric: "Drivers", current: 18, previous: 22 }
];

const vehicleHealth = [
  { subject: "Engine", A: 92, fullMark: 100 },
  { subject: "Brakes", A: 85, fullMark: 100 },
  { subject: "Tires", A: 78, fullMark: 100 },
  { subject: "Battery", A: 94, fullMark: 100 },
  { subject: "Trans.", A: 88, fullMark: 100 },
  { subject: "Electrical", A: 91, fullMark: 100 }
];

const deliveryPerformance = [
  { month: "Jan", onTime: 93, late: 5, failed: 2 },
  { month: "Feb", onTime: 91, late: 7, failed: 2 },
  { month: "Mar", onTime: 95, late: 3, failed: 2 },
  { month: "Apr", onTime: 92, late: 6, failed: 2 },
  { month: "May", onTime: 96, late: 3, failed: 1 },
  { month: "Jun", onTime: 94, late: 5, failed: 1 },
  { month: "Jul", onTime: 96, late: 3, failed: 1 }
];

export default function ReportCharts() {
  const isDark = document.documentElement.classList.contains("dark");

  const tt = {
    backgroundColor: isDark ? "#0f172a" : "#fff",
    border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "11px",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
  };
  const ax = { fontSize: 10, fill: isDark ? "#94a3b8" : "#64748b" };
  const grid = isDark ? "#1e293b" : "#f1f5f9";

  const Card = ({ icon: Icon, color, title, children }) => (
    <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`h-4 w-4 ${color}`} />
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</h3>
      </div>
      <div className="h-56">{children}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Row 1: Revenue + Trips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card icon={DollarSign} color="text-emerald-500" title="Revenue vs Target">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="month" tick={ax} axisLine={false} tickLine={false} />
              <YAxis tick={ax} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tt} formatter={(v) => [`$${v.toLocaleString()}`, ""]} />
              <Legend verticalAlign="top" iconSize={8} iconType="circle" formatter={(v) => <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{v}</span>} />
              <Bar dataKey="revenue" fill="url(#revGrad)" radius={[4, 4, 0, 0]} barSize={22} name="Revenue" />
              <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        <Card icon={Navigation} color="text-blue-500" title="Trips Overview">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tripsTrend} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="month" tick={ax} axisLine={false} tickLine={false} />
              <YAxis tick={ax} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tt} />
              <Legend verticalAlign="top" iconSize={8} iconType="circle" formatter={(v) => <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{v}</span>} />
              <Bar dataKey="completed" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} name="Completed" />
              <Bar dataKey="delayed" stackId="a" fill="#f59e0b" name="Delayed" />
              <Bar dataKey="cancelled" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} name="Cancelled" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Row 2: Fuel + Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card icon={Fuel} color="text-amber-500" title="Fuel Cost & Usage Trend">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={fuelTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="month" tick={ax} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={ax} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" tick={ax} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}`} />
              <Tooltip contentStyle={tt} />
              <Legend verticalAlign="top" iconSize={8} iconType="circle" formatter={(v) => <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{v}</span>} />
              <Bar yAxisId="left" dataKey="cost" fill="url(#fuelCostGrad)" radius={[4, 4, 0, 0]} barSize={20} name="Cost ($)" />
              <Line yAxisId="right" type="monotone" dataKey="gallons" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b", r: 3 }} name="Gallons" />
              <defs>
                <linearGradient id="fuelCostGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        <Card icon={Wrench} color="text-rose-500" title="Maintenance Cost Breakdown">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={maintenanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="month" tick={ax} axisLine={false} tickLine={false} />
              <YAxis tick={ax} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tt} formatter={(v) => [`$${v.toLocaleString()}`, ""]} />
              <Legend verticalAlign="top" iconSize={8} iconType="circle" formatter={(v) => <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{v}</span>} />
              <defs>
                <linearGradient id="prevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="corrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="preventive" stroke="#6366f1" strokeWidth={2} fill="url(#prevGrad)" name="Preventive" />
              <Area type="monotone" dataKey="corrective" stroke="#ef4444" strokeWidth={2} fill="url(#corrGrad)" name="Corrective" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Row 3: Driver Performance + Fleet Utilization + Vehicle Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card icon={Users} color="text-indigo-500" title="Driver Performance">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={driverPerformance} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} horizontal={false} />
              <XAxis type="number" tick={ax} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={ax} axisLine={false} tickLine={false} width={52} />
              <Tooltip contentStyle={tt} />
              <Bar dataKey="trips" fill="url(#driverGrad)" radius={[0, 6, 6, 0]} name="Trips" />
              <defs>
                <linearGradient id="driverGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card icon={Truck} color="text-blue-500" title="Fleet Utilization">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={fleetUtilization} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                {fleetUtilization.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip contentStyle={tt} formatter={(v, name) => [`${v} vehicles`, name]} />
              <Legend verticalAlign="bottom" iconSize={8} iconType="circle" formatter={(value) => <span className="text-[10px] text-slate-500 dark:text-slate-400">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card icon={Activity} color="text-teal-500" title="Avg Vehicle Health Score">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius={75} data={vehicleHealth}>
              <PolarGrid stroke={isDark ? "#1e293b" : "#e2e8f0"} />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: isDark ? "#94a3b8" : "#64748b" }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Health" dataKey="A" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.25} strokeWidth={2} />
              <Tooltip contentStyle={tt} formatter={(v) => [`${v}%`, "Score"]} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Row 4: Monthly Comparison + Delivery Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card icon={BarChart3} color="text-violet-500" title="Monthly Comparison (Jul vs Jun)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyComparison} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="metric" tick={ax} axisLine={false} tickLine={false} />
              <YAxis tick={ax} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tt} />
              <Legend verticalAlign="top" iconSize={8} iconType="circle" formatter={(v) => <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{v}</span>} />
              <Bar dataKey="current" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Current" />
              <Bar dataKey="previous" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Previous" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card icon={CheckCircle2} color="text-emerald-500" title="Delivery Performance (%)">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={deliveryPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="month" tick={ax} axisLine={false} tickLine={false} />
              <YAxis tick={ax} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={tt} formatter={(v) => [`${v}%`, ""]} />
              <Legend verticalAlign="top" iconSize={8} iconType="circle" formatter={(v) => <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{v}</span>} />
              <defs>
                <linearGradient id="onTimeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="onTime" stroke="#10b981" strokeWidth={2} fill="url(#onTimeGrad)" name="On-Time" />
              <Line type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: "#f59e0b" }} name="Late" />
              <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: "#ef4444" }} name="Failed" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
