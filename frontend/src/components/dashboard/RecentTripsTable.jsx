import { MapPin, Navigation } from "lucide-react";

export default function RecentTripsTable({ isLoading = false }) {
  const recentTrips = [
    { id: 1, vehicle: "Volvo FH16 (TRK-102)", driver: "Alex Rivera", route: "Chicago, IL ➔ New York, NY", cargo: "Electronics (4.5t)", status: "Running", progress: 68, eta: "5:30 PM" },
    { id: 2, vehicle: "Scania R500 (TRK-105)", driver: "Sarah Jenkins", route: "Houston, TX ➔ Los Angeles, CA", cargo: "Pharma Supplies (1.8t)", status: "Completed", progress: 100, eta: "Done" },
    { id: 3, vehicle: "Actros L (TRK-109)", driver: "Marcus Brody", route: "Seattle, WA ➔ Denver, CO", cargo: "Industrial Steel (8.2t)", status: "Pending", progress: 0, eta: "July 13, 9:00 AM" },
    { id: 4, vehicle: "Cascadia (TRK-101)", driver: "David Miller", route: "Miami, FL ➔ Atlanta, GA", cargo: "Fresh Produce (5.0t)", status: "Running", progress: 24, eta: "July 13, 8:15 AM" },
    { id: 5, vehicle: "DAF XF (TRK-108)", driver: "Elena Rostova", route: "Boston, MA ➔ Philadelphia, PA", cargo: "Auto Parts (3.2t)", status: "Cancelled", progress: 0, eta: "Cancelled" },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Completed
          </span>
        );
      case "Running":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/30">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            Running
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/30">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/30">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs animate-pulse">
        <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded-md mb-6" />
        <div className="space-y-4">
          <div className="h-8 bg-slate-100 dark:bg-slate-900/30 rounded-lg" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 dark:bg-slate-900/30 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Shipment Trips</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real-time status updates of fleet transits</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
          <Navigation className="h-4 w-4 rotate-45" />
        </div>
      </div>

      <div className="overflow-x-auto -mx-5">
        <div className="inline-block min-w-full align-middle px-5">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-850">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                <th className="pb-3 pr-4">Vehicle</th>
                <th className="pb-3 px-4">Driver</th>
                <th className="pb-3 px-4">Route Info</th>
                <th className="pb-3 px-4">Cargo Details</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4">Transit Progress</th>
                <th className="pb-3 pl-4">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850/50 text-sm">
              {recentTrips.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/20 transition-colors duration-150">
                  {/* Vehicle */}
                  <td className="py-3.5 pr-4 font-semibold text-slate-850 dark:text-slate-200 whitespace-nowrap">
                    {trip.vehicle}
                  </td>
                  
                  {/* Driver */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-650 dark:text-slate-350 flex items-center justify-center">
                        {trip.driver.split(" ").map(w => w[0]).join("")}
                      </div>
                      <span>{trip.driver}</span>
                    </div>
                  </td>

                  {/* Route */}
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                      <span>{trip.route}</span>
                    </div>
                  </td>

                  {/* Cargo */}
                  <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {trip.cargo}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(trip.status)}
                  </td>

                  {/* Progress Indicator */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 w-28">
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full flex-1 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500" 
                          style={{ width: `${trip.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{trip.progress}%</span>
                    </div>
                  </td>

                  {/* ETA */}
                  <td className="py-3.5 pl-4 text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {trip.eta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
