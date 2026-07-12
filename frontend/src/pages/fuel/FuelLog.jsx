import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import FuelDashboard from "../../components/fuel/FuelDashboard";
import FuelTable from "../../components/fuel/FuelTable";
import FuelForm from "../../components/fuel/FuelForm";
import toast from "react-hot-toast";
import fuelService from "../../services/fuelService";

export default function FuelLog() {
  const [entries, setEntries] = useState([]);
  const [view, setView] = useState("list");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const data = await fuelService.getFuelLogs();
      const mapped = data.map((f) => ({
        ...f,
        logId: `FUEL-${f.id + 7000}`,
        vehicle: f.vehicle ? `${f.vehicle.name} (${f.vehicle.registrationNumber})` : "Unknown Vehicle",
        driver: "Fleet Operator",
        station: "Internal Fuel Depot",
        fuelType: f.vehicle?.type?.includes("EV") ? "Electric" : "Diesel",
        quantity: f.liters,
        cost: f.cost,
        mileage: f.vehicle ? f.vehicle.odometer : 12000,
        date: f.createdAt ? new Date(f.createdAt).toISOString().split('T')[0] : ""
      }));
      setEntries(mapped);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load fuel records");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSaveEntry = async (savedData) => {
    try {
      await fuelService.createFuelLog({
        vehicleId: savedData.vehicleId,
        liters: savedData.liters,
        cost: savedData.cost
      });
      toast.success("Fuel entry logged", { style: { borderRadius: "12px", background: "#0d1527", color: "#fff" } });
      fetchEntries();
      setView("list");
      setSelectedEntry(null);
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || "Failed to log fuel entry";
      toast.error(errMsg);
    }
  };

  const handleAddEntryClick = () => { setSelectedEntry(null); setView("add"); };
  const handleCancel = () => { setView("list"); setSelectedEntry(null); };

  const handleExportCSV = () => {
    const headers = ["Log ID", "Vehicle", "Driver", "Station", "Fuel Type", "Qty (liters)", "Cost ($)", "Mileage", "Date"];
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
                isLoading={isLoading}
                onAddEntryClick={handleAddEntryClick}
                onExportCSV={handleExportCSV}
              />
            </div>
          </div>
        )}

        {view === "add" && (
          <div key="form">
            <FuelForm
              entry={null}
              onSave={handleSaveEntry}
              onCancel={handleCancel}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}