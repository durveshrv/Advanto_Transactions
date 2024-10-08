import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionStatistics = ({ month }) => {
  const [statistics, setStatistics] = useState({
    totalSales: 0,
    totalSold: 0,
    totalNotSold: 0,
  });
  

  const fetchStatistics = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/statistics', {
        params: { month },
      });
      setStatistics({
        totalSales: res.data.totalSaleAmount || 0,
        totalSold: res.data.totalSoldItems || 0,
        totalNotSold: res.data.totalNotSoldItems || 0,
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };
  

  useEffect(() => {
    fetchStatistics();
  }, [month]);

  return (
    <div className="container mt-4">
      <h3 className="mb-3 text-center">Transaction Statistics</h3>
      <div className="row">
        <div className="col-md-4">
          <div className="card text-center mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Sales</h5>
              <p className="card-text">${(statistics.totalSales || 0).toFixed(2)}</p> 
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Sold Items</h5>
              <p className="card-text">{statistics.totalSold || 0}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Not Sold Items</h5>
              <p className="card-text">{statistics.totalNotSold || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatistics;
