const { addTransaction, getTransaction, updateTransaction, deleteTransaction } = require("../../controllers/transactionController");
const Transaction = require("../../models/transactionModel");
const { allocateSavings } = require("../../helpers/savingsHelper");
const { convertCurrency } = require("../../helpers/currencyHelper");

jest.mock('../../models/transactionModel');
jest.mock('../../helpers/savingsHelper');
jest.mock('../../helpers/currencyHelper');

describe('Transaction Controller', () => {
    let req, res;

    beforeEach(() => {
        req = { user: { id: 'U123', role: 'user', currency: 'LKR' }, body: {}, params: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('addTransaction', () => {
        it('Should add an income transaction', async () => {
            req.body = { 
                type: 'income', 
                amount: 5000, 
                currency: 'USD', 
                category: 'Salary' 
            };
    
            convertCurrency.mockResolvedValue(10000);
            Transaction.prototype.save = jest.fn().mockResolvedValueOnce({ _id: 'ts123', ...req.body, amount: 10000, currency: 'LKR' });
    
            await addTransaction(req, res);
    
            expect(convertCurrency).toHaveBeenCalledWith(5000, 'USD', 'LKR');
            expect(allocateSavings).toHaveBeenCalledWith('U123', 5000);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Transaction added successfully' }));
        });

        it('Should return an error for invalid transaction type', async () => {
            req.body = { type: 'invalidType', amount: 1000 };
    
            await addTransaction(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid transaction type.Only 'income' or 'expense'." });
        });
    });
    
    describe('getTransaction', () => {
        it('Should get all transactions', async () => {
            Transaction.find.mockResolvedValue([{ _id: 'ts123', amount: 5000, currency: 'LKR' }]);
    
            await getTransaction(req, res);
    
            expect(res.json).toHaveBeenCalledWith([{ _id: 'ts123', amount: 5000, currency: 'LKR' }]);
        });

        it('Should get all transactions', async () => {
            Transaction.find.mockResolvedValue([{ _id: 'ts123', amount: 5000, currency: 'LKR' }]);
    
            await getTransaction(req, res);
    
            expect(res.json).toHaveBeenCalledWith([{ _id: 'ts123', amount: 5000, currency: 'LKR' }]);
        });
    });
    

    
    describe('updateTransaction', () => {
        it('Should update a transaction', async () => {
            req.params.id = 'ts123';
            req.body = { 
                amount: 7000, 
                currency: 'USD' 
            };

            convertCurrency.mockResolvedValue(14000);
            Transaction.findOneAndUpdate.mockResolvedValue({ _id: 'ts123', amount: 14000, currency: 'LKR' });
    
            await updateTransaction(req, res);
    
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Transaction updated successfully' }));
        });
    });
    
    describe('deleteTransaction', () => {
        it('Should delete a transaction', async () => {
            req.params.id = 'ts123';
            Transaction.findOneAndDelete.mockResolvedValue({ _id: 'ts123' });
    
            await deleteTransaction(req, res);
    
            expect(res.json).toHaveBeenCalledWith({ message: 'Transaction deleted successfully.' });
        });
    });
    
});
