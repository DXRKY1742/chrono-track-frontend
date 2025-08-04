import React, { useMemo } from 'react';
import { Chart } from 'primereact/chart';

export default function BarChart({ tasks, value }) {
  const barChartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const pendingData = Array(12).fill(0);
    const progressData = Array(12).fill(0);
    const completedData = Array(12).fill(0);

    if (value === 2) { // Agrupar por mes
      tasks.forEach(task => {
        const date = new Date(task.initDate || task.createdAt || new Date());
        const monthIndex = date.getMonth(); // 0-11

        if (task.state === 'a') {
          pendingData[monthIndex]++;
        } else if (task.state === 'p') {
          progressData[monthIndex]++;
        } else if (task.state === 'c') {
          completedData[monthIndex]++;
        }
      });

      return {
        labels: months,
        datasets: [
          {
            label: 'Pending',
            backgroundColor: '#1F2937',
            data: pendingData,
          },
          {
            label: 'Progress',
            backgroundColor: '#6B7280',
            data: progressData,
          },
          {
            label: 'Completed',
            backgroundColor: '#3B82F6',
            data: completedData,
          },
        ],
      };
    }

    let labels = [];
    let pendingCounts = {};
    let progressCounts = {};
    let completedCounts = {};

    tasks.forEach(task => {
      const date = new Date(task.initDate || task.createdAt || new Date());
      let key = '';

      if (value === 1) {
        key = date.toISOString().split('T')[0]; 
      } else if (value === 3) {
        key = `${date.getFullYear()}`; 
      }

      if (key) {
        if (task.state === 'a') pendingCounts[key] = (pendingCounts[key] || 0) + 1;
        if (task.state === 'p') progressCounts[key] = (progressCounts[key] || 0) + 1;
        if (task.state === 'c') completedCounts[key] = (completedCounts[key] || 0) + 1;
      }
    });

    const allKeys = new Set([
      ...Object.keys(pendingCounts),
      ...Object.keys(progressCounts),
      ...Object.keys(completedCounts),
    ]);
    labels = Array.from(allKeys).sort();

    return {
      labels,
      datasets: [
        {
          label: 'Pending',
          backgroundColor: '#1F2937',
          data: labels.map(label => pendingCounts[label] || 0),
        },
        {
          label: 'Progress',
          backgroundColor: '#6B7280',
          data: labels.map(label => progressCounts[label] || 0),
        },
        {
          label: 'Completed',
          backgroundColor: '#3B82F6',
          data: labels.map(label => completedCounts[label] || 0),
        },
      ],
    };
  }, [tasks, value]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: { color: '#F3F4F6' },
        ticks: { color: '#9CA3AF' }
      }
    },
    elements: { bar: { borderWidth: 0 } }
  };

  return <Chart type="bar" data={barChartData} options={options} />;
}
