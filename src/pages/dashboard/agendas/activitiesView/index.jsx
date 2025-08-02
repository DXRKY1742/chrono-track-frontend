'use client'

// React
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Redux
import { useSelector } from "react-redux";

// PrimeReact
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

// Services 
import agendaService from "../../../../services/agendaService";

// Components
import ActivityDialog from "../../../../components/dialogs/ActivityDialog";

function ActivitiesView() {
  // ----- Params -----
  const { agendaId } = useParams(); 

  // ----- Theme -----
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  const isDark = currentTheme === "arya-blue";

  // ----- States -----
  const [completedActivities, setCompletedActivities] = useState([]);
  const [pendingActivities, setPendingActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndexPending, setPageIndexPending] = useState(0);
  const [pageIndexCompleted, setPageIndexCompleted] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  // Miscelaneous
  const [showDialog, setShowDialog] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const navigate = useNavigate();

  // Column definitions
  const completedActivitiesColumns = [
    { field: "id", header: "ID" },
    { field: "title", header: "Nombre" },
    { field: "description", header: "Categoría" },
    { field: "completedDate", header: "Fecha completada" }
  ];

  const pendingActivitiesColumns = [
    { field: "id", header: "ID" },
    { field: "title", header: "Nombre" },
    { field: "description", header: "Categoría" },
    { field: "desiredDate", header: "Fecha límite" }
  ];

  // ----- Effects -----
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks(){
    try {
      setLoading(true);
      const res = await agendaService.fetchTasksByAgendaId(agendaId);
      console.log(res);
      const pending = []
      const completed = []
      res.forEach(item => {
        if(item.state == 'c'){
          completed.push(item)
        } else {
          pending.push(item)
        }
      });
      setCompletedActivities(completed);
      setPendingActivities(pending)
    } catch (error) {
      console.error("Error cargando las agendas:", error);
    } finally {
      setLoading(false);
    }
  }
  // ----- Row click handler -----
  function handleRowClick(activity) {
    setSelectedActivity(activity);
    setShowDialog(true);
  }

  function reloadActivities(){}

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Cargando actividades...</p>
      </div>
    );
  }

 return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <ActivityDialog 
        visible={showDialog} 
        onHide={() => {
          setShowDialog(false);
          setSelectedActivity(null);
        }} 
        onActivitySaved = {reloadActivities}
        activityToEdit = {selectedActivity}
      />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Agenda {agendaId}</h1>
        <button 
          className={`${isDark 
            ? "bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600" 
            : "bg-[#2979FF] hover:bg-blue-700 border border-blue-600 hover:border-blue-700"} 
            text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200`
          }
          onClick={() => navigate(`create`)}
        >
          <i className="pi pi-plus" />
          Administrar actividades
        </button>
      </div>

      {/* Tabla de actividades pendientes */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Actividades pendientes</h2>
        <div className="rounded-lg overflow-hidden border shadow">
          <DataTable
            value={pendingActivities.slice(pageIndexPending * pageSize, (pageIndexPending + 1) * pageSize)}
            className="w-full text-m"
            showGridlines
            size="medium"
            stripedRows
            onRowClick={(e) => handleRowClick(e.data)}
            paginator
            rows={pageSize}
            first={pageIndexPending * pageSize}
            totalRecords={pendingActivities.length}
            onPage={(e) => setPageIndexPending(e.page)}
            emptyMessage={
              <div className="text-center py-6">No hay actividades disponibles</div>
            }
          >
            {pendingActivitiesColumns.map(col => (
              <Column key={col.field} field={col.field} header={col.header} />
            ))}
          </DataTable>
        </div>
      </div>

      {/* Tabla de actividades completadas */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Actividades completadas</h2>
        <div className="rounded-lg overflow-hidden border border-gray-300 bg-white shadow">
          <DataTable
            value={completedActivities.slice(pageIndexCompleted * pageSize, (pageIndexCompleted + 1) * pageSize)}
            className="w-full text-m"
            showGridlines
            size="medium"
            stripedRows
            onRowClick={(e) => handleRowClick(e.data)}
            paginator
            rows={pageSize}
            first={pageIndexCompleted * pageSize}
            totalRecords={completedActivities.length}
            onPage={(e) => setPageIndexCompleted(e.page)}
            emptyMessage={
              <div className="text-center py-6">No hay actividades disponibles</div>
            }
          >
            {completedActivitiesColumns.map(col => (
              <Column key={col.field} field={col.field} header={col.header} />
            ))}
          </DataTable>
        </div>
      </div>
    </div>
  );
}

export default ActivitiesView;
