const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");
const Budget = require("../models/budgetModel");
const Goal = require("../models/goalModel");
const { convertCurrency } = require("../helpers/currencyHelper");

// Admin Dashboard
const adminDashboard = async (req, res) => {
    try {
        
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const users = await User.find({}, { password: 0 }); // Discard passwords

        const totalTransactions = await Transaction.countDocuments();
        const totalBudgets = await Budget.countDocuments();
        const totalGoals = await Goal.countDocuments();

        const transactions = await Transaction.find();
        const totalIncome = transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);

        res.json({
            message: "Admin dashboard data",
            users,
            totalTransactions,
            totalBudgets,
            totalGoals,
            totalIncome,
            totalExpenses,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve admin dashboard data" });
    }
};

// Regular User Dashboard
const userDashboard = async (req, res) => {
    try {

        if (req.user.role !== "user") {
            return res.status(403).json({ message: "Access denied. Users only." });
        }

        const userId = req.user.id;

        const transactions = await Transaction.find({ userId });

        const budgets = await Budget.find({ userId });

        const goals = await Goal.find({ userId });

        const userCurrency = req.user.currency || "LKR"; // Default to LKR
        const convertedTransactions = await Promise.all(
            transactions.map(async (t) => {
                if (t.currency !== userCurrency) {
                    t.amount = await convertCurrency(t.amount, t.currency, userCurrency);
                    t.currency = userCurrency;
                }
                return t;
            })
        );

        const totalIncome = convertedTransactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = convertedTransactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);

        res.json({
            message: "User dashboard data",
            transactions: convertedTransactions,
            budgets,
            goals,
            totalIncome,
            totalExpenses,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve user dashboard data" });
    }
};

module.exports = { adminDashboard, userDashboard };