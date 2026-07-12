import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

import MainLayout from "./components/layout/MainLayout";

import Dashboard from "./pages/dashboard/Dashboard";
import VehicleList from "./pages/vehicles/VehicleList";
import DriverList from "./pages/drivers/DriverList";
import TripList from "./pages/trips/TripList";
import MaintenanceList from "./pages/maintenance/MaintenanceList";
import FuelLog from "./pages/fuel/FuelLog";
import FuelEfficiency from "./pages/reports/FuelEfficiency";
import Settings from "./pages/settings/Settings";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="vehicles" element={<VehicleList />} />
            <Route path="drivers" element={<DriverList />} />
            <Route path="trips" element={<TripList />} />
            <Route path="maintenance" element={<MaintenanceList />} />
            <Route path="fuel" element={<FuelLog />} />
            <Route path="reports" element={<FuelEfficiency />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;