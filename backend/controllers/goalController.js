const Goal = require("../models/goalModel");
const { convertCurrency } = require("../helpers/currencyHelper");

// Add a new goal
const addGoal = async(req, res) => {
    try{
        const { name, targetAmount, savedAmount, deadline } = req.body;

        if (!name || !targetAmount || !deadline){
            return res.status(400).json({ message: "Name, target amount and deadline are required."});
        }

        let convertedTargetAmount = targetAmount;
        let convertedSavedAmount = targetAmount;
        if (currency !== "LKR") {
            convertedTargetAmount = await convertCurrency(targetAmount, currency, "LKR");
            convertedSavedAmount = await convertCurrency(savedAmount, currency, "LKR");
        }

        const newGoal = new Goal({
            userId: req.user.id,
            name,
            targetAmount: convertedTargetAmount,
            savedAmount: convertedSavedAmount,
            currency: "LKR",
            deadline,
        });

        await newGoal.save();
        res.status(201).json({ message: "Goal created successfully.", newGoal });    
    } catch (error){
        res.status(500).json({ message: "Failed to add goal" });
    }
};

// Get all goals
const getGoal = async(req, res) => {
    try{
        let query = {};
        if(req.user.role === "user"){
            query = { userId: req.user.id };
        }

        const goals = await Goal.find(query);

        const userCurrency = req.user.currency || "LKR";
        const convertedGoals = await Promise.all(
            goals.map(async (goal) => {
                if (goal.currency !== userCurrency) {
                    goal.targetAmount = await convertCurrency(goal.targetAmount, "LKR", userCurrency);
                    goal.savedAmount = await convertCurrency(goal.savedAmount, "LKR", userCurrency);
                    goal.currency = userCurrency;
                }
                return goal;
            })
        );

        res.json(convertedGoals);
        //res.json(goals);
    } catch(error){
        res.status(500).json({ message: "Failed to fetch goals" });
    }
}; 

// Update a goal by id
const updateGoal = async(req, res) => {
    try{
        const { id } = req.params;
        const { name, targetAmount, currency, deadline, savedAmount } = req.body;

        let query = { _id: id };
        if(req.user.role === "user"){
            query.userId = req.user.id;
        }

        let convertedTargetAmount = targetAmount;
        let convertedSavedAmount = savedAmount;
        if (currency !== "LKR") {
            convertedTargetAmount = await convertCurrency(targetAmount, currency, "LKR");
            convertedSavedAmount = await convertCurrency(savedAmount, currency, "LKR");
        }

        const updatedGoal = await Goal.findOneAndUpdate(
            query,
            { name, targetAmount: convertedTargetAmount, currency: "LKR", deadline, savedAmount: convertedSavedAmount },
            { new: true }
        );

        if(!updatedGoal){
            return res.status(404).json({ message: "Goal not found" });
        }

        res.json({ message: "Goal updated successfully", updatedGoal });
    } catch (error) {
        res.status(500).json({ message: "Failed to update goal" });
    }
};

// Delete a goal by id
const deleteGoal = async(req, res) => {
    try{
        const { id } = req.params;

        let query = { _id: id };
        if(req.user.role === "user"){
            query.userId = req.user.id;
        }

        const deletedGoal = await Goal.findOneAndDelete(query);

        if(!deletedGoal){
            return res.status(404).json({ message: "Goal not found" });
        }

        res.json({ message: "Goal deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete goal" });
    }
};

module.exports = { addGoal, getGoal, updateGoal, deleteGoal };
