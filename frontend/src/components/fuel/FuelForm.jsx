import { useState, useEffect } from "react";
import { ArrowLeft, Save, X, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const vehicles = [
  "Volvo FH16 (TRK-102)",
  "Scania R500 (TRK-105)",
  "Actros L (TRK-109)",
  "Cascadia (TRK-101)",
  "DAF XF (TRK-108)",
  "Ford Transit (VAN-201)",
  "Hino 268 (TRK-302)",
  "Tesla Semi (EV-401)"
];

const drivers = [
  "Alex Rivera",
  "Sarah Jenkins",
  "Marcus Brody",
  "David Miller",
  "Elena Rostova",
  "James Chen",
  "Priya Sharma",
  "Carlos Mendez"
];

const stations = [
  "Pilot Flying J — Dallas, TX",
  "Love's Travel Stop — Houston, TX",
  "TA Petro — Chicago, IL",
  "Sheetz — Philadelphia, PA",
  "Circle K — Phoenix, AZ",
  "Shell Fleet — Los Angeles, CA",
  "BP TruckStop — Miami, FL",
  "Supercharger Station — SF, CA"
];

export default function FuelForm({ entry, onSave, onCancel }) {
  const isEdit = !!entry;

  const [formData, setFormData] = useState({
    vehicle: "",
    driver: "",
    station: "",
    fuelType: "Diesel",
    quantity: "",
    cost: "",
    mileage: "",
    date: "",
    notes: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (entry) {
      setFormData({
        vehicle: entry.vehicle || "",
        driver: entry.driver || "",
        station: entry.station || "",
        fuelType: entry.fuelType || "Diesel",
        quantity: entry.quantity?.toString() || "",
        cost: entry.cost?.toString() || "",
        mileage: entry.mileage?.toString() || "",
        date: entry.date || "",
        notes: entry.notes || ""
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
    if (!formData.vehicle) errs.vehicle = "Vehicle is required";
    if (!formData.driver) errs.driver = "Driver is required";
    if (!formData.station) errs.station = "Fuel station is required";
    if (!formData.quantity || isNaN(formData.quantity) || Number(formData.quantity) <= 0)
      errs.quantity = "Valid quantity is required";
    if (!formData.cost || isNaN(formData.cost) || Number(formData.cost) <= 0)
      errs.cost = "Valid cost is required";
    if (!formData.mileage || isNaN(formData.mileage) || Number(formData.mileage) <= 0)
      errs.mileage = "Valid odometer reading is required";
    if (!formData.date) errs.date = "Date is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      id: entry ? entry.id : Date.now(),
      logId: entry ? entry.logId : `FUEL-${(7000 + Math.floor(Math.random() * 999))}`,
      vehicle: formData.vehicle,
      driver: formData.driver,
      station: formData.station,
      fuelType: formData.fuelType,
      quantity: Number(formData.quantity),
      cost: Number(formData.cost),
      mileage: Number(formData.mileage),
      date: formData.date,
      notes: formData.notes.trim()
    });
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
      errors[field] ? "border-rose-400 dark:border-rose-800/60" : "border-slate-200 dark:border-slate-800"
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
            {isEdit ? "Edit Fuel Entry" : "Log Fuel Entry"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isEdit ? "Update fuel transaction details" : "Record a new fuel fill-up transaction for a fleet vehicle"}
          </p>
        </div>
      </div>

      <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-6 rounded-2xl shadow-xs max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Vehicle */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="vehicle" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Vehicle <span className="text-rose-500">*</span></label>
              <select id="vehicle" name="vehicle" value={formData.vehicle} onChange={handleChange} className={`${inputClass("vehicle")} cursor-pointer`}>
                <option value="">Select vehicle...</option>
                {vehicles.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
              {errors.vehicle && <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" /> {errors.vehicle}</p>}
            </div>

            {/* Driver */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="driver" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Driver <span className="text-rose-500">*</span></label>
              <select id="driver" name="driver" value={formData.driver} onChange={handleChange} className={`${inputClass("driver")} cursor-pointer`}>
                <option value="">Select driver...</option>
                {drivers.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.driver && <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" /> {errors.driver}</p>}
            </div>

            {/* Station */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="station" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Fuel Station <span className="text-rose-500">*</span></label>
              <select id="station" name="station" value={formData.station} onChange={handleChange} className={`${inputClass("station")} cursor-pointer`}>
                <option value="">Select station...</option>
                {stations.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.station && <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" /> {errors.station}</p>}
            </div>

            {/* Fuel Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Fuel Type</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {["Diesel", "Gasoline", "CNG", "Electric"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, fuelType: t }))}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-150
                      ${formData.fuelType === t
                        ? t === "Diesel" ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                        : t === "Gasoline" ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                        : t === "CNG" ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                        : "bg-violet-600 border-violet-600 text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/10 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="quantity" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Quantity (Gallons) <span className="text-rose-500">*</span></label>
              <input type="number" id="quantity" name="quantity" min="0" step="0.1" value={formData.quantity} onChange={handleChange} placeholder="85.5" className={inputClass("quantity")} />
              {errors.quantity && <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" /> {errors.quantity}</p>}
            </div>

            {/* Cost */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cost" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Total Cost ($) <span className="text-rose-500">*</span></label>
              <input type="number" id="cost" name="cost" min="0" step="0.01" value={formData.cost} onChange={handleChange} placeholder="312.50" className={inputClass("cost")} />
              {errors.cost && <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" /> {errors.cost}</p>}
            </div>

            {/* Mileage */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="mileage" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Odometer (Miles) <span className="text-rose-500">*</span></label>
              <input type="number" id="mileage" name="mileage" min="0" value={formData.mileage} onChange={handleChange} placeholder="82450" className={inputClass("mileage")} />
              {errors.mileage && <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" /> {errors.mileage}</p>}
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="date" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Fill-up Date <span className="text-rose-500">*</span></label>
              <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className={`${inputClass("date")} cursor-pointer`} />
              {errors.date && <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" /> {errors.date}</p>}
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="notes" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Notes</label>
              <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={handleChange} placeholder="Receipt number, pump number, DEF fluid added, discounts applied..." className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-5">
            <button onClick={onCancel} type="button" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              <X className="h-4 w-4" /><span>Cancel</span>
            </button>
            <button type="submit" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/10 transition-colors cursor-pointer">
              <Save className="h-4 w-4" /><span>{isEdit ? "Update Entry" : "Log Entry"}</span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
