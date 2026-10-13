import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import GuestRoute from "../components/auth/GuestRoute";
import Home from "../pages/Home";
import Unauthorized from "../pages/Unauthorized";
import CitizenLogin from "../pages/citizen/CitizenLogin";
import CitizenRegister from "../pages/citizen/CitizenRegister";
import CitizenDashboard from "../pages/citizen/CitizenDashboard";
import OfficerLogin from "../pages/officer/OfficerLogin";
import OfficerDashboard from "../pages/officer/OfficerDashboard";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminOfficers from "../pages/admin/AdminOfficers";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<GuestRoute><Home /></GuestRoute>} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Login / register (signed-in users are redirected to their dashboard) */}
      <Route path="/citizen/login" element={<GuestRoute><CitizenLogin /></GuestRoute>} />
      <Route path="/citizen/register" element={<GuestRoute><CitizenRegister /></GuestRoute>} />
      <Route path="/officer/login" element={<GuestRoute><OfficerLogin /></GuestRoute>} />
      <Route path="/admin/login" element={<GuestRoute><AdminLogin /></GuestRoute>} />

      {/* Role-protected areas */}
      <Route element={<ProtectedRoute allowedRoles={["CITIZEN"]} />}>
        <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["OFFICER"]} />}>
        <Route path="/officer/dashboard" element={<OfficerDashboard />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/officers" element={<AdminOfficers />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
