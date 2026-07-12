import { useState, useEffect } from "react";
import { ArrowLeft, Save, X, AlertCircle, Camera } from "lucide-react";
import { motion } from "framer-motion";

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

export default function DriverForm({ driver, onSave, onCancel }) {
  const isEdit = !!driver;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    dateOfBirth: "",
    licenseNumber: "",
    licenseExpiry: "",
    assignedVehicle: "",
    experience: "",
    status: "Available",
    notes: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (driver) {
      setFormData({
        name: driver.name || "",
        phone: driver.phone || "",
        email: driver.email || "",
        address: driver.address || "",
        dateOfBirth: driver.dateOfBirth || "",
        licenseNumber: driver.licenseNumber || "",
        licenseExpiry: driver.licenseExpiry || "",
        assignedVehicle: driver.assignedVehicle || "",
        experience: driver.experience?.toString() || "",
        status: driver.status || "Available",
        notes: driver.notes || ""
      });
    }
  }, [driver]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "License number is required";
    if (!formData.licenseExpiry.trim()) newErrors.licenseExpiry = "License expiry is required";
    if (!formData.experience || isNaN(formData.experience) || Number(formData.experience) < 0) {
      newErrors.experience = "Valid experience (years) is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: driver ? driver.id : Date.now(),
      driverId: driver ? driver.driverId : `DRV-${(4000 + Math.floor(Math.random() * 999))}`,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      dateOfBirth: formData.dateOfBirth,
      licenseNumber: formData.licenseNumber.trim(),
      licenseExpiry: formData.licenseExpiry,
      assignedVehicle: formData.assignedVehicle,
      experience: Number(formData.experience),
      rating: driver ? driver.rating : 4.5,
      status: formData.status,
      notes: formData.notes.trim(),
      totalTrips: driver?.totalTrips || 0,
      totalDistance: driver?.totalDistance || 0,
      deliveriesCompleted: driver?.deliveriesCompleted || 0,
      fuelEfficiency: driver?.fuelEfficiency || 7.5,
      safetyScore: driver?.safetyScore || 90,
      lateDeliveries: driver?.lateDeliveries || 0
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
            {isEdit ? "Edit Driver Record" : "Register New Driver"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isEdit ? "Update driver profile, credentials, and assignment details" : "Add a new CDL-certified driver to the fleet roster"}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-6 rounded-2xl shadow-xs max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload Placeholder */}
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-lg font-bold shadow-md">
                {formData.name ? formData.name.split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "?"}
              </div>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Camera className="h-3 w-3 text-slate-500" />
              </button>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{isEdit ? "Update Photo" : "Upload Photo"}</p>
              <p className="text-[10px] text-slate-400">JPG, PNG up to 5MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Alex Rivera" className={inputClass("name")} />
              {errors.name && <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" /> {errors.name}</p>}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Phone <span className="text-rose-500">*</span>
              </label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="(555) 123-4567" className={inputClass("phone")} />
              {errors.phone && <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" /> {errors.phone}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Email <span className="text-rose-500">*</span>
              </label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="alex@transitops.com" className={inputClass("email")} />
              {errors.email && <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" /> {errors.email}</p>}
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="address" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Address</label>
              <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="742 Freight Ln, Dallas, TX" className={inputClass("address")} />
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="dateOfBirth" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Date of Birth</label>
              <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={`${inputClass("dateOfBirth")} cursor-pointer`} />
            </div>

            {/* License Number */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="licenseNumber" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                License Number <span className="text-rose-500">*</span>
              </label>
              <input type="text" id="licenseNumber" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="CDL-A-2847591" className={inputClass("licenseNumber")} />
              {errors.licenseNumber && <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" /> {errors.licenseNumber}</p>}
            </div>

            {/* License Expiry */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="licenseExpiry" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                License Expiry <span className="text-rose-500">*</span>
              </label>
              <input type="text" id="licenseExpiry" name="licenseExpiry" value={formData.licenseExpiry} onChange={handleChange} placeholder="Dec 2027" className={inputClass("licenseExpiry")} />
              {errors.licenseExpiry && <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" /> {errors.licenseExpiry}</p>}
            </div>

            {/* Vehicle Assignment */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="assignedVehicle" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Vehicle Assignment</label>
              <select id="assignedVehicle" name="assignedVehicle" value={formData.assignedVehicle} onChange={handleChange} className={`${inputClass("assignedVehicle")} cursor-pointer`}>
                <option value="">Unassigned</option>
                {availableVehicles.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            {/* Experience */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="experience" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Experience (Years) <span className="text-rose-500">*</span>
              </label>
              <input type="number" id="experience" name="experience" min="0" max="50" value={formData.experience} onChange={handleChange} placeholder="6" className={inputClass("experience")} />
              {errors.experience && <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" /> {errors.experience}</p>}
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Current Status</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {["Available", "Driving", "On Leave", "Offline"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, status: s }))}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-150
                      ${formData.status === s
                        ? s === "Available"
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                          : s === "Driving"
                          ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                          : s === "On Leave"
                          ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                          : "bg-slate-600 border-slate-600 text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/10 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes - Full Width */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="notes" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Notes</label>
              <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={handleChange} placeholder="Certifications, endorsements, special qualifications..." className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-5">
            <button onClick={onCancel} type="button" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button type="submit" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/10 transition-colors cursor-pointer">
              <Save className="h-4 w-4" />
              <span>{isEdit ? "Update Driver" : "Register Driver"}</span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
