import { ArrowLeft, Calendar, Fuel, MapPin, Wrench, QrCode, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function VehicleDetails({ vehicle, onBack }) {
  // Seeding dummy statistics/logs based on vehicle type or registration
  const maintenanceHistory = [
    { id: 1, type: "Routine Oil Change", date: "June 24, 2026", cost: 180, status: "Completed", notes: "Full synthetic oil, oil filter replaced." },
    { id: 2, type: "Tire Rotation & Alignment", date: "May 12, 2026", cost: 240, status: "Completed", notes: "Aligned front axle, rotated all tires." },
    { id: 3, type: "Brake Pad Replacement", date: "April 08, 2026", cost: 450, status: "Completed", notes: "Rear brake pads replaced, rotor resurfaced." }
  ];

  const fuelLogs = {
    avgEfficiency: vehicle.type.includes("Heavy") ? "6.8 mpg" : vehicle.type.includes("EV") ? "0.45 kWh/mi" : "18.2 mpg",
    totalConsumption: vehicle.type.includes("EV") ? "4,820 kWh" : "3,240 Gal",
    totalCost: vehicle.type.includes("EV") ? 1446 : 11988
  };

  const tripSummary = {
    completedTrips: 42,
    activeDriver: "Alex Rivera",
    totalDistance: vehicle.odometer - 15000 > 0 ? (vehicle.odometer - 15000).toLocaleString() : "24,500"
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Detail Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {vehicle.name}
            </h1>
            <span className="text-xs font-bold text-slate-450 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              {vehicle.regNumber}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Vehicle Profile and Fleet Operations Report
          </p>
        </div>
      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Image, QR Code & Core Specs */}
        <div className="space-y-6">
          {/* Main Info Card */}
          <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
            {/* Vehicle Gradient Mockup Graphic */}
            <div className="w-full h-44 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-800 flex items-center justify-center relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              <svg className="w-24 h-24 text-white/95" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M14 18H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6" />
                <circle cx="7.5" cy="18.5" r="2.5" />
                <circle cx="16.5" cy="18.5" r="2.5" />
                <path d="M18 10h4v4h-4z" />
                <path d="M14 6V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2" />
              </svg>
              <div className="absolute bottom-3 left-3 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider">
                {vehicle.type}
              </div>
            </div>

            {/* Spec items list */}
            <div className="mt-6 space-y-3.5">
              <div className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-800/50 pb-2">
                <span className="text-slate-500 dark:text-slate-450">Registration Number</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{vehicle.regNumber}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-800/50 pb-2">
                <span className="text-slate-500 dark:text-slate-450">Vehicle Type</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{vehicle.type}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-800/50 pb-2">
                <span className="text-slate-500 dark:text-slate-450">Cargo Capacity</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{vehicle.capacity.toLocaleString()} lbs</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-800/50 pb-2">
                <span className="text-slate-500 dark:text-slate-450">Current Odometer</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{vehicle.odometer.toLocaleString()} mi</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-800/50 pb-2">
                <span className="text-slate-500 dark:text-slate-450">Acquisition Cost</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{formatCurrency(vehicle.acquisitionCost)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-450">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  vehicle.status === "Available" 
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" 
                    : vehicle.status === "On Trip" 
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400"
                    : vehicle.status === "Maintenance"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                }`}>
                  {vehicle.status}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Placeholder Card */}
          <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs flex items-center gap-4">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 rounded-xl flex-shrink-0">
              <QrCode className="h-10 w-10" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Asset QR Identity</h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
                Scan labels on the vehicle console to check-in maintenance or track driver dispatch logs.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Summaries & History Logs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fuel Summary */}
            <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs flex items-start gap-4">
              <div className="p-3 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
                <Fuel className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Fuel Summary</h4>
                <div className="text-lg font-bold text-slate-850 dark:text-slate-100 mt-1">{fuelLogs.avgEfficiency} Avg</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-1">
                  Consumed: <span className="font-semibold text-slate-700 dark:text-slate-300">{fuelLogs.totalConsumption}</span> • Spend: <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(fuelLogs.totalCost)}</span>
                </p>
              </div>
            </div>

            {/* Trip Summary */}
            <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs flex items-start gap-4">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Trip Summary</h4>
                <div className="text-lg font-bold text-slate-850 dark:text-slate-100 mt-1">{tripSummary.completedTrips} Trips</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-1">
                  Driver: <span className="font-semibold text-slate-700 dark:text-slate-300">{tripSummary.activeDriver}</span> • Odo distance: <span className="font-semibold text-slate-700 dark:text-slate-300">{tripSummary.totalDistance} mi</span>
                </p>
              </div>
            </div>
          </div>

          {/* Maintenance History */}
          <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="h-4.5 w-4.5 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Maintenance History Logs</h3>
            </div>
            <div className="flow-root">
              <div className="overflow-x-auto -mx-5">
                <div className="inline-block min-w-full align-middle px-5">
                  <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                    <thead>
                      <tr className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        <th className="pb-2.5 pr-4">Service Type</th>
                        <th className="pb-2.5 px-4">Service Date</th>
                        <th className="pb-2.5 px-4 text-right">Service Cost</th>
                        <th className="pb-2.5 px-4">Status</th>
                        <th className="pb-2.5 pl-4">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs">
                      {maintenanceHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-55/30 dark:hover:bg-slate-800/20 transition-colors">
                          <td className="py-3 pr-4 font-semibold text-slate-850 dark:text-slate-200">{item.type}</td>
                          <td className="py-3 px-4 text-slate-500 dark:text-slate-450">
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                              <Calendar className="h-3.5 w-3.5 text-slate-400" />
                              <span>{item.date}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-slate-700 dark:text-slate-350">{formatCurrency(item.cost)}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 pl-4 text-slate-450 dark:text-slate-500 max-w-xs truncate">{item.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Logs / File Text */}
          <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-4.5 w-4.5 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Trip dispatch log</h3>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/35 rounded-xl border border-slate-100 dark:border-slate-800/60 text-xs">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                  <span>Trip #TRP-9482</span>
                  <span>June 29, 2026</span>
                </div>
                <p className="mt-1.5 text-slate-800 dark:text-slate-200 font-semibold">Route: Chicago, IL ➔ New York, NY</p>
                <p className="mt-1 text-slate-550 dark:text-slate-450 leading-relaxed">
                  Cargo loaded: Electronics (4.5 Tons). Completed with 0 delays. Driver notes: Truck alignment feels smooth. Brake deceleration is standard.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
