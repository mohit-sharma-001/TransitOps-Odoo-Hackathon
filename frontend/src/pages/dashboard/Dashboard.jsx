import { useEffect, useState } from "react";
import {
  Truck,
  CheckCircle,
  Wrench,
  MapPin,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react";
import KPICard from "../../components/dashboard/KPICard";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentTripsTable from "../../components/dashboard/RecentTripsTable";
import ActivityTimeline from "../../components/dashboard/ActivityTimeline";
import DashboardCharts from "../../components/dashboard/DashboardCharts";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1.0s mock load delay for skeleton showing
    return () => clearTimeout(timer);
  }, []);

  const kpis = [
    { title: "Active Vehicles", value: "45", description: "Currently in transit", trend: "+8.2%", trendType: "up", icon: Truck, colorClass: "border-blue-500", iconBgClass: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" },
    { title: "Available Vehicles", value: "30", description: "Ready in depot", trend: "+2.1%", trendType: "up", icon: CheckCircle, colorClass: "border-emerald-500", iconBgClass: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" },
    { title: "In Maintenance", value: "12", description: "Undergoing repairs", trend: "-4.5%", trendType: "up", icon: Wrench, colorClass: "border-amber-500", iconBgClass: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" },
    { title: "Active Trips", value: "24", description: "Active transits", trend: "+12.4%", trendType: "up", icon: MapPin, colorClass: "border-indigo-500", iconBgClass: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400" },
    { title: "Pending Trips", value: "8", description: "Queued for dispatch", trend: "0.0%", trendType: "neutral", icon: Clock, colorClass: "border-purple-500", iconBgClass: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" },
    { title: "Drivers On Duty", value: "38", description: "Working shifts", trend: "+5.3%", trendType: "up", icon: Users, colorClass: "border-teal-500", iconBgClass: "bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400" },
    { title: "Fleet Utilization", value: "84.5%", description: "Capacity metrics", trend: "+1.8%", trendType: "up", icon: TrendingUp, colorClass: "border-rose-500", iconBgClass: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400" }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Heading */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Welcome back, Deepesh 👋
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Here is what's happening with TransitOps today.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-5">
        {kpis.map((kpi, idx) => (
          <KPICard
            key={idx}
            {...kpi}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Main Content Splits: Charts (left) vs Sidebar Operations (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Panel */}
        <div className="lg:col-span-2">
          <DashboardCharts isLoading={isLoading} />
        </div>

        {/* Quick Actions and Activity Timeline Panel */}
        <div className="flex flex-col gap-6">
          <QuickActions isLoading={isLoading} />
          <ActivityTimeline isLoading={isLoading} />
        </div>
      </div>

      {/* Shipment Table Panel */}
      <div className="w-full">
        <RecentTripsTable isLoading={isLoading} />
      </div>
    </div>
  );
}