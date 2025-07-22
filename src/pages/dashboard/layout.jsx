// React
import { Outlet } from "react-router-dom";

// Components
import SidebarMenu from "../../components/sidebar/sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen">
      <SidebarMenu />
      <div className="flex-1 flex flex-col max-h-screen overflow-auto">
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
