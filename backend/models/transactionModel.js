const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    type: {
        type: String,   
        enum: ["income", "expense"],
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: "LKR",
    },

    category: {
        type: String,
        enum: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Rent', 'Healthcare', 'Education', 'Shopping', 'Salary', 'Other'],
        required: true
    },

    tags: [{ type: String }],

    date: {
        type: Date,
        default: Date.now
    },

    isRecurring: {
        type: Boolean,   
        default: false
    },

    recurrencePattern: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
        required: function() {
            return this.isRecurring;  
        },
    },

    endDate: {
        type: Date,
        required: function() {
            return this.isRecurring;  
        },
    },
});

module.exports = mongoose.model("Transaction", transactionSchema);