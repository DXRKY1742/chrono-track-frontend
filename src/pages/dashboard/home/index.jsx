// React
import React, {useEffect, useState, useRef} from "react";
import { useNavigate, useLocation } from 'react-router-dom';

// Redux
import { useSelector } from "react-redux";

// Primereact
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { Toast } from 'primereact/toast';

// Services
import taskService from "../../../services/tasksService";

// Components
import {createToastService} from "../../../components/toast/createToastService";

export default function Home() {
  const location = useLocation();
  const { agendaId, agendaName } = location.state || {};

  // ----- Toast -----
  const toastRef = useRef(null);
  const toast = createToastService(toastRef);
  // ----- Theme -----
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  const isDark = currentTheme === "arya-blue";
  const cardBgClass = isDark ? "bg-gray-900" : "bg-gray-200";

  // ----- UseStates -----
  // Activities / Tasks
  const [pendingActivities, setPendingActivities] = useState([])
  const [inProgressActivities, setInProgressActivities] = useState([])
  const [completedActivities, setCompletedActivities] = useState([])
  const [dueTodayActivities, setDueTodayActivities] = useState([])
  
  // Miscelaneous
  const [loading, setLoading] = useState(false) 

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        const res = await taskService.fetchAssigned();
        const now = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
        
        const pending = [];
        const inProgress = [];
        const completed = [];
        const dueToday = [];

        (res || []).forEach(task => {
          if (task.state === 'a') pending.push(task);
          if (task.state === 'p') inProgress.push(task);
          if (task.state === 'c') completed.push(task);
          if (task.desiredDate && task.desiredDate.startsWith(now)) dueToday.push(task);
        });

        setPendingActivities(pending);
        setInProgressActivities(inProgress);
        setCompletedActivities(completed);
        setDueTodayActivities(dueToday);
      } catch (error) {
        toast.showError()
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);


  //----- Navigation -----
  const navigate = useNavigate();

  const redirectTo = (index) => {
    switch (index) {
      case 1:
        navigate('/dashboard/statistics');
        break;
      case 2:
        navigate('/dashboard/agendas');
        break;
      case 3:
        navigate('/dashboard/settings');
        break;
      default:
        console.warn('Índice no válido');
        break;
    }
  };


  // Datos para el gráfico de dona
  const donutData =
  completedActivities.length === 0 &&
  pendingActivities.length === 0 &&
  inProgressActivities.length === 0 &&
  dueTodayActivities.length === 0
    ? {
        labels: ["No activities"],
        datasets: [
          {
            data: [1],
            backgroundColor: ["#d1d5db"], 
            hoverBackgroundColor: ["#d1d5db"],
          },
        ],
      }
    : {
        labels: ["Completado", "Pendiente", "En progreso", "Vencidas"],
        datasets: [
          {
            data: [
              completedActivities.length,
              pendingActivities.length,
              inProgressActivities.length,
              dueTodayActivities.length,
            ],
            backgroundColor: ["#4285F4", "#F4B400", "#0F9D58", "#E53935"],
            hoverBackgroundColor: ["#5C9DF6", "#FFD34E", "#33CC88", "#F0625F"],
          },
        ],
      };
  

  // agregar {isLoading ? () : <progressSpinner/>}
  return (
    <div className="min-h-screen p-8">
      <Toast ref={toastRef} />
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Estadísticas */}
          <Card onClick={() => redirectTo(1)} className={`${cardBgClass} rounded-2xl p-6 flex flex-col min-h-[300px] transition-transform transform hover:scale-[1.02] shadow-none border-none cursor-pointer`}>
            <div className=" font-semibold mb-2 text-lg">Estadísticas</div>
            <div className="flex-grow flex justify-center items-center">
              <div className="w-[180px] h-[180px] flex justify-center items-center">
                <Chart
                  type="doughnut"
                  data={donutData}
                  options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false }}
                  style={{ width: "160px", height: "160px" }}
                />
              </div>
            </div>
          </Card>

          {/* Actividades para hoy */}
          <Card className={`${cardBgClass} rounded-2xl p-6 flex flex-col min-h-[300px] shadow-none border-none cursor-pointer`}>
            <div className=" font-semibold mb-2 text-lg">Actividades pendientes</div>
            <div className="flex-grow flex flex-col justify-center max-h-[300px] overflow-hidden">
              {loading ? (
                <div className="text-center">Cargando...</div>
              ) : pendingActivities.length === 0 ? (
                <div className="text-center">No hay actividades pendientes</div>
              ) : (
                <ul className="list-none p-0 m-0 space-y-2">
                  {pendingActivities.map((actividad) => (
                    <li 
                      key={actividad.id} 
                      className="border-b py-2 text-base transform scale-100 hover:border rounded"
                      onClick={() => {
                        navigate(`/dashboard/agendas/${actividad.agendaId}/activities`, {
                          state: { agendaId: actividad.agendaId, agendaName: actividad.agenda }
                        });
                      }}
                    >
                      {actividad.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
              
          {/* Ajustes */}
          <Card onClick={() => redirectTo(3)} className={`${cardBgClass} rounded-2xl p-6 flex flex-col min-h-[300px] transition-transform transform hover:scale-[1.02] shadow-none border-none cursor-pointer`}>
            <div className="font-semibold mb-2 text-lg">Ajustes</div>
            <div className="flex-grow flex justify-center items-center">
              <i className="pi pi-user text-[100px]" style={{ fontWeight: 100 }}></i>
            </div>
          </Card>

          {/* Agendas */}
          <Card onClick={() => redirectTo(2)} className={`${cardBgClass} rounded-2xl p-6 flex flex-col min-h-[300px] transition-transform transform hover:scale-[1.02] shadow-none border-none cursor-pointer`}>
            <div className="font-semibold mb-2 text-lg">Agendas</div>
            <div className="flex-grow flex justify-center items-center">
              <i className="pi pi-book text-[100px]" style={{ fontWeight: 100 }}></i>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}