import { useState, useEffect } from "react";
import { ArrowLeft, Save, X, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const availableVehicles = [
  { name: "Volvo FH16", reg: "TRK-102" },
  { name: "Scania R500", reg: "TRK-105" },
  { name: "Actros L", reg: "TRK-109" },
  { name: "Cascadia", reg: "TRK-101" },
  { name: "DAF XF", reg: "TRK-108" },
  { name: "Ford Transit", reg: "VAN-201" },
  { name: "Hino 268", reg: "TRK-302" },
  { name: "Tesla Semi", reg: "EV-401" }
];

const mechanics = [
  "Tony Morales",
  "Frank Peterson",
  "Linda Cho",
  "Robert Harris",
  "Diana Vasquez"
];

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
    vehicle: "",
    serviceType: "",
    mechanic: "",
    scheduledDate: "",
    completionDate: "",
    cost: "",
    priority: "Medium",
    status: "Scheduled",
    notes: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (record) {
      setFormData({
        vehicle: record.vehicle || "",
        serviceType: record.serviceType || "",
        mechanic: record.mechanic || "",
        scheduledDate: record.scheduledDate || "",
        completionDate: record.completionDate || "",
        cost: record.cost?.toString() || "",
        priority: record.priority || "Medium",
        status: record.status || "Scheduled",
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
    if (!formData.vehicle) newErrors.vehicle = "Vehicle selection is required";
    if (!formData.serviceType) newErrors.serviceType = "Service type is required";
    if (!formData.mechanic) newErrors.mechanic = "Mechanic assignment is required";
    if (!formData.scheduledDate) newErrors.scheduledDate = "Scheduled date is required";
    if (!formData.cost || isNaN(formData.cost) || Number(formData.cost) <= 0) {
      newErrors.cost = "Valid estimated cost is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedVehicle = availableVehicles.find(
      (v) => `${v.name} (${v.reg})` === formData.vehicle
    );

    onSave({
      id: record ? record.id : Date.now(),
      maintenanceId: record ? record.maintenanceId : `MNT-${(6000 + Math.floor(Math.random() * 999))}`,
      vehicle: formData.vehicle,
      regNumber: selectedVehicle ? selectedVehicle.reg : record?.regNumber || "N/A",
      serviceType: formData.serviceType,
      mechanic: formData.mechanic,
      scheduledDate: formData.scheduledDate,
      completionDate: formData.completionDate || null,
      cost: Number(formData.cost),
      priority: formData.priority,
      status: formData.status,
      notes: formData.notes.trim()
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
        <button onClick={onCancel} type="button" className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isEdit ? "Edit Service Record" : "Schedule Maintenance"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isEdit ? "Update service details, scheduling, and cost information" : "Create a new maintenance work order for a fleet vehicle"}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-6 rounded-2xl shadow-xs max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Vehicle */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="vehicle" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Vehicle <span className="text-rose-500">*</span>
              </label>
              <select id="vehicle" name="vehicle" value={formData.vehicle} onChange={handleChange} className={`${inputClass("vehicle")} cursor-pointer`}>
                <option value="">Select a vehicle...</option>
                {availableVehicles.map((v) => (
                  <option key={v.reg} value={`${v.name} (${v.reg})`}>{v.name} ({v.reg})</option>
                ))}
              </select>
              {errors.vehicle && <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" /> {errors.vehicle}</p>}
            </div>

            {/* Service Type */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="serviceType" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Service Type <span className="text-rose-500">*</span>
              </label>
              <select id="serviceType" name="serviceType" value={formData.serviceType} onChange={handleChange} className={`${inputClass("serviceType")} cursor-pointer`}>
                <option value="">Select service type...</option>
                {serviceTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.serviceType && <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" /> {errors.serviceType}</p>}
            </div>

            {/* Mechanic */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="mechanic" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Assigned Mechanic <span className="text-rose-500">*</span>
              </label>
              <select id="mechanic" name="mechanic" value={formData.mechanic} onChange={handleChange} className={`${inputClass("mechanic")} cursor-pointer`}>
                <option value="">Select a mechanic...</option>
                {mechanics.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              {errors.mechanic && <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" /> {errors.mechanic}</p>}
            </div>

            {/* Scheduled Date */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="scheduledDate" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Scheduled Date <span className="text-rose-500">*</span>
              </label>
              <input type="date" id="scheduledDate" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} className={`${inputClass("scheduledDate")} cursor-pointer`} />
              {errors.scheduledDate && <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" /> {errors.scheduledDate}</p>}
            </div>

            {/* Completion Date */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="completionDate" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Completion Date
              </label>
              <input type="date" id="completionDate" name="completionDate" value={formData.completionDate} onChange={handleChange} className={`${inputClass("completionDate")} cursor-pointer`} />
            </div>

            {/* Cost */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cost" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Estimated Cost ($) <span className="text-rose-500">*</span>
              </label>
              <input type="number" id="cost" name="cost" min="0" step="0.01" value={formData.cost} onChange={handleChange} placeholder="450" className={inputClass("cost")} />
              {errors.cost && <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" /> {errors.cost}</p>}
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Priority Level</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {["Low", "Medium", "High", "Critical"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, priority: p }))}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-150
                      ${formData.priority === p
                        ? p === "Critical" ? "bg-rose-600 border-rose-600 text-white shadow-sm"
                        : p === "High" ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                        : "bg-blue-600 border-blue-600 text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/10 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Status (edit mode) */}
            {isEdit && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Status</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {["Scheduled", "In Progress", "Completed", "Overdue", "Cancelled"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, status: s }))}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-150
                        ${formData.status === s
                          ? s === "Completed" ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                          : s === "Overdue" ? "bg-rose-600 border-rose-600 text-white shadow-sm"
                          : s === "Cancelled" ? "bg-slate-600 border-slate-600 text-white shadow-sm"
                          : "bg-blue-600 border-blue-600 text-white shadow-sm"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/10 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="notes" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Service Notes</label>
              <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={handleChange} placeholder="Describe the issue, requested service, or special instructions..." className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-5">
            <button onClick={onCancel} type="button" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              <X className="h-4 w-4" /><span>Cancel</span>
            </button>
            <button type="submit" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/10 transition-colors cursor-pointer">
              <Save className="h-4 w-4" /><span>{isEdit ? "Update Record" : "Schedule Service"}</span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
