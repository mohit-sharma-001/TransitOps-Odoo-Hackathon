import { useState, useEffect } from "react";
import { ArrowLeft, Save, X, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import vehicleService from "../../services/vehicleService";
import toast from "react-hot-toast";

export default function FuelForm({ entry, onSave, onCancel }) {
  const isEdit = !!entry;

  const [formData, setFormData] = useState({
    vehicleId: "",
    liters: "",
    cost: "",
    date: new Date().toISOString().split("T")[0]
  });

  const [vehiclesList, setVehiclesList] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehicleService.getVehicles();
        setVehiclesList(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load vehicle list");
      } finally {
        setLoadingVehicles(false);
      }
    };
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (entry) {
      setFormData({
        vehicleId: entry.vehicleId || "",
        liters: entry.liters?.toString() || "",
        cost: entry.cost?.toString() || "",
        date: entry.date || new Date().toISOString().split("T")[0]
      });
    }
  }, [entry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.vehicleId) errs.vehicleId = "Vehicle is required";
    if (!formData.liters || isNaN(formData.liters) || Number(formData.liters) <= 0)
      errs.liters = "Valid liters quantity is required";
    if (!formData.cost || isNaN(formData.cost) || Number(formData.cost) <= 0)
      errs.cost = "Valid cost is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      vehicleId: parseInt(formData.vehicleId),
      liters: parseFloat(formData.liters),
      cost: parseFloat(formData.cost)
    });
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
      errors[field] ? "border-rose-450 dark:border-rose-800/60" : "border-slate-200 dark:border-slate-800"
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <button onClick={onCancel} type="button" className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Log Fuel Activity
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log fuel liters and cost to calculate fleet operating expenses.
          </p>
        </div>
      </div>

      <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-6 rounded-2xl shadow-xs max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Vehicle */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="vehicleId" className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">Vehicle <span className="text-rose-500">*</span></label>
              <select id="vehicleId" name="vehicleId" value={formData.vehicleId} onChange={handleChange} className={`${inputClass("vehicleId")} cursor-pointer`} disabled={loadingVehicles}>
                <option value="">{loadingVehicles ? "Loading vehicles..." : "Select vehicle..."}</option>
                {vehiclesList.map((v) => <option key={v.id} value={v.id}>{v.name} ({v.registrationNumber})</option>)}
              </select>
              {errors.vehicleId && <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" /> {errors.vehicleId}</p>}
            </div>

            {/* Liters */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="liters" className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">Quantity (Liters) <span className="text-rose-500">*</span></label>
              <input type="number" id="liters" name="liters" min="0" step="0.1" value={formData.liters} onChange={handleChange} placeholder="120" className={inputClass("liters")} />
              {errors.liters && <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" /> {errors.liters}</p>}
            </div>

            {/* Cost */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cost" className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">Total Cost ($) <span className="text-rose-500">*</span></label>
              <input type="number" id="cost" name="cost" min="0" step="0.01" value={formData.cost} onChange={handleChange} placeholder="312.50" className={inputClass("cost")} />
              {errors.cost && <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" /> {errors.cost}</p>}
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="date" className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">Date <span className="text-rose-500">*</span></label>
              <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className={`${inputClass("date")} cursor-pointer`} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-5">
            <button onClick={onCancel} type="button" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              <X className="h-4 w-4" /><span>Cancel</span>
            </button>
            <button type="submit" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/10 transition-colors cursor-pointer">
              <Save className="h-4 w-4" /><span>Log Entry</span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
