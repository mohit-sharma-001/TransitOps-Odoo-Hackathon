import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Shield,
  Truck,
  Clock,
  Fuel,
  AlertTriangle,
  FileText,
  Paperclip,
  Navigation,
  CheckCircle2,
  TrendingUp,
  User,
  Heart
} from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const tripsPerMonth = [
  { month: "Jan", trips: 18 },
  { month: "Feb", trips: 22 },
  { month: "Mar", trips: 15 },
  { month: "Apr", trips: 26 },
  { month: "May", trips: 20 },
  { month: "Jun", trips: 28 },
  { month: "Jul", trips: 12 }
];

const safetyScoreTrend = [
  { month: "Jan", score: 91 },
  { month: "Feb", score: 93 },
  { month: "Mar", score: 88 },
  { month: "Apr", score: 95 },
  { month: "May", score: 92 },
  { month: "Jun", score: 97 },
  { month: "Jul", score: 96 }
];

export default function DriverProfile({ driver, onBack }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Available": return "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/30";
      case "Driving": return "text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/30";
      case "On Leave": return "text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/30";
      case "Offline": return "text-slate-500 bg-slate-100 dark:bg-slate-800/40 dark:text-slate-400 border-slate-200/50 dark:border-slate-700/30";
      default: return "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case "Available": return "bg-emerald-500";
      case "Driving": return "bg-blue-500 animate-pulse";
      case "On Leave": return "bg-amber-500";
      default: return "bg-slate-400";
    }
  };

  const stats = [
    { label: "Total Trips", value: driver.totalTrips || 287, icon: Navigation, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/20" },
    { label: "Total Distance", value: `${(driver.totalDistance || 84250).toLocaleString()} mi`, icon: MapPin, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/20" },
    { label: "Deliveries Done", value: driver.deliveriesCompleted || 274, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
    { label: "Fuel Efficiency", value: `${driver.fuelEfficiency || 7.8} mpg`, icon: Fuel, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/20" },
    { label: "Safety Score", value: `${driver.safetyScore || 96}%`, icon: Shield, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/20" },
    { label: "Late Deliveries", value: driver.lateDeliveries || 4, icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/20" }
  ];

  const recentTrips = [
    { id: "TRP-9501", route: "Chicago → New York", status: "Completed", date: "Jul 10, 2026", distance: "790 mi" },
    { id: "TRP-9485", route: "Houston → Dallas", status: "Completed", date: "Jul 8, 2026", distance: "240 mi" },
    { id: "TRP-9472", route: "Miami → Atlanta", status: "Delayed", date: "Jul 5, 2026", distance: "662 mi" },
    { id: "TRP-9460", route: "Seattle → Portland", status: "Completed", date: "Jul 2, 2026", distance: "175 mi" },
    { id: "TRP-9448", route: "LA → San Francisco", status: "Completed", date: "Jun 28, 2026", distance: "382 mi" }
  ];

  const getTripStatusColor = (status) => {
    switch (status) {
      case "Completed": return "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400";
      case "Delayed": return "text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400";
      default: return "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const isDark = document.documentElement.classList.contains("dark");

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Driver Profile</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Complete overview and performance analytics</p>
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-5">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl md:text-3xl font-extrabold shadow-lg border border-white/20">
              {driver.name.split(" ").map((w) => w[0]).join("")}
            </div>
            <span className={`absolute -bottom-1 -right-1 block h-4 w-4 rounded-full ring-3 ring-white/30 ${getStatusDot(driver.status)}`} />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h2 className="text-xl md:text-2xl font-extrabold">{driver.name}</h2>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-sm border border-white/10`}>
                <span className={`h-1.5 w-1.5 rounded-full ${getStatusDot(driver.status)}`} />
                {driver.status}
              </span>
            </div>
            <p className="text-sm text-white/70 font-medium">{driver.driverId} • CDL Class A Licensed</p>

            <div className="flex flex-wrap gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-300 fill-amber-300" />
                <span className="text-sm font-bold">{driver.rating.toFixed(1)}</span>
                <span className="text-xs text-white/60">rating</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-white/60" />
                <span className="text-sm font-bold">{driver.experience} yrs</span>
                <span className="text-xs text-white/60">experience</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Navigation className="h-4 w-4 text-white/60" />
                <span className="text-sm font-bold">{driver.totalTrips || 287}</span>
                <span className="text-xs text-white/60">total trips</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-4 rounded-2xl shadow-xs text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className={`w-8 h-8 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="text-lg font-extrabold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name", value: driver.name, icon: User },
                { label: "Phone", value: driver.phone, icon: Phone },
                { label: "Email", value: driver.email, icon: Mail },
                { label: "Address", value: driver.address || "742 Freight Ln, Dallas, TX 75201", icon: MapPin },
                { label: "Date of Birth", value: driver.dateOfBirth || "Mar 15, 1988", icon: Calendar },
                { label: "Joined", value: driver.joinDate || "Jan 2020", icon: Calendar }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-3 p-3 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-slate-100 dark:border-slate-800/50">
                    <Icon className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</p>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* License Details */}
          <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">License Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-slate-100 dark:border-slate-800/50 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase">License Number</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono mt-1">{driver.licenseNumber}</p>
              </div>
              <div className="p-3 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-slate-100 dark:border-slate-800/50 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase">License Class</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">CDL Class A</p>
              </div>
              <div className="p-3 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-slate-100 dark:border-slate-800/50 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Expiry Date</p>
                <p className={`text-sm font-bold mt-1 ${new Date(driver.licenseExpiry) < new Date() ? "text-rose-600 dark:text-rose-400" : "text-slate-800 dark:text-slate-200"}`}>
                  {driver.licenseExpiry}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Trips Timeline */}
          <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Navigation className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Recent Trips</h3>
            </div>
            <div className="flow-root">
              <ul className="-mb-4">
                {recentTrips.map((trip, idx) => (
                  <li key={trip.id}>
                    <div className="relative pb-4">
                      {idx !== recentTrips.length - 1 && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-150 dark:bg-slate-800/80" aria-hidden="true" />
                      )}
                      <div className="relative flex space-x-3 items-start">
                        <div>
                          <span className={`h-8 w-8 rounded-lg flex items-center justify-center ${trip.status === "Completed" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}`}>
                            {trip.status === "Completed" ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div>
                              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">{trip.id}</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">{trip.route}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${getTripStatusColor(trip.status)}`}>{trip.status}</span>
                              <span className="text-[10px] text-slate-400">{trip.date}</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">{trip.distance}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Performance Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trips Per Month */}
            <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Trips Per Month</h3>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tripsPerMonth} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#f1f5f9"} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: isDark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: isDark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#0f172a" : "#fff",
                        border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
                        borderRadius: "12px",
                        fontSize: "11px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                      }}
                    />
                    <Bar dataKey="trips" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Safety Score Trend */}
            <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-4 w-4 text-violet-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Safety Score Trend</h3>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={safetyScoreTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#f1f5f9"} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: isDark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[80, 100]} tick={{ fontSize: 10, fill: isDark ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#0f172a" : "#fff",
                        border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
                        borderRadius: "12px",
                        fontSize: "11px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                      }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: "#8b5cf6", r: 4 }} activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Assigned Vehicle */}
          <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Assigned Vehicle</h3>
            </div>
            <div className="w-full h-28 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-blue-800 flex items-center justify-center relative overflow-hidden mb-4">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              <Truck className="w-12 h-12 text-white/90" />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{driver.assignedVehicle || "Unassigned"}</p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="p-2 bg-slate-50/50 dark:bg-slate-900/20 rounded-lg border border-slate-100 dark:border-slate-800/50 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Type</p>
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-0.5">Heavy Truck</p>
              </div>
              <div className="p-2 bg-slate-50/50 dark:bg-slate-900/20 rounded-lg border border-slate-100 dark:border-slate-800/50 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Capacity</p>
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-0.5">40,000 lbs</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-4 w-4 text-rose-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Emergency Contact</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Name", value: driver.emergencyContact || "Maria Rivera" },
                { label: "Relationship", value: "Spouse" },
                { label: "Phone", value: driver.emergencyPhone || "(555) 234-5678" }
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-450">{item.label}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Paperclip className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Documents</h3>
            </div>
            <div className="space-y-2">
              {[
                { name: "CDL_License_Scan.pdf", size: "1.2 MB" },
                { name: "Medical_Certificate.pdf", size: "680 KB" },
                { name: "Background_Check.pdf", size: "245 KB" },
                { name: "Drug_Test_Results.pdf", size: "128 KB" }
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-900/25 rounded-xl border border-slate-100 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer group">
                  <div className="p-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-lg flex-shrink-0">
                    <FileText className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{doc.name}</p>
                    <p className="text-[10px] text-slate-400">{doc.size}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
