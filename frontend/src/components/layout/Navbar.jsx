import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, Bell, Calendar } from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";

export default function Navbar({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const dummyNotifications = [
    { id: 1, title: "Maintenance Alert", text: "Vehicle #TRK-102 due for service", time: "10m ago", read: false },
    { id: 2, title: "Trip Complete", text: "Trip #TRP-9482 marked finished", time: "1h ago", read: true },
    { id: 3, title: "Fuel Refill", text: "Driver Alex refueled Truck #TRK-105", time: "2h ago", read: true }
  ];

  return (
    <header className="h-16 border-b border-slate-200/80 dark:border-slate-800/40 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 z-30 transition-colors duration-200">
      
      {/* Left Section: Mobile Menu and Date */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-500 dark:text-slate-400 md:hidden transition-colors"
          aria-label="Open Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Current Date */}
        <div className="hidden sm:flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
          <Calendar className="h-4 w-4 text-blue-500" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Right Section: Actions and Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Search Input */}
        <div className={`relative hidden md:block transition-all duration-200 ${searchFocused ? "w-64" : "w-48"}`}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Quick search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-9 pr-3 py-1.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        {/* Search for mobile */}
        <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/85 text-slate-500 dark:text-slate-400 md:hidden transition-colors">
          <Search className="h-5 w-5" />
        </button>

        {/* Theme Toggle Component */}
        <ThemeToggle />

        {/* Notification Dropdown Container */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/85 text-slate-500 dark:text-slate-400 transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0b0f19]" />
          </button>

          {notificationsOpen && (
            <>
              {/* Backdrop to dismiss */}
              <div onClick={() => setNotificationsOpen(false)} className="fixed inset-0 z-40" />
              
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</span>
                  <span className="text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {dummyNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex gap-3 transition-colors ${
                        !notif.read ? "bg-blue-50/30 dark:bg-blue-900/10" : ""
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <p className={`text-xs font-semibold truncate ${notif.read ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-white"}`}>
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {notif.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Avatar Block */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 pl-2 border-l border-slate-200/80 dark:border-slate-800/40 hover:opacity-80 transition-opacity cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-semibold text-xs shadow-md">
              DJ
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-semibold text-slate-950 dark:text-slate-200 leading-none">Deepesh Joshi</p>
              <p className="text-[10px] text-slate-500 leading-none mt-1">Fleet Manager</p>
            </div>
          </button>

          {profileDropdownOpen && (
            <>
              {/* Backdrop */}
              <div onClick={() => setProfileDropdownOpen(false)} className="fixed inset-0 z-45" />

              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5">
                <Link
                  to="/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 3m0-3a3 3 0 110 6m0-6V9m0 6v2m0-2a2 2 0 100 3m0-3a3 3 0 110 6m-3-9h.01M2 12h.01M22 12h.01M4 12a8 8 0 018-8V2m8 10a8 8 0 01-8 8v2m-8-10a8 8 0 008 8v-2m8-10a8 8 0 00-8-8V4" />
                  </svg>
                  <span>Settings</span>
                </Link>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    localStorage.removeItem("isAuthenticated");
                    toast.success("Successfully logged out", {
                      style: { borderRadius: "12px", background: "#0d1527", color: "#fff" }
                    });
                    window.location.href = "/login";
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors text-left cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
}