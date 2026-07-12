import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import DriverTable from "../../components/driver/DriverTable";
import DriverProfile from "../../components/driver/DriverProfile";
import DriverForm from "../../components/driver/DriverForm";
import toast from "react-hot-toast";
import driverService from "../../services/driverService";
import { useAuth } from "../../context/AuthContext";

export default function DriverList() {
  const { user } = useAuth();
  const canManage = user?.role === "FleetManager" || user?.role === "SafetyOfficer";

  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState("list");
  const [selectedDriver, setSelectedDriver] = useState(null);

  const fetchDrivers = async () => {
    setIsLoading(true);
    try {
      const data = await driverService.getDrivers();
      // Map properties for UI compatibility
      const mapped = data.map((d) => ({
        ...d,
        driverId: `DRV-${d.id + 3000}`
      }));
      setDrivers(mapped);
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
      toast.error("Failed to load driver roster");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleSaveDriver = async (savedData) => {
    try {
      const payload = {
        name: savedData.name,
        licenseNumber: savedData.licenseNumber,
        licenseCategory: savedData.licenseCategory || "CDL-A",
        licenseExpiry: new Date(savedData.licenseExpiry).toISOString(),
        phone: savedData.phone,
        safetyScore: parseFloat(savedData.safetyScore || 90)
      };

      await driverService.createDriver(payload);
      toast.success("New driver registered to fleet", {
        style: { borderRadius: "12px", background: "#0d1527", color: "#fff" }
      });
      fetchDrivers();
      setView("list");
      setSelectedDriver(null);
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || "Failed to register driver";
      toast.error(errMsg);
    }
  };

  const handleDeleteDriver = async (id) => {
    if (window.confirm("Are you sure you want to suspend this driver from active roster?")) {
      try {
        await driverService.updateDriverStatus(id, "Suspended");
        toast.success("Driver status updated to Suspended", {
          style: { borderRadius: "12px", background: "#0d1527", color: "#fff" }
        });
        fetchDrivers();
      } catch (error) {
        console.error(error);
        toast.error("Failed to suspend driver");
      }
    }
  };

  const handleViewProfile = (driver) => {
    setSelectedDriver(driver);
    setView("profile");
  };

  const handleAddDriverClick = () => {
    setSelectedDriver(null);
    setView("add");
  };

  const handleCancel = () => {
    setView("list");
    setSelectedDriver(null);
    fetchDrivers();
  };

  const handleExportCSV = () => {
    const headers = [
      "Driver ID", "Name", "Phone", "Email", "License Number", "License Expiry",
      "License Valid", "Experience (yrs)", "Rating", "Status", "Safety Score"
    ];
    const rows = drivers.map((d) => [
      d.driverId, d.name, d.phone, d.email || "N/A", d.licenseNumber, d.licenseExpiry,
      d.licenseValid ? "Valid" : "Expired", d.experience || 0, d.rating || 4.5, d.status,
      d.safetyScore
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transitops_driver_roster_${new Date().toISOString().slice(0,10)}.csv`);
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
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Driver Roster Management
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Manage commercial vehicle drivers, licensing credentials, and safety performance scores.
              </p>
            </div>

            <DriverTable
              drivers={drivers}
              isLoading={isLoading}
              onViewProfile={handleViewProfile}
              onDeleteDriver={handleDeleteDriver}
              onAddDriverClick={handleAddDriverClick}
              onExportCSV={handleExportCSV}
              canManage={canManage}
            />
          </div>
        )}

        {view === "profile" && selectedDriver && (
          <div key="profile">
            <DriverProfile
              driver={selectedDriver}
              onBack={handleCancel}
            />
          </div>
        )}

        {view === "add" && (
          <div key="form">
            <DriverForm
              driver={null}
              onSave={handleSaveDriver}
              onCancel={handleCancel}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}