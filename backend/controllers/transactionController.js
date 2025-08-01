const { allocateSavings } = require("../helpers/savingsHelper"); 
const { convertCurrency } = require("../helpers/currencyHelper");
const Transaction = require("../models/transactionModel");

// Add a new transaction
const addTransaction = async(req, res) => {
    try{
        const { type, amount, currency, category, tags, date, isRecurring, recurrencePattern, endDate } = req.body;

        // Validate transaction type
        if (!["income", "expense"].includes(type)){
            return res.status(400).json({ message: "Invalid transaction type.Only 'income' or 'expense'."});
        }

        if (typeof amount !== "number" || amount <= 0){
            return res.status(400).json({ message: "Amount must be a positive number."});
        }

        let convertedAmount = amount;
        if (currency !== "LKR") {
            convertedAmount = await convertCurrency(amount, currency, "LKR");
        }

        const newTransaction = new Transaction({ 
            userId: req.user.id, 
            type, 
            amount: convertedAmount,
            currency: "LKR",
            category,
            tags, 
            date: date || Date.now(), 
            isRecurring, 
            recurrencePattern, 
            endDate 
        });
        await newTransaction.save();

        if (type === "income") {
            await allocateSavings(req.user.id, amount);
        }

        res.status(201).json({ message: "Transaction added successfully",
            transaction: newTransaction
         });
    }catch(error){
        res.status(500).json({ message: "Failed to add transaction." });
    }
};

// Get all transactions 
const getTransaction = async(req, res) => {
    try{
        let query = {};
        if(req.user.role === "user"){
            query = { userId: req.user.id }; // Users can only see their transactions
        }

        const transactions = await Transaction.find(query);

        const userCurrency = req.user.currency || "LKR"; 
        const convertedTransactions = await Promise.all(
            transactions.map(async (transaction) => {
                if (transaction.currency !== userCurrency) {
                    transaction.amount = await convertCurrency(transaction.amount, "LKR", userCurrency);
                    transaction.currency = userCurrency;
                }
                return transaction;
            })
        );

        res.json(convertedTransactions);
        //res.json(transactions);
    } catch(error){
        res.status(500).json({ message: "Failed to get transactions." });
    }
};

// Update a transaction by id 
const updateTransaction = async(req, res) => {
    try{
        const { id } = req.params;
        const { type, amount, currency, category, tags, date, isRecurring, recurrencePattern, endDate } = req.body;

        let query = { _id: id };
        if (req.user.role === "user"){
            query.userId = req.user.id; 
        }

        let convertedAmount = amount;
        if (currency !== "LKR") {
            convertedAmount = await convertCurrency(amount, currency, "LKR");
        }

        const transaction = await Transaction.findOneAndUpdate(query, 
            { type, amount: convertedAmount, currency: "LKR", category, tags, date, isRecurring, recurrencePattern, endDate }, 
            { new: true}
        );

        if(!transaction){
            return res.status(404).json({ message: "Transaction not found." });
        }
        
        res.json({ message: "Transaction updated successfully", transaction });
    } catch (error){
        res.status(500).json({ message: "Failed to update transaction." });
    }
};

// Delete a transaction
const deleteTransaction = async(req,res) => {
    try{
        const { id } = req.params;
        let query = { _id: id };

        if(req.user.role === "user"){
            query.userId = req.user.id; 
        }

        const transaction = await Transaction.findOneAndDelete(query);
        if(!transaction){
            return res.status(404).json({ message: "Transaction not found." });
        }
        res.json({ message: "Transaction deleted successfully." });
    } catch (error){
        res.status(500).json({ message: "Failed to delete transaction." });
    }
}

module.exports = { addTransaction, getTransaction, updateTransaction, deleteTransaction };