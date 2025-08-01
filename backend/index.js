const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");   
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const goalRoutes = require("./routes/goalRoutes");
const reportRoutes = require("./routes/reportRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cron = require("./cron/cronEmail");

const app = express();

//Middleware
app.use(express.json());

//Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/transactions", transactionRoutes);
app.use("/budgets", budgetRoutes);
app.use("/goals", goalRoutes);
app.use("/reports", reportRoutes);
app.use("/dashboards", dashboardRoutes);

module.exports = app;

//Connect to MongoDB
const DBURL = process.env.CONNECTION_STRING;

//Start the server
const PORT = process.env.PORT || 5000;

mongoose.connect(DBURL)
    .then(() => {
        console.log("Database connected successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
