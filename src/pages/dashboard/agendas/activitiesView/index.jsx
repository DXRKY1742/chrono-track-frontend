'use client'

// React
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Primereact
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
        
// Services 
import taskService from "../../../../services/tasksService";
import agendaService from "../../../../services/agendaService";

function ActivitiesView() {
  // ----- Params -----
  const { agendaId } = useParams(); 

  // ----- States -----
  // Activities / Tasks
  const [completedctivities, setCompletedActivities] = useState([]);
  const [pendingActivities, setPendingActivities] = useState([]);

  // Miscelaneous
  const [loading, setLoading] = useState(false);

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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Agenda {agendaId}</h1>

      {/* Ambos datatables con single rowselection flex-col w-full onRowClick(() => openActivityDialog(activity)) */}
      {/* Datatable 1 */}

      {/* Datatable 2 */}

    </div>
  );
}

export default ActivitiesView;
