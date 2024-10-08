import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables); 

const TransactionBarChart = ({ month }) => {
  const [barData, setBarData] = useState([]);
  const chartRef = useRef(null); 

  const fetchBarChartData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/barchart', {
        params: { month },
      });
      setBarData(res.data);
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  useEffect(() => {
    fetchBarChartData();
  }, [month]);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chartData = {
      labels: barData.map((item) => item.range),
      datasets: [
        {
          label: 'Number of Items',
          data: barData.map((item) => item.count),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };

    const barChart = new Chart(ctx, {
      type: 'bar', 
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
            text: 'Transaction Bar Chart',
          },
        },
      },
    });

    return () => {
      barChart.destroy(); 
    };
  }, [barData]);

  return (
    <div className="container mt-4">
      <h3 className="mb-3 text-center">Transaction Bar Chart</h3>
      <canvas ref={chartRef} />
      {barData.length === 0 && <p>No data available for the selected month.</p>}
    </div>
  );
};

export default TransactionBarChart;
