const jwt = require("jsonwebtoken");
const verifyToken = require("../../middlewares/authMiddleware");

jest.mock('jsonwebtoken');

describe('verifyToken Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {},
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        next = jest.fn();
    });

    it('should call next() if the token is valid', () => {
        const mockToken = 'validToken';
        req.headers.authorization = `Bearer ${mockToken}`;

        const mockDecodedUser = { id: '123', role: 'admin' };
        jwt.verify.mockReturnValue(mockDecodedUser);

        verifyToken(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
        expect(req.user).toEqual(mockDecodedUser);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled;
    });

    it('should return 400 if the token is invalid', () => {
        const mockToken = 'invalidToken';
        req.headers.authorization = `Bearer ${mockToken}`;

        jwt.verify.mockImplementation(() => {
            throw new Error('Invalid token');
        });

        verifyToken(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Token is not valid' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if the authorization header does not start with "Bearer"', () => {
        req.headers.authorization = 'InvalidHeader';

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'No token, access denied' });
        expect(next).not.toHaveBeenCalled();
    });
});