import React, { useState } from 'react';
import TransactionTable from './components/TransactionTable';
import TransactionStatistics from './components/TransactionStatistics';
import TransactionBarChart from './components/TransactionBarChart';
import TransactionPieChart from './components/TransactionPieChart';
import Footer from './components/Footer'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; 

const App = () => {
  const [month, setMonth] = useState('03'); 

  return (
    <div style={{backgroundColor:"yellowgreen"}}>
    <div className="container">
      <h1 className="text-center unique-font mb-5 header">Advanto</h1>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <TransactionTable month={month} setMonth={setMonth} />
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-4 mx-auto">
          <div className="card">
            <div className="card-body">
              <TransactionStatistics month={month} />
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <TransactionBarChart month={month} />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <TransactionPieChart month={month} />
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default App;
