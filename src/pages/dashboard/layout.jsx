// React
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

// Redux
import { useSelector } from "react-redux";

// Components
import SidebarMenu from "../../components/sidebar/sidebar";

export default function DashboardLayout() {
  const currentTheme = useSelector(state => state.theme.currentTheme);

  return (
    <div className={`flex h-screen ${currentTheme === 'arya-blue' ? 'dark' : ''}`}>
      <SidebarMenu />
      <div className="flex-1 flex flex-col max-h-screen overflow-auto">
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
