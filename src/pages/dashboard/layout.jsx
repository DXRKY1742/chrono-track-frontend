
// React
import { Outlet } from "react-router-dom";

// Redux
import { Provider } from "react-redux";

// Components
import SidebarMenu from "../../components/sidebar/sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex">
      <SidebarMenu />
      <div className="flex-1">
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
