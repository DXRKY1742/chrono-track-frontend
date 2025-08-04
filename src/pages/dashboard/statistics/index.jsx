// React
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from "react-router-dom";

// Redux
import { useSelector } from "react-redux";

// Primereact
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';

// Services
import agendaService from '../../../services/agendaService';
import taskService from '../../../services/tasksService';

// Components
import BarChart from './utils/barChart';

export default function Statistics() {
  // ----- Theme -----
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  const isDark = currentTheme === "arya-blue";
  const cardBgClass = isDark ? "bg-gray-900" : "bg-gray-200";

  // ----- States -----
  // Agendas
  const [agendas, setAgendas] = useState([]);
  // Tasks
  const [tasks, setTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  
  // Miscelaneous
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(2);
  const items = [
      { name: 'D', value: 1 },
      { name: 'M', value: 2 },
      { name: 'Y', value: 3 }
  ];
  // Navigation
  const navigate = useNavigate();
  
  //----- Dataloading -----
  useEffect(() => {
    fetchAgendas();
  }, []);

  useEffect(() => {
    if (agendas.length > 0) {
      fetchGlobalTasks();
      fetchAssignedTasks();
    }
  }, [agendas]);


   useEffect(() => {
    console.log(tasks)
  }, [tasks])

  //----- Functions -----
  async function fetchAgendas() {
    try {
      setLoading(true);
      const res = await agendaService.fetchAgendas();
      setAgendas(res || []);
    } catch (error) {
      console.error("Error cargando las agendas:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAssignedTasks(){
    try {
      setLoading(true);
      const res = await taskService.fetchAssigned();
      setAssignedTasks((res || []).sort((a, b) => {
        if (a.state === 'c' && b.state !== 'c') return 1;
        if (a.state !== 'c' && b.state === 'c') return -1;
        return 0;
      }));
    } catch (error) {
      console.error("Error cargando las tareas asignadas:", error);
    } finally {
      setLoading(false);
    }
  }

  const fetchGlobalTasks = async () => {
    try {
      setLoading(true);
      const allTasks = await Promise.all(
        agendas.map((agenda) =>
          agendaService.fetchTasksByAgendaId(agenda.id)
        )
      );
      const mergedTasks = allTasks.flat();
      setTasks(mergedTasks);
    } catch (error) {
      console.error("Error cargando las tareas globales:", error);
    } finally {
      setLoading(false);
    }
  };

  // ----- Mapper -----
  const stateMap = {
    a: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' },
    p: { label: 'In Progress', className: 'bg-blue-100 text-blue-700' },
    c: { label: 'Completed', className: 'bg-green-100 text-green-700' },
    x: { label: 'Canceled', className: 'bg-red-100 text-red-700' },
  };

  // ----- Charts -----  

  const pieChartData = useMemo(() => {
    const categoryCount = {};
    const pendingTasks = tasks.filter(task => task.state === 'a');
    pendingTasks.forEach(task => {
      const agenda = task.agenda || 'Unknown';
      categoryCount[agenda] = (categoryCount[agenda] || 0) + 1;
    });
    const labels = Object.keys(categoryCount);
    const data = Object.values(categoryCount);
    const backgroundColor = ['#FACC15', '#3B82F6', '#10B981', '#60A5FA', '#F87171', '#FBBF24'];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColor.slice(0, labels.length),
          borderWidth: 0,
        },
      ],
    };
  }, [tasks]);



  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Estadísticas</h1>
      
      {/* Fila superior - Gráfico de barras + My Agendas */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Bar Chart */}
        <Card className={`${cardBgClass} flex-1 lg:basis-[75%] rounded-xl shadow-lg border-0 overflow-hidden`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-blue-600">Global task report in range of date</h2>
              <div className="flex justify-center w-full md:w-1/2 mx-auto my-6">
                <SelectButton
                  value={value}
                  onChange={(e) => setValue(e.value)}
                  optionLabel="name"
                  options={items}
                  className="w-50"
                  pt={{
                    root: {
                      className: "inline-flex rounded overflow-hidden border border-cyan-600"
                    },
                    button: ({ context }) => ({
                      className: `flex-1 text-center font-semibold py-2 px-4 text-sm ${!context.first ? 'border-l border-cyan-500' : ''}`
                    })
                  }}
                />
              </div>


              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-800 rounded-full"></div> Pending
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div> In progress
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div> Completed
                </span>
              </div>
            </div>
            <div>
              <BarChart tasks={tasks} value={value} />
            </div>
          </div>
        </Card>

        {/* Agendas */}
        <Card className={`${cardBgClass} flex-1 lg:basis-[25%] rounded-xl shadow-lg border-0 overflow-hidden`}>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">My Agendas</h2>
            <div className="space-y-4">
              {agendas.map((agenda, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="">{agenda.name || agenda.label}</span>
                  <Button
                    label="Ver"
                    icon="pi pi-eye"
                    className={`${isDark 
                      ? "bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600" 
                      : "bg-blue-600 hover:bg-blue-700 border border-blue-600 hover:border-blue-700"} 
                      text-white font-medium px-3 py-1 text-sm rounded transition-colors duration-200 ml-4`
                    }
                    onClick={() => navigate(`/dashboard/agendas/${agenda.id}/activities`, {
                      state: { agendaId: agenda.id, agendaName: agenda.name }
                    })}
                  />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Fila inferior - Pie + Tabla */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Pie */}
        <Card className={`${cardBgClass} flex-1 lg:basis-[30%]  rounded-xl shadow-lg border-0 overflow-hidden`}>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Pending Tasks</h2>
            <div className="flex-grow flex justify-center items-center">
              <div className="w-[180px] h-[180px] flex justify-center items-center">
                <Chart
                  type="doughnut"
                  data={pieChartData}
                  options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false }}
                  style={{ width: "160px", height: "160px" }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Tabla */}
        <Card className={`${cardBgClass} flex-1 lg:basis-[70%]  rounded-xl shadow-lg border-0 overflow-hidden`}>
          <div className="p-6 max-h-[400px] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Tasks assigned to me</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 text-sm font-medium">Assigned by</th>
                    <th className="text-left py-3 text-sm font-medium">Initialized on</th>
                    <th className="text-left py-3 text-sm font-medium">Due date</th>
                    <th className="text-left py-3 text-sm font-medium">Agenda</th>
                    <th className="text-left py-3 text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedTasks.map((task) => {
                    const stateInfo = stateMap[task.state] || { label: 'Unknown', className: 'bg-gray-100 text-gray-700' };
                    return (
                      <tr key={task.id} className={`border-b border-gray-100`}>
                        <td className="py-4 ">{task.createdByUser || 'N/A'}</td>
                        <td className="py-4 ">{task.initDate || '—'}</td>
                        <td className="py-4 ">{task.desiredDate || '—'}</td>
                        <td className="py-4 ">{task.agenda || 'N/A'}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${stateInfo.className}`}>
                            {stateInfo.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
