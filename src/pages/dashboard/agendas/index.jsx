'use client'

// React
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Primereact
import { Card } from "primereact/card";
import { Button } from "primereact/button";
      
// Services
import agendaService from "../../../services/agendaService";

// Components
import AgendaDialog from "../../../components/dialogs/AgendaDialog";

export default function Agendas() {
  // ----- UseStates -----
  // Agendas
  const [agendas, setAgendas] = useState([]);
  const [selectedAgenda, setSelectedAgenda] = useState()

  // Miscelaneous
  const [loading, setLoading] = useState(false) 
  const [showDialog, setShowDialog] = useState(false);

  // Navigation
  const navigate = useNavigate();

  async function fetchAgendas() {
    try {
      setLoading(true);
      const requestResult = await agendaService.fetchAgendas()
      console.log(requestResult)
      setAgendas(requestResult || []);
    } catch (error) {
      console.error("Error cargando las tareas:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAgendas();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AgendaDialog 
        visible={showDialog} 
        onHide={() => setShowDialog(false)} 
        onAgendaSaved={fetchAgendas}
        agendaToEdit={selectedAgenda}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Agendas</h1>
        <Button 
          label="Nueva Agenda" 
          icon="pi pi-plus" 
          className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200"
          onClick={() => setShowDialog(true)}
        />
      </div>

      <div className="space-y-4 max-w-4xl mx-auto">
        {agendas.map((agenda) => (
          <Card key={agenda.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-center p-6">
              <div className="text-center flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{agenda.name}</h3>
                <p className="text-sm text-gray-500">Creada el {agenda.registerDate}</p>
              </div>
              <Button
                label="Edit"
                icon="pi pi-pencil"
                className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white font-medium px-3 py-1 text-sm rounded transition-colors duration-200 ml-4"
                onClick={() => {
                  setSelectedAgenda(agenda);
                  setShowDialog(true);
                }}
              />
              <Button
                label="Ver"
                icon="pi pi-eye"
                className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white font-medium px-3 py-1 text-sm rounded transition-colors duration-200 ml-4"
                onClick={() => navigate(`${agenda.id}/activities`)}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}