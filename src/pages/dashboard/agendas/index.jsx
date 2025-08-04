'use client'

// React
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Redux
import { useSelector } from "react-redux";

// Primereact
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
      
// Services
import agendaService from "../../../services/agendaService";

// Components
import AgendaDialog from "../../../components/dialogs/AgendaDialog";
import { createToastService } from "../../../components/toasts/createToastService";

export default function Agendas() {
  // ----- Toast -----
  const toastRef = useRef(null);
  const toast = createToastService(toastRef);
  // ----- Theme -----
    const currentTheme = useSelector((state) => state.theme.currentTheme);
    const isDark = currentTheme === "arya-blue";
    const cardBgClass = isDark ? "bg-gray-900" : "bg-gray-200";

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
      setAgendas(requestResult || []);
    } catch (error) {
      toast.showError('Error: ', error)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAgendas();
  }, []);

  const handleDelete = async (agendaId) => {
    try {
      setLoading(true);
      await agendaService.deleteAgenda(agendaId);
      setAgendas((prev) => prev.filter((a) => a.id !== agendaId));
      fetchAgendas();
    } catch (error) {
      toast.showError('Error: ', error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <Toast ref={toastRef} />
      <AgendaDialog 
        visible={showDialog} 
        onHide={() => setShowDialog(false)} 
        onAgendaSaved={fetchAgendas}
        agendaToEdit={selectedAgenda}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agendas</h1>
        <Button 
          label="Nueva Agenda" 
          icon="pi pi-plus"
          className={`${isDark 
            ? "bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600" 
            : "bg-[#2979FF] hover:bg-blue-700 border border-blue-600 hover:border-blue-700"} 
            text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200`
          }
          onClick={() => setShowDialog(true)}
        />
      </div>

      <div className="space-y-4 max-w-4xl mx-auto">
        {agendas.map((agenda) => (
          <Card key={agenda.id} className={`${cardBgClass} rounded-lg shadow-sm border  hover:shadow-md transition-shadow duration-200"`}>
            <div className="flex justify-between items-center p-6">
              <div className="text-center flex-1">
                <h3 className="text-lg font-semibold  mb-1">{agenda.name}</h3>
                <p className="text-sm ">Creada el {agenda.registerDate}</p>
              </div>
              <Button
                label="Edit"
                icon="pi pi-pencil"
                className={`${isDark 
                  ? "bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600" 
                  : "bg-blue-600 hover:bg-blue-700 border border-blue-600 hover:border-blue-700"} 
                  text-white font-medium px-3 py-1 text-sm rounded transition-colors duration-200 ml-4`}
                onClick={() => {
                  setSelectedAgenda(agenda);
                  setShowDialog(true);
                }}
              />
              <Button
                label="Ver"
                icon="pi pi-eye"
                className={`${isDark 
                  ? "bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600" 
                  : "bg-blue-600 hover:bg-blue-700 border border-blue-600 hover:border-blue-700"} 
                  text-white font-medium px-3 py-1 text-sm rounded transition-colors duration-200 ml-4`}
                onClick={() => navigate(`${agenda.id}/activities`, {
                  state: { agendaId: agenda.id, agendaName: agenda.name }
                })}
              />
              <Button
                label="Borrar"
                icon="pi pi-trash"
                className={`${isDark 
                  ? "bg-red-700 hover:bg-red-800 border border-red-600 hover:border-red-700" 
                  : "bg-red-600 hover:bg-red-700 border border-red-600 hover:border-red-700"} 
                  text-white font-medium px-3 py-1 text-sm rounded transition-colors duration-200 ml-4`}
                onClick={() => handleDelete(agenda.id)}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
