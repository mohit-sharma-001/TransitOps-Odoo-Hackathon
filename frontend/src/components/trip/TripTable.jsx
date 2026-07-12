import { useState, useMemo } from "react";
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Download, 
  RefreshCw, 
  Eye, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";

export default function TripTable({ 
  trips, 
  onViewDetails, 
  onEditTrip, 
  onDeleteTrip, 
  onCreateTripClick,
  onExportCSV 
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [driverFilter, setDriverFilter] = useState("All Drivers");
  const [vehicleFilter, setVehicleFilter] = useState("All Vehicles");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Sorting state
  const [sortField, setSortField] = useState("tripId");
  const [sortDirection, setSortDirection] = useState("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Extract unique drivers & vehicles for filter selectors
  const uniqueDrivers = useMemo(() => {
    const drivers = trips.map(t => t.driver);
    return ["All Drivers", ...new Set(drivers)];
  }, [trips]);

  const uniqueVehicles = useMemo(() => {
    const vehicles = trips.map(t => t.vehicle);
    return ["All Vehicles", ...new Set(vehicles)];
  }, [trips]);

  // Handle Sort
  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  // Filter & Search & Sort Logic
  const processedTrips = useMemo(() => {
    let filtered = [...trips];

    // Status filter
    if (statusFilter !== "All Statuses") {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    // Driver filter
    if (driverFilter !== "All Drivers") {
      filtered = filtered.filter(t => t.driver === driverFilter);
    }

    // Vehicle filter
    if (vehicleFilter !== "All Vehicles") {
      filtered = filtered.filter(t => t.vehicle === vehicleFilter);
    }

    // Date Range filters
    if (startDate) {
      filtered = filtered.filter(t => new Date(t.startTime) >= new Date(startDate));
    }
    if (endDate) {
      // Add one day to end date to make it inclusive
      const endLimit = new Date(endDate);
      endLimit.setDate(endLimit.getDate() + 1);
      filtered = filtered.filter(t => new Date(t.startTime) <= endLimit);
    }

    // Search query
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      filtered = filtered.filter(t => 
        t.tripId.toLowerCase().includes(q) || 
        t.source.toLowerCase().includes(q) || 
        t.destination.toLowerCase().includes(q) || 
        t.driver.toLowerCase().includes(q) ||
        t.vehicle.toLowerCase().includes(q)
      );
    }

    // Sort logic
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [trips, search, statusFilter, driverFilter, vehicleFilter, startDate, endDate, sortField, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(processedTrips.length / itemsPerPage) || 1;
  const paginatedTrips = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedTrips.slice(startIndex, startIndex + itemsPerPage);
  }, [processedTrips, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Scheduled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/30">
            Scheduled
          </span>
        );
      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/30">
            <span className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
            In Progress
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30">
            Completed
          </span>
        );
      case "Delayed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30">
            Delayed
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-450 border border-rose-200/50 dark:border-rose-800/30">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Low":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50">
            Low
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-55 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/25">
            Medium
          </span>
        );
      case "High":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/25">
            High
          </span>
        );
      case "Critical":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/35">
            Critical
          </span>
        );
      default:
        return null;
    }
  };

  const handleRefresh = () => {
    setSearch("");
    setStatusFilter("All Statuses");
    setDriverFilter("All Drivers");
    setVehicleFilter("All Vehicles");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
    toast.success("Trips list refreshed", {
      style: { borderRadius: '12px', background: '#0d1527', color: '#fff' }
    });
  };

  return (
    <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 rounded-2xl shadow-xs overflow-hidden transition-all duration-200">
      
      {/* Filtering Actions Toolbar */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col gap-4">
        
        {/* Row 1: Search & Date Range & Primary Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Search trip ID, route..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-3 py-1.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Date Range Start */}
            <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1.5 w-full sm:w-auto">
              <Calendar className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-xs text-slate-700 dark:text-slate-350 focus:outline-none cursor-pointer"
                title="Start Date"
              />
            </div>
            
            {/* Date Range End */}
            <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1.5 w-full sm:w-auto">
              <Calendar className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-xs text-slate-700 dark:text-slate-350 focus:outline-none cursor-pointer"
                title="End Date"
              />
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={onCreateTripClick}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/10 cursor-pointer transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create Trip</span>
            </button>
            
            <button
              onClick={onExportCSV}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Export Trips"
            >
              <Download className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleRefresh}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Refresh List"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Row 2: Select Filters */}
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 dark:border-slate-800/50 pt-3">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="appearance-none pl-3 pr-8 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-650 dark:text-slate-350 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer font-semibold"
            >
              <option>All Statuses</option>
              <option>Scheduled</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Delayed</option>
              <option>Cancelled</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          </div>

          {/* Driver Filter */}
          <div className="relative">
            <select
              value={driverFilter}
              onChange={(e) => { setDriverFilter(e.target.value); setCurrentPage(1); }}
              className="appearance-none pl-3 pr-8 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-650 dark:text-slate-350 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer font-semibold"
            >
              {uniqueDrivers.map((driver) => (
                <option key={driver} value={driver}>{driver}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          </div>

          {/* Vehicle Filter */}
          <div className="relative">
            <select
              value={vehicleFilter}
              onChange={(e) => { setVehicleFilter(e.target.value); setCurrentPage(1); }}
              className="appearance-none pl-3 pr-8 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-650 dark:text-slate-350 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer font-semibold"
            >
              {uniqueVehicles.map((vehicle) => (
                <option key={vehicle} value={vehicle}>{vehicle}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Responsive Table Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs font-semibold text-slate-450 dark:text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-900/20 border-b border-slate-100 dark:border-slate-800/80 sticky top-0 backdrop-blur-xs">
            <tr>
              <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50" onClick={() => handleSort("tripId")}>
                <div className="flex items-center gap-1.5">
                  <span>Trip ID</span>
                  {sortField === "tripId" && (sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50" onClick={() => handleSort("driver")}>
                <div className="flex items-center gap-1.5">
                  <span>Driver</span>
                  {sortField === "driver" && (sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50" onClick={() => handleSort("vehicle")}>
                <div className="flex items-center gap-1.5">
                  <span>Vehicle</span>
                  {sortField === "vehicle" && (sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                </div>
              </th>
              <th className="py-3.5 px-4">Route Info</th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50" onClick={() => handleSort("distance")}>
                <div className="flex items-center justify-end gap-1.5">
                  <span>Distance</span>
                  {sortField === "distance" && (sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                </div>
              </th>
              <th className="py-3.5 px-4">Start Time</th>
              <th className="py-3.5 px-4">ETA</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {paginatedTrips.length > 0 ? (
              paginatedTrips.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-55/40 dark:hover:bg-slate-900/20 transition-colors duration-150 group text-xs sm:text-sm">
                  {/* ID */}
                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {trip.tripId}
                  </td>
                  
                  {/* Driver */}
                  <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-350 whitespace-nowrap">
                    {trip.driver}
                  </td>
                  
                  {/* Vehicle */}
                  <td className="py-3.5 px-4 text-slate-650 dark:text-slate-400 whitespace-nowrap">
                    {trip.vehicle}
                  </td>
                  
                  {/* Route */}
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    <div className="font-semibold text-slate-700 dark:text-slate-300">
                      {trip.source} ➔ {trip.destination}
                    </div>
                  </td>
                  
                  {/* Distance */}
                  <td className="py-3.5 px-4 text-right font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {trip.distance.toLocaleString()} mi
                  </td>

                  {/* Start Time */}
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-450 whitespace-nowrap">
                    {new Date(trip.startTime).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </td>

                  {/* ETA */}
                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {trip.eta}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(trip.status)}
                  </td>

                  {/* Priority Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getPriorityBadge(trip.priority)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onViewDetails(trip)}
                        className="p-1 rounded-lg text-slate-450 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Trip Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditTrip(trip)}
                        className="p-1 rounded-lg text-slate-450 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Edit Trip"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTrip(trip.id)}
                        className="p-1 rounded-lg text-slate-450 dark:text-slate-500 hover:text-rose-650 dark:hover:text-rose-450 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Delete Trip"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="py-8 text-center text-slate-400 dark:text-slate-500">
                  No matching trips found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {processedTrips.length > 0 && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/10 flex items-center justify-between gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div>
            Showing <span className="text-slate-700 dark:text-slate-200">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="text-slate-700 dark:text-slate-200">
              {Math.min(currentPage * itemsPerPage, processedTrips.length)}
            </span>{" "}
            of <span className="text-slate-700 dark:text-slate-200">{processedTrips.length}</span> entries
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-lg border border-slate-250 dark:border-slate-750 transition-colors ${
                currentPage === 1
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded-lg border border-slate-250 dark:border-slate-750 transition-colors ${
                currentPage === totalPages
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer"
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
