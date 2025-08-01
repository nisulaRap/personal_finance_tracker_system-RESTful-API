const { getAllUsers, updateUser } = require("../../controllers/userController");
const User = require("../../models/userModel");

jest.mock('../../models/userModel');
jest.mock('bcryptjs');

describe('User Controller', () => {
    let req, res;
    beforeEach(() => {
        req = {
            user: {
                id: '123',
                role: 'admin',
            },
            params: {},
            body: {},
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe('getAllUsers', () => {
        it('should return all users if the request is an admin', async () => {
            const mockUsers = [{ username: 'Kamal'}, { username: 'Nimal'}, {username: 'Upul' }];
            User.find.mockResolvedValue(mockUsers);
        
            await getAllUsers(req, res);
        
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUsers);
        });
        
        it('should return 403 if the request is not an admin', async () => {
            req.user.role = 'user';
        
            await getAllUsers(req, res);
        
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Access denied'});
        });
    })
    

    describe('updateUser', () => {
        it('should update the user if the request is an admin or same user', async () => {
            const mockUpdatedUser = { username: 'Vimal' };
            
            req.params.id = '123';
            req.body = { username: 'Vimal' };
            User.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);
    
            await updateUser(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUpdatedUser);
        });
    })
});


