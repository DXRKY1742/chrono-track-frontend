'use client'

// React
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Redux
import { useSelector } from "react-redux";

// Primereact
import { Calendar } from 'primereact/calendar';
import { Button } from "primereact/button";

// Components
import AddActivityDialog from "../../../../components/dialogs/AddActivityDialog";

// Services 
import taskService from "../../../../services/tasksService";

function AddActivitiesView() {
 
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
  const selectedDateString = selectedDate.toISOString().split('T')[0];
  
  // Miscellaneous
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        const res = await taskService.fetchAssigned();
        console.log(res)
        setTasks(res)
      } catch (error) {
        console.error("Error cargando las tareas:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  if (loading) return <p>Cargando actividades...</p>;

  return (
    <div className="p-6 min-h-screen">
      <AddActivityDialog 
        visible={showDialog} 
        onHide={() => setShowDialog(false)}
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
        <div className="border p-4 rounded-lg w-[30%] shadow mt-4 m:mt-0">
          <h3 className="font-semibold mb-2">
            {selectedDate.toLocaleDateString("es-MX", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </h3>
        
          {tasks.filter(task => task.initDate === selectedDateString).map(task => (
            <div key={task.id} className="mb-2 p-2 rounded shadow-sm">
              <h4 className="font-bold">{task.title}</h4>
              <p className="text-sm">{task.description}</p>
              <p className="text-xs">Asignado a: {task.userAssigned}</p>
            </div>
          ))}
          {tasks.filter(task => task.initDate === selectedDateString).length === 0 && (
            <p className="text-gray-500">No hay actividades para esta fecha.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddActivitiesView;
