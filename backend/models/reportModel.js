const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    type: {
        type: String,
        required: true,
        enum: ["spendingTrends", "incomeVsExpense"],
    },
    filters: {
        startDate: Date,
        endDate: Date,
        categories: [String],
        tags: [String],
    },
    data: {
        type: Object,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Report", reportSchema);