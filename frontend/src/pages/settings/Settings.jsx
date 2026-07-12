import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Building2, Bell, Palette, Globe, Shield, Users, Database,
  Key, Monitor, Sun, Moon, ChevronRight, Save, Camera, Eye, EyeOff,
  Smartphone, Mail, MessageSquare, Lock, LogOut, Laptop, Clock,
  Check, AlertCircle, RefreshCw, Copy, Trash2, Plus, Info
} from "lucide-react";
import toast from "react-hot-toast";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "company", label: "Company", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "language", label: "Language", icon: Globe },
  { id: "security", label: "Security", icon: Shield },
  { id: "roles", label: "Roles & Permissions", icon: Users },
  { id: "backup", label: "Backup & Restore", icon: Database },
  { id: "api", label: "API Keys", icon: Key },
  { id: "system", label: "System Info", icon: Monitor }
];

/* ───── Reusable sub-components ───── */
const SectionCard = ({ title, description, children }) => (
  <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 p-5 md:p-6 rounded-2xl shadow-xs">
    {title && (
      <div className="mb-5">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</h3>
        {description && <p className="text-[11px] text-slate-400 mt-0.5">{description}</p>}
      </div>
    )}
    {children}
  </div>
);

const Field = ({ label, children, required }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
  </div>
);

const inputCls = "w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200";

const Toggle = ({ enabled, onToggle, label }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer ${enabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  </div>
);

const saveSetting = (msg) => toast.success(msg || "Settings saved", { style: { borderRadius: "12px", background: "#0d1527", color: "#fff" } });

/* ───── Tab Content Components ───── */
function ProfileTab() {
  return (
    <div className="space-y-6">
      <SectionCard title="Personal Information" description="Update your profile details visible to your team.">
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-100 dark:border-slate-800/60">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-lg font-bold shadow-md">JD</div>
            <button className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <Camera className="h-3 w-3 text-slate-500" />
            </button>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">John Doe</p>
            <p className="text-[11px] text-slate-400">Fleet Manager • Admin</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Full Name" required><input type="text" defaultValue="John Doe" className={inputCls} /></Field>
          <Field label="Email" required><input type="email" defaultValue="john.doe@transitops.com" className={inputCls} /></Field>
          <Field label="Phone"><input type="tel" defaultValue="(555) 100-2000" className={inputCls} /></Field>
          <Field label="Job Title"><input type="text" defaultValue="Fleet Manager" className={inputCls} /></Field>
          <Field label="Department"><input type="text" defaultValue="Operations" className={inputCls} /></Field>
          <Field label="Timezone">
            <select defaultValue="America/Chicago" className={`${inputCls} cursor-pointer`}>
              <option>America/New_York</option>
              <option>America/Chicago</option>
              <option>America/Denver</option>
              <option>America/Los_Angeles</option>
              <option>UTC</option>
            </select>
          </Field>
        </div>
        <div className="flex justify-end mt-5">
          <button onClick={() => saveSetting("Profile updated")} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm transition-colors cursor-pointer"><Save className="h-4 w-4" /> Save</button>
        </div>
      </SectionCard>
    </div>
  );
}

function CompanyTab() {
  return (
    <SectionCard title="Company Settings" description="Manage your organization's profile and fleet branding.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Company Name" required><input type="text" defaultValue="TransitOps Logistics Inc." className={inputCls} /></Field>
        <Field label="Industry"><input type="text" defaultValue="Fleet Management & Logistics" className={inputCls} /></Field>
        <Field label="Address"><input type="text" defaultValue="2100 Commerce St, Dallas, TX 75201" className={inputCls} /></Field>
        <Field label="Website"><input type="url" defaultValue="https://transitops.io" className={inputCls} /></Field>
        <Field label="Fleet Size"><input type="number" defaultValue={20} className={inputCls} /></Field>
        <Field label="Tax ID"><input type="text" defaultValue="EIN: 84-2957381" className={inputCls} /></Field>
      </div>
      <div className="flex justify-end mt-5">
        <button onClick={() => saveSetting("Company settings saved")} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm transition-colors cursor-pointer"><Save className="h-4 w-4" /> Save</button>
      </div>
    </SectionCard>
  );
}

function NotificationsTab() {
  const [email, setEmail] = useState({ tripUpdates: true, maintenance: true, fuel: false, reports: true, security: true });
  const [push, setPush] = useState({ tripUpdates: true, maintenance: true, fuel: true, reports: false, security: true });
  const [sms, setSms] = useState({ tripUpdates: false, maintenance: false, fuel: false, reports: false, security: true });

  const Section = ({ title, icon: Icon, state, setState }) => (
    <SectionCard title={title}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-blue-500" />
        <p className="text-xs text-slate-400">Configure which notifications you receive via {title.toLowerCase()}.</p>
      </div>
      <div className="space-y-1 divide-y divide-slate-50 dark:divide-slate-800/30">
        {Object.entries(state).map(([key, val]) => (
          <Toggle key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())} enabled={val} onToggle={() => setState((p) => ({ ...p, [key]: !p[key] }))} />
        ))}
      </div>
    </SectionCard>
  );

  return (
    <div className="space-y-6">
      <Section title="Email Notifications" icon={Mail} state={email} setState={setEmail} />
      <Section title="Push Notifications" icon={Smartphone} state={push} setState={setPush} />
      <Section title="SMS Notifications" icon={MessageSquare} state={sms} setState={setSms} />
      <div className="flex justify-end">
        <button onClick={() => saveSetting("Notification preferences saved")} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm transition-colors cursor-pointer"><Save className="h-4 w-4" /> Save Preferences</button>
      </div>
    </div>
  );
}

