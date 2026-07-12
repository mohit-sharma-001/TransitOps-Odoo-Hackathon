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
  SlidersHorizontal,
  Star,
  Phone,
  Mail
} from "lucide-react";
import toast from "react-hot-toast";

export default function DriverTable({
  drivers,
  onViewProfile,
  onEditDriver,
  onDeleteDriver,
  onAddDriverClick,
  onExportCSV,
  canManage
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [vehicleFilter, setVehicleFilter] = useState("All Vehicles");
  const [experienceFilter, setExperienceFilter] = useState("All Experience");

  const [sortField, setSortField] = useState("driverId");
  const [sortDirection, setSortDirection] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const uniqueVehicles = useMemo(() => {
    const set = new Set(drivers.map((d) => d.assignedVehicle).filter(Boolean));
    return ["All Vehicles", ...Array.from(set).sort()];
  }, [drivers]);

  const processedDrivers = useMemo(() => {
    let filtered = [...drivers];

    if (statusFilter !== "All Statuses") {
      filtered = filtered.filter((d) => 
        d.status === statusFilter ||
        (statusFilter === "Driving" && d.status === "OnTrip") ||
        (statusFilter === "On Leave" && d.status === "OffDuty") ||
        (statusFilter === "Offline" && d.status === "Suspended")
      );
    }
    if (vehicleFilter !== "All Vehicles") {
      filtered = filtered.filter((d) => d.assignedVehicle === vehicleFilter);
    }
    if (experienceFilter !== "All Experience") {
      const [min, max] = experienceFilter.split("-").map(Number);
      filtered = filtered.filter((d) => d.experience >= min && (max ? d.experience <= max : true));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.driverId.toLowerCase().includes(q) ||
          d.phone.includes(q) ||
          d.email.toLowerCase().includes(q) ||
          d.licenseNumber.toLowerCase().includes(q)
      );
    }

    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [drivers, search, statusFilter, vehicleFilter, experienceFilter, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(processedDrivers.length / itemsPerPage));
  const paginatedDrivers = processedDrivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    let displayStatus = status;
    if (status === "OnTrip") displayStatus = "Driving";
    if (status === "OffDuty") displayStatus = "On Leave";
    if (status === "Suspended") displayStatus = "Offline";

    switch (displayStatus) {
      case "Available":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/25 dark:text-emerald-400 dark:border-emerald-800/30";
      case "Driving":
        return "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/25 dark:text-blue-400 dark:border-blue-800/30";
      case "On Leave":
        return "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/25 dark:text-amber-400 dark:border-amber-800/30";
      case "Offline":
        return "bg-slate-100 text-slate-650 border-slate-200/60 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700/30";
      default:
        return "bg-slate-105 text-slate-650 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const getStatusDot = (status) => {
    let displayStatus = status;
    if (status === "OnTrip") displayStatus = "Driving";
    if (status === "OffDuty") displayStatus = "On Leave";
    if (status === "Suspended") displayStatus = "Offline";

    switch (displayStatus) {
      case "Available": return "bg-emerald-500";
      case "Driving": return "bg-blue-500 animate-pulse";
      case "On Leave": return "bg-amber-500";
      case "Offline": return "bg-slate-400 dark:bg-slate-600";
      default: return "bg-slate-400";
    }
  };

  const SortHeader = ({ field, children, className = "" }) => (
    <th
      onClick={() => handleSort(field)}
      className={`px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-pointer select-none hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${className}`}
    >
      <div className="flex items-center gap-1">
        {children}
        <span className="flex flex-col -space-y-1 ml-0.5">
          <ChevronUp className={`h-2.5 w-2.5 ${sortField === field && sortDirection === "asc" ? "text-blue-600 dark:text-blue-400" : "text-slate-300 dark:text-slate-700"}`} />
          <ChevronDown className={`h-2.5 w-2.5 ${sortField === field && sortDirection === "desc" ? "text-blue-600 dark:text-blue-400" : "text-slate-300 dark:text-slate-700"}`} />
        </span>
      </div>
    </th>
  );

  const selectClass =
    "px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer appearance-none";

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-4 rounded-2xl shadow-xs">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, ID, phone, email, license..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <SlidersHorizontal className="h-4 w-4 text-slate-400 hidden md:block" />

            <select value={statusFilter} onChange={handleFilterChange(setStatusFilter)} className={selectClass}>
              <option>All Statuses</option>
              <option>Available</option>
              <option>Driving</option>
              <option>On Leave</option>
              <option>Offline</option>
            </select>

            <select value={vehicleFilter} onChange={handleFilterChange(setVehicleFilter)} className={selectClass}>
              {uniqueVehicles.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>

            <select value={experienceFilter} onChange={handleFilterChange(setExperienceFilter)} className={selectClass}>
              <option value="All Experience">All Experience</option>
              <option value="0-3">0–3 years</option>
              <option value="4-7">4–7 years</option>
              <option value="8-12">8–12 years</option>
              <option value="13-99">13+ years</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={() => toast.success("Driver roster refreshed", { style: { borderRadius: "12px", background: "#0d1527", color: "#fff" } })}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
            {canManage && (
              <button
                onClick={onAddDriverClick}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/10 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Driver</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800/60 sticky top-0 z-10">
              <tr>
                <SortHeader field="driverId">ID</SortHeader>
                <SortHeader field="name">Driver</SortHeader>
                <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Contact</th>
                <SortHeader field="licenseNumber">License</SortHeader>
                <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Vehicle</th>
                <SortHeader field="experience">Exp.</SortHeader>
                <SortHeader field="rating">Rating</SortHeader>
                <SortHeader field="status">Status</SortHeader>
                <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {paginatedDrivers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No drivers found</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedDrivers.map((driver) => (
                  <tr
                    key={driver.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    {/* ID */}
                    <td className="px-3 py-3">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">{driver.driverId}</span>
                    </td>

                    {/* Driver (Avatar + Name) */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="relative flex-shrink-0">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                            {driver.name.split(" ").map((w) => w[0]).join("")}
                          </div>
                          <span className={`absolute -bottom-0.5 -right-0.5 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${getStatusDot(driver.status)}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{driver.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{driver.driverId}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-3 py-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span className="truncate">{driver.phone}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                          <Mail className="h-3 w-3 text-slate-300 dark:text-slate-600" />
                          <span className="truncate max-w-[140px]">{driver.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* License */}
                    <td className="px-3 py-3">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">{driver.licenseNumber}</p>
                      <p className={`text-[10px] flex items-center gap-1 font-semibold ${driver.licenseValid === false ? "text-rose-500" : "text-slate-400 dark:text-slate-500"}`}>
                        {driver.licenseValid === false && <span className="h-1 w-1 rounded-full bg-rose-500" />}
                        Exp: {new Date(driver.licenseExpiry).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </p>
                    </td>

                    {/* Vehicle */}
                    <td className="px-3 py-3">
                      <span className="text-xs text-slate-600 dark:text-slate-400">{driver.assignedVehicle || "—"}</span>
                    </td>

                    {/* Experience */}
                    <td className="px-3 py-3">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{driver.experience ?? 5} yrs</span>
                    </td>

                    {/* Rating */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{(driver.rating ?? 4.5).toFixed(1)}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getStatusBadge(driver.status)}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${getStatusDot(driver.status)}`} />
                        {driver.status}
                      </span>
                    </td>

                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onViewProfile(driver)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                          title="View Profile"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        {canManage && (
                          <button
                            onClick={() => onDeleteDriver(driver.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-600 dark:hover:text-rose-450 transition-colors cursor-pointer"
                            title="Suspend Driver"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800/60 gap-3">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Showing <span className="font-bold text-slate-700 dark:text-slate-300">{Math.min((currentPage - 1) * itemsPerPage + 1, processedDrivers.length)}</span> to{" "}
            <span className="font-bold text-slate-700 dark:text-slate-300">{Math.min(currentPage * itemsPerPage, processedDrivers.length)}</span> of{" "}
            <span className="font-bold text-slate-700 dark:text-slate-300">{processedDrivers.length}</span> drivers
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-7 w-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  currentPage === page
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
