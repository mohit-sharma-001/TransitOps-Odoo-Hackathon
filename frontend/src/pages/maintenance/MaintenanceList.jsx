import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import MaintenanceDashboard from "../../components/maintenance/MaintenanceDashboard";
import MaintenanceTable from "../../components/maintenance/MaintenanceTable";
import MaintenanceDetails from "../../components/maintenance/MaintenanceDetails";
import MaintenanceForm from "../../components/maintenance/MaintenanceForm";
import toast from "react-hot-toast";
import maintenanceService from "../../services/maintenanceService";

export default function MaintenanceList() {
  const [records, setRecords] = useState([]);
  const [view, setView] = useState("list");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const data = await maintenanceService.getMaintenanceLogs();
      const mapped = data.map((m) => {
        const parts = m.description.split(":");
        const serviceType = parts[0]?.trim() || "Maintenance";
        const notes = parts.slice(1).join(":").trim() || m.description;

        return {
          ...m,
          maintenanceId: `MNT-${m.id + 6000}`,
          vehicle: m.vehicle ? `${m.vehicle.name} (${m.vehicle.registrationNumber})` : "Unknown Vehicle",
          regNumber: m.vehicle ? m.vehicle.registrationNumber : "",
          serviceType: serviceType,
          mechanic: "Internal Workshop",
          scheduledDate: m.createdAt ? new Date(m.createdAt).toISOString().split('T')[0] : "",
          completionDate: m.completedAt ? new Date(m.completedAt).toISOString().split('T')[0] : null,
          cost: m.cost,
          priority: m.cost > 2000 ? "Critical" : m.cost > 1000 ? "High" : "Medium",
          status: m.completedAt ? "Completed" : "In Progress",
          notes: notes
        };
      });
      setRecords(mapped);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load maintenance records");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSaveRecord = async (savedData) => {
    try {
      await maintenanceService.createMaintenanceLog({
        vehicleId: savedData.vehicleId,
        description: savedData.description,
        cost: savedData.cost
      });
      toast.success("New maintenance record created", {
        style: { borderRadius: "12px", background: "#0d1527", color: "#fff" }
      });
      fetchRecords();
      setView("list");
      setSelectedRecord(null);
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || "Failed to log maintenance";
      toast.error(errMsg);
    }
  };

  const handleCompleteRecord = async (id) => {
    try {
      await maintenanceService.completeMaintenance(id);
      toast.success("Maintenance marked as Completed!", {
        style: { borderRadius: "12px", background: "#0d1527", color: "#fff" }
      });
      fetchRecords();
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || "Failed to complete maintenance";
      toast.error(errMsg);
    }
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setView("details");
  };

  const handleScheduleClick = () => {
    setSelectedRecord(null);
    setView("add");
  };

  const handleCancel = () => {
    setView("list");
    setSelectedRecord(null);
  };

  const handleExportCSV = () => {
    const headers = [
      "Maintenance ID", "Vehicle", "Reg Number", "Service Type", "Mechanic",
      "Scheduled Date", "Completion Date", "Cost ($)", "Priority", "Status"
    ];
    const rows = records.map((r) => [
      r.maintenanceId, r.vehicle, r.regNumber, r.serviceType, r.mechanic,
      r.scheduledDate, r.completionDate || "", r.cost, r.priority, r.status
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `transitops_maintenance_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Maintenance report exported", {
      style: { borderRadius: "12px", background: "#0d1527", color: "#fff" }
    });
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {view === "list" && (
          <div key="list">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Fleet Maintenance Center
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Service scheduling, work orders, cost tracking, and fleet health monitoring.
              </p>
            </div>

            <MaintenanceDashboard />

            <div className="mt-6">
              <MaintenanceTable
                records={records}
                isLoading={isLoading}
                onViewDetails={handleViewDetails}
                onCompleteLog={handleCompleteRecord}
                onScheduleClick={handleScheduleClick}
                onExportCSV={handleExportCSV}
              />
            </div>
          </div>
        )}

        {view === "details" && selectedRecord && (
          <div key="details">
            <MaintenanceDetails
              record={selectedRecord}
              onBack={handleCancel}
            />
          </div>
        )}

        {view === "add" && (
          <div key="form">
            <MaintenanceForm
              record={null}
              onSave={handleSaveRecord}
              onCancel={handleCancel}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}