function AppearanceTab() {
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains("dark"));
  const [compactMode, setCompactMode] = useState(false);
  const [sidebarStyle, setSidebarStyle] = useState("default");
  const [accentColor, setAccentColor] = useState("#3b82f6");

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
    setDarkMode(!darkMode);
  };

  const colors = ["#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#ef4444", "#f59e0b", "#10b981", "#14b8a6"];

  return (
    <div className="space-y-6">
      <SectionCard title="Theme" description="Customize the visual appearance of your dashboard.">
        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="h-5 w-5 text-indigo-400" /> : <Sun className="h-5 w-5 text-amber-500" />}
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{darkMode ? "Dark Mode" : "Light Mode"}</p>
              <p className="text-[10px] text-slate-400">Switch between light and dark themes</p>
            </div>
          </div>
          <button onClick={toggleDark} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer ${darkMode ? "bg-blue-600" : "bg-slate-300"}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${darkMode ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
        <Toggle label="Compact Mode" enabled={compactMode} onToggle={() => setCompactMode(!compactMode)} />
      </SectionCard>

      <SectionCard title="Sidebar Style">
        <div className="flex gap-3">
          {["default", "compact", "floating"].map((s) => (
            <button key={s} onClick={() => setSidebarStyle(s)} className={`flex-1 p-3 rounded-xl border text-xs font-semibold text-center capitalize cursor-pointer transition-all ${sidebarStyle === s ? "bg-blue-600 border-blue-600 text-white shadow-sm" : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
              {s}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Accent Color" description="Choose your primary UI accent color.">
        <div className="flex flex-wrap gap-3">
          {colors.map((c) => (
            <button key={c} onClick={() => { setAccentColor(c); saveSetting("Accent color updated"); }} className={`w-9 h-9 rounded-xl cursor-pointer transition-all duration-150 hover:scale-110 ${accentColor === c ? "ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-950" : ""}`} style={{ backgroundColor: c }} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function LanguageTab() {
  const [lang, setLang] = useState("en");
  const languages = [
    { code: "en", name: "English (US)", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" }
  ];

  return (
    <SectionCard title="Language & Region" description="Set your preferred language and regional formats.">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {languages.map((l) => (
          <button key={l.code} onClick={() => { setLang(l.code); saveSetting(`Language set to ${l.name}`); }} className={`flex items-center gap-3 p-3 rounded-xl border text-left cursor-pointer transition-all ${lang === l.code ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 ring-1 ring-blue-500/20" : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
            <span className="text-xl">{l.flag}</span>
            <div>
              <p className={`text-xs font-bold ${lang === l.code ? "text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"}`}>{l.name}</p>
              <p className="text-[10px] text-slate-400 uppercase">{l.code}</p>
            </div>
            {lang === l.code && <Check className="h-4 w-4 text-blue-500 ml-auto" />}
          </button>
        ))}
      </div>
    </SectionCard>
  );
}

function SecurityTab() {
  const [showPw, setShowPw] = useState(false);
  const [twoFa, setTwoFa] = useState(false);

  const sessions = [
    { device: "MacBook Pro — Chrome", location: "Dallas, TX", time: "Active now", current: true },
    { device: "iPhone 15 — Safari", location: "Dallas, TX", time: "2 hours ago", current: false },
    { device: "Windows PC — Edge", location: "Chicago, IL", time: "3 days ago", current: false }
  ];

  const loginHistory = [
    { date: "Jul 12, 2026 09:15 AM", ip: "192.168.1.42", device: "Chrome / macOS", status: "Success" },
    { date: "Jul 11, 2026 08:30 AM", ip: "192.168.1.42", device: "Chrome / macOS", status: "Success" },
    { date: "Jul 10, 2026 11:45 PM", ip: "10.0.0.15", device: "Safari / iOS", status: "Success" },
    { date: "Jul 09, 2026 03:22 AM", ip: "45.33.21.8", device: "Unknown", status: "Failed" }
  ];

  return (
    <div className="space-y-6">
      <SectionCard title="Change Password" description="Update your account password. Use a strong combination.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-lg">
          <Field label="Current Password" required>
            <div className="relative">
              <input type={showPw ? "text" : "password"} placeholder="••••••••" className={inputCls} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"><Eye className={`h-4 w-4 ${showPw ? "hidden" : ""}`} /><EyeOff className={`h-4 w-4 ${showPw ? "" : "hidden"}`} /></button>
            </div>
          </Field>
          <div />
          <Field label="New Password" required><input type="password" placeholder="••••••••" className={inputCls} /></Field>
          <Field label="Confirm Password" required><input type="password" placeholder="••••••••" className={inputCls} /></Field>
        </div>
        <div className="flex justify-end mt-5">
          <button onClick={() => saveSetting("Password updated")} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm transition-colors cursor-pointer"><Lock className="h-4 w-4" /> Update Password</button>
        </div>
      </SectionCard>

      <SectionCard title="Two-Factor Authentication" description="Add an extra layer of security to your account.">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${twoFa ? "bg-emerald-50 dark:bg-emerald-950/20" : "bg-slate-100 dark:bg-slate-800/40"}`}>
              <Shield className={`h-5 w-5 ${twoFa ? "text-emerald-500" : "text-slate-400"}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{twoFa ? "2FA Enabled" : "2FA Disabled"}</p>
              <p className="text-[10px] text-slate-400">Authenticator app or SMS verification</p>
            </div>
          </div>
          <button onClick={() => { setTwoFa(!twoFa); saveSetting(twoFa ? "2FA disabled" : "2FA enabled"); }} className={`px-3.5 py-2 text-xs font-semibold rounded-xl border cursor-pointer transition-colors ${twoFa ? "border-rose-200 dark:border-rose-800/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20" : "border-emerald-200 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"}`}>
            {twoFa ? "Disable" : "Enable"}
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Active Sessions">
        <div className="space-y-3">
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-slate-100 dark:border-slate-800/50">
              <div className="flex items-center gap-3">
                <Laptop className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{s.device}</p>
                  <p className="text-[10px] text-slate-400">{s.location} • {s.time}</p>
                </div>
              </div>
              {s.current ? (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md">This device</span>
              ) : (
                <button onClick={() => saveSetting("Session revoked")} className="text-[10px] font-semibold text-rose-500 hover:text-rose-700 cursor-pointer">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Login History">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/60">
                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-2">Date</th>
                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-2">IP Address</th>
                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-2">Device</th>
                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/30">
              {loginHistory.map((l, i) => (
                <tr key={i}>
                  <td className="py-2 text-xs text-slate-600 dark:text-slate-400">{l.date}</td>
                  <td className="py-2 text-xs text-slate-500 font-mono">{l.ip}</td>
                  <td className="py-2 text-xs text-slate-500">{l.device}</td>
                  <td className="py-2"><span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${l.status === "Success" ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400" : "text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400"}`}>{l.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

function RolesTab() {
  const roles = [
    { name: "Admin", users: 2, permissions: "Full access", color: "text-rose-500 bg-rose-50 dark:bg-rose-950/20" },
    { name: "Fleet Manager", users: 4, permissions: "Vehicles, Drivers, Trips, Reports", color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20" },
    { name: "Dispatcher", users: 6, permissions: "Trips, Drivers", color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20" },
    { name: "Mechanic", users: 5, permissions: "Maintenance, Vehicles", color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" },
    { name: "Viewer", users: 8, permissions: "Read-only access", color: "text-slate-500 bg-slate-100 dark:bg-slate-800/40" }
  ];

  return (
    <SectionCard title="Roles & Permissions" description="Manage access control levels for your team.">
      <div className="space-y-3">
        {roles.map((r) => (
          <div key={r.name} className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-slate-100 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${r.color}`}><Shield className="h-4 w-4" /></div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{r.name}</p>
                <p className="text-[10px] text-slate-400">{r.permissions}</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800/40 px-2 py-0.5 rounded-md">{r.users} users</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function BackupTab() {
  const backups = [
    { date: "Jul 12, 2026 — 02:00 AM", size: "248 MB", type: "Automatic", status: "Completed" },
    { date: "Jul 11, 2026 — 02:00 AM", size: "245 MB", type: "Automatic", status: "Completed" },
    { date: "Jul 10, 2026 — 11:30 AM", size: "242 MB", type: "Manual", status: "Completed" },
    { date: "Jul 09, 2026 — 02:00 AM", size: "240 MB", type: "Automatic", status: "Failed" }
  ];

  return (
    <div className="space-y-6">
      <SectionCard title="Backup & Restore" description="Manage automatic backups and restore data snapshots.">
        <div className="flex flex-wrap gap-3 mb-5">
          <button onClick={() => saveSetting("Manual backup started")} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm transition-colors cursor-pointer"><Database className="h-3.5 w-3.5" /> Create Backup</button>
          <button onClick={() => saveSetting("Restore initiated")} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"><RefreshCw className="h-3.5 w-3.5" /> Restore</button>
        </div>
        <div className="space-y-2">
          {backups.map((b, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-slate-100 dark:border-slate-800/50">
              <div className="flex items-center gap-3">
                <Database className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{b.date}</p>
                  <p className="text-[10px] text-slate-400">{b.size} • {b.type}</p>
                </div>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${b.status === "Completed" ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400" : "text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400"}`}>{b.status}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function ApiKeysTab() {
  const keys = [
    { name: "Production API Key", key: "tok_live_Xk9s...m4Qz", created: "Jun 15, 2026", lastUsed: "2 mins ago", status: "Active" },
    { name: "Staging API Key", key: "tok_test_Rj7w...p3Hn", created: "May 22, 2026", lastUsed: "3 days ago", status: "Active" },
    { name: "Legacy Key (deprecated)", key: "tok_old_Yp2d...k8Fm", created: "Jan 10, 2026", lastUsed: "Never", status: "Revoked" }
  ];

  return (
    <SectionCard title="API Keys" description="Manage API keys for external integrations and automation.">
      <button onClick={() => saveSetting("New API key generated")} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm transition-colors cursor-pointer mb-4"><Plus className="h-3.5 w-3.5" /> Generate New Key</button>
      <div className="space-y-3">
        {keys.map((k, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center gap-3 min-w-0">
              <Key className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{k.name}</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">{k.key}</p>
                <p className="text-[10px] text-slate-400">Created {k.created} • Last used {k.lastUsed}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${k.status === "Active" ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400" : "text-slate-500 bg-slate-100 dark:bg-slate-800/40"}`}>{k.status}</span>
              {k.status === "Active" && <>
                <button onClick={() => saveSetting("Key copied")} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"><Copy className="h-3.5 w-3.5" /></button>
                <button onClick={() => saveSetting("Key revoked")} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500 cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
              </>}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function SystemInfoTab() {
  const info = [
    { label: "Application", value: "TransitOps v2.4.0" },
    { label: "Environment", value: "Production" },
    { label: "Build", value: "2026.07.12-r287" },
    { label: "React", value: "19.1.0" },
    { label: "Vite", value: "8.1.4" },
    { label: "Node.js", value: "22.16.0" },
    { label: "Database", value: "PostgreSQL 16.3" },
    { label: "Uptime", value: "47 days 12 hours" },
    { label: "Last Deploy", value: "Jul 12, 2026 02:30 AM" },
    { label: "License", value: "Enterprise — Active" }
  ];

  return (
    <SectionCard title="System Information" description="Platform version, build details, and runtime environment.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {info.map((item) => (
          <div key={item.label} className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-slate-100 dark:border-slate-800/50">
            <span className="text-xs text-slate-500 dark:text-slate-400">{item.label}</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.value}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

/* ───── Main Settings Page ───── */
export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabComponents = {
    profile: ProfileTab,
    company: CompanyTab,
    notifications: NotificationsTab,
    appearance: AppearanceTab,
    language: LanguageTab,
    security: SecurityTab,
    roles: RolesTab,
    backup: BackupTab,
    api: ApiKeysTab,
    system: SystemInfoTab
  };

  const ActiveComponent = tabComponents[activeTab];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">Configure your TransitOps fleet management platform.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <nav className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 rounded-2xl shadow-xs p-2 space-y-0.5 lg:sticky lg:top-4">
            <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer w-full text-left ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-blue-500" : "text-slate-400"}`} />
                    <span className="hidden lg:inline">{tab.label}</span>
                    {isActive && <ChevronRight className="h-3 w-3 ml-auto hidden lg:block" />}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
