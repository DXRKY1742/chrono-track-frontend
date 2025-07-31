// React
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
//PRIMEREACT
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/saga-blue/theme.css';  
import 'primereact/resources/primereact.min.css';         
import 'primeicons/primeicons.css';  

// PAGES
import DashboardLayout from "./pages/dashboard/layout";
import GuestLayout from "./pages/guestOnly/layout";
import Home from "./pages/dashboard/home";
import Statistics from "./pages/dashboard/statistics";
import Agendas from "./pages/dashboard/agendas"
import Settings from "./pages/dashboard/settings"
import ActivitiesView from "./pages/dashboard/agendas/activitiesView";
import AddActivitiesView from "./pages/dashboard/agendas/addActivities";

import Login from "./pages/guestOnly/login";
import Register from "./pages/guestOnly/register";
import NotFound from "./pages/guestOnly/notFound";

// Guards
import RequireAuth from "./guards/RequireAuth";
import GuestOnlyGuard from "./guards/GuestOnlyGuard";
import AuthLoader from "./features/authLoader";


const isAuthenticated = () => {
  return false
};

export default function App() {
  return (
    <PrimeReactProvider>
      <BrowserRouter>
        <AuthLoader/>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated() ? (
                  <Navigate to="/dashboard/home" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            {/* Guest Routes */}
            <Route element={<GuestOnlyGuard />}>
              <Route element={<GuestLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
            </Route>
            {/* Dashboard Routes */}
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route path="home" element={<Home />} />
                <Route path="statistics" element={<Statistics />} />
                <Route path="agendas" element={<Agendas />} />
                <Route path="agendas/:agendaId/activities" element={<ActivitiesView />} />
                <Route path="agendas/:agendaId/activities/create" element={<AddActivitiesView />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
            {/* Not found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
      </BrowserRouter>
    </PrimeReactProvider>
  );
}
