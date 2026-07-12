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
  SlidersHorizontal
} from "lucide-react";
import toast from "react-hot-toast";

export default function VehicleTable({ 
  vehicles, 
  onViewDetails, 
  onEditVehicle, 
  onDeleteVehicle, 
  onRegisterClick,
  onExportCSV,
  canManage
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  
  // Sorting state
  const [sortField, setSortField] = useState("regNumber");
  const [sortDirection, setSortDirection] = useState("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Handle Sort
  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  // Filter & Search & Sort Logic
  const processedVehicles = useMemo(() => {
    let filtered = [...vehicles];

    // Filter by type
    if (typeFilter !== "All Types") {
      filtered = filtered.filter(v => v.type === typeFilter);
    }

    // Filter by status
    if (statusFilter !== "All Statuses") {
      filtered = filtered.filter(v => 
        v.status === statusFilter ||
        (statusFilter === "On Trip" && v.status === "OnTrip") ||
        (statusFilter === "Maintenance" && v.status === "InShop")
      );
    }

    // Filter by search query
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      filtered = filtered.filter(v => 
        v.regNumber.toLowerCase().includes(q) || 
        v.name.toLowerCase().includes(q)
      );
    }

    // Sort logic
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle numerical comparisons
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      // Default string comparisons
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [vehicles, search, typeFilter, statusFilter, sortField, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(processedVehicles.length / itemsPerPage) || 1;
  const paginatedVehicles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedVehicles.slice(startIndex, startIndex + itemsPerPage);
  }, [processedVehicles, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusBadge = (status) => {
    let displayStatus = status;
    if (status === "OnTrip") displayStatus = "On Trip";
    if (status === "InShop") displayStatus = "Maintenance";

    switch (displayStatus) {
      case "Available":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-200/50 dark:border-emerald-900/30">
            Available
          </span>
        );
      case "On Trip":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-450 border border-blue-200/50 dark:border-blue-900/30">
            On Trip
          </span>
        );
      case "Maintenance":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-450 border border-amber-200/50 dark:border-amber-900/30">
            Maintenance
          </span>
        );
      case "Retired":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50">
            Retired
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50">
            {status}
          </span>
        );
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
  };

  const handleRefresh = () => {
    setSearch("");
    setTypeFilter("All Types");
    setStatusFilter("All Statuses");
    setCurrentPage(1);
    toast.success("Vehicles list refreshed", {
      style: { borderRadius: '12px', background: '#0d1527', color: '#fff' }
    });
  };

  return (
    <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 rounded-2xl shadow-xs overflow-hidden transition-all duration-200">
      
      {/* Header Controls */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Search registration or name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-3 py-1.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
              className="appearance-none pl-3 pr-8 py-1.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option>All Types</option>
              <option>Heavy Truck</option>
              <option>Light Truck</option>
              <option>Cargo Van</option>
              <option>EV Delivery Truck</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="appearance-none pl-3 pr-8 py-1.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option>All Statuses</option>
              <option>Available</option>
              <option>On Trip</option>
              <option>Maintenance</option>
              <option>Retired</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Actions Button */}
        <div className="flex items-center gap-2 justify-end">
          {canManage && (
            <button
              onClick={onRegisterClick}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/10 cursor-pointer transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Register Vehicle</span>
            </button>
          )}
          
          <button
            onClick={onExportCSV}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Export CSV"
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

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs font-semibold text-slate-450 dark:text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-900/20 border-b border-slate-100 dark:border-slate-800/80 sticky top-0 backdrop-blur-xs">
            <tr>
              <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50" onClick={() => handleSort("regNumber")}>
                <div className="flex items-center gap-1.5">
                  <span>Reg Number</span>
                  {sortField === "regNumber" && (sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50" onClick={() => handleSort("name")}>
                <div className="flex items-center gap-1.5">
                  <span>Vehicle Name</span>
                  {sortField === "name" && (sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50" onClick={() => handleSort("type")}>
                <div className="flex items-center gap-1.5">
                  <span>Vehicle Type</span>
                  {sortField === "type" && (sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-right" onClick={() => handleSort("capacity")}>
                <div className="flex items-center justify-end gap-1.5">
                  <span>Capacity</span>
                  {sortField === "capacity" && (sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-right" onClick={() => handleSort("odometer")}>
                <div className="flex items-center justify-end gap-1.5">
                  <span>Odometer</span>
                  {sortField === "odometer" && (sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-right" onClick={() => handleSort("acquisitionCost")}>
                <div className="flex items-center justify-end gap-1.5">
                  <span>Acquisition Cost</span>
                  {sortField === "acquisitionCost" && (sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                </div>
              </th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {paginatedVehicles.length > 0 ? (
              paginatedVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/20 transition-colors duration-150 group">
                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {vehicle.regNumber}
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-350 font-medium whitespace-nowrap">
                    {vehicle.name}
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-450 whitespace-nowrap">
                    {vehicle.type}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400 font-semibold whitespace-nowrap">
                    {vehicle.capacity.toLocaleString()} lbs
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400 font-semibold whitespace-nowrap">
                    {vehicle.odometer.toLocaleString()} mi
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400 font-bold whitespace-nowrap">
                    {formatCurrency(vehicle.acquisitionCost)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getStatusBadge(vehicle.status)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onViewDetails(vehicle)}
                        className="p-1 rounded-lg text-slate-450 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {canManage && (
                        <button
                          onClick={() => onDeleteVehicle(vehicle.id)}
                          className="p-1 rounded-lg text-slate-450 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-450 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Retire Vehicle"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-8 text-center text-slate-400 dark:text-slate-500">
                  No matching vehicles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {processedVehicles.length > 0 && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/10 flex items-center justify-between gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div>
            Showing <span className="text-slate-700 dark:text-slate-200">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="text-slate-700 dark:text-slate-200">
              {Math.min(currentPage * itemsPerPage, processedVehicles.length)}
            </span>{" "}
            of <span className="text-slate-700 dark:text-slate-200">{processedVehicles.length}</span> entries
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
