import { useState, useEffect } from "react";
import { ArrowLeft, Save, X, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import vehicleService from "../../services/vehicleService";
import driverService from "../../services/driverService";
import toast from "react-hot-toast";

export default function TripForm({ trip, onSave, onCancel }) {
  const isEdit = !!trip;

  const [formData, setFormData] = useState({
    driverId: "",
    vehicleId: "",
    source: "",
    destination: "",
    cargoWeight: "5000",
    priority: "Medium",
    startTime: "",
    notes: ""
  });

  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const [driversData, vehiclesData] = await Promise.all([
          driverService.getAvailableDrivers(),
          vehicleService.getAvailableVehicles()
        ]);
        setAvailableDrivers(driversData);
        setAvailableVehicles(vehiclesData);
      } catch (error) {
        console.error("Failed to load available fleet assets:", error);
        toast.error("Failed to load available vehicles/drivers");
      } finally {
        setLoadingAssets(false);
      }
    };
    fetchAssets();
  }, []);

  useEffect(() => {
    if (trip) {
      setFormData({
        driverId: trip.driverId || "",
        vehicleId: trip.vehicleId || "",
        source: trip.source || "",
        destination: trip.destination || "",
        cargoWeight: trip.cargoWeight?.toString() || "5000",
        priority: trip.priority || "Medium",
        startTime: trip.startTime ? new Date(trip.startTime).toISOString().slice(0, 16) : "",
        notes: trip.notes || ""
      });
    }
  }, [trip]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.driverId) newErrors.driverId = "Driver selection is required";
    if (!formData.vehicleId) newErrors.vehicleId = "Vehicle selection is required";
    if (!formData.source.trim()) newErrors.source = "Pickup location is required";
    if (!formData.destination.trim()) newErrors.destination = "Destination is required";
    if (!formData.startTime) newErrors.startTime = "Departure time is required";
    if (!formData.cargoWeight || isNaN(formData.cargoWeight) || Number(formData.cargoWeight) <= 0) {
      newErrors.cargoWeight = "Cargo weight must be a positive number";
    }

    if (formData.source.trim() && formData.destination.trim() && 
        formData.source.trim().toLowerCase() === formData.destination.trim().toLowerCase()) {
      newErrors.destination = "Destination must differ from pickup location";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Generate distance dynamically
    const distanceBase = (formData.source.length + formData.destination.length) * 42 + 120;
    const distance = Math.min(distanceBase, 2400);

    onSave({
      driverId: parseInt(formData.driverId),
      vehicleId: parseInt(formData.vehicleId),
      source: formData.source.trim(),
      destination: formData.destination.trim(),
      cargoWeight: parseFloat(formData.cargoWeight),
      priority: formData.priority,
      distance: distance,
      startTime: formData.startTime,
      notes: formData.notes.trim()
    });
  };

  const inputClass = (fieldName) =>
    `w-full px-3 py-2 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
      errors[fieldName] ? "border-rose-450 dark:border-rose-800/60" : "border-slate-200 dark:border-slate-800"
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onCancel}
          type="button"
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isEdit ? "Edit Trip Dispatch" : "Create New Trip"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isEdit ? "Update trip routing, scheduling, and cargo details" : "Schedule a new cargo transport trip in the system"}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-6 rounded-2xl shadow-xs max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* 1. Driver Select */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="driverId" className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">
                Available Driver <span className="text-rose-500">*</span>
              </label>
              <select
                id="driverId"
                name="driverId"
                value={formData.driverId}
                onChange={handleChange}
                disabled={loadingAssets}
                className={`${inputClass("driverId")} cursor-pointer`}
              >
                <option value="">{loadingAssets ? "Loading drivers..." : "Select a driver..."}</option>
                {availableDrivers.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} (Safety Score: {d.safetyScore})</option>
                ))}
              </select>
              {errors.driverId && (
                <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="h-3 w-3" /> {errors.driverId}
                </p>
              )}
            </div>

            {/* 2. Vehicle Select */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="vehicleId" className="text-xs font-bold text-slate-655 dark:text-slate-400 uppercase tracking-wider">
                Available Vehicle <span className="text-rose-500">*</span>
              </label>
              <select
                id="vehicleId"
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleChange}
                disabled={loadingAssets}
                className={`${inputClass("vehicleId")} cursor-pointer`}
              >
                <option value="">{loadingAssets ? "Loading vehicles..." : "Select a vehicle..."}</option>
                {availableVehicles.map((v) => (
                  <option key={v.id} value={v.id}>{v.name} ({v.registrationNumber})</option>
                ))}
              </select>
              {errors.vehicleId && (
                <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="h-3 w-3" /> {errors.vehicleId}
                </p>
              )}
            </div>

            {/* 3. Pickup Location */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="source" className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">
                Pickup Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                placeholder="e.g. Chicago, IL"
                className={inputClass("source")}
              />
              {errors.source && (
                <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="h-3 w-3" /> {errors.source}
                </p>
              )}
            </div>

            {/* 4. Destination */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="destination" className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">
                Destination <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="e.g. New York, NY"
                className={inputClass("destination")}
              />
              {errors.destination && (
                <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="h-3 w-3" /> {errors.destination}
                </p>
              )}
            </div>

            {/* 5. Cargo Weight */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cargoWeight" className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">
                Cargo Weight (lbs) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                id="cargoWeight"
                name="cargoWeight"
                value={formData.cargoWeight}
                onChange={handleChange}
                placeholder="e.g. 15000"
                className={inputClass("cargoWeight")}
              />
              {errors.cargoWeight && (
                <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="h-3 w-3" /> {errors.cargoWeight}
                </p>
              )}
            </div>

            {/* 6. Priority */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">
                Priority Level
              </label>
              <div className="flex flex-wrap gap-2 mt-1">
                {["Low", "Medium", "High", "Critical"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, priority: p }))}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-150
                      ${formData.priority === p
                        ? p === "Critical"
                          ? "bg-rose-600 border-rose-600 text-white shadow-sm"
                          : p === "High"
                          ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                          : "bg-blue-600 border-blue-600 text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/10 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* 7. Departure Time */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="startTime" className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">
                Departure Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={`${inputClass("startTime")} cursor-pointer`}
              />
              {errors.startTime && (
                <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="h-3 w-3" /> {errors.startTime}
                </p>
              )}
            </div>

            {/* 8. Notes - Full Width */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="notes" className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">
                Dispatch Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Special handling instructions, delivery contacts, temperature requirements..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-5">
            <button
              onClick={onCancel}
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/10 transition-colors cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Create Draft Trip</span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
