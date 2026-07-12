import { useState, useEffect } from "react";
import { ArrowLeft, Save, X, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function VehicleForm({ vehicle, onSave, onCancel }) {
  const isEdit = !!vehicle;

  const [formData, setFormData] = useState({
    regNumber: "",
    name: "",
    type: "Heavy Truck",
    capacity: "",
    odometer: "",
    acquisitionCost: "",
    status: "Available"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (vehicle) {
      setFormData({
        regNumber: vehicle.regNumber || "",
        name: vehicle.name || "",
        type: vehicle.type || "Heavy Truck",
        capacity: vehicle.capacity || "",
        odometer: vehicle.odometer || "",
        acquisitionCost: vehicle.acquisitionCost || "",
        status: vehicle.status || "Available"
      });
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const regPattern = /^[a-zA-Z0-9-]{3,15}$/;
    
    if (!formData.regNumber.trim()) {
      newErrors.regNumber = "Registration number is required";
    } else if (!regPattern.test(formData.regNumber.trim())) {
      newErrors.regNumber = "Format invalid. Alphanumeric & hyphens allowed (e.g. TRK-102)";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Vehicle name is required";
    }

    const capacityNum = parseFloat(formData.capacity);
    if (formData.capacity === "") {
      newErrors.capacity = "Cargo capacity is required";
    } else if (isNaN(capacityNum) || capacityNum <= 0) {
      newErrors.capacity = "Capacity must be a positive number";
    }

    const odoNum = parseFloat(formData.odometer);
    if (formData.odometer === "") {
      newErrors.odometer = "Odometer reading is required";
    } else if (isNaN(odoNum) || odoNum < 0) {
      newErrors.odometer = "Odometer reading must be 0 or positive";
    }

    const costNum = parseFloat(formData.acquisitionCost);
    if (formData.acquisitionCost === "") {
      newErrors.acquisitionCost = "Acquisition cost is required";
    } else if (isNaN(costNum) || costNum <= 0) {
      newErrors.acquisitionCost = "Cost must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: vehicle ? vehicle.id : Date.now(),
      regNumber: formData.regNumber.trim().toUpperCase(),
      name: formData.name.trim(),
      type: formData.type,
      capacity: parseFloat(formData.capacity),
      odometer: parseFloat(formData.odometer),
      acquisitionCost: parseFloat(formData.acquisitionCost),
      status: formData.status
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header controls */}
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
            {isEdit ? "Edit Vehicle Details" : "Register New Fleet Vehicle"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Provide specs and acquisition statistics to register fleet assets
          </p>
        </div>
      </div>

      {/* Main card form container */}
      <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-6 rounded-2xl shadow-xs max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Registration number */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="regNumber" className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">
                Registration Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="regNumber"
                name="regNumber"
                value={formData.regNumber}
                onChange={handleChange}
                placeholder="e.g. TRK-102"
                className={`w-full px-3 py-2 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200
                  ${errors.regNumber ? "border-rose-450 dark:border-rose-800/65" : "border-slate-200 dark:border-slate-800"}
                `}
              />
              {errors.regNumber && (
                <p className="text-xs text-rose-550 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.regNumber}</span>
                </p>
              )}
            </div>

            {/* 2. Vehicle Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">
                Vehicle Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Volvo FH16 Globetrotter"
                className={`w-full px-3 py-2 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200
                  ${errors.name ? "border-rose-450 dark:border-rose-800/65" : "border-slate-200 dark:border-slate-800"}
                `}
              />
              {errors.name && (
                <p className="text-xs text-rose-550 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* 3. Vehicle Type */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="type" className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">
                Vehicle Type <span className="text-rose-500">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer"
              >
                <option value="Heavy Truck">Heavy Truck</option>
                <option value="Light Truck">Light Truck</option>
                <option value="Cargo Van">Cargo Van</option>
                <option value="EV Delivery Truck">EV Delivery Truck</option>
              </select>
            </div>

            {/* 4. Capacity */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="capacity" className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">
                Cargo Capacity (lbs) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="e.g. 15000"
                className={`w-full px-3 py-2 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200
                  ${errors.capacity ? "border-rose-450 dark:border-rose-800/65" : "border-slate-200 dark:border-slate-800"}
                `}
              />
              {errors.capacity && (
                <p className="text-xs text-rose-550 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.capacity}</span>
                </p>
              )}
            </div>

            {/* 5. Odometer */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="odometer" className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">
                Odometer Reading (mi) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                id="odometer"
                name="odometer"
                value={formData.odometer}
                onChange={handleChange}
                placeholder="e.g. 42000"
                className={`w-full px-3 py-2 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200
                  ${errors.odometer ? "border-rose-450 dark:border-rose-800/65" : "border-slate-200 dark:border-slate-800"}
                `}
              />
              {errors.odometer && (
                <p className="text-xs text-rose-550 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.odometer}</span>
                </p>
              )}
            </div>

            {/* 6. Acquisition Cost */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="acquisitionCost" className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">
                Acquisition Cost ($ USD) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                id="acquisitionCost"
                name="acquisitionCost"
                value={formData.acquisitionCost}
                onChange={handleChange}
                placeholder="e.g. 135000"
                className={`w-full px-3 py-2 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200
                  ${errors.acquisitionCost ? "border-rose-450 dark:border-rose-800/65" : "border-slate-200 dark:border-slate-800"}
                `}
              />
              {errors.acquisitionCost && (
                <p className="text-xs text-rose-550 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.acquisitionCost}</span>
                </p>
              )}
            </div>

            {/* 7. Status */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">
                Current Status
              </label>
              <div className="flex flex-wrap gap-2.5 mt-1">
                {["Available", "On Trip", "Maintenance", "Retired"].map((statusOption) => (
                  <button
                    key={statusOption}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, status: statusOption }))}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-150
                      ${formData.status === statusOption
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/10"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/10 hover:bg-slate-100 dark:hover:bg-slate-850"
                      }
                    `}
                  >
                    {statusOption}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-5">
            <button
              onClick={onCancel}
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-250 dark:border-slate-750 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/10 transition-colors cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{isEdit ? "Update Vehicle" : "Register Vehicle"}</span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
