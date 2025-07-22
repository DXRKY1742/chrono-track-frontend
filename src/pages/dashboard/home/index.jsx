import React from "react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";

export default function Home() {

  /* Pending: 
      adjust card contents to be centered 
      flex-col on responsive (small, med screens)
  */
  const actividades = [
    "Reunión de equipo",
    "Desarrollo módulo X",
    "Revisión de código",
    "Planificación de sprint",
    "Llamada con cliente"
  ];

  const donutData = {
    labels: ['Completado', 'Pendiente', 'En progreso'],
    datasets: [
      {
        data: [50, 13, 20],
        backgroundColor: ['#4285F4', '#F4B400', '#0F9D58'],
        hoverBackgroundColor: ['#5C9DF6', '#FFD34E', '#33CC88'],
      }
    ]
  };

  const items = [
    { tipo: "chart", titulo: "Estadísticas" },
    { tipo: "actividades", titulo: "Actividades pendientes" },
    { tipo: "icon", titulo: "Ajustes", icon: "pi pi-user" },
    { tipo: "icon", titulo: "Agendas", icon: "pi pi-book" },
  ];

  const renderItem = (item) => (
    <div className="p-2">
      <Card className="bg-gray-200 rounded-2xl p-4 flex flex-col min-h-[300px] text-gray-700 shadow-none border-none">
        <div className="font-medium text-gray-600 mb-4 text-lg">{item.titulo}</div>
        <div className="flex-grow flex justify-center items-center">
          {item.tipo === "chart" && (
            <div className="max-w-[150px] max-h-[150px] w-full h-full">
              <Chart
                type="doughnut"
                data={donutData}
                options={{ plugins: { legend: { display: false } } }}
                style={{ width: "100px", height: "100px" }}
              />
            </div>
          )}
          {item.tipo === "actividades" && (
            <ul className="w-full list-none p-0 m-0">
              {actividades.map((actividad, idx) => (
                <li
                  key={idx}
                  className="border-b border-gray-300 py-1"
                >
                  {actividad}
                </li>
              ))}
            </ul>
          )}
          {item.tipo === "icon" && (
            <i className={`${item.icon} text-4xl text-gray-900`}></i>
          )}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="bg-white p-4 flex justify-center min-h-full min-w-full">
      <div className="grid grid-cols-2 gap-4 w-[1000px] h-[750px]">
        {items.map((item, idx) => (
          <React.Fragment key={idx}>{renderItem(item)}</React.Fragment>
        ))}
      </div>
    </div>
  );
}
