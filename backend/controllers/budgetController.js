const Budget = require("../models/budgetModel");
const { convertCurrency } = require("../helpers/currencyHelper");

// Add a new budget
const addBudget = async(req, res) => {
    try{
        const { category, limit, currency, period, startDate, endDate, notificationsEnabled } = req.body;

        if (!category || !limit || !startDate || !endDate){
            return res.status(400).json({ message: "Category, Limit, Start date and end date are required."});
        }

        let convertedLimit = limit;
        if (currency !== "LKR") {
            convertedLimit = await convertCurrency(limit, currency, "LKR");
        }

        const newBudget = new Budget({
            userId: req.user.id,
            category,
            limit: convertedLimit,
            currency: "LKR",
            period,
            startDate,
            endDate,
            notificationsEnabled,
        });

        await newBudget.save();
        res.status(201).json({ meesage: "Budget created successfully.", newBudget });
    } catch (error){
        res.status(500).json({ message: "Failed to add budget" });
    }
};

// Get all budgets
const getBudget = async(req, res) => {
    try{
        let query = {};
        if(req.user.role === "user"){
            query = { userId: req.user.id };
        }

        const budgets = await Budget.find(query);

        // Convert budgets to user's
        const userCurrency = req.user.currency || "LKR";
        const convertedBudgets = await Promise.all(
            budgets.map(async (budget) => {
                if (budget.currency !== userCurrency) {
                    budget.limit = await convertCurrency(budget.limit, "LKR", userCurrency);
                    budget.currency = userCurrency;
                }
                return budget;
            })
        );

        res.json(convertedBudgets);
        //res.json(budgets);
    } catch(error){
        res.status(500).json({ message: "Failed to fetch budgets" });
    }
};

// Update a budget by id
const updateBudget = async (req, res) => {
    try{
        const { id } = req.params;
        const { category, limit, currency, period, startDate, endDate, notificationsEnabled } = req.body;

        let query = { _id: id };
        if(req.user.role === "user"){
            query.userId = req.user.id;
        }

        let convertedLimit = limit;
        if (currency !== "LKR") {
            convertedLimit = await convertCurrency(limit, currency, "LKR");
        }

        const updatedBudget = await Budget.findOneAndUpdate(
            query,
            { category, limit: convertedLimit, currency: "LKR", period, startDate, endDate, notificationsEnabled },
            { new: true }
        );

        if(!updatedBudget){
            return res.status(404).json({ message: "Budget not found" });
        }

        res.json({ message: "Budget updated successfully", updatedBudget });
    } catch (error) {
        res.status(500).json({ message: "Failed to update budget" });
    }
};

// Delete a budget by id 
const deleteBudget = async(req, res) => {
    try{
        const { id } = req.params;

        let query = {_id: id};
        if(req.user.role === "user"){
            query.userId = req.user.id;
        }

        const deletedBudget = await Budget.findOneAndDelete(query);
        if(!deletedBudget){
            return res.status(404).json({ message: "Budget not found" });
        }

        res.json({ message: "Budget deleted successfully" });
    } catch (error){
        res.status(500).json({ message: "Failed to delete budget" });   
    } 
};

module.exports = { addBudget, getBudget, updateBudget, deleteBudget };