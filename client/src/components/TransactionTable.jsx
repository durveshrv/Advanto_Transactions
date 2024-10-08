import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const TransactionTable = ({ month, setMonth }) => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(10); 

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/transactions', {
        params: {
          search,
          month,
          page,
          perPage,
        },
      });
      setTransactions(res.data.transactions);
      setTotalPages(Math.ceil(res.data.total / perPage));
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [search, month, page]);

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setPage(1); 
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); 
  };

  return (
    <div className="container mt-5 text-center">
      <h2 className="mb-4">Transactions Table</h2>

      <div className="row mb-3 justify-content-center">
        <div className="col-md-4">
          <label className="form-label">Select Month:</label>
          <select className="form-select" value={month} onChange={handleMonthChange}>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Search:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
        <table className="table table-bordered table-striped">
          <thead className="table-primary">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Date of Sale</th>
              <th>Sold</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((txn) => (
                <tr key={txn._id}>
                  <td>{txn.title}</td>
                  <td>{txn.description}</td>
                  <td>${txn.price.toFixed(2)}</td>
                  <td>{new Date(txn.dateOfSale).toLocaleDateString()}</td>
                  <td>{txn.sold ? 'Yes' : 'No'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-secondary"
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>

        <span>{`Page ${page} of ${totalPages}`}</span>

        <button
          className="btn btn-secondary"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;
