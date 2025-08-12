import type { ReactElement } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Drivers from "./pages/Drivers";
import RoutesPage from "./pages/RoutesPage";
import Orders from "./pages/Orders";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
// import Dashboard from "./pages/Dashboard";
import SimulationPage from "./pages/SimulationPage";
import DashboardPage from "./pages/SimulationDashboard";

function PrivateRoute({ children }: { children: ReactElement }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/simulation" element={<PrivateRoute><SimulationPage /></PrivateRoute>} />
        <Route path="/drivers" element={<PrivateRoute><Drivers /></PrivateRoute>} />
        <Route path="/routes" element={<PrivateRoute><RoutesPage /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
