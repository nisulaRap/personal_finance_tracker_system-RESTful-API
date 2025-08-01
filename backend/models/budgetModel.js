const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
    category: {
        type: String,
        enum: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Rent', 'Healthcare', 'Education', 'Shopping', 'Salary', 'Other']
    },

    limit: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: "LKR",
    },

    period: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
        default: "monthly"
    },

    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    notificationsEnabled: {
        type: Boolean,
        default: true
    }

});

module.exports = mongoose.model("Budget", budgetSchema);