import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js'; 

Chart.register(...registerables); 

const TransactionPieChart = ({ month }) => {
  const [pieData, setPieData] = useState([]);
  const chartRef = useRef(null);

  const fetchPieChartData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/piechart', {
        params: { month },
      });
      setPieData(res.data);
    } catch (error) {
      console.error('Error fetching pie chart data:', error);
    }
  };

  useEffect(() => {
    fetchPieChartData();
  }, [month]);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chartData = {
      labels: pieData.map((item) => item._id),
      datasets: [
        {
          label: 'Number of Items by Category',
          data: pieData.map((item) => item.count),
          backgroundColor: pieData.map((_, index) =>
            `hsl(${(index * 360) / pieData.length}, 70%, 50%)`
          ),
        },
      ],
    };

    const pieChart = new Chart(ctx, {
      type: 'pie',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
            text: 'Transaction Pie Chart',
          },
        },
      },
    });

    return () => {
      pieChart.destroy(); 
    };
  }, [pieData]);

  return (
    <div className="container mt-4">
      <h3 className="mb-3 text-center">Transaction Pie Chart</h3>
      <canvas ref={chartRef} />
      {pieData.length === 0 && <p>No data available for the selected month.</p>}
    </div>
  );
};

export default TransactionPieChart;
