import { 
  CheckCircle, 
  Fuel, 
  Send, 
  UserCheck, 
  Wrench, 
  PlusCircle 
} from "lucide-react";

export default function ActivityTimeline({ isLoading = false }) {
  const activities = [
    { id: 1, type: "trip_completed", title: "Trip Completed", detail: "Trip #TRP-9482 arrived at New York, NY", time: "12 mins ago", icon: CheckCircle, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500" },
    { id: 2, type: "fuel_logged", title: "Fuel Logged", detail: "Truck #TRK-105 filled 140 Gal ($520.00)", time: "45 mins ago", icon: Fuel, color: "text-rose-600 bg-rose-50 dark:bg-rose-950/30 border-rose-500" },
    { id: 3, type: "trip_dispatched", title: "Trip Dispatched", detail: "Trip #TRP-9501 sent from Seattle to Denver", time: "1 hour ago", icon: Send, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30 border-blue-500" },
    { id: 4, type: "driver_assigned", title: "Driver Assigned", detail: "Marcus Brody assigned to Truck #TRK-109", time: "2 hours ago", icon: UserCheck, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-500" },
    { id: 5, type: "maintenance_added", title: "Maintenance Scheduled", detail: "Truck #TRK-102 booked for tire replacement", time: "3 hours ago", icon: Wrench, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-500" },
    { id: 6, type: "vehicle_registered", title: "Vehicle Registered", detail: "New Scania R500 Added to Active Fleet", time: "5 hours ago", icon: PlusCircle, color: "text-teal-650 bg-teal-50 dark:bg-teal-950/30 border-teal-500" },
    { id: 7, type: "fuel_logged", title: "Fuel Logged", detail: "Truck #TRK-111 filled 85 Gal ($310.50)", time: "6 hours ago", icon: Fuel, color: "text-rose-600 bg-rose-50 dark:bg-rose-950/30 border-rose-500" },
    { id: 8, type: "maintenance_completed", title: "Maintenance Completed", detail: "Truck #TRK-106 engine tuning finished", time: "1 day ago", icon: Wrench, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500" },
    { id: 9, type: "trip_completed", title: "Trip Completed", detail: "Trip #TRP-9430 arrived at Atlanta, GA", time: "1 day ago", icon: CheckCircle, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500" },
    { id: 10, type: "driver_assigned", title: "Driver Assigned", detail: "David Miller assigned to Truck #TRK-101", time: "2 days ago", icon: UserCheck, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-500" },
  ];

  if (isLoading) {
    return (
      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs animate-pulse">
        <div className="h-4 w-44 bg-slate-200 dark:bg-slate-800 rounded-md mb-6" />
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
                <div className="h-3 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 rounded-2xl shadow-xs">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Operations Activity</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Chronological operations feeds</p>
      </div>

      <div className="flow-root mt-6">
        <ul className="-mb-8">
          {activities.map((act, actIdx) => {
            const Icon = act.icon;
            return (
              <li key={act.id}>
                <div className="relative pb-6">
                  {/* Connecting Line */}
                  {actIdx !== activities.length - 1 ? (
                    <span 
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100 dark:bg-slate-800/80" 
                      aria-hidden="true" 
                    />
                  ) : null}

                  <div className="relative flex space-x-3 items-start">
                    {/* Icon Badge */}
                    <div>
                      <span className={`h-8 w-8 rounded-lg flex items-center justify-center ring-4 ring-white dark:ring-[#0b0f19] border ${act.color}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>

                    {/* Content Detail */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {act.title}
                        </p>
                        <span className="text-[10px] text-slate-450 dark:text-slate-500 whitespace-nowrap">
                          {act.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {act.detail}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
