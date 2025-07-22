// React
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Primereact
import { Card } from "primereact/card";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";


export default function Agendas() {

  /* 
  Pending:
    Redireccion a agendas/agendaId/activities 
    estilizado talwind css
  */
  const [agendas, setAgendas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching agendas
    const fetchAgendas = async () => {
      const mockAgendas = [
        { id: 1, descripcion: "Revisión del roadmap de Q3" },
        { id: 2, descripcion: "Preparación presentación cliente" },
        { id: 3, descripcion: "Seguimiento tareas equipo de diseño" },
      ];
      setAgendas(mockAgendas);
    };

    fetchAgendas();
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen text-gray-800">
      <h1 className="text-3xl font-semibold mb-4">Agendas</h1>

      <Card className="rounded-2xl shadow-md">
        <div className="flex justify-between items-center px-4 pt-4">
          <span className="text-xl font-medium">Tus Agendas</span>
          <Button label="Nueva Agenda" icon="pi pi-plus" />
        </div>

        <div className="p-4">
          <Accordion multiple>
            {agendas.map((agenda) => (
              <AccordionTab header={`Agenda #${agenda.id}`} key={agenda.id}>
                <p className="mb-4">{agenda.descripcion}</p>
                <div className="flex justify-center">
                  <Button
                    label="Ver Detalles"
                    icon="pi pi-arrow-right"
                    onClick={() => navigate(`/agenda/${agenda.id}`)}
                  />
                </div>
              </AccordionTab>
            ))}
          </Accordion>
        </div>
      </Card>
    </div>
  );
}
