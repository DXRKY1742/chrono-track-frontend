'use client'

// React
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";

// Redux
import { useSelector } from "react-redux";

// Primereact
import { Calendar } from 'primereact/calendar';
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

// Components
import AddActivityDialog from "../../../../components/dialogs/AddActivityDialog";
import {createToastService} from "../../../components/toast/createToastService";

// Services 
import taskService from "../../../../services/tasksService";

function AddActivitiesView() {
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
  // Activities / Tasks
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedDateString = useMemo(() => {
    return selectedDate.toISOString().split("T")[0];
  }, [selectedDate]);
  
  // Miscellaneous
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      setLoading(true);
      const res = await taskService.fetchAssigned();
      setTasks(res)
    } catch (error) {
      toast.showError('Error: ', error)
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Cargando actividades...</p>;

  return (
    <div className="p-6 min-h-screen">
      <Toast ref={toastRef} />
      <AddActivityDialog 
        visible={showDialog} 
        onHide={() => {
          setShowDialog(false);
          fetchTasks();
        }}
        agendaId={agendaId} 
        suggestedInitDate={selectedDate}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-6">Añadir actividades para {agendaName}</h1>
        <Button 
          label="Nueva actividad" 
          icon="pi pi-plus" 
          className={`${isDark 
            ? "bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600" 
            : "bg-[#2979FF] hover:bg-blue-700 border border-blue-600 hover:border-blue-700"} 
            text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200`
          }
          onClick={() => setShowDialog(true)}
        />
      </div>

      <div className="flex flex-col justify-self-center sm:flex-row flex-wrap gap-8 items-start mt-10">
        {/* Calendario */}
        <div className="rounded-lg">
          <Calendar
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.value)}
            inline
            showWeek
            className="w-[500px] text-[1.05rem]"
          />
        </div>
        {/* Activity Card */}
        <div className="border p-4 rounded-lg w-[300px] shadow mt-4 m:mt-0">
          <h3 className="font-semibold mb-2">
            {selectedDate.toLocaleDateString("es-MX", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </h3>
        
          <ul>
            {tasks
              .filter(task => task.initDate === selectedDateString)
              .map(task => (
                <li key={task.id}>
                  <h4 className="font-bold">{task.title}: {task.description}</h4>
                  <p className="text-xs text-gray-500">Asignado a: {task.userAssigned}</p>
                </li>
              ))}
          </ul>
          {tasks.filter(task => task.initDate === selectedDateString).length === 0 && (
            <p className="text-gray-500">No hay actividades para esta fecha.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddActivitiesView;
