import {
  ArrowLeft,
  Wrench,
  Truck,
  User,
  Clock,
  DollarSign,
  FileText,
  Paperclip,
  Package,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Settings
} from "lucide-react";
import { motion } from "framer-motion";

export default function MaintenanceDetails({ record, onBack }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/30";
      case "In Progress": return "text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/30";
      case "Scheduled": return "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-800/30";
      case "Overdue": return "text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400 border-rose-200/50 dark:border-rose-800/30";
      case "Cancelled": return "text-slate-500 bg-slate-100 dark:bg-slate-800/40 dark:text-slate-400 border-slate-200/50 dark:border-slate-700/30";
      default: return "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical": return "text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400";
      case "High": return "text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400";
      case "Medium": return "text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400";
      default: return "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const timelineEvents = [
    { id: 1, label: "Service Requested", detail: `${record.serviceType} scheduled for ${record.vehicle}`, time: record.scheduledDate, status: "completed", icon: FileText },
    { id: 2, label: "Work Order Created", detail: `Assigned to ${record.mechanic}`, time: record.scheduledDate, status: "completed", icon: Settings },
    { id: 3, label: "Parts Ordered", detail: "Required parts procured from supplier inventory", time: record.scheduledDate, status: "completed", icon: Package },
    { id: 4, label: "Service In Progress", detail: `${record.mechanic} performing ${record.serviceType.toLowerCase()}`, time: "Current", status: record.status === "Completed" ? "completed" : record.status === "Cancelled" ? "cancelled" : "active", icon: Wrench },
    ...(record.status === "Overdue" ? [{ id: 5, label: "Service Overdue", detail: "Exceeded scheduled completion deadline", time: "—", status: "warning", icon: AlertTriangle }] : []),
    { id: 6, label: "Quality Inspection", detail: "Final inspection and test drive verification", time: record.completionDate || "Pending", status: record.status === "Completed" ? "completed" : "pending", icon: CheckCircle2 },
    { id: 7, label: "Service Completed", detail: "Vehicle cleared and returned to active fleet", time: record.completionDate || "Pending", status: record.status === "Completed" ? "completed" : "pending", icon: CheckCircle2 }
  ];

  const partsUsed = record.partsUsed || [
    { name: "Engine Oil Filter", qty: 1, unitCost: 28, total: 28 },
    { name: "Synthetic Motor Oil (5W-30)", qty: 8, unitCost: 12, total: 96 },
    { name: "Air Filter Element", qty: 1, unitCost: 45, total: 45 },
    { name: "Drain Plug Gasket", qty: 1, unitCost: 5, total: 5 }
  ];

  const partsTotal = partsUsed.reduce((sum, p) => sum + p.total, 0);
  const laborCost = record.cost - partsTotal > 0 ? record.cost - partsTotal : Math.round(record.cost * 0.4);

  const getTimelineIcon = (status) => {
    switch (status) {
      case "completed": return "bg-emerald-500 text-white border-emerald-500";
      case "active": return "bg-blue-500 text-white border-blue-500 animate-pulse";
      case "warning": return "bg-rose-500 text-white border-rose-500";
      case "cancelled": return "bg-slate-400 text-white border-slate-400";
      default: return "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-300 dark:border-slate-700";
    }
  };

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
        <button onClick={onBack} className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {record.maintenanceId}
            </h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(record.status)}`}>{record.status}</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${getPriorityColor(record.priority)}`}>{record.priority}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {record.serviceType} • {record.vehicle} ({record.regNumber})
          </p>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Scheduled", value: record.scheduledDate, icon: Clock, color: "text-blue-500" },
          { label: "Completed", value: record.completionDate || "In Progress", icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Total Cost", value: `$${record.cost.toLocaleString()}`, icon: DollarSign, color: "text-amber-500" },
          { label: "Service Type", value: record.serviceType, icon: Wrench, color: "text-indigo-500" }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-4 rounded-2xl shadow-xs text-center">
              <Icon className={`h-4 w-4 mx-auto ${item.color} mb-1.5`} />
              <p className="text-[10px] text-slate-400 font-bold uppercase">{item.label}</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{item.value}</p>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Service Timeline */}
          <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-5">Service Timeline</h3>
            <div className="flow-root">
              <ul className="-mb-6">
                {timelineEvents.map((event, idx) => {
                  const Icon = event.icon;
                  return (
                    <li key={event.id}>
                      <div className="relative pb-6">
                        {idx !== timelineEvents.length - 1 && (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-150 dark:bg-slate-800/80" aria-hidden="true" />
                        )}
                        <div className="relative flex space-x-3 items-start">
                          <span className={`h-8 w-8 rounded-lg flex items-center justify-center ${getTimelineIcon(event.status)}`}>
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex justify-between items-start gap-2">
                              <p className={`text-xs font-bold ${event.status === "pending" ? "text-slate-400 dark:text-slate-600" : "text-slate-800 dark:text-slate-200"}`}>{event.label}</p>
                              <span className={`text-[10px] whitespace-nowrap font-semibold ${event.status === "pending" ? "text-slate-350" : "text-slate-450 dark:text-slate-500"}`}>{event.time}</span>
                            </div>
                            <p className={`text-[11px] mt-0.5 leading-relaxed ${event.status === "pending" ? "text-slate-350" : "text-slate-500 dark:text-slate-400"}`}>{event.detail}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Parts Used */}
          <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Parts Used</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/60">
                    <th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-2">Part</th>
                    <th className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-2">Qty</th>
                    <th className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-2">Unit Cost</th>
                    <th className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-2">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/30">
                  {partsUsed.map((part, idx) => (
                    <tr key={idx}>
                      <td className="py-2 text-xs font-semibold text-slate-700 dark:text-slate-300">{part.name}</td>
                      <td className="py-2 text-xs text-slate-500 text-center">{part.qty}</td>
                      <td className="py-2 text-xs text-slate-500 text-right">${part.unitCost}</td>
                      <td className="py-2 text-xs font-bold text-slate-800 dark:text-slate-200 text-right">${part.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Cost Breakdown</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-450">Parts & Materials</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">${partsTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-slate-100 dark:border-slate-800/50 pt-2.5">
                <span className="text-slate-500 dark:text-slate-450">Labor (est.)</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">${laborCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-slate-100 dark:border-slate-800/50 pt-2.5">
                <span className="text-slate-500 dark:text-slate-450">Diagnostics</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">$75</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t-2 border-slate-200 dark:border-slate-700 pt-3">
                <span className="font-bold text-slate-800 dark:text-slate-200">Total</span>
                <span className="font-extrabold text-lg text-blue-600 dark:text-blue-400">${record.cost.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Service Notes</h3>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {record.notes || "Standard service completed per manufacturer specifications. All fluids topped off. Tire pressure calibrated to 105 PSI. Next service recommended at 15,000 miles or 6 months. No additional issues found during diagnostic scan."}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Vehicle Card */}
          <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Vehicle</h3>
            </div>
            <div className="w-full h-28 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-blue-800 flex items-center justify-center relative overflow-hidden mb-4">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              <Truck className="w-12 h-12 text-white/90" />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{record.vehicle}</p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">{record.regNumber}</p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="p-2 bg-slate-50/50 dark:bg-slate-900/20 rounded-lg border border-slate-100 dark:border-slate-800/50 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Type</p>
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-0.5">{record.vehicleType || "Heavy Truck"}</p>
              </div>
              <div className="p-2 bg-slate-50/50 dark:bg-slate-900/20 rounded-lg border border-slate-100 dark:border-slate-800/50 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Odometer</p>
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-0.5">{record.odometer || "82,450"} mi</p>
              </div>
            </div>
          </div>

          {/* Mechanic Card */}
          <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Assigned Mechanic</h3>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                  {record.mechanic.split(" ").map((w) => w[0]).join("")}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 block h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{record.mechanic}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-450">ASE Certified • 8 yrs exp</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="p-2.5 bg-slate-50/50 dark:bg-slate-900/20 rounded-lg border border-slate-100 dark:border-slate-800/50 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Specialization</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">Diesel</p>
              </div>
              <div className="p-2.5 bg-slate-50/50 dark:bg-slate-900/20 rounded-lg border border-slate-100 dark:border-slate-800/50 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Jobs (MTD)</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">14</p>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Paperclip className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Attachments</h3>
            </div>
            <div className="space-y-2">
              {[
                { name: "Service_Report.pdf", size: "340 KB" },
                { name: "Parts_Invoice.pdf", size: "156 KB" },
                { name: "Inspection_Photos.zip", size: "4.2 MB" }
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
