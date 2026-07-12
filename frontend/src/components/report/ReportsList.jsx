import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Truck,
  Users,
  Navigation,
  Fuel,
  Wrench,
  ChevronRight,
  FileSpreadsheet,
  File,
  CheckCircle2,
  Clock
} from "lucide-react";
import toast from "react-hot-toast";

const reports = [
  {
    id: "fleet",
    title: "Fleet Report",
    description: "Complete fleet inventory, utilization rates, depreciation, and asset lifecycle analysis.",
    icon: Truck,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/20",
    lastGenerated: "Jul 11, 2026",
    status: "Ready",
    metrics: ["20 vehicles tracked", "87.4% utilization", "$1.2M total asset value"]
  },
  {
    id: "driver",
    title: "Driver Report",
    description: "Driver performance ratings, safety scores, trip logs, license expiry tracking, and compliance.",
    icon: Users,
    color: "text-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-950/20",
    lastGenerated: "Jul 11, 2026",
    status: "Ready",
    metrics: ["24 active drivers", "4.6 avg rating", "94% safety score"]
  },
  {
    id: "trip",
    title: "Trip Report",
    description: "Route analytics, distance, ETA accuracy, cargo manifests, and delivery KPIs.",
    icon: Navigation,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    lastGenerated: "Jul 12, 2026",
    status: "Ready",
    metrics: ["1,055 trips YTD", "96.2% on-time", "342K miles covered"]
  },
  {
    id: "fuel",
    title: "Fuel Report",
    description: "Fuel consumption analytics, cost-per-mile, station usage, and fuel type breakdown.",
    icon: Fuel,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/20",
    lastGenerated: "Jul 12, 2026",
    status: "Processing",
    metrics: ["23,050 gal consumed", "$0.52 cost/mile", "7.4 mpg fleet avg"]
  },
  {
    id: "maintenance",
    title: "Maintenance Report",
    description: "Service history, cost trends, parts inventory, mechanic workloads, and predictive alerts.",
    icon: Wrench,
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-950/20",
    lastGenerated: "Jul 10, 2026",
    status: "Ready",
    metrics: ["68 services YTD", "$62,400 total cost", "6.2 hrs avg downtime"]
  }
];

const handleExport = (reportTitle, format) => {
  toast.success(`${reportTitle} exported as ${format.toUpperCase()}`, {
    style: { borderRadius: "12px", background: "#0d1527", color: "#fff" }
  });
};

export default function ReportsList() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-blue-500" />
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Generated Reports</h2>
      </div>

      <div className="space-y-3">
        {reports.map((report, idx) => {
          const Icon = report.icon;
          const isExpanded = expandedId === report.id;

          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 rounded-2xl shadow-xs overflow-hidden"
            >
              {/* Report Row */}
              <button
                onClick={() => toggleExpand(report.id)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors cursor-pointer"
              >
                <div className={`w-10 h-10 ${report.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-5 w-5 ${report.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{report.title}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      report.status === "Ready"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                        : "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
                    }`}>
                      {report.status === "Ready" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3 animate-spin" />}
                      {report.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{report.description}</p>
                </div>

                <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Last Generated</p>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{report.lastGenerated}</p>
                  </div>
                </div>

                <ChevronRight className={`h-4 w-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0 border-t border-slate-100 dark:border-slate-800/50">
                      <div className="flex flex-col md:flex-row gap-4 mt-3">
                        {/* Key Metrics */}
                        <div className="flex-1">
                          <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Key Metrics</p>
                          <div className="flex flex-wrap gap-2">
                            {report.metrics.map((m, i) => (
                              <span key={i} className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/50 text-slate-600 dark:text-slate-400">
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Export Buttons */}
                        <div className="flex items-end gap-2 flex-shrink-0">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleExport(report.title, "pdf"); }}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-800/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                          >
                            <File className="h-3.5 w-3.5" />
                            PDF
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleExport(report.title, "excel"); }}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-emerald-200 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors cursor-pointer"
                          >
                            <FileSpreadsheet className="h-3.5 w-3.5" />
                            Excel
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleExport(report.title, "csv"); }}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-blue-200 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors cursor-pointer"
                          >
                            <Download className="h-3.5 w-3.5" />
                            CSV
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
