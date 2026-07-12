import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import VehicleTable from "../../components/vehicle/VehicleTable";
import VehicleDetails from "../../components/vehicle/VehicleDetails";
import VehicleForm from "../../components/vehicle/VehicleForm";
import toast from "react-hot-toast";

const initialVehicles = [
  { id: 1, regNumber: "TRK-102", name: "Volvo FH16 Globetrotter", type: "Heavy Truck", capacity: 40000, odometer: 145200, acquisitionCost: 142000, status: "On Trip" },
  { id: 2, regNumber: "TRK-105", name: "Scania R500 V8", type: "Heavy Truck", capacity: 38000, odometer: 98450, acquisitionCost: 135000, status: "Available" },
  { id: 3, regNumber: "TRK-109", name: "Actros L Pro", type: "Heavy Truck", capacity: 42000, odometer: 182100, acquisitionCost: 148000, status: "Maintenance" },
  { id: 4, regNumber: "TRK-101", name: "Freightliner Cascadia", type: "Heavy Truck", capacity: 44050, odometer: 230400, acquisitionCost: 125000, status: "Available" },
  { id: 5, regNumber: "TRK-108", name: "DAF XF 530", type: "Heavy Truck", capacity: 35000, odometer: 64120, acquisitionCost: 118000, status: "On Trip" },
  { id: 6, regNumber: "VAN-201", name: "Ford Transit High Roof", type: "Cargo Van", capacity: 4500, odometer: 35080, acquisitionCost: 48000, status: "Available" },
  { id: 7, regNumber: "VAN-204", name: "Mercedes Sprinter Cargo", type: "Cargo Van", capacity: 5200, odometer: 72400, acquisitionCost: 55000, status: "Maintenance" },
  { id: 8, regNumber: "TRK-302", name: "Hino 268 Medium Duty", type: "Light Truck", capacity: 18000, odometer: 85220, acquisitionCost: 75000, status: "Available" },
  { id: 9, regNumber: "TRK-305", name: "Isuzu NPR Cabover", type: "Light Truck", capacity: 14000, odometer: 112900, acquisitionCost: 68000, status: "Retired" },
  { id: 10, regNumber: "EV-401", name: "Tesla Semi Truck", type: "EV Delivery Truck", capacity: 80000, odometer: 12450, acquisitionCost: 180000, status: "Available" }
];

export default function VehicleList() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [view, setView] = useState("list"); // "list" | "details" | "add" | "edit"
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Add/Edit Save Handler
  const handleSaveVehicle = (savedData) => {
    if (selectedVehicle) {
      // Editing
      setVehicles((prev) => 
        prev.map((v) => (v.id === selectedVehicle.id ? { ...v, ...savedData } : v))
      );
      toast.success("Vehicle specs updated successfully", {
        style: { borderRadius: '12px', background: '#0d1527', color: '#fff' }
      });
    } else {
      // Adding
      setVehicles((prev) => [savedData, ...prev]);
      toast.success("New vehicle registered to fleet", {
        style: { borderRadius: '12px', background: '#0d1527', color: '#fff' }
      });
    }
    setView("list");
    setSelectedVehicle(null);
  };

  // Delete Handler
  const handleDeleteVehicle = (id) => {
    const confirmation = window.confirm("Are you sure you want to retire and remove this vehicle from active fleet registry?");
    if (confirmation) {
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      toast.success("Vehicle deleted from registry", {
        style: { borderRadius: '12px', background: '#0d1527', color: '#fff' }
      });
    }
  };

  // Navigation handlers
  const handleViewDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    setView("details");
  };

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setView("edit");
  };

  const handleRegisterClick = () => {
    setSelectedVehicle(null);
    setView("add");
  };

  const handleCancel = () => {
    setView("list");
    setSelectedVehicle(null);
  };

  // Export to CSV Logic
  const handleExportCSV = () => {
    const headers = ["ID", "Registration", "Name", "Type", "Capacity (lbs)", "Odometer (mi)", "Acquisition Cost ($)", "Status"];
    const rows = vehicles.map((v) => [
      v.id,
      v.regNumber,
      v.name,
      v.type,
      v.capacity,
      v.odometer,
      v.acquisitionCost,
      v.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transitops_fleet_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);

    toast.success("CSV report exported successfully", {
      style: { borderRadius: '12px', background: '#0d1527', color: '#fff' }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Sub-Views Swapper with Animates */}
      <AnimatePresence mode="wait">
        {view === "list" && (
          <div key="list">
            {/* Header info */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Vehicle Fleet Registry
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Manage registered logistics vehicles, service status and mileage logs.
              </p>
            </div>

            <VehicleTable
              vehicles={vehicles}
              onViewDetails={handleViewDetails}
              onEditVehicle={handleEditVehicle}
              onDeleteVehicle={handleDeleteVehicle}
              onRegisterClick={handleRegisterClick}
              onExportCSV={handleExportCSV}
            />
          </div>
        )}

        {view === "details" && selectedVehicle && (
          <div key="details">
            <VehicleDetails
              vehicle={selectedVehicle}
              onBack={handleCancel}
            />
          </div>
        )}

        {(view === "add" || view === "edit") && (
          <div key="form">
            <VehicleForm
              vehicle={selectedVehicle}
              onSave={handleSaveVehicle}
              onCancel={handleCancel}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}