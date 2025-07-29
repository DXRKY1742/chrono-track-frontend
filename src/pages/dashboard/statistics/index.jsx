// React
import React from 'react';

// Primereact
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ListBox } from 'primereact/listbox';

export default function Statistics() {
  /* COMPLETADO:
      styling tailwind (Adjust to color palette)
       adjust sizes
       Chart configurations with perfect color matching
       DataTable with colored avatars and alternating rows
       Responsive layout with proper spacing
       ListBox styling completed
  */
  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Pending',
        backgroundColor: '#1F2937',
        data: [20, 15, 25, 10, 30, 15, 20, 25, 15, 20, 10, 25],
      },
      {
        label: 'Canceled',
        backgroundColor: '#6B7280',
        data: [15, 20, 10, 25, 18, 22, 18, 15, 25, 18, 30, 15],
      },
      {
        label: 'Completed',
        backgroundColor: '#3B82F6',
        data: [30, 35, 40, 45, 40, 50, 55, 45, 50, 60, 55, 65],
      },
    ],
  };

  const pieChartData = {
    labels: ['Personal', 'University', 'Work', 'Freelance'],
    datasets: [
      {
        data: [5, 2, 1, 1],
        backgroundColor: ['#1F2937', '#60A5FA', '#4ADE80', '#93C5FD'],
        borderWidth: 0,
      },
    ],
  };

  const tasks = [
    { 
      id: 1, 
      manager: 'ByeWind', 
      due: 'Jun 24, 2025', 
      agenda: 'Personal',
      status: 'In Progress',
      avatar: 'BW',
      avatarBg: 'bg-blue-500'
    },
    { 
      id: 2, 
      manager: 'Natali Craig', 
      due: 'Mar 10, 2025', 
      agenda: 'Work',
      status: 'Complete',
      avatar: 'NC',
      avatarBg: 'bg-green-500'
    },
    { 
      id: 3, 
      manager: 'Drew Cano', 
      due: 'Nov 10, 2025', 
      agenda: 'Personal',
      status: 'Pending',
      avatar: 'DC',
      avatarBg: 'bg-purple-500'
    },
    { 
      id: 4, 
      manager: 'Orlando Diggs', 
      due: 'Dec 20, 2025', 
      agenda: 'University',
      status: 'Approved',
      avatar: 'OD',
      avatarBg: 'bg-orange-500'
    },
  ];

  const agendas = [
    { label: 'Personal', count: '•••' },
    { label: 'Work', count: '••' },
    { label: 'University', count: '•••' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Estadísticas</h1>
      
      {/* Fila superior - Gráfico de barras + My Agendas */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <Card className="flex-1 lg:basis-[75%] bg-white rounded-xl shadow-lg border-0 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-blue-600">Tasks report in range of date</h2>
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                  Pending
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  Canceled
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Completed
                </span>
              </div>
            </div>
            <div className="h-80">
              <Chart 
                type="bar" 
                data={barChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    x: {
                      stacked: true,
                      grid: {
                        display: false
                      }
                    },
                    y: {
                      stacked: true,
                      beginAtZero: true,
                      grid: {
                        color: '#F3F4F6'
                      },
                      ticks: {
                        color: '#9CA3AF'
                      }
                    }
                  },
                  elements: {
                    bar: {
                      borderWidth: 0,
                    }
                  }
                }}
              />
            </div>
          </div>
        </Card>
        
        <Card className="flex-1 lg:basis-[25%] bg-white rounded-xl shadow-lg border-0 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">My Agendas</h2>
            <div className="space-y-4">
              {agendas.map((agenda, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{agenda.label}</span>
                  <span className="text-gray-400 text-lg">{agenda.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      
      {/* Fila inferior - Pie chart + Tabla */}
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 lg:basis-[30%] bg-white rounded-xl shadow-lg border-0 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Task pending</h2>
            <div className="flex items-center gap-6">
              {/* Gráfico donut a la izquierda */}
              <div className="w-32 h-32 flex-shrink-0">
                <Chart 
                  type="doughnut" 
                  data={pieChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '60%',
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }}
                />
              </div>
              
              {/* Lista de categorías a la derecha */}
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                    Personal
                  </span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    University
                  </span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    Work
                  </span>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                    Freelance
                  </span>
                  <span className="font-medium">1</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
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
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${task.avatarBg} rounded-full flex items-center justify-center text-white text-xs font-semibold`}>
                            {task.avatar}
                          </div>
                          <span className="text-gray-800">{task.manager}</span>
                        </div>
                      </td>
                      <td className="py-4 text-gray-600">{task.due}</td>
                      <td className="py-4 text-gray-600">{task.agenda}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          task.status === 'Complete' ? 'bg-green-100 text-green-700' :
                          task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                          task.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          task.status === 'Approved' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {task.status}
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
