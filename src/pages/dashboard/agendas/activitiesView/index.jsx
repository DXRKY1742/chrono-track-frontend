'use client'

// React
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Primereact
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
        
// Services 
import taskService from "../../../../services/tasksService";
import agendaService from "../../../../services/agendaService";

function ActivitiesView() {
  /* Pending:
        - Adding datatables for activities
        - Adding activity updator dialog
        - Styiling for datatables
  */  
      
  // ----- Params -----
  const { agendaId } = useParams(); 

  // ----- States -----
  // Activities / Tasks
  const [completedctivities, setCompletedActivities] = useState([]);
  const [pendingActivities, setPendingActivities] = useState([]);

  // Miscelaneous
  const [loading, setLoading] = useState(false);

  // Navigation
  const navigate = useNavigate();

  const completedActivitiesColumns = ["id", "nombre", "categoria", "fecha en que se completo"]
  const pendingActivitiesColumns = ["id", "nombre", "categoria", "fecha límite"]

  async function fetchTasks() {
      try {
        setLoading(true);
        const [pendingRes, progressRes] = await Promise.all([
          taskService.fetchAssignedCompleted(),
          taskService.fetchAssignedPending(),
        ]);
        setCompletedActivities(progressRes.data || []);
        setPendingActivities(pendingRes.data || []);
      } catch (error) {
        console.error("Error cargando las tareas:", error);
      } finally {
        setLoading(false);
      }
    }

  // UseEffects
   useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <p>Cargando actividades...</p>;

  return (
    
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Agenda {agendaId}</h1>
        <Button 
          label="Administrar actividades" 
          icon="pi pi-plus" 
          className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200"
          onClick={() => navigate(`create`)}
        />
      </div>
      
      {/* Ambos datatables con single rowselection flex-col w-full onRowClick(() => openActivityDialog(activity)) */}
      {/* Datatable 1 */}

      {/* Datatable 2 */}

    </div>
  );
}

export default ActivitiesView;
