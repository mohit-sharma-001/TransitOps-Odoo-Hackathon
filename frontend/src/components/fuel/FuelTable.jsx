import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Plus,
  Download,
  RefreshCw,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Calendar,
  Fuel
} from "lucide-react";
import toast from "react-hot-toast";

export default function FuelTable({
  entries,
  onEditEntry,
  onDeleteEntry,
  onAddEntryClick,
  onExportCSV
}) {
  const [search, setSearch] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("All Vehicles");
  const [driverFilter, setDriverFilter] = useState("All Drivers");
  const [fuelTypeFilter, setFuelTypeFilter] = useState("All Types");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const uniqueVehicles = useMemo(() => {
    const s = new Set(entries.map((e) => e.vehicle));
    return ["All Vehicles", ...Array.from(s).sort()];
  }, [entries]);

  const uniqueDrivers = useMemo(() => {
    const s = new Set(entries.map((e) => e.driver));
    return ["All Drivers", ...Array.from(s).sort()];
  }, [entries]);

  const processed = useMemo(() => {
    let filtered = [...entries];

    if (vehicleFilter !== "All Vehicles") filtered = filtered.filter((e) => e.vehicle === vehicleFilter);
    if (driverFilter !== "All Drivers") filtered = filtered.filter((e) => e.driver === driverFilter);
    if (fuelTypeFilter !== "All Types") filtered = filtered.filter((e) => e.fuelType === fuelTypeFilter);
    if (dateFrom) filtered = filtered.filter((e) => e.date >= dateFrom);
    if (dateTo) filtered = filtered.filter((e) => e.date <= dateTo);

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.logId.toLowerCase().includes(q) ||
          e.vehicle.toLowerCase().includes(q) ||
          e.driver.toLowerCase().includes(q) ||
          e.station.toLowerCase().includes(q)
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
  }, [entries, search, vehicleFilter, driverFilter, fuelTypeFilter, dateFrom, dateTo, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(processed.length / itemsPerPage));
  const paginated = processed.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetPage = (setter) => (e) => { setter(e.target.value); setCurrentPage(1); };

  const getFuelBadge = (type) => {
    switch (type) {
      case "Diesel": return "bg-blue-50 text-blue-700 dark:bg-blue-950/25 dark:text-blue-400";
      case "Gasoline": return "bg-amber-50 text-amber-700 dark:bg-amber-950/25 dark:text-amber-400";
      case "CNG": return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-400";
      case "Electric": return "bg-violet-50 text-violet-700 dark:bg-violet-950/25 dark:text-violet-400";
      default: return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
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

  const selClass = "px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer appearance-none";

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-4 rounded-2xl shadow-xs">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by log ID, vehicle, driver, station..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <SlidersHorizontal className="h-4 w-4 text-slate-400 hidden md:block" />
            <select value={vehicleFilter} onChange={resetPage(setVehicleFilter)} className={selClass}>{uniqueVehicles.map((v) => <option key={v}>{v}</option>)}</select>
            <select value={driverFilter} onChange={resetPage(setDriverFilter)} className={selClass}>{uniqueDrivers.map((d) => <option key={d}>{d}</option>)}</select>
            <select value={fuelTypeFilter} onChange={resetPage(setFuelTypeFilter)} className={selClass}>
              <option>All Types</option>
              <option>Diesel</option>
              <option>Gasoline</option>
              <option>CNG</option>
              <option>Electric</option>
            </select>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }} className={`${selClass} w-[120px]`} />
              <span className="text-[10px] text-slate-400">to</span>
              <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }} className={`${selClass} w-[120px]`} />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={onExportCSV} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              <Download className="h-3.5 w-3.5" /><span className="hidden sm:inline">Export</span>
            </button>
            <button onClick={() => toast.success("Fuel log refreshed", { style: { borderRadius: "12px", background: "#0d1527", color: "#fff" } })} className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
            <button onClick={onAddEntryClick} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/10 transition-colors cursor-pointer">
              <Plus className="h-3.5 w-3.5" /><span>Add Entry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead className="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800/60 sticky top-0 z-10">
              <tr>
                <SortHeader field="logId">Log ID</SortHeader>
                <SortHeader field="vehicle">Vehicle</SortHeader>
                <SortHeader field="driver">Driver</SortHeader>
                <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Station</th>
                <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Fuel Type</th>
                <SortHeader field="quantity">Qty (gal)</SortHeader>
                <SortHeader field="cost">Cost</SortHeader>
                <SortHeader field="mileage">Mileage</SortHeader>
                <SortHeader field="date">Date</SortHeader>
                <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Fuel className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No fuel entries found</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Adjust filters or add a new fuel log entry</p>
                    </div>
                  </td>
                </tr>
              ) : paginated.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-3 py-3"><span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">{entry.logId}</span></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center flex-shrink-0"><Fuel className="h-3 w-3" /></div>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{entry.vehicle}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3"><span className="text-xs text-slate-600 dark:text-slate-400">{entry.driver}</span></td>
                  <td className="px-3 py-3"><span className="text-xs text-slate-500 dark:text-slate-400">{entry.station}</span></td>
                  <td className="px-3 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${getFuelBadge(entry.fuelType)}`}>{entry.fuelType}</span></td>
                  <td className="px-3 py-3"><span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{entry.quantity}</span></td>
                  <td className="px-3 py-3"><span className="text-xs font-bold text-slate-800 dark:text-slate-200">${entry.cost.toLocaleString()}</span></td>
                  <td className="px-3 py-3"><span className="text-xs text-slate-600 dark:text-slate-400">{entry.mileage.toLocaleString()} mi</span></td>
                  <td className="px-3 py-3"><span className="text-xs text-slate-500 dark:text-slate-400">{entry.date}</span></td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEditEntry(entry)} className="p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/30 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer" title="Edit"><Edit2 className="h-3.5 w-3.5" /></button>
                      <button onClick={() => onDeleteEntry(entry.id)} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800/60 gap-3">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Showing <span className="font-bold text-slate-700 dark:text-slate-300">{Math.min((currentPage - 1) * itemsPerPage + 1, processed.length)}</span> to{" "}
            <span className="font-bold text-slate-700 dark:text-slate-300">{Math.min(currentPage * itemsPerPage, processed.length)}</span> of{" "}
            <span className="font-bold text-slate-700 dark:text-slate-300">{processed.length}</span> entries
          </p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"><ChevronLeft className="h-3.5 w-3.5" /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`h-7 w-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${currentPage === page ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>{page}</button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"><ChevronRight className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
