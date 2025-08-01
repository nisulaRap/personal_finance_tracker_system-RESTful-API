const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../index"); 
const User = require("../../models/userModel");

beforeAll(async () => {
    await mongoose.connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Authorization Controller - Integration Tests", () => {
    let token;

    describe('POST /auth/register', () => {
        it('Should register a new user', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({
                    username: 'Vimal',
                    email: 'vimal@gmail.com',
                    password: 'user4568',
                    role: 'user',
                    currency: 'LKR'
            });

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe("User registered with username Vimal");

            const user = await User.findOne({ username: "Vimal" });
            expect(user).toBeTruthy();
        });
    });

    describe('POST /auth/login', () => {
        it('Should login a user and return a token', async () => {

            const res = await request(app)
                .post("/auth/login")
                .send({
                    username: "Vimal",
                    password: "user4568"
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("token");

            token = res.body.token; 
        });

        it('Should fail if password is incorrect', async () => {
                
            const res = await request(app)
                .post('/auth/login')
                .send({
                    username: 'Vimal',
                    password: 'user1234'
                });
    
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Invalid credentials');
        });

        ('Should fail if user is not found', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    username: 'Bimal',
                    password: 'user4568'
                });
    
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('User with username unknownuser not found.');
        });
    });   
});
