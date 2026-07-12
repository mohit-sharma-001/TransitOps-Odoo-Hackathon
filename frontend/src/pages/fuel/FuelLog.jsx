import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import FuelDashboard from "../../components/fuel/FuelDashboard";
import FuelTable from "../../components/fuel/FuelTable";
import FuelForm from "../../components/fuel/FuelForm";
import toast from "react-hot-toast";

const initialEntries = [
  { id: 1, logId: "FUEL-7001", vehicle: "Volvo FH16 (TRK-102)", driver: "Alex Rivera", station: "Pilot Flying J — Dallas, TX", fuelType: "Diesel", quantity: 92, cost: 335.80, mileage: 82450, date: "2026-07-12", notes: "Pump #4. Receipt #TX-89231." },
  { id: 2, logId: "FUEL-7002", vehicle: "Scania R500 (TRK-105)", driver: "Sarah Jenkins", station: "Love's Travel Stop — Houston, TX", fuelType: "Diesel", quantity: 105, cost: 383.25, mileage: 64200, date: "2026-07-11", notes: "DEF fluid also added — 5 gal." },
  { id: 3, logId: "FUEL-7003", vehicle: "Ford Transit (VAN-201)", driver: "Priya Sharma", station: "Shell Fleet — Los Angeles, CA", fuelType: "Gasoline", quantity: 18, cost: 65.70, mileage: 31800, date: "2026-07-11", notes: "Regular unleaded. Fleet card." },
  { id: 4, logId: "FUEL-7004", vehicle: "Cascadia (TRK-101)", driver: "David Miller", station: "BP TruckStop — Miami, FL", fuelType: "Diesel", quantity: 110, cost: 401.50, mileage: 78600, date: "2026-07-10", notes: "Full tank. Fuel cap replaced." },
  { id: 5, logId: "FUEL-7005", vehicle: "DAF XF (TRK-108)", driver: "Elena Rostova", station: "TA Petro — Chicago, IL", fuelType: "Diesel", quantity: 88, cost: 321.20, mileage: 55100, date: "2026-07-10", notes: "Pump #7. Winter blend additive." },
  { id: 6, logId: "FUEL-7006", vehicle: "Tesla Semi (EV-401)", driver: "James Chen", station: "Supercharger Station — SF, CA", fuelType: "Electric", quantity: 0, cost: 48.00, mileage: 42600, date: "2026-07-09", notes: "250 kWh charged. Supercharger V3." },
  { id: 7, logId: "FUEL-7007", vehicle: "Actros L (TRK-109)", driver: "Marcus Brody", station: "Pilot Flying J — Dallas, TX", fuelType: "Diesel", quantity: 120, cost: 438.00, mileage: 102300, date: "2026-07-08", notes: "Heavy load run. Max capacity fill." },
  { id: 8, logId: "FUEL-7008", vehicle: "Hino 268 (TRK-302)", driver: "Carlos Mendez", station: "Circle K — Phoenix, AZ", fuelType: "Diesel", quantity: 65, cost: 237.25, mileage: 48900, date: "2026-07-07", notes: "CNG adapter unavailable, used diesel." },
  { id: 9, logId: "FUEL-7009", vehicle: "Volvo FH16 (TRK-102)", driver: "Alex Rivera", station: "Sheetz — Philadelphia, PA", fuelType: "Diesel", quantity: 98, cost: 357.70, mileage: 81660, date: "2026-07-05", notes: "Return leg fill-up." },
  { id: 10, logId: "FUEL-7010", vehicle: "Scania R500 (TRK-105)", driver: "Sarah Jenkins", station: "Love's Travel Stop — Houston, TX", fuelType: "CNG", quantity: 42, cost: 88.20, mileage: 63500, date: "2026-07-04", notes: "CNG fill. Testing alternative fuel program." },
  { id: 11, logId: "FUEL-7011", vehicle: "Ford Transit (VAN-201)", driver: "Priya Sharma", station: "Shell Fleet — Los Angeles, CA", fuelType: "Gasoline", quantity: 16, cost: 58.40, mileage: 31450, date: "2026-07-03", notes: "Premium unleaded per mechanic recommendation." },
  { id: 12, logId: "FUEL-7012", vehicle: "Cascadia (TRK-101)", driver: "David Miller", station: "TA Petro — Chicago, IL", fuelType: "Diesel", quantity: 115, cost: 419.75, mileage: 77800, date: "2026-07-02", notes: "Long haul pre-trip fill." }
];

export default function FuelLog() {
  const [entries, setEntries] = useState(initialEntries);
  const [view, setView] = useState("list");
  const [selectedEntry, setSelectedEntry] = useState(null);

  const handleSaveEntry = (data) => {
    if (selectedEntry) {
      setEntries((prev) => prev.map((e) => (e.id === selectedEntry.id ? { ...e, ...data } : e)));
      toast.success("Fuel entry updated", { style: { borderRadius: "12px", background: "#0d1527", color: "#fff" } });
    } else {
      setEntries((prev) => [data, ...prev]);
      toast.success("Fuel entry logged", { style: { borderRadius: "12px", background: "#0d1527", color: "#fff" } });
    }
    setView("list");
    setSelectedEntry(null);
  };

  const handleDeleteEntry = (id) => {
    if (window.confirm("Delete this fuel log entry?")) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      toast.success("Fuel entry removed", { style: { borderRadius: "12px", background: "#0d1527", color: "#fff" } });
    }
  };

  const handleEditEntry = (entry) => { setSelectedEntry(entry); setView("edit"); };
  const handleAddEntryClick = () => { setSelectedEntry(null); setView("add"); };
  const handleCancel = () => { setView("list"); setSelectedEntry(null); };

  const handleExportCSV = () => {
    const headers = ["Log ID", "Vehicle", "Driver", "Station", "Fuel Type", "Qty (gal)", "Cost ($)", "Mileage", "Date"];
    const rows = entries.map((e) => [e.logId, e.vehicle, e.driver, e.station, e.fuelType, e.quantity, e.cost, e.mileage, e.date]);
    const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", `transitops_fuel_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Fuel report exported", { style: { borderRadius: "12px", background: "#0d1527", color: "#fff" } });
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {view === "list" && (
          <div key="list">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Fuel Management
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Fleet fuel consumption analytics, cost tracking, and fill-up logs.
              </p>
            </div>

            <FuelDashboard />

            <div className="mt-6">
              <FuelTable
                entries={entries}
                onEditEntry={handleEditEntry}
                onDeleteEntry={handleDeleteEntry}
                onAddEntryClick={handleAddEntryClick}
                onExportCSV={handleExportCSV}
              />
            </div>
          </div>
        )}

        {(view === "add" || view === "edit") && (
          <div key="form">
            <FuelForm
              entry={selectedEntry}
              onSave={handleSaveEntry}
              onCancel={handleCancel}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}