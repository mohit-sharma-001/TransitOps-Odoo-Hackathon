import { useState } from "react";
import { motion } from "framer-motion";
import {
  SlidersHorizontal,
  Calendar,
  RefreshCw
} from "lucide-react";
import ReportKPIs from "../../components/report/ReportKPIs";
import ReportCharts from "../../components/report/ReportCharts";
import ReportsList from "../../components/report/ReportsList";
import toast from "react-hot-toast";

export default function FuelEfficiency() {
  const [dateRange, setDateRange] = useState("This Month");
  const [vehicleFilter, setVehicleFilter] = useState("All Vehicles");
  const [driverFilter, setDriverFilter] = useState("All Drivers");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const selClass =
    "px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer appearance-none";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Business Intelligence
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Fleet analytics, operational KPIs, and generated reports for decision support.
          </p>
        </div>

        {/* Global Filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4 text-slate-400 hidden md:block" />

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={selClass}
          >
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Quarter</option>
            <option>Last Quarter</option>
            <option>Year to Date</option>
            <option>Last 12 Months</option>
          </select>

          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className={selClass}
          >
            <option>All Vehicles</option>
            <option>Volvo FH16 (TRK-102)</option>
            <option>Scania R500 (TRK-105)</option>
            <option>Actros L (TRK-109)</option>
            <option>Cascadia (TRK-101)</option>
            <option>DAF XF (TRK-108)</option>
            <option>Ford Transit (VAN-201)</option>
            <option>Hino 268 (TRK-302)</option>
            <option>Tesla Semi (EV-401)</option>
          </select>

          <select
            value={driverFilter}
            onChange={(e) => setDriverFilter(e.target.value)}
            className={selClass}
          >
            <option>All Drivers</option>
            <option>Alex Rivera</option>
            <option>Sarah Jenkins</option>
            <option>Marcus Brody</option>
            <option>David Miller</option>
            <option>Elena Rostova</option>
            <option>James Chen</option>
            <option>Priya Sharma</option>
            <option>Carlos Mendez</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={selClass}
          >
            <option>All Statuses</option>
            <option>Active</option>
            <option>Completed</option>
            <option>Pending</option>
          </select>

          <button
            onClick={() => toast.success("Dashboard data refreshed", { style: { borderRadius: "12px", background: "#0d1527", color: "#fff" } })}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      </div>

      {/* Executive KPIs */}
      <ReportKPIs />

      {/* Charts Grid */}
      <ReportCharts />

      {/* Reports List */}
      <ReportsList />
    </div>
  );
}