// React
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Primereact
import { Card } from "primereact/card";
import { Button } from "primereact/button";


export default function Agendas() {

  /* PENDING CORRECT DASHBOARD MISTAKE (WRONG SCREEN) */
  const [agendas, setAgendas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching agendas
    const fetchAgendas = async () => {
      const mockAgendas = [
        { id: 1, title: "Agenda Proyecto 1", createdAt: "19/06/2023" },
        { id: 2, title: "Agenda Proyecto 2", createdAt: "19/06/2023" },
        { id: 3, title: "Agenda Proyecto 3", createdAt: "19/06/2023" },
      ];
      setAgendas(mockAgendas);
    };

    fetchAgendas();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Agendas</h1>
        <Button 
          label="Nueva Agenda" 
          icon="pi pi-plus" 
          className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200"
        />
      </div>

      <div className="space-y-4 max-w-4xl mx-auto">
        {agendas.map((agenda) => (
          <Card key={agenda.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-center p-6">
              <div className="text-center flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{agenda.title}</h3>
                <p className="text-sm text-gray-500">Creada el {agenda.createdAt}</p>
              </div>
              <Button
                label="Ver"
                icon="pi pi-eye"
                className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white font-medium px-3 py-1 text-sm rounded transition-colors duration-200 ml-4"
                onClick={() => navigate(`/agendas/${agenda.id}/activities`)}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
