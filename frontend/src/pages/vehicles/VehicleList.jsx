import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import VehicleTable from "../../components/vehicle/VehicleTable";
import VehicleDetails from "../../components/vehicle/VehicleDetails";
import VehicleForm from "../../components/vehicle/VehicleForm";
import toast from "react-hot-toast";
import vehicleService from "../../services/vehicleService";
import { useAuth } from "../../context/AuthContext";

export default function VehicleList() {
  const { user } = useAuth();
  const canManage = user?.role === "FleetManager";

  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState("list"); // "list" | "details" | "add" | "edit"
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const data = await vehicleService.getVehicles();
      // Map database registrationNumber to regNumber for frontend compatibility
      const mapped = data.map((v) => ({
        ...v,
        regNumber: v.registrationNumber
      }));
      setVehicles(mapped);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
      toast.error("Failed to load vehicle list");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Add/Edit Save Handler
  const handleSaveVehicle = async (savedData) => {
    try {
      const payload = {
        registrationNumber: savedData.regNumber,
        name: savedData.name,
        type: savedData.type,
        capacity: parseFloat(savedData.capacity),
        odometer: parseFloat(savedData.odometer),
        acquisitionCost: parseFloat(savedData.acquisitionCost)
      };

      await vehicleService.createVehicle(payload);
      toast.success("New vehicle registered to fleet", {
        style: { borderRadius: '12px', background: '#0d1527', color: '#fff' }
      });
      fetchVehicles();
      setView("list");
      setSelectedVehicle(null);
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || "Failed to register vehicle";
      toast.error(errMsg);
    }
  };

  // Delete Handler (Mark as Retired)
  const handleDeleteVehicle = async (id) => {
    const confirmation = window.confirm("Are you sure you want to retire this vehicle?");
    if (confirmation) {
      try {
        await vehicleService.updateVehicleStatus(id, "Retired");
        toast.success("Vehicle status updated to Retired", {
          style: { borderRadius: '12px', background: '#0d1527', color: '#fff' }
        });
        fetchVehicles();
      } catch (error) {
        console.error(error);
        toast.error("Failed to retire vehicle");
      }
    }
  };

  // Navigation handlers
  const handleViewDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    setView("details");
  };

  const handleRegisterClick = () => {
    setSelectedVehicle(null);
    setView("add");
  };

  const handleCancel = () => {
    setView("list");
    setSelectedVehicle(null);
    fetchVehicles(); // Refetch list to sync status updates
  };

  // Secure CSV Export (Delegated to reportService or local filter)
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
    document.body.appendChild(link);
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
              isLoading={isLoading}
              onViewDetails={handleViewDetails}
              onDeleteVehicle={handleDeleteVehicle}
              onRegisterClick={handleRegisterClick}
              onExportCSV={handleExportCSV}
              onRefresh={fetchVehicles}
              canManage={canManage}
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

        {view === "add" && (
          <div key="form">
            <VehicleForm
              vehicle={null}
              onSave={handleSaveVehicle}
              onCancel={handleCancel}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}