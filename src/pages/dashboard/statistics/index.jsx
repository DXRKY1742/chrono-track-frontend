// React
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

// Primereact
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Button } from 'primereact/button';

// Services
import agendaService from '../../../services/agendaService';
import taskService from '../../../services/tasksService';

export default function Statistics() {
  /* Pending:
        - Testing
        - Correct task mapping 
  */  

  // ----- States -----
  // Agendas
  const [agendas, setAgendas] = useState([]);
  // Tasks
  const [tasks, setTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  // Miscelaneous
  const [loading, setLoading] = useState(false);
  // Navigation
  const navigate = useNavigate();
  
  //----- Dataloading -----
  useEffect(() => {
    fetchTasks();
    fetchAgendas();
  }, []);

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

  async function fetchTasks() {
    try {
      setLoading(true);
      const [assignedRes, pendingRes, progressRes, completedRes] = await Promise.all([
        taskService.fetchAssigned(),
        taskService.fetchAssignedPending(),
        taskService.fetchAssignedProgress(),
        taskService.fetchAssignedCompleted()
      ]);
      setTasks(assignedRes?.data || []);
      setPendingTasks(pendingRes?.data || []);
      setInProgressTasks(progressRes?.data || []);
      setCompletedTasks(completedRes?.data || []);
    } catch (error) {
      console.error("Error cargando las tareas:", error);
    } finally {
      setLoading(false);
    }
  }

  // ----- Charts -----

  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Pending',
        backgroundColor: '#1F2937',
        data: Array(12).fill(pendingTasks.length),
      },
      {
        label: 'Progress',
        backgroundColor: '#6B7280',
        data: Array(12).fill(inProgressTasks.length),
      },
      {
        label: 'Completed',
        backgroundColor: '#3B82F6',
        data: Array(12).fill(completedTasks.length),
      },
    ],
  };

  const pieChartData = (() => {
    const categoryCount = {};
    pendingTasks.forEach(task => {
      const agenda = task.agenda || 'Unknown';
      categoryCount[agenda] = (categoryCount[agenda] || 0) + 1;
    });

    const labels = Object.keys(categoryCount);
    const data = Object.values(categoryCount);
    const backgroundColor = ['#1F2937', '#60A5FA', '#4ADE80', '#93C5FD', '#F87171', '#FBBF24'];

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
  })();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Estadísticas</h1>
      
      {/* Fila superior - Gráfico de barras + My Agendas */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Bar Chart */}
        <Card className="flex-1 lg:basis-[75%] bg-white rounded-xl shadow-lg border-0 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-blue-600">Tasks report in range of date</h2>
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
            <div className="h-80">
              <Chart type="bar" data={barChartData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }},
                scales: {
                  x: { stacked: true, grid: { display: false }},
                  y: {
                    stacked: true, beginAtZero: true,
                    grid: { color: '#F3F4F6' },
                    ticks: { color: '#9CA3AF' }
                  }
                },
                elements: { bar: { borderWidth: 0 }}
              }} />
            </div>
          </div>
        </Card>

        {/* Agendas */}
        <Card className="flex-1 lg:basis-[25%] bg-white rounded-xl shadow-lg border-0 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">My Agendas</h2>
            <div className="space-y-4">
              {agendas.map((agenda, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{agenda.name || agenda.label}</span>
                  <Button
                    label="Ver"
                    icon="pi pi-eye"
                    className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white font-medium px-3 py-1 text-sm rounded transition-colors duration-200 ml-4"
                    onClick={() => navigate(`/dashboard/agendas/${agenda.id}/activities`)}
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
        <Card className="flex-1 lg:basis-[30%] bg-white rounded-xl shadow-lg border-0 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Task pending</h2>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 flex-shrink-0">
                <Chart type="doughnut" data={pieChartData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: '60%',
                  plugins: { legend: { display: false }}
                }} />
              </div>
              <div className="flex-1 space-y-3">
                {pieChartData.labels.map((label, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: pieChartData.datasets[0].backgroundColor[index] }}></div>
                      {label}
                    </span>
                    <span className="font-medium">{pieChartData.datasets[0].data[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Tabla */}
        <Card className="flex-1 lg:basis-[70%] bg-white rounded-xl shadow-lg border-0 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Tasks assigned to me</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Manager</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Due Date</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Agenda</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => (
                    <tr key={task.id} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}`}>
                      <td className="py-4 text-gray-800">{task.manager || 'N/A'}</td>
                      <td className="py-4 text-gray-600">{task.due || '—'}</td>
                      <td className="py-4 text-gray-600">{task.agenda || '—'}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          task.status === 'Complete' ? 'bg-green-100 text-green-700' :
                          task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                          task.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          task.status === 'Approved' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {task.status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
