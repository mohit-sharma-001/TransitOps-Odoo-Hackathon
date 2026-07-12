import { useState, useEffect } from "react";
import { ArrowLeft, Save, X, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const availableDrivers = [
  "Alex Rivera",
  "Sarah Jenkins",
  "Marcus Brody",
  "David Miller",
  "Elena Rostova",
  "James Chen",
  "Priya Sharma"
];

const availableVehicles = [
  "Volvo FH16 (TRK-102)",
  "Scania R500 (TRK-105)",
  "Actros L (TRK-109)",
  "Cascadia (TRK-101)",
  "DAF XF (TRK-108)",
  "Ford Transit (VAN-201)",
  "Hino 268 (TRK-302)",
  "Tesla Semi (EV-401)"
];

export default function TripForm({ trip, onSave, onCancel }) {
  const isEdit = !!trip;

  const [formData, setFormData] = useState({
    driver: "",
    vehicle: "",
    source: "",
    destination: "",
    cargoType: "General Freight",
    priority: "Medium",
    startTime: "",
    estimatedArrival: "",
    notes: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (trip) {
      setFormData({
        driver: trip.driver || "",
        vehicle: trip.vehicle || "",
        source: trip.source || "",
        destination: trip.destination || "",
        cargoType: trip.cargoType || "General Freight",
        priority: trip.priority || "Medium",
        startTime: trip.startTime ? new Date(trip.startTime).toISOString().slice(0, 16) : "",
        estimatedArrival: trip.estimatedArrival || "",
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

    if (!formData.driver) newErrors.driver = "Driver selection is required";
    if (!formData.vehicle) newErrors.vehicle = "Vehicle selection is required";
    if (!formData.source.trim()) newErrors.source = "Pickup location is required";
    if (!formData.destination.trim()) newErrors.destination = "Destination is required";
    if (!formData.startTime) newErrors.startTime = "Departure time is required";
    if (!formData.estimatedArrival.trim()) newErrors.estimatedArrival = "Estimated arrival is required";

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

    // Generate synthetic distance from city names hash
    const distanceBase = (formData.source.length + formData.destination.length) * 42 + 120;
    const distance = Math.min(distanceBase, 2400);

    onSave({
      id: trip ? trip.id : Date.now(),
      tripId: trip ? trip.tripId : `TRP-${(9500 + Math.floor(Math.random() * 500))}`,
      driver: formData.driver,
      vehicle: formData.vehicle,
      source: formData.source.trim(),
      destination: formData.destination.trim(),
      cargoType: formData.cargoType,
      priority: formData.priority,
      distance: trip ? trip.distance : distance,
      startTime: formData.startTime,
      eta: formData.estimatedArrival,
      estimatedArrival: formData.estimatedArrival,
      notes: formData.notes.trim(),
      status: trip ? trip.status : "Scheduled"
    });
  };

  const inputClass = (fieldName) =>
    `w-full px-3 py-2 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
      errors[fieldName] ? "border-rose-400 dark:border-rose-800/60" : "border-slate-200 dark:border-slate-800"
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
            {isEdit ? "Update trip routing, scheduling, and cargo details" : "Dispatch a new cargo transport request to the fleet"}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-6 rounded-2xl shadow-xs max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* 1. Driver */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="driver" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Driver <span className="text-rose-500">*</span>
              </label>
              <select
                id="driver"
                name="driver"
                value={formData.driver}
                onChange={handleChange}
                className={`${inputClass("driver")} cursor-pointer`}
              >
                <option value="">Select a driver...</option>
                {availableDrivers.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.driver && (
                <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="h-3 w-3" /> {errors.driver}
                </p>
              )}
            </div>

            {/* 2. Vehicle */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="vehicle" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Vehicle <span className="text-rose-500">*</span>
              </label>
              <select
                id="vehicle"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                className={`${inputClass("vehicle")} cursor-pointer`}
              >
                <option value="">Select a vehicle...</option>
                {availableVehicles.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              {errors.vehicle && (
                <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="h-3 w-3" /> {errors.vehicle}
                </p>
              )}
            </div>

            {/* 3. Pickup Location */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="source" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
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
              <label htmlFor="destination" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
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

            {/* 5. Cargo Type */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cargoType" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Cargo Type
              </label>
              <select
                id="cargoType"
                name="cargoType"
                value={formData.cargoType}
                onChange={handleChange}
                className={`${inputClass("cargoType")} cursor-pointer`}
              >
                <option>General Freight</option>
                <option>Electronics</option>
                <option>Pharmaceuticals</option>
                <option>Perishable Goods</option>
                <option>Industrial Steel</option>
                <option>Auto Parts</option>
                <option>Hazardous Materials</option>
                <option>Temperature Controlled</option>
              </select>
            </div>

            {/* 6. Priority */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
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
              <label htmlFor="startTime" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
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

            {/* 8. Estimated Arrival */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="estimatedArrival" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Estimated Arrival <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="estimatedArrival"
                name="estimatedArrival"
                value={formData.estimatedArrival}
                onChange={handleChange}
                placeholder="e.g. July 14, 5:30 PM"
                className={inputClass("estimatedArrival")}
              />
              {errors.estimatedArrival && (
                <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="h-3 w-3" /> {errors.estimatedArrival}
                </p>
              )}
            </div>

            {/* 9. Notes - Full Width */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="notes" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
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
              <span>{isEdit ? "Update Trip" : "Dispatch Trip"}</span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
