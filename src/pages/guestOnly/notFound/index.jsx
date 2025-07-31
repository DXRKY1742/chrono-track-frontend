// React
import { NavLink } from "react-router-dom";

// PrimeReact
import { Card } from "primereact/card";
import { Button } from "primereact/button";

// Redux
import { useSelector } from "react-redux";

export default function NotFound() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const target = isAuthenticated ? "/dashboard/home" : "/login";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card title="Solo una enorme cantidad de nada" className="w-full sm:w-96 text-center shadow-4 p-5 rounded-xl">
        <p className="mb-4">La página que buscas no existe o ha sido removida.</p>

        <NavLink to={target}>
          <Button
            label={isAuthenticated ? "Ir al dashboard" : "Volver al login"}
            icon="pi pi-arrow-left"
            className="p-button-rounded w-full"
          />
        </NavLink>
      </Card>
    </div>
  );
}
