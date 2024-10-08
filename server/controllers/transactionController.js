const axios = require("axios");
const Transaction = require("../models/Transaction");

// API to Fetch and Seed Data from Third-Party Source
exports.seedDatabase = async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const transactions = response.data;

    await Transaction.insertMany(transactions);
    res.status(201).json({ message: "Database initialized with seed data" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//api to fetch the transactions with the filters month, searching accorigin to title/description/price and pagination.
exports.getTransactions = async (req, res) => {
  const { page = 1, perPage = 10, search = "", month } = req.query;

  if (!month || isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: "Invalid month provided" });
  }

  try {
    const searchQuery = {
      dateOfSale: { $regex: `-${month}-` },
      ...(search
        ? {
            $or: [
              { title: { $regex: search, $options: "i" } },      
              { description: { $regex: search, $options: "i" } }, 
              ...(isNaN(search) || search.trim() === ""
                ? [] 
                : [{ price: Number(search) }]) 
            ]
          }
        : {}),
    };

    const transactions = await Transaction.find(searchQuery)
      .skip((page - 1) * perPage) 
      .limit(Number(perPage));     

    const total = await Transaction.countDocuments(searchQuery);

    res.json({ total, transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: error.message });
  }
};



// API for Statistics
exports.getStatistics = async (req, res) => {
  const { month } = req.query;

  if (!month || isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: "Invalid month provided" });
  }

  try {
    const totalSaleAmount = await Transaction.aggregate([
      {
        $match: {
          dateOfSale: { $regex: `-${month}-` },
          sold: true
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$price" }
        }
      }
    ]);

    const totalSoldItems = await Transaction.countDocuments({
      dateOfSale: { $regex: `-${month}-` },
      sold: true
    });

    const totalNotSoldItems = await Transaction.countDocuments({
      dateOfSale: { $regex: `-${month}-` },
      sold: false
    });

    res.json({
      totalSaleAmount: totalSaleAmount.length ? totalSaleAmount[0].totalSales : 0,
      totalSoldItems,
      totalNotSoldItems
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: error.message });
  }
};


// API for Bar Chart Data
exports.getBarChartData = async (req, res) => {
  const { month } = req.query;

  if (!month || isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: "Invalid month provided" });
  }

  try {
    const priceRanges = [
      { range: "0-100", min: 0, max: 100 },
      { range: "101-200", min: 101, max: 200 },
      { range: "201-300", min: 201, max: 300 },
      { range: "301-400", min: 301, max: 400 },
      { range: "401-500", min: 401, max: 500 },
      { range: "501-600", min: 501, max: 600 },
      { range: "601-700", min: 601, max: 700 },
      { range: "701-800", min: 701, max: 800 },
      { range: "801-900", min: 801, max: 900 },
      { range: "901-above", min: 901, max: Infinity }
    ];

    const barChartData = await Promise.all(
      priceRanges.map(async (range) => {
        const count = await Transaction.countDocuments({
          price: { $gte: range.min, $lt: range.max },
          dateOfSale: { $regex: `-${month}-` }
        });
        return { range: range.range, count };
      })
    );

    res.json(barChartData);
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    res.status(500).json({ error: error.message });
  }
};


// API for Pie Chart Data
exports.getPieChartData = async (req, res) => {
  const { month } = req.query;

  if (!month || isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: "Invalid month provided" });
  }

  try {
    const pieChartData = await Transaction.aggregate([
      {
        $match: {
          dateOfSale: { $regex: `-${month}-` }
        }
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(pieChartData);
  } catch (error) {
    console.error("Error fetching pie chart data:", error);
    res.status(500).json({ error: error.message });
  }
};

// API to Fetch Data from All 3 APIs
exports.getCombinedData = async (req, res) => {
  const { month } = req.query;

  if (!month || isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: "Invalid month provided" });
  }

  try {
    const transactions = await Transaction.find({
      dateOfSale: { $regex: `-${month}-` }  
    });

    const totalSaleAmount = await Transaction.aggregate([
      { $match: { dateOfSale: { $regex: `-${month}-` }, sold: true } },
      { $group: { _id: null, totalSales: { $sum: "$price" } } }
    ]);

    const totalSoldItems = await Transaction.countDocuments({
      dateOfSale: { $regex: `-${month}-` },
      sold: true
    });

    const totalNotSoldItems = await Transaction.countDocuments({
      dateOfSale: { $regex: `-${month}-` },
      sold: false
    });

    const priceRanges = [
      { range: "0-100", min: 0, max: 100 },
      { range: "101-200", min: 101, max: 200 },
      { range: "201-300", min: 201, max: 300 },
      { range: "301-400", min: 301, max: 400 },
      { range: "401-500", min: 401, max: 500 },
      { range: "501-600", min: 501, max: 600 },
      { range: "601-700", min: 601, max: 700 },
      { range: "701-800", min: 701, max: 800 },
      { range: "801-900", min: 801, max: 900 },
      { range: "901-above", min: 901, max: Infinity }
    ];

    const barChartData = await Promise.all(
      priceRanges.map(async (range) => {
        const count = await Transaction.countDocuments({
          price: { $gte: range.min, $lt: range.max },
          dateOfSale: { $regex: `-${month}-` }
        });
        return { range: range.range, count };
      })
    );

    const pieChartData = await Transaction.aggregate([
      { $match: { dateOfSale: { $regex: `-${month}-` } } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    res.json({
      transactions,
      statistics: {
        totalSaleAmount: totalSaleAmount.length ? totalSaleAmount[0].totalSales : 0,
        totalSoldItems,
        totalNotSoldItems
      },
      barChart: barChartData,
      pieChart: pieChartData
    });
  } catch (error) {
    console.error("Error fetching combined data:", error);
    res.status(500).json({ error: error.message });
  }
};
