const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    name: {
        type: String,
        required: true,
    },
    targetAmount:{
        type: Number,
        required: true,
    },
    savedAmount:{
        type: Number,
        required: true,
        default: 0,
    },
    currency: {
        type: String,
        default: "LKR",
    },
    deadline:{
        type: Date,
        required: true,
    },
    progress: {
        type: Number,
        default: 0,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

goalSchema.pre("save", function (next) {
    this.progress = (this.savedAmount / this.targetAmount) * 100;
    next();
});

module.exports = mongoose.model("Goal", goalSchema);