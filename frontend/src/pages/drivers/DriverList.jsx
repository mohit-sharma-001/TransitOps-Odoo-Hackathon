import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import DriverTable from "../../components/driver/DriverTable";
import DriverProfile from "../../components/driver/DriverProfile";
import DriverForm from "../../components/driver/DriverForm";
import toast from "react-hot-toast";

const initialDrivers = [
  {
    id: 1,
    driverId: "DRV-3001",
    name: "Alex Rivera",
    phone: "(555) 123-4567",
    email: "alex.rivera@transitops.com",
    address: "742 Freight Ln, Dallas, TX 75201",
    dateOfBirth: "1988-03-15",
    licenseNumber: "CDL-A-2847591",
    licenseExpiry: "Dec 2027",
    assignedVehicle: "Volvo FH16 (TRK-102)",
    experience: 8,
    rating: 4.9,
    status: "Driving",
    totalTrips: 312,
    totalDistance: 94250,
    deliveriesCompleted: 298,
    fuelEfficiency: 7.8,
    safetyScore: 97,
    lateDeliveries: 3,
    notes: "Hazmat endorsement. Exceptional safety record."
  },
  {
    id: 2,
    driverId: "DRV-3002",
    name: "Sarah Jenkins",
    phone: "(555) 234-5678",
    email: "sarah.jenkins@transitops.com",
    address: "1920 Logistics Ave, Houston, TX 77002",
    dateOfBirth: "1990-07-22",
    licenseNumber: "CDL-A-3918274",
    licenseExpiry: "Mar 2028",
    assignedVehicle: "Scania R500 (TRK-105)",
    experience: 6,
    rating: 4.8,
    status: "Available",
    totalTrips: 248,
    totalDistance: 72800,
    deliveriesCompleted: 240,
    fuelEfficiency: 8.1,
    safetyScore: 95,
    lateDeliveries: 5,
    notes: "Refrigerated transport specialist."
  },
  {
    id: 3,
    driverId: "DRV-3003",
    name: "Marcus Brody",
    phone: "(555) 345-6789",
    email: "marcus.brody@transitops.com",
    address: "88 Harbor Rd, Seattle, WA 98101",
    dateOfBirth: "1985-11-08",
    licenseNumber: "CDL-A-5027384",
    licenseExpiry: "Jun 2026",
    assignedVehicle: "Actros L (TRK-109)",
    experience: 12,
    rating: 4.6,
    status: "Available",
    totalTrips: 456,
    totalDistance: 138000,
    deliveriesCompleted: 432,
    fuelEfficiency: 7.2,
    safetyScore: 92,
    lateDeliveries: 12,
    notes: "Oversize load certified. Mentor for new drivers."
  },
  {
    id: 4,
    driverId: "DRV-3004",
    name: "David Miller",
    phone: "(555) 456-7890",
    email: "david.miller@transitops.com",
    address: "2150 Ocean Dr, Miami, FL 33139",
    dateOfBirth: "1992-01-30",
    licenseNumber: "CDL-A-6193847",
    licenseExpiry: "Sep 2027",
    assignedVehicle: "Cascadia (TRK-101)",
    experience: 5,
    rating: 4.7,
    status: "Driving",
    totalTrips: 198,
    totalDistance: 58400,
    deliveriesCompleted: 190,
    fuelEfficiency: 7.9,
    safetyScore: 94,
    lateDeliveries: 6,
    notes: "Perishable goods specialist. Bilingual (EN/ES)."
  },
  {
    id: 5,
    driverId: "DRV-3005",
    name: "Elena Rostova",
    phone: "(555) 567-8901",
    email: "elena.rostova@transitops.com",
    address: "64 Commonwealth Ave, Boston, MA 02116",
    dateOfBirth: "1991-05-14",
    licenseNumber: "CDL-A-7284916",
    licenseExpiry: "Nov 2028",
    assignedVehicle: "DAF XF (TRK-108)",
    experience: 7,
    rating: 4.5,
    status: "On Leave",
    totalTrips: 275,
    totalDistance: 81200,
    deliveriesCompleted: 264,
    fuelEfficiency: 7.6,
    safetyScore: 93,
    lateDeliveries: 8,
    notes: "Tanker endorsement. Currently on parental leave."
  },
  {
    id: 6,
    driverId: "DRV-3006",
    name: "James Chen",
    phone: "(555) 678-9012",
    email: "james.chen@transitops.com",
    address: "501 Market St, San Francisco, CA 94105",
    dateOfBirth: "1993-09-03",
    licenseNumber: "CDL-A-8371049",
    licenseExpiry: "Feb 2028",
    assignedVehicle: "Tesla Semi (EV-401)",
    experience: 4,
    rating: 4.4,
    status: "Driving",
    totalTrips: 156,
    totalDistance: 42600,
    deliveriesCompleted: 148,
    fuelEfficiency: 0,
    safetyScore: 96,
    lateDeliveries: 2,
    notes: "EV fleet specialist. Zero-emission route planner."
  },
  {
    id: 7,
    driverId: "DRV-3007",
    name: "Priya Sharma",
    phone: "(555) 789-0123",
    email: "priya.sharma@transitops.com",
    address: "1300 Main St, Dallas, TX 75202",
    dateOfBirth: "1994-12-19",
    licenseNumber: "CDL-B-4829175",
    licenseExpiry: "Aug 2027",
    assignedVehicle: "Ford Transit (VAN-201)",
    experience: 3,
    rating: 4.3,
    status: "Available",
    totalTrips: 124,
    totalDistance: 28400,
    deliveriesCompleted: 118,
    fuelEfficiency: 18.2,
    safetyScore: 91,
    lateDeliveries: 4,
    notes: "Last-mile delivery specialist. Clean driving record."
  },
  {
    id: 8,
    driverId: "DRV-3008",
    name: "Carlos Mendez",
    phone: "(555) 890-1234",
    email: "carlos.mendez@transitops.com",
    address: "920 Desert Blvd, Phoenix, AZ 85001",
    dateOfBirth: "1987-06-25",
    licenseNumber: "CDL-A-9517382",
    licenseExpiry: "Apr 2026",
    assignedVehicle: "Hino 268 (TRK-302)",
    experience: 10,
    rating: 4.2,
    status: "Offline",
    totalTrips: 389,
    totalDistance: 112500,
    deliveriesCompleted: 370,
    fuelEfficiency: 7.4,
    safetyScore: 89,
    lateDeliveries: 15,
    notes: "Cross-border certified (US/MX). Double/triple endorsement."
  }
];

