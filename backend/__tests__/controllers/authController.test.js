const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { register, login } = require("../../controllers/authController");
const User = require("../../models/userModel");

jest.mock('../../models/userModel');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe("Authorization Controller", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Register', () => {
        it('should register a new user', async () => {
            const req = { 
                body: { username: 'Vimal',
                        email: 'vimal@gmail.com', 
                        password: 'user4568', 
                        role: 'user', 
                        currency: 'LKR' 
                    }};
    
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            bcrypt.hash.mockResolvedValue('hashedpassword');
            User.prototype.save = jest.fn().mockResolvedValue({});
    
            await register(req, res);
    
            expect(bcrypt.hash).toHaveBeenCalledWith('user4568', 10);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'User registered with username Vimal' });
        });
    });
    
    describe('Login', () => {
        it('should login a user and return a token', async () => {
            const req = { body: { username: 'Vimal', password: 'user4568' }};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            const mockUser = { _id: 'ts123', username: 'Vimal', password: 'hashedpassword', role: 'user', currency: 'LKR' };
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mockedToken');
    
            await login(req, res);
    
            expect(User.findOne).toHaveBeenCalledWith({ username: 'Vimal' });
            expect(bcrypt.compare).toHaveBeenCalledWith('user4568', 'hashedpassword');
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 'ts123', role: 'user', currency: 'LKR' },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Login successful', token: 'mockedToken' });
        });    

        it('should return error if password is incorrect', async () => {
            const req = { body: { username: 'Vimal', password: 'user1234' }};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            const mockUser = { username: 'Vimal', password: 'hashedpassword' };
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);
    
            await login(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });

        test('should return error if user is not found', async () => {
            const req = { body: { username: 'unknownuser', password: 'user4568' }};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            User.findOne.mockResolvedValue(null);
    
            await login(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User with username unknownuser not found.' });
        });
    });   
    
});
