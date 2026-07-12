import { useState, useEffect } from "react";
import { ArrowLeft, Save, X, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import vehicleService from "../../services/vehicleService";
import toast from "react-hot-toast";

const serviceTypes = [
  "Oil Change",
  "Brake Service",
  "Tire Rotation",
  "Engine Repair",
  "Transmission Service",
  "General Inspection",
  "Electrical Diagnostics",
  "Coolant Flush",
  "Air Filter Replacement",
  "Suspension Repair"
];

export default function MaintenanceForm({ record, onSave, onCancel }) {
  const isEdit = !!record;

  const [formData, setFormData] = useState({
    vehicleId: "",
    serviceType: "Oil Change",
    cost: "",
    notes: ""
  });

  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await vehicleService.getVehicles();
        setVehicles(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load vehicle list");
      } finally {
        setLoadingVehicles(false);
      }
    };
    loadVehicles();
  }, []);

  useEffect(() => {
    if (record) {
      setFormData({
        vehicleId: record.vehicleId || "",
        serviceType: record.serviceType || "Oil Change",
        cost: record.cost?.toString() || "",
        notes: record.notes || ""
      });
    }
  }, [record]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.vehicleId) newErrors.vehicleId = "Vehicle selection is required";
    if (!formData.serviceType) newErrors.serviceType = "Service type is required";
    if (!formData.cost || isNaN(formData.cost) || Number(formData.cost) <= 0) {
      newErrors.cost = "Valid cost is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      vehicleId: parseInt(formData.vehicleId),
      description: `${formData.serviceType}: ${formData.notes.trim()}`,
      cost: parseFloat(formData.cost)
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
        <button onClick={onCancel} type="button" className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Log Maintenance Activity
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log diagnostic status, parts cost, and details of vehicle maintenance.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-6 rounded-2xl shadow-xs max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Vehicle Select */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="vehicleId" className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">
                Vehicle <span className="text-rose-500">*</span>
              </label>
              <select 
                id="vehicleId" 
                name="vehicleId" 
                value={formData.vehicleId} 
                onChange={handleChange} 
                disabled={loadingVehicles} 
                className={`${inputClass("vehicleId")} cursor-pointer`}
              >
                <option value="">{loadingVehicles ? "Loading vehicles..." : "Select a vehicle..."}</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>{v.name} ({v.registrationNumber})</option>
                ))}
              </select>
              {errors.vehicleId && <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" /> {errors.vehicleId}</p>}
            </div>

            {/* Service Type */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="serviceType" className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">
                Service Type <span className="text-rose-500">*</span>
              </label>
              <select id="serviceType" name="serviceType" value={formData.serviceType} onChange={handleChange} className={`${inputClass("serviceType")} cursor-pointer`}>
                {serviceTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Cost */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cost" className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">
                Cost ($) <span className="text-rose-500">*</span>
              </label>
              <input type="number" id="cost" name="cost" min="0" step="0.01" value={formData.cost} onChange={handleChange} placeholder="450" className={inputClass("cost")} />
              {errors.cost && <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" /> {errors.cost}</p>}
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="notes" className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">Work Details / Notes</label>
              <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={handleChange} placeholder="Enter service notes, replaced parts, or diagnostics..." className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none" />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-5">
            <button onClick={onCancel} type="button" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button type="submit" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/10 transition-colors cursor-pointer">
              <Save className="h-4 w-4" />
              <span>Save Record</span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
