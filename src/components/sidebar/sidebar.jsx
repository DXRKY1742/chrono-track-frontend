// React
import { React, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/authSlice";

// Primereact
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";

export default function SidebarMenu() {
  const currentTheme = useSelector(state => state.theme.currentTheme);
  const isDarkMode = currentTheme === 'arya-blue';

  const [visible, setVisible] = useState(false);

  const links = [
    { to: "/dashboard/home", icon: "pi pi-home", label: "Dashboard" },
    { to: "/dashboard/agendas", icon: "pi pi-calendar", label: "Agendas" },
    { to: "/dashboard/statistics", icon: "pi pi-chart-bar", label: "Estadísticas" },
    { to: "/dashboard/settings", icon: "pi pi-cog", label: "Ajustes" },
  ];

  return (
    <>
      <div className="lg:hidden p-2">
        <Button icon="pi pi-bars" onClick={() => setVisible(true)} />
      </div>
      <Sidebar
        visible={visible}
        onHide={() => setVisible(false)}
        style={{
          backgroundColor: isDarkMode ? '#1f2937' : '#2979FF',
          color: isDarkMode ? '#fff' : '#fff',
        }}
      >
        <SidebarContent links={links} isDarkMode={isDarkMode} />
      </Sidebar>
      <aside className={`hidden lg:flex flex-col w-64 h-screen border-r shadow-sm ${isDarkMode ? "bg-gray-900 text-white" : "bg-[#2979FF] text-white"}`}>
        <SidebarContent links={links} isDarkMode={isDarkMode} />
      </aside>
    </>
  );
}

function SidebarContent({ links, isDarkMode  }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header/logo */}
      <div className="p-4">
        <img src="../../../LogoWhite.png"></img>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-1 p-4 overflow-y-auto">
        {links.map(({ to, icon, label }) => (
          <div key={to}>
            <hr className="border-white/30 my-2" />
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded transition-all justify-center ${
                  isActive
                    ? isDarkMode
                      ? "bg-gray-700 text-white font-semibold"
                      : "bg-[#679dfc] text-[#133775] font-semibold"
                    : isDarkMode
                    ? "hover:bg-gray-800"
                    : "hover:bg-white/20"
                }`
              }
            >
              <i className={`${icon} text-lg`} />
              <span>{label}</span>
            </NavLink>

          </div>
        ))}
      </nav>
      <div className="mt-auto mb-2 p-4 flex justify-center">
        <Button
          label="Cerrar sesión"
          icon="pi pi-sign-out"
          iconPos="left"
          onClick={handleLogout}
          className={isDarkMode ? "p-button-secondary" : "p-button-text"}
          style={{ '--pi-button-icon-margin': '0 12px 0 0' }}
        />
      </div>
    </div>
  );
}
