import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import JobsPage from "./pages/JobsPage";
import EquipmentPage from "./pages/EquipmentPage";
import CustomersPage from "./pages/CustomersPage";
import PricingPage from "./pages/PricingPage";
import CompliancePage from "./pages/CompliancePage";
import AppLayout from "./components/layout/AppLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="equipment" element={<EquipmentPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="compliance" element={<CompliancePage />} />
      </Route>
    </Routes>
  );
}
