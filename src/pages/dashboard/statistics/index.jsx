// React
import React from 'react';

// Primereact
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ListBox } from 'primereact/listbox';

export default function Statistics() {
  /* Pending:
      styiling tailwind (Adjust to color palette)
      adjust sizes

  */
  const barChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Completed Tasks',
        backgroundColor: '#4ade80',
        data: [12, 19, 8, 15, 10],
      },
    ],
  };

  const pieChartData = {
    labels: ['Pending', 'Completed', 'In Progress'],
    datasets: [
      {
        data: [10, 25, 5],
        backgroundColor: ['#f87171', '#34d399', '#60a5fa'],
      },
    ],
  };

  const tasks = [
    { id: 1, title: 'Design meeting', due: '2025-07-22' },
    { id: 2, title: 'API integration', due: '2025-07-23' },
    { id: 3, title: 'Testing', due: '2025-07-24' },
  ];

  const agendas = [
    { label: 'Review Sprint Board' },
    { label: 'Client Call 2PM' },
    { label: 'Team Sync-up' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Statistics</h1>
      <div className="flex gap-4 mb-6">
        <Card className="flex-1 basis-[70%] p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-2">Tasks Report in Date Range</h2>
          <Chart type="bar" data={barChartData} />
        </Card>
        <Card className="flex-1 basis-[30%] p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-2">My Agendas</h2>
          <ListBox value={null} options={agendas} optionLabel="label" />
        </Card>
      </div>
      <div className="flex gap-4">
        <Card className="flex-1 basis-[40%] p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-2">Task Pending</h2>
          <Chart type="pie" data={pieChartData} />
        </Card>
        <Card className="flex-1 basis-[60%] p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-2">Tasks Assigned to Me</h2>
          <DataTable value={tasks} paginator rows={5}>
            <Column field="id" header="ID" />
            <Column field="title" header="Task" />
            <Column field="due" header="Due Date" />
          </DataTable>
        </Card>
      </div>
    </div>
  );
}
