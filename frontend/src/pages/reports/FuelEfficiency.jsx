import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  FileText,
  TrendingUp,
  Truck,
  Activity,
  DollarSign
} from "lucide-react";
import toast from "react-hot-toast";
import reportService from "../../services/reportService";
import api from "../../services/api";

export default function FuelEfficiency() {
  const [analytics, setAnalytics] = useState([]);
  const [fleetUtilization, setFleetUtilization] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await reportService.getAnalytics();
      setAnalytics(data.analytics || data);
      setFleetUtilization(data.fleetUtilization || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const downloadCSV = async (endpoint, filename) => {
    try {
      const response = await api.get(endpoint, { responseType: "blob" });
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${filename} exported successfully!`, {
        style: { borderRadius: "12px", background: "#0d1527", color: "#fff" }
      });
    } catch (error) {
      console.error("Failed to download CSV:", error);
      toast.error("Export failed. You may have insufficient permissions.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Reports & Analytics
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review fleet performance dashboards, vehicle ROI diagnostics, and export CSV spreadsheets.
        </p>
      </div>

      {/* KPI Summary Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/75 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fleet Utilization</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{fleetUtilization}%</p>
          </div>
        </div>

        <div className="bg-white/75 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg Operations Cost</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              ${(analytics.reduce((acc, curr) => acc + (curr.operationalCost || 0), 0) / (analytics.length || 1)).toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        <div className="bg-white/75 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fleet Range Covered</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {analytics.reduce((acc, curr) => acc + (curr.totalDistance || 0), 0).toLocaleString()} mi
            </p>
          </div>
        </div>
      </div>

      {/* CSV Downloads Section */}
      <div className="bg-white/75 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <Download className="h-4 w-4 text-blue-500" />
          Download System Spreadsheets (CSV)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => downloadCSV("/reports/vehicles/csv", "vehicles_report.csv")}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer text-center gap-2"
          >
            <FileText className="h-5 w-5 text-indigo-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">Vehicles List</span>
          </button>
          <button
            onClick={() => downloadCSV("/reports/trips/csv", "trips_report.csv")}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer text-center gap-2"
          >
            <FileText className="h-5 w-5 text-emerald-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">Trips Log</span>
          </button>
          <button
            onClick={() => downloadCSV("/reports/maintenance/csv", "maintenance_report.csv")}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer text-center gap-2"
          >
            <FileText className="h-5 w-5 text-rose-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">Maintenance History</span>
          </button>
          <button
            onClick={() => downloadCSV("/reports/analytics/csv", "analytics_report.csv")}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer text-center gap-2"
          >
            <FileText className="h-5 w-5 text-amber-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">Vehicle ROI Analytics</span>
          </button>
        </div>
      </div>

      {/* Analytics ROI Table */}
      <div className="bg-white/75 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/40 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            Vehicle Performance & ROI Analysis
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-900/20 border-b border-slate-100 dark:border-slate-800/80">
              <tr>
                <th className="py-3 px-4">Vehicle Details</th>
                <th className="py-3 px-4 text-right">Distance Run (km)</th>
                <th className="py-3 px-4 text-right">Fuel Efficiency (km/L)</th>
                <th className="py-3 px-4 text-right">Operational Cost</th>
                <th className="py-3 px-4 text-right">Estimated Revenue</th>
                <th className="py-3 px-4 text-right">Estimated ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 dark:text-slate-500 font-semibold">
                    Calculating ROI values...
                  </td>
                </tr>
              ) : analytics.length > 0 ? (
                analytics.map((row) => (
                  <tr key={row.vehicleId} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors text-xs sm:text-sm">
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {row.name} ({row.registrationNumber})
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-slate-650 dark:text-slate-350">
                      {row.totalDistance ? row.totalDistance.toLocaleString() : "0"}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-slate-650 dark:text-slate-350">
                      {row.fuelEfficiency ? row.fuelEfficiency.toFixed(2) : "0.00"} km/L
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-800 dark:text-slate-200">
                      ${row.operationalCost ? row.operationalCost.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "0.00"}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      ${row.estimatedRevenue ? row.estimatedRevenue.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "0.00"}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs ${
                        row.roi >= 0 
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" 
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400"
                      }`}>
                        {(row.roi * 100).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 dark:text-slate-500">
                    No vehicle log telemetry recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}