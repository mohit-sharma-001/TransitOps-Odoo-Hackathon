import { useLocation, Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Users,
  MapPin,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed
}) {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Vehicles", path: "/vehicles", icon: Truck },
    { name: "Drivers", path: "/drivers", icon: Users },
    { name: "Trips", path: "/trips", icon: MapPin },
    { name: "Maintenance", path: "/maintenance", icon: Wrench },
    { name: "Fuel Logs", path: "/fuel", icon: Fuel },
    { name: "Reports", path: "/reports", icon: BarChart3 },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex flex-col h-full bg-[#0d1527] text-slate-300 border-r border-slate-800/40 transition-all duration-300 ease-in-out transform md:translate-x-0 md:static
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        ${sidebarCollapsed ? "md:w-20" : "md:w-64"}
      `}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/40">
        <Link to="/dashboard" className="flex items-center gap-3 font-semibold text-white">
          {/* Brand Logo - clean energetic speed path */}
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/20 flex-shrink-0">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          {!sidebarCollapsed && (
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              TransitOps
            </span>
          )}
        </Link>

        {/* Mobile Close Button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-1.5 rounded-lg hover:bg-slate-850 text-slate-400 md:hidden transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/10" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                }
              `}
              title={sidebarCollapsed ? item.name : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="text-sm font-medium">{item.name}</span>}
              
              {/* Tooltip for collapsed state */}
              {sidebarCollapsed && (
                <div className="absolute left-16 z-50 hidden group-hover:block bg-slate-950 text-white text-xs px-2.5 py-1.5 rounded-md shadow-md whitespace-nowrap">
                  {item.name}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle (Desktop/Tablet) */}
      <div className="hidden md:flex px-3 py-2 border-t border-slate-800/30">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex items-center justify-center w-full py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-850 transition-colors"
          title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <div className="flex items-center gap-2 text-xs font-medium">
              <ChevronLeft className="h-5 w-5" />
              <span>Collapse Menu</span>
            </div>
          )}
        </button>
      </div>

      {/* Fleet Manager Profile Section */}
      <div className="p-3 border-t border-slate-800/40 bg-slate-950/20">
        <div className="flex items-center gap-3 p-1">
          {/* Avatar Container with Online Indicator */}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-semibold text-sm shadow-md">
              DJ
            </div>
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0d1527]" />
          </div>

          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Deepesh Joshi</p>
              <p className="text-xs text-slate-500 truncate">Fleet Manager</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}