import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import TripTable from "../../components/trip/TripTable";
import TripDetails from "../../components/trip/TripDetails";
import TripForm from "../../components/trip/TripForm";
import toast from "react-hot-toast";
import tripService from "../../services/tripService";
import { useAuth } from "../../context/AuthContext";

export default function TripList() {
  const { user } = useAuth();
  const canManage = user?.role === "FleetManager" || user?.role === "Dispatcher";

  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState("list");
  const [selectedTrip, setSelectedTrip] = useState(null);

  // States for Completing Trip Modal
  const [completingTrip, setCompletingTrip] = useState(null);
  const [finalOdometer, setFinalOdometer] = useState("");
  const [fuelConsumed, setFuelConsumed] = useState("");
  const [submittingComplete, setSubmittingComplete] = useState(false);

  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      const data = await tripService.getTrips();
      // Map API payload into UI-friendly structure
      const mapped = data.map((t) => ({
        ...t,
        tripId: `TRP-${t.id + 9500}`,
        driver: t.driver ? t.driver.name : "Unassigned",
        vehicle: t.vehicle ? `${t.vehicle.name} (${t.vehicle.registrationNumber})` : "Unassigned",
        eta: t.status === "Cancelled" ? "Cancelled" : t.status === "Completed" ? "Completed" : new Date(t.estimatedArrival || new Date()).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        estimatedArrival: t.estimatedArrival || new Date().toISOString()
      }));
      setTrips(mapped);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load active trip schedule");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleSaveTrip = async (savedData) => {
    try {
      const payload = {
        source: savedData.source,
        destination: savedData.destination,
        vehicleId: parseInt(savedData.vehicleId),
        driverId: parseInt(savedData.driverId),
        cargoWeight: parseFloat(savedData.cargoWeight || 5000),
        distance: parseFloat(savedData.distance || 300)
      };

      await tripService.createTrip(payload);
      toast.success("New trip created successfully in Draft", {
        style: { borderRadius: '12px', background: '#0d1527', color: '#fff' }
      });
      fetchTrips();
      setView("list");
      setSelectedTrip(null);
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || "Failed to create trip";
      toast.error(errMsg);
    }
  };

  const handleDispatchTrip = async (id) => {
    try {
      await tripService.dispatchTrip(id);
      toast.success("Trip successfully dispatched!", {
        style: { borderRadius: '12px', background: '#0d1527', color: '#fff' }
      });
      fetchTrips();
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || "Failed to dispatch trip";
      toast.error(errMsg, { duration: 5000 });
    }
  };

  const handleCancelTrip = async (id) => {
    if (window.confirm("Are you sure you want to cancel this trip dispatch?")) {
      try {
        await tripService.cancelTrip(id);
        toast.success("Trip marked as Cancelled", {
          style: { borderRadius: '12px', background: '#0d1527', color: '#fff' }
        });
        fetchTrips();
      } catch (error) {
        console.error(error);
        const errMsg = error.response?.data?.error || "Failed to cancel trip";
        toast.error(errMsg);
      }
    }
  };

  const handleCompleteTripClick = (trip) => {
    setCompletingTrip(trip);
    setFinalOdometer("");
    setFuelConsumed("");
  };

  const handleCompleteTripSubmit = async () => {
    if (!finalOdometer || !fuelConsumed) {
      toast.error("Please enter final odometer and fuel consumed");
      return;
    }
    setSubmittingComplete(true);
    try {
      await tripService.completeTrip(completingTrip.id, {
        finalOdometer: parseFloat(finalOdometer),
        fuelConsumed: parseFloat(fuelConsumed)
      });
      toast.success("Trip completed and logged!", {
        style: { borderRadius: '12px', background: '#0d1527', color: '#fff' }
      });
      setCompletingTrip(null);
      fetchTrips();
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || "Failed to complete trip";
      toast.error(errMsg);
    } finally {
      setSubmittingComplete(false);
    }
  };

  const handleViewDetails = (trip) => {
    setSelectedTrip(trip);
    setView("details");
  };

  const handleCreateTripClick = () => {
    setView("add");
  };

  const handleCancel = () => {
    setView("list");
    setSelectedTrip(null);
    fetchTrips();
  };

  const handleExportCSV = () => {
    const headers = ["Trip ID", "Driver", "Vehicle", "Source", "Destination", "Distance (mi)", "Start Time", "ETA", "Status", "Priority"];
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
      t.priority || "Medium"
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
              isLoading={isLoading}
              onViewDetails={handleViewDetails}
              onDispatchTrip={handleDispatchTrip}
              onCompleteTrip={handleCompleteTripClick}
              onCancelTrip={handleCancelTrip}
              onCreateTripClick={handleCreateTripClick}
              onExportCSV={handleExportCSV}
              canManage={canManage}
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

        {view === "add" && (
          <div key="form">
            <TripForm
              trip={null}
              onSave={handleSaveTrip}
              onCancel={handleCancel}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Complete Trip Modal Overlay */}
      {completingTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-sm w-full shadow-lg space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Complete Trip {completingTrip.tripId}</h3>
              <p className="text-xs text-slate-500 mt-1">Submit final telemetry parameters to archive dispatch log.</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleCompleteTripSubmit(); }} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Final Odometer (mi)</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={finalOdometer}
                  onChange={(e) => setFinalOdometer(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="e.g. 152000"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fuel Consumed (Liters)</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={fuelConsumed}
                  onChange={(e) => setFuelConsumed(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="e.g. 120"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  disabled={submittingComplete}
                  onClick={() => setCompletingTrip(null)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingComplete}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm cursor-pointer"
                >
                  {submittingComplete ? "Submitting..." : "Submit Log"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}