'use client'

// React
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Primereact
import { Calendar } from 'primereact/calendar';
import { Button } from "primereact/button";
        
// Services 
import taskService from "../../../../services/tasksService";

function AddActivitiesView() {
  /* Pending:
        - Styiling (center calendar)
        - InitDate EndDate selector
        - ActivityDialog
  */  
 
  // ----- Params -----
  const { agendaId } = useParams(); 

  // ----- States -----
  // Activities / Tasks
  const [date, setDate] = useState(null);

  // Miscelaneous
  const [loading, setLoading] = useState(false) 
  const [showDialog, setShowDialog] = useState(false);

  /* Mis tasks tienen initDate y desired date entonces hay que poner un selector de fecha inicial y fecha final */

  if (loading) return <p>Cargando actividades...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* <ActivityDialog 
        visible={showDialog} 
        onHide={() => setShowDialog(false)}
        agendaId = {agendaId} 
      /> */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Añadir actividades para agenda {agendaId}</h1>
        <Button 
          label="Nueva actividad" 
          icon="pi pi-plus" 
          className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200"
          onClick={() => setShowDialog(true)}
        />
      </div>

      <div className="card flex justify-content-center">
          <Calendar value={date} onChange={(e) => setDate(e.value)} inline showWeek />
      </div>
    </div>
  );
}

export default AddActivitiesView;
