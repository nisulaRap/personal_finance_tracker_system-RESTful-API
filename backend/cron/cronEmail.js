const cron = require('node-cron');
const Goal = require('../models/goalModel');
const User = require('../models/userModel');
const Budget = require('../models/budgetModel');
const Transaction = require('../models/transactionModel');
const { sendEmailNotification } = require('../services/emailService');

const task = cron.schedule('0 0 * * *', async () => {
    console.log("Cron email started: Checking for upcoming goals...");
    try {
        const now = new Date();

        // Checking upcoming goals
        const upcomingGoals = await Goal.find({
            deadline: { $gte: now, $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000) }
        });

        if (upcomingGoals.length > 0) {
            for (const goal of upcomingGoals) {
                const user = await User.findById(goal.userId);
                
                const subject = `Reminder: Your Financial Goal "${goal.name}" Deadline is Approaching`;
                const message = `
                    <p>Hi ${user.username},</p>
                    <p>Just a friendly reminder that your goal <strong>"${goal.name}"</strong> is due tomorrow!</p>
                    <p>Target Amount: $${goal.targetAmount}</p>
                    <p>Current Saved Amount: $${goal.savedAmount}</p>
                    <p>Deadline: ${goal.deadline}</p>
                `;

                await sendEmailNotification(user.email, subject, message);
                console.log(`Reminder email sent to ${user.email} for goal: ${goal.name}`);
            }
        }

        // Checking budget limits
        console.log("Running budget check...");
        const budgets = await Budget.find({ notificationsEnabled: true });

        for (const budget of budgets) {
            const expenses = await Transaction.find({
                userId: budget.userId,
                type: "expense",
                category: budget.category,
                date: { $gte: budget.startDate, $lte: budget.endDate }
            });

            const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
            const percentageSpent = (totalSpent / budget.limit) * 100;

            if (percentageSpent >= 90) {
                const user = await User.findById(budget.userId);

                const subject = `Warning: Your "${budget.category}" Budget is Almost Exceeded`;
                const message = `
                    <p>Hi ${user.username},</p>
                    <p>Your budget for "${budget.category}" is almost exceeded.</p>
                    <p>Total Spent: $${totalSpent} / Budget Limit: $${budget.limit}</p>
                `;

                await sendEmailNotification(user.email, subject, message);
                console.log(`Budget alert sent to ${user.email} for category: ${budget.category}`);
            }
        }

        // Checking upcoming transactions
        const upcomingTransactions = await Transaction.find({
            isRecurring: true,
            endDate: {
                $gte: now,
                $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        for (const transaction of upcomingTransactions) {
            const user = await User.findById(transaction.userId);

            const subject = `Upcoming Recurring Transaction Reminder`;
            const message = `
                <p>Hi ${user.username},</p>
                <p>A recurring transaction of <strong>$${transaction.amount}</strong> for "${transaction.category}" is due soon.</p>
            `;

            await sendEmailNotification(user.email, subject, message);
            console.log(`Transaction reminder email sent to ${user.email}`);
        }

    } catch (error) {
        console.error('Error sending reminders:', error);
    }
}, { scheduled: false });

if (process.env.NODE_ENV !== 'test') {
    task.start();
}

module.exports = { task };
