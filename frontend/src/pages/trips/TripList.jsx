import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import TripTable from "../../components/trip/TripTable";
import TripDetails from "../../components/trip/TripDetails";
import TripForm from "../../components/trip/TripForm";
import toast from "react-hot-toast";

const initialTrips = [
  {
    id: 1,
    tripId: "TRP-9501",
    driver: "Alex Rivera",
    vehicle: "Volvo FH16 (TRK-102)",
    source: "Chicago, IL",
    destination: "New York, NY",
    cargoType: "Electronics",
    priority: "High",
    distance: 790,
    startTime: "2026-07-10T08:00",
    eta: "July 11, 5:30 PM",
    estimatedArrival: "July 11, 5:30 PM",
    notes: "Handle with care. Temperature-controlled container required.",
    status: "In Progress"
  },
  {
    id: 2,
    tripId: "TRP-9482",
    driver: "Sarah Jenkins",
    vehicle: "Scania R500 (TRK-105)",
    source: "Houston, TX",
    destination: "Los Angeles, CA",
    cargoType: "Pharmaceuticals",
    priority: "Critical",
    distance: 1547,
    startTime: "2026-07-08T06:30",
    eta: "July 10, 2:00 PM",
    estimatedArrival: "July 10, 2:00 PM",
    notes: "Refrigerated trailer. Maintain 2–8°C. Proof of delivery mandatory.",
    status: "Completed"
  },
  {
    id: 3,
    tripId: "TRP-9510",
    driver: "Marcus Brody",
    vehicle: "Actros L (TRK-109)",
    source: "Seattle, WA",
    destination: "Denver, CO",
    cargoType: "Industrial Steel",
    priority: "Medium",
    distance: 1320,
    startTime: "2026-07-13T09:00",
    eta: "July 15, 8:00 AM",
    estimatedArrival: "July 15, 8:00 AM",
    notes: "Heavy load — require oversize permit for I-90 corridor.",
    status: "Scheduled"
  },
  {
    id: 4,
    tripId: "TRP-9498",
    driver: "David Miller",
    vehicle: "Cascadia (TRK-101)",
    source: "Miami, FL",
    destination: "Atlanta, GA",
    cargoType: "Perishable Goods",
    priority: "High",
    distance: 662,
    startTime: "2026-07-09T07:15",
    eta: "July 10, 6:00 AM",
    estimatedArrival: "July 10, 6:00 AM",
    notes: "Fresh produce — must arrive within 24 hours. Call receiver 30 mins prior.",
    status: "Delayed"
  },
  {
    id: 5,
    tripId: "TRP-9475",
    driver: "Elena Rostova",
    vehicle: "DAF XF (TRK-108)",
    source: "Boston, MA",
    destination: "Philadelphia, PA",
    cargoType: "Auto Parts",
    priority: "Low",
    distance: 310,
    startTime: "2026-07-07T14:00",
    eta: "July 7, 10:30 PM",
    estimatedArrival: "July 7, 10:30 PM",
    notes: "Standard delivery. Dock #3 at receiver warehouse.",
    status: "Completed"
  },
  {
    id: 6,
    tripId: "TRP-9520",
    driver: "James Chen",
    vehicle: "Tesla Semi (EV-401)",
    source: "San Francisco, CA",
    destination: "Portland, OR",
    cargoType: "Electronics",
    priority: "Medium",
    distance: 636,
    startTime: "2026-07-12T10:00",
    eta: "July 13, 3:00 PM",
    estimatedArrival: "July 13, 3:00 PM",
    notes: "EV route — verify charging station availability at Grants Pass, OR.",
    status: "In Progress"
  },
  {
    id: 7,
    tripId: "TRP-9465",
    driver: "Priya Sharma",
    vehicle: "Ford Transit (VAN-201)",
    source: "Dallas, TX",
    destination: "San Antonio, TX",
    cargoType: "General Freight",
    priority: "Low",
    distance: 274,
    startTime: "2026-07-06T11:30",
    eta: "Cancelled",
    estimatedArrival: "Cancelled",
    notes: "Customer cancelled order. Vehicle returned to depot.",
    status: "Cancelled"
  },
  {
    id: 8,
    tripId: "TRP-9530",
    driver: "Alex Rivera",
    vehicle: "Hino 268 (TRK-302)",
    source: "Phoenix, AZ",
    destination: "Las Vegas, NV",
    cargoType: "Temperature Controlled",
    priority: "Critical",
    distance: 297,
    startTime: "2026-07-14T05:00",
    eta: "July 14, 12:00 PM",
    estimatedArrival: "July 14, 12:00 PM",
    notes: "Medical supplies — critical priority. Escort paperwork attached.",
    status: "Scheduled"
  }
];