export default function DriverList() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [view, setView] = useState("list");
  const [selectedDriver, setSelectedDriver] = useState(null);

  const handleSaveDriver = (savedData) => {
    if (selectedDriver) {
      setDrivers((prev) =>
        prev.map((d) => (d.id === selectedDriver.id ? { ...d, ...savedData } : d))
      );
      toast.success("Driver record updated successfully", {
        style: { borderRadius: "12px", background: "#0d1527", color: "#fff" }
      });
    } else {
      setDrivers((prev) => [savedData, ...prev]);
      toast.success("New driver registered to fleet", {
        style: { borderRadius: "12px", background: "#0d1527", color: "#fff" }
      });
    }
    setView("list");
    setSelectedDriver(null);
  };

  const handleDeleteDriver = (id) => {
    if (window.confirm("Remove this driver from the fleet roster? This action cannot be undone.")) {
      setDrivers((prev) => prev.filter((d) => d.id !== id));
      toast.success("Driver removed from fleet roster", {
        style: { borderRadius: "12px", background: "#0d1527", color: "#fff" }
      });
    }
  };

  const handleViewProfile = (driver) => {
    setSelectedDriver(driver);
    setView("profile");
  };

  const handleEditDriver = (driver) => {
    setSelectedDriver(driver);
    setView("edit");
  };

  const handleAddDriverClick = () => {
    setSelectedDriver(null);
    setView("add");
  };

  const handleCancel = () => {
    setView("list");
    setSelectedDriver(null);
  };

  const handleExportCSV = () => {
    const headers = [
      "Driver ID", "Name", "Phone", "Email", "License Number", "License Expiry",
      "Assigned Vehicle", "Experience (yrs)", "Rating", "Status", "Total Trips",
      "Safety Score"
    ];
    const rows = drivers.map((d) => [
      d.driverId, d.name, d.phone, d.email, d.licenseNumber, d.licenseExpiry,
      d.assignedVehicle || "Unassigned", d.experience, d.rating, d.status,
      d.totalTrips, d.safetyScore
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `transitops_drivers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Driver roster exported", {
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
                Driver Management
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Fleet driver roster, certifications, performance analytics, and assignments.
              </p>
            </div>

            <DriverTable
              drivers={drivers}
              onViewProfile={handleViewProfile}
              onEditDriver={handleEditDriver}
              onDeleteDriver={handleDeleteDriver}
              onAddDriverClick={handleAddDriverClick}
              onExportCSV={handleExportCSV}
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

        {(view === "add" || view === "edit") && (
          <div key="form">
            <DriverForm
              driver={selectedDriver}
              onSave={handleSaveDriver}
              onCancel={handleCancel}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}