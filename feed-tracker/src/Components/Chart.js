import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const FoodTypeChart = ({ foodData }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const typeCounts = {};

    foodData.forEach(item => {
      typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
    });

     const labels = Object.keys(typeCounts);
    const data = Object.values(typeCounts);

     // Destroy the previous chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

     // Create a new chart instance
    chartInstanceRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
        datasets: [{
          label: 'Food Type Distribution',
          data,
          backgroundColor: [
            '#f39c12', '#2ecc71', '#3498db',
            '#e74c3c', '#9b59b6', '#16a085'
          ],
          borderColor: '#fff',
          borderWidth: 2,
        }],
      },

      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Food Type Distribution' },
        },
      },
    });
