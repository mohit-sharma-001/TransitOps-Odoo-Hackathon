import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import MaintenanceDashboard from "../../components/maintenance/MaintenanceDashboard";
import MaintenanceTable from "../../components/maintenance/MaintenanceTable";
import MaintenanceDetails from "../../components/maintenance/MaintenanceDetails";
import MaintenanceForm from "../../components/maintenance/MaintenanceForm";
import toast from "react-hot-toast";

const initialRecords = [
  {
    id: 1,
    maintenanceId: "MNT-6001",
    vehicle: "Volvo FH16 (TRK-102)",
    regNumber: "TRK-102",
    serviceType: "Oil Change",
    mechanic: "Tony Morales",
    scheduledDate: "2026-07-10",
    completionDate: "2026-07-10",
    cost: 485,
    priority: "Medium",
    status: "Completed",
    notes: "Synthetic oil replaced. Filter changed. Next service at 15,000 miles."
  },
  {
    id: 2,
    maintenanceId: "MNT-6002",
    vehicle: "Scania R500 (TRK-105)",
    regNumber: "TRK-105",
    serviceType: "Brake Service",
    mechanic: "Frank Peterson",
    scheduledDate: "2026-07-12",
    completionDate: null,
    cost: 1250,
    priority: "High",
    status: "In Progress",
    notes: "Front and rear brake pad replacement. Rotor resurfacing required."
  },
  {
    id: 3,
    maintenanceId: "MNT-6003",
    vehicle: "Cascadia (TRK-101)",
    regNumber: "TRK-101",
    serviceType: "Engine Repair",
    mechanic: "Linda Cho",
    scheduledDate: "2026-07-08",
    completionDate: null,
    cost: 3200,
    priority: "Critical",
    status: "Overdue",
    notes: "Turbocharger failure. Awaiting replacement part from supplier."
  },
  {
    id: 4,
    maintenanceId: "MNT-6004",
    vehicle: "DAF XF (TRK-108)",
    regNumber: "TRK-108",
    serviceType: "Tire Rotation",
    mechanic: "Tony Morales",
    scheduledDate: "2026-07-14",
    completionDate: null,
    cost: 320,
    priority: "Low",
    status: "Scheduled",
    notes: "Standard tire rotation and pressure calibration."
  },
  {
    id: 5,
    maintenanceId: "MNT-6005",
    vehicle: "Tesla Semi (EV-401)",
    regNumber: "EV-401",
    serviceType: "General Inspection",
    mechanic: "Robert Harris",
    scheduledDate: "2026-07-15",
    completionDate: null,
    cost: 180,
    priority: "Medium",
    status: "Scheduled",
    notes: "Quarterly safety inspection. Battery health diagnostics."
  },
  {
    id: 6,
    maintenanceId: "MNT-6006",
    vehicle: "Hino 268 (TRK-302)",
    regNumber: "TRK-302",
    serviceType: "Transmission Service",
    mechanic: "Diana Vasquez",
    scheduledDate: "2026-07-11",
    completionDate: "2026-07-12",
    cost: 2100,
    priority: "High",
    status: "Completed",
    notes: "Transmission fluid flush and filter replacement. Test drive passed."
  },
  {
    id: 7,
    maintenanceId: "MNT-6007",
    vehicle: "Ford Transit (VAN-201)",
    regNumber: "VAN-201",
    serviceType: "Electrical Diagnostics",
    mechanic: "Frank Peterson",
    scheduledDate: "2026-07-13",
    completionDate: null,
    cost: 450,
    priority: "Medium",
    status: "In Progress",
    notes: "Intermittent dashboard warning lights. Checking wiring harness."
  },
  {
    id: 8,
    maintenanceId: "MNT-6008",
    vehicle: "Actros L (TRK-109)",
    regNumber: "TRK-109",
    serviceType: "Coolant Flush",
    mechanic: "Linda Cho",
    scheduledDate: "2026-07-06",
    completionDate: null,
    cost: 280,
    priority: "Low",
    status: "Cancelled",
    notes: "Vehicle reassigned to active duty. Rescheduled for next month."
  },
  {
    id: 9,
    maintenanceId: "MNT-6009",
    vehicle: "Volvo FH16 (TRK-102)",
    regNumber: "TRK-102",
    serviceType: "Air Filter Replacement",
    mechanic: "Tony Morales",
    scheduledDate: "2026-07-16",
    completionDate: null,
    cost: 95,
    priority: "Low",
    status: "Scheduled",
    notes: "Preventive maintenance per schedule."
  },
  {
    id: 10,
    maintenanceId: "MNT-6010",
    vehicle: "Cascadia (TRK-101)",
    regNumber: "TRK-101",
    serviceType: "Suspension Repair",
    mechanic: "Robert Harris",
    scheduledDate: "2026-07-09",
    completionDate: "2026-07-11",
    cost: 1800,
    priority: "High",
    status: "Completed",
    notes: "Leaf spring replacement on rear axle. Alignment performed."
  }
];

export default function MaintenanceList() {
  const [records, setRecords] = useState(initialRecords);
  const [view, setView] = useState("list");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleSaveRecord = (savedData) => {
    if (selectedRecord) {
      setRecords((prev) =>
        prev.map((r) => (r.id === selectedRecord.id ? { ...r, ...savedData } : r))
      );
      toast.success("Service record updated", {
        style: { borderRadius: "12px", background: "#0d1527", color: "#fff" }
      });
    } else {
      setRecords((prev) => [savedData, ...prev]);
      toast.success("New maintenance scheduled", {
        style: { borderRadius: "12px", background: "#0d1527", color: "#fff" }
      });
    }
    setView("list");
    setSelectedRecord(null);
  };

  const handleDeleteRecord = (id) => {
    if (window.confirm("Delete this maintenance record? This action cannot be undone.")) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      toast.success("Service record removed", {
        style: { borderRadius: "12px", background: "#0d1527", color: "#fff" }
      });
    }
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setView("details");
  };

  const handleEditRecord = (record) => {
    setSelectedRecord(record);
    setView("edit");
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
                onViewDetails={handleViewDetails}
                onEditRecord={handleEditRecord}
                onDeleteRecord={handleDeleteRecord}
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

        {(view === "add" || view === "edit") && (
          <div key="form">
            <MaintenanceForm
              record={selectedRecord}
              onSave={handleSaveRecord}
              onCancel={handleCancel}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}