'use client'

// React
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Redux
import { useSelector } from "react-redux";

// PrimeReact
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from "primereact/toast";

// Services 
import agendaService from "../../../../services/agendaService";

// Components
import ActivityDialog from "../../../../components/dialogs/ActivityDialog";
import CollaboratorDialog from "../../../../components/dialogs/CollaboratorDialog"
import {createToastService} from "../../../components/toast/createToastService";

function AgendaView() {
  // ----- Toast -----
  const toastRef = useRef(null);
  const toast = createToastService(toastRef);

  // ----- Params -----
  const location = useLocation();
  const { agendaId, agendaName } = location.state || {};

  // ----- Theme -----
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  const isDark = currentTheme === "arya-blue";

  // ----- States -----
  const [activeCollaborators, setActiveCollaborators] = useState([]);
  const [selectedCollaborator, setSelectedCollaborator] = useState();
  const [completedActivities, setCompletedActivities] = useState([]);
  const [pendingActivities, setPendingActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndexPending, setPageIndexPending] = useState(0);
  const [pageIndexCompleted, setPageIndexCompleted] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  // Miscelaneous
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showAddCollaboratorDialog, setShowAddCollaboratorDialog] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const navigate = useNavigate();

  // Column definitions
  const pendingActivitiesColumns = [
    { field: "title", header: "Nombre" },
    { field: "description", header: "Categoría" },
    { field: "userAssigned", header: "Responsable" },
    { field: "createdByUser", header: "Creador" },
    { header: "Prioridad", body: priorityBodyTemplate },
    { field: "desiredDate", header: "Fecha límite" }
  ];

  const completedActivitiesColumns = [
    { field: "title", header: "Nombre" },
    { field: "description", header: "Categoría" },
    { field: "userAssigned", header: "Responsable" },
    { field: "createdByUser", header: "Creador" },
    { header: "Prioridad", body: priorityBodyTemplate },
    { field: "completedDate", header: "Fecha completada" }
  ];

  function priorityBodyTemplate(rowData) {
    console.log("Prioridad:", rowData.prority);
    switch (rowData.prority) {
      case 'h': return 'Alta';
      case 'm': return 'Media';
      case 'l': return 'Baja';
      default: return '-';
    }
  }


  // ----- Effects -----
  useEffect(() => {
    fetchTasks();
    fetchCollaborators();
  }, []);

  async function fetchTasks(){
    try {
      setLoading(true);
      const res = await agendaService.fetchTasksByAgendaId(agendaId);
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
      toast.showError('Error: ', error)
    } finally {
      setLoading(false);
    }
  }
  async function fetchCollaborators(){
    try {
      setLoading(true);
      const res = await agendaService.fetchCollaboratorsByAgendaId(agendaId);
      setActiveCollaborators(res)
    } catch (error) {
      toast.showError('Error: ', error)
    } finally {
      setLoading(false);
    }
  }
  // ----- Row click handler -----
  function handleRowClick(activity) {
    if (activity.state== 'c') return;
    setSelectedActivity(activity);
    setShowActivityDialog(true);
  }

  function handleCollaboratorRowClick(collaborator) {
    setSelectedCollaborator(collaborator);
    setShowAddCollaboratorDialog(true);
  }

  function priorityBodyTemplate(rowData) {
    switch (rowData.priority) {
      case 'h': return 'Alta';
      case 'm': return 'Media';
      case 'l': return 'Baja';
      default: return '-';
    }
  }

  function openAddCollaboratorDialog(mode){
    setShowAddCollaboratorDialog(true)
  }
  function reloadActivities(){
    fetchTasks();
  }
 
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Cargando actividades...</p>
      </div>
    );
  }

 return (
    <div className="p-6 min-h-screen">
      <Toast ref={toastRef} />
      {/* Header */}
      <ActivityDialog 
        visible={showActivityDialog} 
        onHide={() => {
          setShowActivityDialog(false);
          setSelectedActivity(null);
        }} 
        onActivitySaved = {reloadActivities}
        activityToEdit = {selectedActivity}
      />
      <CollaboratorDialog 
        visible={showAddCollaboratorDialog} 
        onHide={() => {
          setShowAddCollaboratorDialog(false);
          setSelectedCollaborator(null);
        }} 
        agendaId={agendaId}
        agendaName={agendaName}
        activeCollaborators={activeCollaborators}
        mode={selectedCollaborator ? 'edit' : 'create'}
        collaboratorToEdit={selectedCollaborator}
      />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{agendaName}</h1>
        <div className="flex gap-2">
        <button 
          className={`${isDark 
            ? "bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600" 
            : "bg-[#2979FF] hover:bg-blue-700 border border-blue-600 hover:border-blue-700"} 
            text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200`
          }
          onClick={() => navigate('create', {
            state: { agendaId: agendaId, agendaName: agendaName }
          })}
        >
          <i className="pi pi-plus m-2" />
          Agregar actividad
        </button>
        </div>
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
            {pendingActivitiesColumns.map((col, index) => (
              <Column 
                key={col.field || index}
                field={col.field}
                header={col.header}
                body={col.body}
              />
            ))}
          </DataTable>
        </div>
      </div>

      {/* Tabla de actividades completadas */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Actividades completadas</h2>
        <div className="rounded-lg overflow-hidden border bg-white shadow">
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
            {completedActivitiesColumns.map((col, index) => (
              <Column 
                key={col.field || index}
                field={col.field}
                header={col.header}
                body={col.body}
              />
            ))}
          </DataTable>
        </div>
      </div>
      {/* Tabla de colaboradores activos */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold mb-4">Colaboradores</h2>
          <div className="flex gap-2">
          <button 
            className={`${isDark 
              ? "bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600" 
              : "bg-[#2979FF] hover:bg-blue-700 border border-blue-600 hover:border-blue-700"} 
              text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200`
            }
            onClick={() => openAddCollaboratorDialog('create')}
          >
            <i className="pi pi-plus m-2" />
            Agregar colaborador
          </button>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden border bg-white shadow">
          <DataTable
            value={activeCollaborators}
            className="w-full text-m"
            showGridlines
            size="medium"
            stripedRows
            paginator
            rows={5}
            emptyMessage={
              <div className="text-center py-6">No hay colaboradores activos</div>
            }
            onRowClick={(e) => handleCollaboratorRowClick(e.data)}
          >
            <Column field="user.name" header="Nombre" />
            <Column field="rol" header="Rol" />
          </DataTable>
        </div>
      </div>
    </div>
  );
}

export default AgendaView;
