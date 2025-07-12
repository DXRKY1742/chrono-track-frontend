// React
import { React, useState } from "react";
import { NavLink } from "react-router-dom";
// Primereact
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";


export default function SidebarMenu() {
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
        className="lg:hidden bg-[#2979FF] text-white"
      >
        <SidebarContent links={links} />
      </Sidebar>
      <aside className="hidden lg:flex flex-col w-64 h-screen border-r shadow-sm bg-[#2979FF] text-white">
        <SidebarContent links={links} />
      </aside>
    </>
  );
}

function SidebarContent({ links }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header/logo */}
      <div className="p-4">
        <img src="../../../LogoWhite.png"></img>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-1 p-4 text-white overflow-y-auto">
        {links.map(({ to, icon, label }) => (
          <div key={to}>
            <hr className="border-white/30 my-2" />
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded transition-all justify-center ${
                  isActive
                    ? "bg-[#679dfc] text-[#133775] font-semibold"
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
    </div>
  );
}
