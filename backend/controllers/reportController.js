const Report = require("../models/reportModel");
const Transaction = require("../models/transactionModel");

// Generate a report
const generateReport = async (req, res) => {
    try{
        const { type, startDate, endDate, categories, tags } = req.body;

        if (!type){
            return res.status(400).json({ message: "Type is required."});
        }

        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({ message: "Invalid date range. Start date must be before end date." });
        }

        // Filters based on user role
        let filters = { userId: req.user.id };
        if(req.user.role === "admin"){
            filters = {};
        }

        if(startDate && endDate){
            filters.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if(categories && categories.length > 0){
            if (!Array.isArray(categories)) {
                return res.status(400).json({ message: "Categories must be an array." });
            }
            filters.category = { $in: categories.map(cat => new RegExp(cat, "i")) };
        }
        if(tags && tags.length > 0){
            if (!Array.isArray(tags)) {
                return res.status(400).json({ message: "Tags must be an array." });
            }
            filters.tags = { $in: tags.map(tag => new RegExp(tag, "i")) };
        }

        const transactions = await Transaction.find(filters);

        let data = {};

        if(type === "spendingTrends"){

            //calculate total spending per day
            data = transactions.reduce((acc, transaction) => {
                const date = transaction.date.toISOString().split("T")[0];
                if(!acc[date]){
                    acc[date] = 0;
                }
                acc[date] += transaction.amount;
                return acc;
            }, {});

            data = Object.keys(data).map(date => ({ date, totalSpending: data[date] }));
        } else if(type === "incomeVsExpense"){

            //calculate total income and expense
            data = transactions.reduce((acc, transaction) => {
                if(transaction.type === "income"){
                    acc.income += transaction.amount;
                } else if (transaction.type === "expense"){
                    acc.expense += transaction.amount;
                } else {
                    console.warn(`Invalid transaction type: ${transaction.type}`);
                }
                return acc;
            }, { income: 0, expense: 0 });

            data.netSavings = data.income - data.expense;
        }

        //save the report
        const newReport = new Report({
            userId: req.user.id,
            type,
            filters: { startDate, endDate, categories, tags },
            data: data,
        });

        await newReport.save();
        res.status(201).json({ message: "Report generated successfully.", report: {
            id: newReport._id,
            userId: newReport.userId,
            type: newReport.type,
            filters: newReport.filters,
            data: newReport.data,
            createdAt: newReport.createdAt,
        }, });

    } catch (error){
        res.status(500).json({ message: "Failed to generate report" });
    }
};

// Get all reports
const getReports = async (req, res) => {
    try{
        const { page = 1, limit = 10 } = req.query;
        let query = {};
        if(req.user.role === "user"){
            query = { userId: req.user.id };
        }

        const reports = await Report.find(query).limit(limit * 1).skip((page - 1) * limit).exec();

        const count = await Report.countDocuments(query);

        res.json({ reports, totalPages: Math.ceil(count / limit), currentPage: page, });
        
    } catch (error){
        res.status(500).json({ message: "Failed to fetch reports" });
    }
};

module.exports = { generateReport, getReports };