export default function TripList() {
  const [trips, setTrips] = useState(initialTrips);
  const [view, setView] = useState("list");
  const [selectedTrip, setSelectedTrip] = useState(null);

  const handleSaveTrip = (savedData) => {
    if (selectedTrip) {
      setTrips((prev) =>
        prev.map((t) => (t.id === selectedTrip.id ? { ...t, ...savedData } : t))
      );
      toast.success("Trip dispatch updated successfully", {
        style: { borderRadius: '12px', background: '#0d1527', color: '#fff' }
      });
    } else {
      setTrips((prev) => [savedData, ...prev]);
      toast.success("New trip dispatched to fleet", {
        style: { borderRadius: '12px', background: '#0d1527', color: '#fff' }
      });
    }
    setView("list");
    setSelectedTrip(null);
  };

  const handleDeleteTrip = (id) => {
    if (window.confirm("Are you sure you want to cancel and remove this trip from the dispatch log?")) {
      setTrips((prev) => prev.filter((t) => t.id !== id));
      toast.success("Trip removed from dispatch log", {
        style: { borderRadius: '12px', background: '#0d1527', color: '#fff' }
      });
    }
  };

  const handleViewDetails = (trip) => {
    setSelectedTrip(trip);
    setView("details");
  };

  const handleEditTrip = (trip) => {
    setSelectedTrip(trip);
    setView("edit");
  };

  const handleCreateTripClick = () => {
    setSelectedTrip(null);
    setView("add");
  };

  const handleCancel = () => {
    setView("list");
    setSelectedTrip(null);
  };

  const handleExportCSV = () => {
    const headers = ["Trip ID", "Driver", "Vehicle", "Source", "Destination", "Distance (mi)", "Start Time", "ETA", "Status", "Priority", "Cargo Type"];
    const rows = trips.map((t) => [
      t.tripId,
      t.driver,
      t.vehicle,
      t.source,
      t.destination,
      t.distance,
      t.startTime,
      t.eta,
      t.status,
      t.priority,
      t.cargoType || "General"
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `transitops_trips_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Trip dispatch report exported", {
      style: { borderRadius: '12px', background: '#0d1527', color: '#fff' }
    });
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {view === "list" && (
          <div key="list">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Trip Dispatch Center
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Manage cargo shipments, route scheduling, and fleet dispatch operations.
              </p>
            </div>

            <TripTable
              trips={trips}
              onViewDetails={handleViewDetails}
              onEditTrip={handleEditTrip}
              onDeleteTrip={handleDeleteTrip}
              onCreateTripClick={handleCreateTripClick}
              onExportCSV={handleExportCSV}
            />
          </div>
        )}

        {view === "details" && selectedTrip && (
          <div key="details">
            <TripDetails
              trip={selectedTrip}
              onBack={handleCancel}
            />
          </div>
        )}

        {(view === "add" || view === "edit") && (
          <div key="form">
            <TripForm
              trip={selectedTrip}
              onSave={handleSaveTrip}
              onCancel={handleCancel}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}