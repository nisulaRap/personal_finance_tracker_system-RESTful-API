const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../index");
const Transaction = require("../../models/transactionModel");

beforeAll(async () => {
    await mongoose.connect(process.env.CONNECTION_STRING);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Transaction Controller - Integration Testing", () => {
    let token;
    beforeEach(async () => {
        token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZDAzYzIyNmI5MDg4ODE2ZTU4YzE3ZSIsInJvbGUiOiJ1c2VyIiwiY3VycmVuY3kiOiJMS1IiLCJpYXQiOjE3NDE3MDA3MTksImV4cCI6MTc0MTcwNDMxOX0.DhykwD0EPJcvK9gVGukPu4XTDuz1f7IF5QCEd_AIV6o'; 
    });

    describe('POST /transactions', () => {
        it('Should add a new transaction', async () => {
            const response = await request(app)
                .post('/transactions')
                .set('Authorization', token)
                .send({ 
                    type: 'income', 
                    amount: 5000, 
                    currency: 'LKR', 
                    category: 'Transport', 
                    tags: ['#bus', '#travel'] 
                });

            console.log(response.body);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("transaction");
        });
    });

    describe('GET /transactions', () => {
        it('Should fetch all transactions', async () => {
            const response = await request(app)
                .get('/transactions')
                .set('Authorization', token);

            console.log(response.body); 
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });
    });

    describe('UPDATE /transactions/:id', () => {
        it('Should update a transaction', async () => {
            const transaction = new Transaction({
                userId: '67d03c226b9088816e58c17e',
                type: 'expense',
                amount: 1000,
                currency: 'LKR', 
                category: 'Food'
            });
            await transaction.save();
    
            const response = await request(app)
                .put(`/transactions/${transaction._id}`)
                .set('Authorization', token)
                .send({ amount: 2000, category: 'Transport', currency: 'LKR' }); 
    
            console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('transaction');
        });
    });
    
    describe('DELETE /transactions/:id', () => {
        it('Should delete a transaction', async () => {
            const transaction = new Transaction({ 
                userId: '67d03c226b9088816e58c17e', 
                type: 'expense', 
                amount: 2000, 
                currency: 'LKR', 
                category: 'Transport'
            });
            await transaction.save();

            const response = await request(app)
                .delete(`/transactions/${transaction._id}`)
                .set('Authorization', token);

            console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Transaction deleted successfully.');
        });
    });
});