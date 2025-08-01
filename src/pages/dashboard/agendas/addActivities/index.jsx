'use client'

// React
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Primereact
import { Calendar } from 'primereact/calendar';
import { Button } from "primereact/button";
        
// Services 
import taskService from "../../../../services/tasksService";

// Components
import AddActivityDialog from "../../../../components/dialogs/AddActivityDialog";

function AddActivitiesView() {
 
  // ----- Params -----
  const { agendaId } = useParams(); 

  // ----- States -----
  // Activities / Tasks
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Miscelaneous
  const [loading, setLoading] = useState(false) 
  const [showDialog, setShowDialog] = useState(false);

  if (loading) return <p>Cargando actividades...</p>;

  return (
    <div className="p-6 min-h-screen">
      <AddActivityDialog 
        visible={showDialog} 
        onHide={() => setShowDialog(false)}
        agendaId = {agendaId} 
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Añadir actividades para agenda {agendaId}</h1>
        <Button 
          label="Nueva actividad" 
          icon="pi pi-plus" 
          className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200"
          onClick={() => setShowDialog(true)}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between mt-10">
        <div className="scale-[1.3] origin-top-left rounded-lg">
          <Calendar
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.value)}
            inline
            showWeek
            className="w-[500px]"
          />
        </div>
        {/* Corregir: Se pone por debajo del calendar */}
        <div className="border p-4 rounded-lg w-[250px] shadow mt-4 m:mt-0">
          <h3 className="font-semibold text-gray-700 mb-2">
            {selectedDate.toLocaleDateString("es-MX", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </h3>
          <p className="text-gray-500 text-sm">No tienes actividades en esta fecha</p>
        </div>
      </div>

    </div>
  );
}

export default AddActivitiesView;
