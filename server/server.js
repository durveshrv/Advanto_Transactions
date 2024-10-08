const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
app.use(cors());
app.use(express.json());
const dbURI = "mongodb+srv://vetaledurvesh06:$tr0nGarrmsa@cluster1.ovrr3oh.mongodb.net/transactionwala?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB successfully!");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});
app.use('/api', transactionRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
