const Goal = require("../models/goalModel");

const allocateSavings = async (userId, amount) => {
    try {
        const goals = await Goal.find({ userId });

        if (goals.length === 0) {
            return; 
        }

        const amountPerGoal = amount / goals.length;

        for (const goal of goals) {
            goal.savedAmount += amountPerGoal;
            await goal.save();
        }
    } catch (error) {
        console.error("Failed to allocate savings:", error);
    }
};

module.exports = { allocateSavings };